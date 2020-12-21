const parse = require('csv-parse');
const fs = require('fs');
const path = require('path');
const Pitchers = require('../../models/pitchers');
const realTeam = require('../../models/realTeam');

const getRealTeamId = async (name) => {
    const [data, error] = await realTeam.getRealTeamIdByStratName(name);
    if (error) console.log(error);
    if (data && data.length === 1) {
        return {
            realTeam: data[0].real_team_abbrev,
            realTeamId: parseInt(data[0].real_team_id),
        };
    }
};

const convertNameToNameAndThrows = (name) => {
    return {
        pitcherName: name.slice(-1) === '*'
            ? name.slice(0, -1)
            : name.slice(-1) === '+'
                ? name.slice(0, -1)
                : name,
        bats: name.slice(-1) === '*'
            ? 'L'
            : name.slice(-1) === '+'
                ? 'S'
                : 'R',
    };
};

const processInsertData = async (row) => {
    const { realTeam, realTeamId } = await getRealTeamId(row.TM);
    const { pitcherName, throws } = convertNameToNameAndThrows(row.PITCHERS);

    const modifiedObj = {
        year: parseInt(row.Year),
        realTeam,
        realTeamId,
        pitcherName,
        throws,
        inj: row.INJ,
        ab: parseInt(row.AB),
        soVsL: parseInt(row.SO_v_lhp),
        bbVsL: Math.round(parseFloat(row.OB_v_lhp) - parseFloat(row.HIT_v_lhp)),
        hitVsL: parseFloat(row.HIT_v_lhp),
        obVsL: parseFloat(row.OB_v_lhp),
        tbVsL: parseFloat(row.TB_v_lhp),
        hrVsL: parseFloat(row.HR_v_lhp),
        clVsL: parseInt(row.CL_v_lhp),
        dpVsL: parseInt(row.DP_v_lhp),
        soVsR: parseInt(row.SO_v_rhp),
        bbVsR: Math.round(parseFloat(row.OB_v_rhp) - parseFloat(row.HIT_v_rhp)),
        hitVsR: parseFloat(row.HIT_v_rhp),
        obVsR: parseFloat(row.OB_v_rhp),
        tbVsR: parseFloat(row.TB_v_rhp),
        hrVsR: parseFloat(row.HR_v_rhp),
        clVsR: parseInt(row.CL_v_rhp),
        dpVsR: parseInt(row.DP_v_rhp),
        stealing: row.STEALING,
        stl: row.STL,
        spd: parseInt(row.SPD),
        bunt: row.B,
        hitRun: row.H,
        fielding: row.FIELD,
        rmlTeamId: row.rml_team_id !== '' ? parseInt(row.rml_team_id) : '',
    };

    const [, error] = await Pitchers.addNewPitchersRow(modifiedObj);
    if (error) console.log(error);
};

const processPitchersCSV = async () => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '../uploads/pitcher_ratings.csv'))
            .pipe(
                parse({
                    delimiter: ',',
                    columns: true,
                    // from_line: 1,
                    // to_line: 2,
                    trim: true,
                }),
            )
            .on('data', async row => {
                await processInsertData(row);
            })
            .on('error', error => {
                reject(error);
            })
            .on('end', async function () {
                const fs = require('fs').promises;
                try {
                    await fs.unlink(path.join(__dirname, '../uploads/pitcher_ratings.csv'));
                } catch (error) {
                    console.log(error);
                }
                resolve();
            });
    });
};

module.exports = processPitchersCSV;
