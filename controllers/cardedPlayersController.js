const router = require('express').Router();
const { getAllCardedPlayers, getCardedPlayersByYear, addNewCardedPlayerData } = require('../models/cardedPlayers');
const ensureUploadsExists = require('./utils/ensureUploadsExists');
const path = require('path');
const fileUpload = require('express-fileupload');
const cardedPlayersSchema = require('./validation/schema/cardedPlayersSchema');
const { processCardedPlayersXLSX } = require('./utils/processCardedPlayersXLSX');

router.get('/:year', async (req, res, next) => {
    try {
        const [data, error] = await getCardedPlayersByYear(req.params.year);
        return data ? res.json(data) : next(error);
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const [data, error] = await getAllCardedPlayers();
        return data ? res.json(data) : next(error);
    } catch (error) {
        next(error);
    }
});

router.post('/', fileUpload(), async (req, res, next) => {
    try {
        if (req.files === null) return res.status(400).json({ message: 'No file was uploaded!' });
        const file = req.files.file;

        await ensureUploadsExists();
        await file.mv(path.join(__dirname, '/uploads/carded_players.xlsx'), error => {
            if (error) return next(error);
        });

        const xlsxData = await processCardedPlayersXLSX();
        await cardedPlayersSchema.validateAsync(xlsxData);
        const processedCardedPlayers = xlsxData.map(row => Object.values(row));

        const [data, error] = await addNewCardedPlayerData(processedCardedPlayers);
        data ? res.status(201).json({ message: `Successfully added ${data[1].affectedRows} new hitter row(s) to the database!`, added: data[1].affectedRows }) : next(error);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
