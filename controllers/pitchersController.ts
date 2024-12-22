import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { getSeasonsListWithPitcherData, getMultiTeamPitchersPartialByYear, getPitchersDataByYear, addNewPitchersData, addMultiTeamPitchersData } from '../models/pitchers';
import { getAllRmlTeams } from '../models/rmlTeam';
import { getAllRealTeams } from '../models/realTeam';
import { getAllCardedPlayers } from '../models/cardedPlayers';
import { processPitchersXLSX, processPitchersInsertData } from './utils/processPitchersXLSX';
import { processMultiTeamPitchersXLSX, processMultiTeamPitchersInsertData } from './utils/processMultiTeamPitchersXLSX';
import { calculatePitcherValues } from './utils/calculatePitcherValues';
import { ensureUploadsExists } from './utils/ensureUploadsExists';
import fileUpload, { UploadedFile } from 'express-fileupload';
import { pitchersSchema } from './validation/schema/pitchersSchema';
import { multiTeamPitchersSchema } from './validation/schema/multiTeamPitchersSchema';
import { convertToCsv } from './utils/convertMultiTeamPitchersToCsv';
import * as converter from 'json-2-csv';
import { convertArrToObj } from './utils/rmlTeamArrToObj';

const router = express.Router();

router.get('/season-list', async (_req, res, next) => {
    try {
        const data = await getSeasonsListWithPitcherData();
        res.json(data);
    } catch (error) {
        next(error);
    }
});

router.get('/create-multi-team-csv', async (_req, res, next) => {
    try {
        const pitchersOnIndividualTeams = convertToCsv();
        const csv = converter.json2csv(pitchersOnIndividualTeams);
        return csv ? res.status(200).send(csv) : res.status(500).end();
    } catch (error) {
        next(error);
    }
});

router.get('/:year', async (req, res, next) => {
    try {
        const data = await getPitchersDataByYear(parseInt(req.params.year));
        const multiData = await getMultiTeamPitchersPartialByYear(parseInt(req.params.year));
        res.json(calculatePitcherValues(data, multiData));
    } catch (error) {
        next(error);
    }
});

router.post('/', fileUpload(), async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.files) return res.status(400).json({ message: 'No file was uploaded!' });
        const file = req.files.file as UploadedFile;

        await ensureUploadsExists();
        file.mv(path.join(__dirname, '/uploads/pitcher_ratings.xlsx'), error => {
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
        const xlsxData = await processPitchersXLSX();
        if (!xlsxData) throw new Error('There was an error parsing data from the uploaded file.');
        await pitchersSchema.validateAsync(xlsxData);
        const processedPitchers = processPitchersInsertData(xlsxData, realTeams, rmlTeams, cardedPlayers);

        const result = await addNewPitchersData(processedPitchers);
        res.status(201).json({ message: `Successfully added ${result.affectedRows} new pitcher row(s) to the database!`, added: result.affectedRows });
    } catch (error) {
        next(error);
    }
});

router.post('/multi-team', fileUpload(), async (req, res, next) => {
    try {
        if (!req.files) return res.status(400).json({ message: 'No file was uploaded!' });
        const file = req.files.file as UploadedFile;

        await ensureUploadsExists();
        file.mv(path.join(__dirname, '/uploads/multi_team_pitchers.xlsx'), error => {
            if (error) return next(error);
        });

        const realTeams = await getAllRealTeams();
        if (!realTeams) throw new Error('Real team list could not be retrieved from the DB.');
        const xlsxData = await processMultiTeamPitchersXLSX();
        if (!xlsxData) throw new Error('There was an error parsing data from the uploaded file.');
        await multiTeamPitchersSchema.validateAsync(xlsxData);
        const processedMultiTeamPitchers = processMultiTeamPitchersInsertData(xlsxData, realTeams);

        const result = await addMultiTeamPitchersData(processedMultiTeamPitchers);
        res.status(201).json({ message: `Successfully added ${result.affectedRows} new multi-team pitcher row(s) to the database!`, added: result.affectedRows });
    } catch (error) {
        next(error);
    }
});

export default router;
