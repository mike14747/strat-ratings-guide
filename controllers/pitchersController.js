const router = require('express').Router();
const Pitchers = require('../models/pitchers');
const processPitchersCSV = require('./utils/processPitchersCSV');
const processMultiTeamPitchersCSV = require('./utils/processMultiTeamPitchersCSV');
const calculatePitcherValues = require('./utils/calculatePitcherValues');
const calculateMultiTeamPitcherValues = require('./utils/calculateMultiTeamPitcherValues');
const ensureUploadsExists = require('./utils/ensureUploadsExists');
const path = require('path');
const fileUpload = require('express-fileupload');

router.get('/season-list', async (req, res, next) => {
    try {
        const [data, error] = await Pitchers.getSeasonsListWithPitcherData();
        data ? res.json(data) : next(error);
    } catch (error) {
        next(error);
    }
});

router.get('/multi-team-season-list', async (req, res, next) => {
    try {
        const [data, error] = await Pitchers.getSeasonsListWithMultiTeamPitcherData();
        data ? res.json(data) : next(error);
    } catch (error) {
        next(error);
    }
});

router.get('/:year', async (req, res, next) => {
    try {
        const [data, error] = await Pitchers.getPitchersDataByYear(req.params.year);
        data ? res.json(calculatePitcherValues(data)) : next(error);
    } catch (error) {
        next(error);
    }
});

router.get('/multi-team/:year', async (req, res, next) => {
    try {
        const [data, error] = await Pitchers.getMultiTeamPitchersDataByYear(req.params.year);
        data ? res.json(await calculateMultiTeamPitcherValues(data, req.params.year)) : next(error);
    } catch (error) {
        next(error);
    }
});

router.post('/', fileUpload(), async (req, res, next) => {
    try {
        if (req.files === null) return res.status(400).json({ message: 'No file was uploaded!' });

        const file = req.files.file;

        const [, error] = await Pitchers.truncatePitchersTable();
        if (error) return next(error);

        await ensureUploadsExists();

        await file.mv(path.join(__dirname, '/uploads/pitcher_ratings.csv'), error => {
            if (error) return next(error);
        });
        const newRecordsInserted = await processPitchersCSV();
        res.status(201).json({ message: `Successfully added ${newRecordsInserted} new pitcher row(s) to the database!` });
    } catch (error) {
        next(error);
    }
});

router.post('/multi-team', fileUpload(), async (req, res, next) => {
    try {
        if (req.files === null) return res.status(400).json({ message: 'No file was uploaded!' });

        const file = req.files.file;

        const [, error] = await Pitchers.truncateMultiTeamPitchersTable();
        if (error) return next(error);

        await ensureUploadsExists();

        await file.mv(path.join(__dirname, '/uploads/multi_team_pitchers.csv'), error => {
            if (error) return next(error);
        });
        const newRecordsInserted = await processMultiTeamPitchersCSV();
        res.status(201).json({ message: `Successfully added ${newRecordsInserted} new pitcher row(s) to the database!` });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
