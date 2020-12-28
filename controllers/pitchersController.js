const router = require('express').Router();
const Pitchers = require('../models/pitchers');
const processPitchersCSV = require('./utils/processPitchersCSV');
const processMultiTeamPitchersCSV = require('./utils/processMultiTeamPitchersCSV');
const calculatePitcherValues = require('./utils/calculatePitcherValues');
const calculateMultiTeamPitcherValues = require('./utils/calculateMultiTeamPitcherValues');
const path = require('path');
const fs = require('fs');

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
        data ? res.json(calculateMultiTeamPitcherValues(data)) : next(error);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        if (req.files === null) return res.status(400).json({ message: 'No file was uploaded!' });

        const file = req.files.file;

        const [, error] = await Pitchers.truncatePitchersTable();
        if (error) return next(error);

        const ensureUploadsExists = async () => {
            return new Promise((resolve, reject) => {
                fs.promises.access(path.join(__dirname, '/uploads'), fs.constants.F_OK)
                    .then(() => resolve())
                    .catch(() => {
                        fs.promises.mkdir(path.join(__dirname, '/uploads'))
                            .then(() => resolve())
                            .catch(error => {
                                throw new Error(error);
                            });
                    });
            });
        };
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

router.post('/multi-team', async (req, res, next) => {
    try {
        if (req.files === null) return res.status(400).json({ message: 'No file was uploaded!' });

        const file = req.files.file;

        const [, error] = await Pitchers.truncateMultiTeamPitchersTable();
        if (error) return next(error);

        const ensureUploadsExists = async () => {
            return new Promise((resolve, reject) => {
                fs.promises.access(path.join(__dirname, '/uploads'), fs.constants.F_OK)
                    .then(() => resolve())
                    .catch(() => {
                        fs.promises.mkdir(path.join(__dirname, '/uploads'))
                            .then(() => resolve())
                            .catch(error => {
                                throw new Error(error);
                            });
                    });
            });
        };
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
