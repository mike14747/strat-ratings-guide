import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { getAllCardedPlayers, getCardedPlayersByYear, addNewCardedPlayerData } from '../models/cardedPlayers';
import { ensureUploadsExists } from './utils/ensureUploadsExists';
import fileUpload, { UploadedFile } from 'express-fileupload';
import { cardedPlayersSchema } from './validation/schema/cardedPlayersSchema';
import { processCardedPlayersXLSX } from './utils/processCardedPlayersXLSX';
import { CardedPlayerArrForDBImport } from '../types';

const router = express.Router();

router.get('/:year', async (req, res, next) => {
    try {
        const data = await getCardedPlayersByYear(parseInt(req.params.year));
        res.json(data);
    } catch (error) {
        next(error);
    }
});

router.get('/', async (_req, res, next) => {
    try {
        const data = await getAllCardedPlayers();
        res.json(data);
    } catch (error) {
        next(error);
    }
});

router.post('/', fileUpload(), async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.files) return res.status(400).json({ message: 'No file was uploaded!' });
        const file = req.files.file as UploadedFile;

        await ensureUploadsExists();
        await file.mv(path.join(__dirname, '/uploads/carded_players.xlsx'), error => {
            if (error) return next(error);
        });

        const xlsxData = await processCardedPlayersXLSX();
        if (!xlsxData) throw new Error('There was an error parsing data from the uploaded file.');
        await cardedPlayersSchema.validateAsync(xlsxData);
        const processedCardedPlayers: CardedPlayerArrForDBImport[] = xlsxData.map(row => [
            row.year,
            row.abbrev_name,
            row.full_name,
            row.rml_team,
            row.ip,
            row.ab,
        ]);

        const result = await addNewCardedPlayerData(processedCardedPlayers);
        res.status(201).json({ message: `Successfully added ${result.affectedRows} new carded player row(s) to the database!`, added: result.affectedRows });
    } catch (error) {
        next(error);
    }
});

export default router;
