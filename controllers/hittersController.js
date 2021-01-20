const router = require('express').Router();
const Hitters = require('../models/hitters');
const RealTeam = require('../models/realTeam');
const { processHittersCSV, processInsertData } = require('./utils/processHittersCSV');
const processMultiTeamHittersCSV = require('./utils/processMultiTeamHittersCSV');
const calculateHitterValues = require('./utils/calculateHitterValues');
const ensureUploadsExists = require('./utils/ensureUploadsExists');
const path = require('path');
const fileUpload = require('express-fileupload');
const hitterSchema = require('./validation/schema/hitterSchema');

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

        await ensureUploadsExists();
        await file.mv(path.join(__dirname, '/uploads/hitter_ratings.csv'), error => {
            if (error) return next(error);
        });

        const [realTeams] = await RealTeam.getAllRealTeams();
        const csvData = await processHittersCSV(realTeams);
        await hitterSchema.validateAsync(csvData);
        const processedHitters = processInsertData(csvData, realTeams);

        const [data, error] = await Hitters.addNewHittersData(processedHitters);
        data ? res.status(201).json({ message: `Successfully added ${data[1].affectedRows} new hitter row(s) to the database!` }) : next(error);
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
