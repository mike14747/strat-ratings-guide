const parse = require('csv-parse');
const fs = require('fs');
const path = require('path');
const Pitchers = require('../../models/pitchers');
const RealTeam = require('../../models/realTeam');

const convertNameToNameAndThrows = (name) => {
    return {
        pitcherName: name.slice(-1) === '*'
            ? name.slice(0, -1)
            : name.slice(-1) === '+'
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

const processInsertData = async (csvData) => {
    try {
        const [result] = await RealTeam.getAllRealTeams();
        const realTeams = JSON.parse(JSON.stringify(result));

        const modifiedArray = csvData.map(row => {
            const { pitcherName, throws } = convertNameToNameAndThrows(row.PITCHERS);
            const { bp: bpVsL, bpsi: bpSiVsL } = convertBpToBpAndBpSi(`${row.BP_v_l}`);
            const { bp: bpVsR, bpsi: bpSiVsR } = convertBpToBpAndBpSi(`${row.BP_v_r}`);

            const { real_team_abbrev: realTeam, real_team_id: realTeamId } = realTeams.find((team) => {
                return team.strat_abbrev === row.TM;
            });

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
                rmlTeamId: row.rml_team_id ? parseInt(row.rml_team_id) : null,
            };

            return Object.values(pitcherObj);
        });

        const [data, error] = await Pitchers.addNewPitchersData(modifiedArray);
        if (error) console.log(error);
        return (data && data.affectedRows) || 0;
    } catch (error) {
        console.log(error.message);
    }
};

const processMultiTeamPitchersCSV = async () => {
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
                }),
            )
            .on('data', async row => {
                csvData.push(row);
            })
            .on('error', error => {
                reject(error);
            })
            .on('end', async function () {
                const numInserted = await processInsertData(csvData) || 0;
                try {
                    await fs.promises.unlink(path.join(__dirname, '../uploads/pitcher_ratings.csv'));
                } catch (error) {
                    console.log(error);
                }
                resolve(numInserted);
            });
    });
};

module.exports = processMultiTeamPitchersCSV;
