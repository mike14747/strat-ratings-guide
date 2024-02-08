const router = require('express').Router();
const Pitchers = require('../models/pitchers');
const { getAllRmlTeams } = require('../models/rmlTeam');
const { getAllRealTeams } = require('../models/realTeam');
const { getAllCardedPlayers } = require('../models/cardedPlayers');
const { processPitchersXLSX, processPitchersInsertData } = require('./utils/processPitchersXLSX');
const { processMultiTeamPitchersXLSX, processMultiTeamPitchersInsertData } = require('./utils/processMultiTeamPitchersXLSX');
const calculatePitcherValues = require('./utils/calculatePitcherValues');
const ensureUploadsExists = require('./utils/ensureUploadsExists');
const path = require('path');
const fileUpload = require('express-fileupload');
const pitchersSchema = require('./validation/schema/pitchersSchema');
const multiTeamPitchersSchema = require('./validation/schema/multiTeamPitchersSchema');
const convertToCsv = require('./utils/convertMultiTeamPitchersToCsv');
const converter = require('json-2-csv');
const convertArrToObj = require('./utils/rmlTeamArrToObj');

router.get('/season-list', async (req, res, next) => {
    try {
        const [data, error] = await Pitchers.getSeasonsListWithPitcherData();
        return data ? res.json(data) : next(error);
    } catch (error) {
        next(error);
    }
});

router.get('/create-multi-team-csv', async (req, res, next) => {
    try {
        const pitchersOnIndividualTeams = convertToCsv();

        const csv = converter.json2csv(pitchersOnIndividualTeams);
        return csv ? res.status(200).send(csv) : res.status(500).end();
    } catch (error) {
        next(error);
    }
});

router.get('/:id/season/:year', async (req, res, next) => {
    try {
        const [data, error] = await Pitchers.getPitchersDataByYearAndId(req.params.year, req.params.id);
        const [multiData, multiError] = await Pitchers.getMultiTeamPitchersPartialByYear(req.params.year);
        return data && multiData ? res.json(calculatePitcherValues(data, multiData)) : next(error || multiError);
    } catch (error) {
        next(error);
    }
});

router.get('/:year', async (req, res, next) => {
    try {
        const [data, error] = await Pitchers.getPitchersDataByYear(req.params.year);
        const [multiData, multiError] = await Pitchers.getMultiTeamPitchersPartialByYear(req.params.year);
        return data && multiData ? res.json(calculatePitcherValues(data, multiData)) : next(error || multiError);
    } catch (error) {
        next(error);
    }
});

router.post('/', fileUpload(), async (req, res, next) => {
    try {
        if (req.files === null) return res.status(400).json({ message: 'No file was uploaded!' });
        const file = req.files.file;

        await ensureUploadsExists();
        await file.mv(path.join(__dirname, '/uploads/pitcher_ratings.xlsx'), error => {
            if (error) return next(error);
        });

        const [realTeams] = await getAllRealTeams();
        const [rmlTeamsArr] = await getAllRmlTeams();
        const rmlTeams = convertArrToObj(rmlTeamsArr);
        const [cardedPlayers] = await getAllCardedPlayers();
        const xlsxData = await processPitchersXLSX();
        await pitchersSchema.validateAsync(xlsxData);
        const processedPitchers = processPitchersInsertData(xlsxData, realTeams, rmlTeams, cardedPlayers);

        const [data, error] = await Pitchers.addNewPitchersData(processedPitchers);
        return data ? res.status(201).json({ message: `Successfully added ${data[1].affectedRows} new pitcher row(s) to the database!`, added: data[1].affectedRows }) : next(error);
    } catch (error) {
        next(error);
    }
});

router.post('/multi-team', fileUpload(), async (req, res, next) => {
    try {
        if (req.files === null) return res.status(400).json({ message: 'No file was uploaded!' });
        const file = req.files.file;

        await ensureUploadsExists();
        await file.mv(path.join(__dirname, '/uploads/multi_team_pitchers.xlsx'), error => {
            if (error) return next(error);
        });

        const [realTeams] = await getAllRealTeams();
        const xlsxData = await processMultiTeamPitchersXLSX();
        await multiTeamPitchersSchema.validateAsync(xlsxData);
        const processedMultiTeamPitchers = processMultiTeamPitchersInsertData(xlsxData, realTeams);

        const [data, error] = await Pitchers.addMultiTeamPitchersData(processedMultiTeamPitchers);
        return data ? res.status(201).json({ message: `Successfully added ${data[1].affectedRows} new pitcher row(s) to the database!`, added: data[1].affectedRows }) : next(error);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
