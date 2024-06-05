import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { getAllCardedPlayers, getCardedPlayersByYear, addNewCardedPlayerData } from '../models/cardedPlayers';
import { ensureUploadsExists } from './utils/ensureUploadsExists';
import fileUpload, { UploadedFile } from 'express-fileupload';
import { cardedPlayersSchema } from './validation/schema/cardedPlayersSchema';
import { processCardedPlayersXLSX } from './utils/processCardedPlayersXLSX';

const router = express.Router();

router.get('/:year', async (req, res, next) => {
    try {
        const [data, error] = await getCardedPlayersByYear(parseInt(req.params.year));
        return data ? res.json(data) : next(error);
    } catch (error) {
        next(error);
    }
});

router.get('/', async (_req, res, next) => {
    try {
        const [data, error] = await getAllCardedPlayers();
        return data ? res.json(data) : next(error);
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
        const processedCardedPlayers = xlsxData.map(row => Object.values(row));

        const [data, error] = await addNewCardedPlayerData(processedCardedPlayers);
        data ? res.status(201).json({ message: `Successfully added ${data[1].affectedRows} new hitter row(s) to the database!`, added: data[1].affectedRows }) : next(error);
    } catch (error) {
        next(error);
    }
});

export default router;
