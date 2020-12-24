const router = require('express').Router();
const Pitchers = require('../models/pitchers');
const processPitchersCSV = require('./utils/processPitchersCSV');
const calculatePitcherValues = require('./utils/calculatePitcherValues');
const path = require('path');
const fs = require('fs');
// const fsPromises = fs.promises;

router.get('/season-list', async (req, res, next) => {
    try {
        const [data, error] = await Pitchers.getSeasonsListWithPitcherData();
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

router.post('/', async (req, res, next) => {
    try {
        if (req.files === null) {
            return res.status(400).json({ message: 'No file was uploaded!' });
        }

        const file = req.files.file;

        const [, error] = await Pitchers.truncatePitchersTable();
        if (error) {
            return res.status(500).json({ message: 'Could not truncate the pitchers table in the database!' });
        }

        if (!fs.existsSync(path.join(__dirname, '/uploads'))) {
            console.log('there is not an uploads folder.');
            fs.mkdirSync(path.join(__dirname, '/uploads'), {
                recursive: true
            });
        }

        await file.mv(path.join(__dirname, '/uploads/pitcher_ratings.csv'), error => {
            if (error) {
                return next(error);
            }
        });
        await processPitchersCSV();
        res.status(201).json({ message: 'Successfully added the new data to the database!' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
