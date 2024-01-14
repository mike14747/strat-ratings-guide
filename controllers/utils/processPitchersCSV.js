const parse = require('csv-parse');
const fs = require('fs');
const path = require('path');
const rmlTeams = require('./rmlTeams');
const cardedPlayers = require('./cardedPlayers');

const convertNameToNameAndThrows = (name) => {
    return {
        pitcherName: (name.slice(-1) === '*' || name.slice(-1) === '+')
            ? name.slice(0, -1)
            : name,
        throws: name.slice(-1) === '*'
            ? 'L'
            : name.slice(-1) === '+'
                ? 'S'
                : 'R',
    };
};

const convertBpToBpAndBpSi = (bp) => {
    return {
        bp: isNaN(bp.charAt(0))
            ? 0
            : parseInt(bp.charAt(0)),
        bpsi: bp.slice(-1) === '*'
            ? 0
            : 2,
    };
};

const processPitchersInsertData = (csvData, realTeams) => {
    return csvData.map(row => {
        const { pitcherName, throws } = convertNameToNameAndThrows(row.PITCHERS);

        const { bp: bpVsL, bpsi: bpSiVsL } = convertBpToBpAndBpSi(`${row.BP_v_l}`);
        const { bp: bpVsR, bpsi: bpSiVsR } = convertBpToBpAndBpSi(`${row.BP_v_r}`);

        const foundTeam = realTeams.find(team => team.strat_abbrev === row.TM);
        if (!foundTeam) throw new RangeError(`No match found for the strat abbreviation (${row.TM}) in the csv file!`);
        const { real_team_abbrev: realTeam, real_team_id: realTeamId } = foundTeam;

        const pitcherObj = {
            year: parseInt(row.Year),
            realTeam,
            realTeamId,
            pitcherName,
            throws,
            ip: parseInt(row.IP),
            soVsL: parseInt(row.SO_v_l),
            bbVsL: parseFloat(row.BB_v_l),
            hitVsL: parseFloat(row.HIT_v_l),
            obVsL: parseFloat(row.OB_v_l),
            tbVsL: parseFloat(row.TB_v_l),
            hrVsL: parseFloat(row.HR_v_l),
            bpVsL,
            bpSiVsL,
            dpVsL: parseInt(row.DP_v_l),
            soVsR: parseInt(row.SO_v_r),
            bbVsR: parseFloat(row.BB_v_r),
            hitVsR: parseFloat(row.HIT_v_r),
            obVsR: parseFloat(row.OB_v_r),
            tbVsR: parseFloat(row.TB_v_r),
            hrVsR: parseFloat(row.HR_v_r),
            bpVsR,
            bpSiVsR,
            dpVsR: parseInt(row.DP_v_r),
            hold: parseInt(row.HO),
            endurance: row.ENDURANCE,
            field: row.FIELD.replace('\'', '').replace('-', 'e').replace(' ', ''),
            balk: parseInt(row.BK),
            wp: parseInt(row.WP),
            batting: row.BAT_B,
            stl: row.STL,
            spd: parseInt(row.SPD),
            rmlTeamId: row.rml_team_id || rmlTeams[cardedPlayers[cardedPlayers.findIndex((item) => item.name === pitcherName)]?.team] || null,
        };

        return Object.values(pitcherObj);
    });
};

const processPitchersCSV = () => {
    const csvData = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '../uploads/pitcher_ratings.csv'))
            .pipe(
                parse({
                    delimiter: ',',
                    columns: true,
                    // from_line: 1,
                    // to_line: 2,
                    trim: true,
                    skip_empty_lines: true,
                }),
            )
            .on('data', row => csvData.push(row))
            .on('error', error => reject(error))
            .on('end', async function () {
                try {
                    await fs.promises.unlink(path.join(__dirname, '../uploads/pitcher_ratings.csv'));
                    resolve(csvData);
                } catch (error) {
                    console.log(error);
                    reject(error);
                }
            });
    });
};

module.exports = {
    processPitchersCSV,
    processPitchersInsertData,
};
