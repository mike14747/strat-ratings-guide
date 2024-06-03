import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { getSeasonsListWithPitcherData, getPitchersDataByYearAndId, getMultiTeamPitchersPartialByYear, getPitchersDataByYear, addNewPitchersData, addMultiTeamPitchersData } from '../models/pitchers';
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
import converter from 'json-2-csv';
import { convertArrToObj } from './utils/rmlTeamArrToObj';

const router = express.Router();

router.get('/season-list', async (_req, res, next) => {
    try {
        const [data, error] = await getSeasonsListWithPitcherData();
        return data ? res.json(data) : next(error);
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

router.get('/:id/season/:year', async (req, res, next) => {
    try {
        const [data, error] = await getPitchersDataByYearAndId(parseInt(req.params.year), parseInt(req.params.id));
        const [multiData, multiError] = await getMultiTeamPitchersPartialByYear(parseInt(req.params.year));
        return data && multiData ? res.json(calculatePitcherValues(data, multiData)) : next(error || multiError);
    } catch (error) {
        next(error);
    }
});

router.get('/:year', async (req, res, next) => {
    try {
        const [data, error] = await getPitchersDataByYear(parseInt(req.params.year));
        const [multiData, multiError] = await getMultiTeamPitchersPartialByYear(parseInt(req.params.year));
        return data && multiData ? res.json(calculatePitcherValues(data, multiData)) : next(error || multiError);
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

        const [realTeams] = await getAllRealTeams();
        const [rmlTeamsArr] = await getAllRmlTeams();
        const rmlTeams = convertArrToObj(rmlTeamsArr);
        const [cardedPlayers] = await getAllCardedPlayers();
        const xlsxData = await processPitchersXLSX();
        if (!xlsxData) throw new Error('There was an error parsing data from the uploaded file.');
        await pitchersSchema.validateAsync(xlsxData);
        const processedPitchers = processPitchersInsertData(xlsxData, realTeams, rmlTeams, cardedPlayers);

        const [data, error] = await addNewPitchersData(processedPitchers);
        return data ? res.status(201).json({ message: `Successfully added ${data[1].affectedRows} new pitcher row(s) to the database!`, added: data[1].affectedRows }) : next(error);
    } catch (error) {
        next(error);
    }
});

router.post('/multi-team', fileUpload(), async (req, res, next) => {
    try {
        if (!req.files) return res.status(400).json({ message: 'No file was uploaded!' });
        const file = req.files.file as UploadedFile;

        await ensureUploadsExists();
        file.mv(path.join(__dirname, '/uploads/multi_team_xlsx'), error => {
            if (error) return next(error);
        });

        const [realTeams] = await getAllRealTeams();
        const xlsxData = await processMultiTeamPitchersXLSX();
        if (!xlsxData) throw new Error('There was an error parsing data from the uploaded file.');
        await multiTeamPitchersSchema.validateAsync(xlsxData);
        const processedMultiTeamPitchers = processMultiTeamPitchersInsertData(xlsxData, realTeams);

        const [data, error] = await addMultiTeamPitchersData(processedMultiTeamPitchers);
        return data ? res.status(201).json({ message: `Successfully added ${data[1].affectedRows} new pitcher row(s) to the database!`, added: data[1].affectedRows }) : next(error);
    } catch (error) {
        next(error);
    }
});

export default router;
