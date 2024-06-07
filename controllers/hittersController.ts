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
import converter from 'json-2-csv';
import { convertArrToObj } from './utils/rmlTeamArrToObj';

const router = express.Router();

router.get('/season-list', async (_req, res, next) => {
    try {
        const [data, error] = await getSeasonsListWithHitterData();
        return data ? res.json(data) : next(error);
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
        const [data, error] = await getHittersDataByYear(parseInt(req.params.year));
        const [multiData, multiError] = await getMultiTeamHittersPartialByYear(parseInt(req.params.year));
        data && multiData ? res.json(calculateHitterValues(data, multiData)) : next(error || multiError);
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
        const rmlTeams = convertArrToObj(rmlTeamsArr);

        // const [realTeams] = await getAllRealTeams();
        // if (!realTeams) throw new Error('Real team list could not be retrieved from the DB.');
        // const [rmlTeamsArr] = await getAllRmlTeams();
        // if (!rmlTeamsArr) throw new Error('Rml teams array list could not be retrieved from the DB.');
        // const rmlTeams = convertArrToObj(rmlTeamsArr);
        // const [cardedPlayers] = await getAllCardedPlayers();
        // if (!cardedPlayers) throw new Error('Carded player list could not be retrieved from the DB.');
        const xlsxData = await processHittersXLSX();
        if (!xlsxData) throw new Error('There was an error parsing data from the uploaded file.');
        await hittersSchema.validateAsync(xlsxData);
        const processedHitters = processHittersInsertData(xlsxData, realTeams, rmlTeams, cardedPlayers);

        const [data, error] = await addNewHittersData(processedHitters);
        data ? res.status(201).json({ message: `Successfully added ${data[1].affectedRows} new hitter row(s) to the database!`, added: data[1].affectedRows }) : next(error);
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

        const [data, error] = await addMultiTeamHittersData(processedMultiTeamHitters);
        data ? res.status(201).json({ message: `Successfully added ${data[1].affectedRows} new hitter row(s) to the database!`, added: data[1].affectedRows }) : next(error);
    } catch (error) {
        next(error);
    }
});

export default router;
