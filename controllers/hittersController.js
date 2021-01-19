const router = require('express').Router();
const Hitters = require('../models/hitters');
const processHittersCSV = require('./utils/processHittersCSV');
const processMultiTeamHittersCSV = require('./utils/processMultiTeamHittersCSV');
const calculateHitterValues = require('./utils/calculateHitterValues');
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

router.get('/:year', async (req, res, next) => {
    try {
        const [data, error] = await Hitters.getHittersDataByYear(req.params.year);
        const [multiData, multiError] = await Hitters.getMultiTeamHittersPartialByYear(req.params.year);
        data && multiData ? res.json(calculateHitterValues(data, multiData)) : next(error || multiError);
    } catch (error) {
        next(error);
    }
});

router.post('/', fileUpload(), async (req, res, next) => {
    try {
        if (req.files === null) return res.status(400).json({ message: 'No file was uploaded!' });

        const file = req.files.file;

        const [, err] = await Hitters.truncateHittersTable();
        if (err) return next(err);

        await ensureUploadsExists();

        await file.mv(path.join(__dirname, '/uploads/hitter_ratings.csv'), error => {
            if (error) return next(error);
        });

        const processedHitters = await processHittersCSV();

        const [data, error] = await Hitters.addNewHittersData(processedHitters);
        data ? res.status(201).json({ message: `Successfully added ${data.affectedRows} new hitter row(s) to the database!` }) : next(error);
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

        ensureUploadsExists()
            .then(async () => {
                await file.mv(path.join(__dirname, '/uploads/multi_team_hitters.csv'), error => {
                    if (error) return next(error);
                });
                const newRecordsInserted = await processMultiTeamHittersCSV();
                return res.status(201).json({ message: `Successfully added ${newRecordsInserted} new multi-team hitter row(s) to the database!` });
            })
            .catch(error => next(error));
    } catch (error) {
        next(error);
    }
});

module.exports = router;
