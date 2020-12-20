const router = require('express').Router();
const Hitters = require('../models/hitters');
const { modifiedHitterData } = require('./utils/hitterFunctions');
const { readHittersFile } = require('./utils/processHittersCSV');
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
        data ? res.json(modifiedHitterData(data)) : next(error);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    if (req.files === null) {
        return res.status(400).json({ message: 'No file was uploaded!' });
    }

    const file = req.files.file;

    const [, error] = await Hitters.truncateHittersTable();
    if (error) {
        return res.status(500).json({ message: 'Could not truncate the hitters table in the database!' });
    }

    file.mv(path.join(__dirname, '/uploads/hitter_ratings.csv'), error => {
        if (error) {
            return next(error);
        }
    });
    readHittersFile();
    res.status(201).json({ message: 'Successfully added the new data to the database!' });
});

module.exports = router;
