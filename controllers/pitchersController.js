const router = require('express').Router();
const Pitchers = require('../models/pitchers');
const RealTeam = require('../models/realTeam');
const { processPitchersCSV, processPitchersInsertData } = require('./utils/processPitchersCSV');
const { processMultiTeamPitchersCSV, processMultiTeamPitchersInsertData } = require('./utils/processMultiTeamPitchersCSV');
const calculatePitcherValues = require('./utils/calculatePitcherValues');
const ensureUploadsExists = require('./utils/ensureUploadsExists');
const path = require('path');
const fileUpload = require('express-fileupload');
const pitchersSchema = require('./validation/schema/pitchersSchema');
const multiTeamPitchersSchema = require('./validation/schema/multiTeamPitchersSchema');

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
        const [multiData, multiError] = await Pitchers.getMultiTeamPitchersPartialByYear(req.params.year);
        data && multiData ? res.json(calculatePitcherValues(data, multiData)) : next(error || multiError);
    } catch (error) {
        next(error);
    }
});

router.post('/', fileUpload(), async (req, res, next) => {
    try {
        if (req.files === null) return res.status(400).json({ message: 'No file was uploaded!' });
        const file = req.files.file;

        await ensureUploadsExists();
        await file.mv(path.join(__dirname, '/uploads/pitcher_ratings.csv'), error => {
            if (error) return next(error);
        });

        const [realTeams] = await RealTeam.getAllRealTeams();
        const csvData = await processPitchersCSV();
        await pitchersSchema.validateAsync(csvData);
        const processedPitchers = processPitchersInsertData(csvData, realTeams);

        const [data, error] = await Pitchers.addNewPitchersData(processedPitchers);
        data ? res.status(201).json({ message: `Successfully added ${data[1].affectedRows} new pitcher row(s) to the database!`, added: data[1].affectedRows }) : next(error);
    } catch (error) {
        next(error);
    }
});

router.post('/multi-team', fileUpload(), async (req, res, next) => {
    try {
        if (req.files === null) return res.status(400).json({ message: 'No file was uploaded!' });
        const file = req.files.file;

        await ensureUploadsExists();
        await file.mv(path.join(__dirname, '/uploads/multi_team_pitchers.csv'), error => {
            if (error) return next(error);
        });

        const [realTeams] = await RealTeam.getAllRealTeams();
        const csvData = await processMultiTeamPitchersCSV();
        await multiTeamPitchersSchema.validateAsync(csvData);
        const processedMultiTeamPitchers = processMultiTeamPitchersInsertData(csvData, realTeams);
        // console.log(processedMultiTeamPitchers);

        const [data, error] = await Pitchers.addMultiTeamPitchersData(processedMultiTeamPitchers);
        data ? res.status(201).json({ message: `Successfully added ${data[1].affectedRows} new pitcher row(s) to the database!` }) : next(error);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
