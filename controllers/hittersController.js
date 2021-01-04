const router = require('express').Router();
const Hitters = require('../models/hitters');
const processHittersCSV = require('./utils/processHittersCSV');
const processMultiTeamHittersCSV = require('./utils/processMultiTeamHittersCSV');
const calculateHitterValues = require('./utils/calculateHitterValues');
const calculateMultiTeamHitterValues = require('./utils/calculateMultiTeamHitterValues');
const ensureUploadsExists = require('./utils/ensureUploadsExists');
const path = require('path');
const fileUpload = require('express-fileupload');

router.get('/season-list', async (req, res, next) => {
    try {
        const [data, error] = await Hitters.getSeasonsListWithHitterData();
        data ? res.json(data) : next(error);
    } catch (error) {
        next(error);
    }
});

router.get('/multi-team-season-list', async (req, res, next) => {
    try {
        const [data, error] = await Hitters.getSeasonsListWithMultiTeamHitterData();
        data ? res.json(data) : next(error);
    } catch (error) {
        next(error);
    }
});

router.get('/multi-team/:year', async (req, res, next) => {
    try {
        const [data, error] = await Hitters.getMultiTeamHittersDataByYear(req.params.year);
        data ? res.json(await calculateMultiTeamHitterValues(data, req.params.year)) : next(error);
    } catch (error) {
        next(error);
    }
});

router.get('/:year', async (req, res, next) => {
    try {
        const [data, error] = await Hitters.getHittersDataByYear(req.params.year);
        data ? res.json(calculateHitterValues(data)) : next(error);
    } catch (error) {
        next(error);
    }
});

router.post('/', fileUpload(), async (req, res, next) => {
    try {
        if (req.files === null) return res.status(400).json({ message: 'No file was uploaded!' });

        const file = req.files.file;

        const [, error] = await Hitters.truncateHittersTable();
        if (error) return next(error);

        await ensureUploadsExists();

        await file.mv(path.join(__dirname, '/uploads/hitter_ratings.csv'), error => {
            if (error) return next(error);
        });
        const newRecordsInserted = await processHittersCSV();
        res.status(201).json({ message: `Successfully added ${newRecordsInserted} new hitter row(s) to the database!` });
    } catch (error) {
        next(error);
    }
});

router.post('/multi-team', fileUpload(), async (req, res, next) => {
    try {
        if (req.files === null) return res.status(400).json({ message: 'No file was uploaded!' });

        const file = req.files.file;

        const [, error] = await Hitters.truncateMultiTeamHittersTable();
        if (error) return next(error);

        await ensureUploadsExists();

        await file.mv(path.join(__dirname, '/uploads/multi_team_hitters.csv'), error => {
            if (error) return next(error);
        });
        const newRecordsInserted = await processMultiTeamHittersCSV();
        res.status(201).json({ message: `Successfully added ${newRecordsInserted} new multi-team hitter row(s) to the database!` });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
