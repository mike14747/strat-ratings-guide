const router = require('express').Router();
const Hitters = require('../models/hitters');
const processHittersCSV = require('./utils/processHittersCSV');
const calculateHitterValues = require('./utils/calculateHitterValues');
const path = require('path');

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

        await file.mv(path.join(__dirname, '/uploads/hitter_ratings.csv'), error => {
            if (error) {
                return next(error);
            }
        });
        await processHittersCSV();
        res.status(201).json({ message: 'Successfully added the new data to the database!' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
