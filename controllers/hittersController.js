const router = require('express').Router();
const Hitters = require('../models/hitters');
const processHittersCSV = require('./utils/processHittersCSV');
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
        // data ? res.json(data) : next(error);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        if (req.files === null) {
            return res.status(400).json({ message: 'No file was uploaded!' });
        }

        const file = req.files.file;

        const [, error] = await Hitters.truncateHittersTable();
        if (error) {
            return res.status(500).json({ message: 'Could not truncate the hitters table in the database!' });
        }

        if (!fs.existsSync(path.join(__dirname, '/uploads'))) {
            fs.mkdirSync(path.join(__dirname, '/uploads'), {
                recursive: true,
            });
        }

        await file.mv(path.join(__dirname, '/uploads/hitter_ratings.csv'), error => {
            if (error) {
                return next(error);
            }
        });
        const newRecordsInserted = await processHittersCSV();
        res.status(201).json({ message: `Successfully added ${newRecordsInserted} new hitter row(s) to the database!` });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
