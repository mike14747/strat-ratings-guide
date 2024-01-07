const router = require('express').Router();
const Hitters = require('../models/hitters');
const RealTeam = require('../models/realTeam');
const { processHittersCSV, processHittersInsertData } = require('./utils/processHittersCSV');
const { processMultiTeamHittersCSV, processMultiTeamHittersInsertData } = require('./utils/processMultiTeamHittersCSV');
const calculateHitterValues = require('./utils/calculateHitterValues');
const ensureUploadsExists = require('./utils/ensureUploadsExists');
const path = require('path');
const fileUpload = require('express-fileupload');
const hittersSchema = require('./validation/schema/hittersSchema');
const multiTeamHittersSchema = require('./validation/schema/multiTeamHittersSchema');
const multiTeamHitters = require('./utils/multiHittersTotFormatted');
const allHitters = require('./utils/multiHittersAllFormatted');
const converter = require('json-2-csv');

router.get('/season-list', async (req, res, next) => {
    try {
        const [data, error] = await Hitters.getSeasonsListWithHitterData();
        data ? res.json(data) : next(error);
    } catch (error) {
        next(error);
    }
});

router.get('/multi-team-new', async (req, res, next) => {
    try {
        const hittersOnIndividualTeams = [];

        allHitters.forEach(indTeam => {
            if (indTeam.team !== 'TOT' && multiTeamHitters[indTeam.id]) {
                indTeam.year = 2023;
                const nameParts = multiTeamHitters[indTeam.id].name.split(', ');
                hittersOnIndividualTeams.push({
                    year: 2023,
                    name: nameParts[0] + ',' + nameParts[1][0],
                    bats: multiTeamHitters[indTeam.id].bats,
                    team: indTeam.team,
                    ab: indTeam.ab,
                });
            }
        });

        const csv = await converter.json2csv(hittersOnIndividualTeams);
        return res.send(csv);
        // res.status(200).json(hittersOnIndividualTeams);
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
        const csvData = await processHittersCSV();
        await hittersSchema.validateAsync(csvData);
        const processedHitters = processHittersInsertData(csvData, realTeams);

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
        await file.mv(path.join(__dirname, '/uploads/multi_team_hitters.csv'), error => {
            if (error) return next(error);
        });

        const [realTeams] = await RealTeam.getAllRealTeams();
        const csvData = await processMultiTeamHittersCSV();
        await multiTeamHittersSchema.validateAsync(csvData);
        const processedMultiTeamHitters = processMultiTeamHittersInsertData(csvData, realTeams);

        const [data, error] = await Hitters.addMultiTeamHittersData(processedMultiTeamHitters);
        data ? res.status(201).json({ message: `Successfully added ${data[1].affectedRows} new hitter row(s) to the database!`, added: data[1].affectedRows }) : next(error);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
