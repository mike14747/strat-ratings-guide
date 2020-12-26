const router = require('express').Router();
const Hitters = require('../models/hitters');
const processHittersCSV = require('./utils/processHittersCSV');
const processMultiTeamHittersCSV = require('./utils/processMultiTeamHittersCSV');
const calculateHitterValues = require('./utils/calculateHitterValues');
const path = require('path');
const fs = require('fs');

router.get('/season-list', async (req, res, next) => {
    try {
        const [data, error] = await Hitters.getSeasonsListWithHitterData();
        data ? res.json(data) : next(error);
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

router.post('/', async (req, res, next) => {
    try {
        if (req.files === null) return res.status(400).json({ message: 'No file was uploaded!' });

        const file = req.files.file;

        const [, error] = await Hitters.truncateHittersTable();
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

        await file.mv(path.join(__dirname, '/uploads/hitter_ratings.csv'), error => {
            if (error) return next(error);
        });
        const newRecordsInserted = await processHittersCSV();
        res.status(201).json({ message: `Successfully added ${newRecordsInserted} new hitter row(s) to the database!` });
    } catch (error) {
        console.log('the error was caught:', error.message);
        next(error);
    }
});

router.post('/multi-team', async (req, res, next) => {
    try {
        if (req.files === null) return res.status(400).json({ message: 'No file was uploaded!' });

        const file = req.files.file;

        const [, error] = await Hitters.truncateMultiTeamHittersTable();
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

        await file.mv(path.join(__dirname, '/uploads/multi_team_hitters.csv'), error => {
            if (error) return next(error);
        });
        const newRecordsInserted = await processMultiTeamHittersCSV();
        res.status(201).json({ message: `Successfully added ${newRecordsInserted} new multi-team hitter row(s) to the database!` });
    } catch (error) {
        console.log('the error was caught:', error.message);
        next(error);
    }
});

module.exports = router;
