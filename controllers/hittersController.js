const router = require('express').Router();
const Hitters = require('../models/hitters');
const RealTeam = require('../models/realTeam');
const RmlTeam = require('../models/rmlTeam');
const { processHittersXLSX, processHittersInsertData } = require('./utils/processHittersXLSX');
const { processMultiTeamHittersXLSX, processMultiTeamHittersInsertData } = require('./utils/processMultiTeamHittersXLSX');
const calculateHitterValues = require('./utils/calculateHitterValues');
const ensureUploadsExists = require('./utils/ensureUploadsExists');
const path = require('path');
const fileUpload = require('express-fileupload');
const hittersSchema = require('./validation/schema/hittersSchema');
const multiTeamHittersSchema = require('./validation/schema/multiTeamHittersSchema');
const convertToCsv = require('./utils/convertMultiTeamHittersToCsv');
const converter = require('json-2-csv');
const convertArrToObj = require('./utils/rmlTeamArrToObj');

router.get('/season-list', async (req, res, next) => {
    try {
        const [data, error] = await Hitters.getSeasonsListWithHitterData();
        return data ? res.json(data) : next(error);
    } catch (error) {
        next(error);
    }
});

router.get('/create-multi-team-csv', async (req, res, next) => {
    try {
        const hittersOnIndividualTeams = convertToCsv();

        const csv = converter.json2csv(hittersOnIndividualTeams);
        return csv ? res.status(200).send(csv) : res.status(500).end();
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
        await file.mv(path.join(__dirname, '/uploads/hitter_ratings.xlsx'), error => {
            if (error) return next(error);
        });

        const [realTeams] = await RealTeam.getAllRealTeams();
        const [rmlTeamsArr] = await RmlTeam.getAllRmlTeams();
        const rmlTeams = convertArrToObj(rmlTeamsArr);
        const xlsxData = await processHittersXLSX();
        await hittersSchema.validateAsync(xlsxData);
        const processedHitters = processHittersInsertData(xlsxData, realTeams, rmlTeams);

        const [data, error] = await Hitters.addNewHittersData(processedHitters);
        data ? res.status(201).json({ message: `Successfully added ${data[1].affectedRows} new hitter row(s) to the database!`, added: data[1].affectedRows }) : next(error);
    } catch (error) {
        next(error);
    }
});

router.post('/multi-team', fileUpload(), async (req, res, next) => {
    try {
        if (req.files === null) return res.status(400).json({ message: 'No file was uploaded!' });
        const file = req.files.file;

        await ensureUploadsExists();
        await file.mv(path.join(__dirname, '/uploads/multi_team_hitters.xlsx'), error => {
            if (error) return next(error);
        });

        const [realTeams] = await RealTeam.getAllRealTeams();
        const xlsxData = await processMultiTeamHittersXLSX();
        await multiTeamHittersSchema.validateAsync(xlsxData);
        const processedMultiTeamHitters = processMultiTeamHittersInsertData(xlsxData, realTeams);

        const [data, error] = await Hitters.addMultiTeamHittersData(processedMultiTeamHitters);
        data ? res.status(201).json({ message: `Successfully added ${data[1].affectedRows} new hitter row(s) to the database!`, added: data[1].affectedRows }) : next(error);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
