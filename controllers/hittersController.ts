import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { getSeasonsListWithHitterData, getHittersDataByYear, getMultiTeamHittersPartialByYear, addNewHittersData, addMultiTeamHittersData } from '../models/hitters';
import { getAllRmlTeams } from '../models/rmlTeam';
import { getAllRealTeams } from '../models/realTeam';
import { getAllCardedPlayers } from '../models/cardedPlayers';
import { processHittersXLSX, processHittersInsertData } from './utils/processHittersXLSX';
import { processMultiTeamHittersXLSX, processMultiTeamHittersInsertData } from './utils/processMultiTeamHittersXLSX';
import { ensureUploadsExists } from './utils/ensureUploadsExists';
import fileUpload, { UploadedFile } from 'express-fileupload';
import { calculateHitterValues } from './utils/calculateHitterValues';
import { hittersSchema } from './validation/schema/hittersSchema';
import { multiTeamHittersSchema } from './validation/schema/multiTeamHittersSchema';
import { convertToCsv } from './utils/convertMultiTeamHittersToCsv';
import * as converter from 'json-2-csv';
import { calculateObTbDpFromArr, fieldingWopsCalculate } from './utils/fieldingWopsCalculate';

import { convertArrToObj } from './utils/rmlTeamArrToObj';

const router = express.Router();

router.get('/test', (_req, res, next) => {
    try {
        const result = fieldingWopsCalculate('P', '1e0');
        res.json({ result });
    } catch (error) {
        next(error);
    }
});

router.post('/fielding-pos-def', (req, res, next) => {
    try {
        const csv = converter.json2csv(calculateObTbDpFromArr(req.body));
        return csv ? res.status(200).send(csv) : res.status(500).end();
    } catch (error) {
        next(error);
    }
});

router.get('/season-list', async (_req, res, next) => {
    try {
        const data = await getSeasonsListWithHitterData();
        res.json(data);
    } catch (error) {
        next(error);
    }
});

router.get('/create-multi-team-csv', async (_req, res, next) => {
    try {
        const hittersOnIndividualTeams = convertToCsv();
        const csv = converter.json2csv(hittersOnIndividualTeams);
        return csv ? res.status(200).send(csv) : res.status(500).end();
    } catch (error) {
        next(error);
    }
});

router.get('/:year', async (req, res, next) => {
    try {
        const data = await getHittersDataByYear(parseInt(req.params.year));
        const multiData = await getMultiTeamHittersPartialByYear(parseInt(req.params.year));
        res.json(calculateHitterValues(data, multiData));
    } catch (error) {
        next(error);
    }
});

router.post('/', fileUpload(), async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.files) return res.status(400).json({ message: 'No file was uploaded!' });
        const file = req.files.file as UploadedFile;

        await ensureUploadsExists();
        file.mv(path.join(__dirname, '/uploads/hitter_ratings.xlsx'), error => {
            if (error) return next(error);
        });

        const [realTeams, rmlTeamsArr, cardedPlayers] = await Promise.all([
            getAllRealTeams(),
            getAllRmlTeams(),
            getAllCardedPlayers(),
        ]);
        if (!realTeams) throw new Error('Real team list could not be retrieved from the DB.');
        if (!rmlTeamsArr) throw new Error('Rml teams array list could not be retrieved from the DB.');
        if (!cardedPlayers) throw new Error('Carded player list could not be retrieved from the DB.');

        const rmlTeams = convertArrToObj(rmlTeamsArr);
        const xlsxData = await processHittersXLSX();
        if (!xlsxData) throw new Error('There was an error parsing data from the uploaded file.');
        await hittersSchema.validateAsync(xlsxData);
        const processedHitters = processHittersInsertData(xlsxData, realTeams, rmlTeams, cardedPlayers);

        const result = await addNewHittersData(processedHitters);
        res.status(201).json({ message: `Successfully added ${result.affectedRows} new hitter row(s) to the database!`, added: result.affectedRows });
    } catch (error) {
        next(error);
    }
});

router.post('/multi-team', fileUpload(), async (req, res, next) => {
    try {
        if (!req.files) return res.status(400).json({ message: 'No file was uploaded!' });
        const file = req.files.file as UploadedFile;

        await ensureUploadsExists();
        file.mv(path.join(__dirname, '/uploads/multi_team_hitters.xlsx'), error => {
            if (error) return next(error);
        });

        const realTeams = await getAllRealTeams();
        if (!realTeams) throw new Error('Real team list could not be retrieved from the DB.');
        const xlsxData = await processMultiTeamHittersXLSX();
        if (!xlsxData) throw new Error('There was an error parsing data from the uploaded file.');
        await multiTeamHittersSchema.validateAsync(xlsxData);
        const processedMultiTeamHitters = processMultiTeamHittersInsertData(xlsxData, realTeams);

        const result = await addMultiTeamHittersData(processedMultiTeamHitters);
        res.status(201).json({ message: `Successfully added ${result.affectedRows} new multi-team hitter row(s) to the database!`, added: result.affectedRows });
    } catch (error) {
        next(error);
    }
});

export default router;
