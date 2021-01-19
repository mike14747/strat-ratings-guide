const parse = require('csv-parse');
const fs = require('fs');
const path = require('path');

const convertPositionlFielding = (rating) => {
    return rating !== '' ? `${rating.charAt(0)}e${parseInt(rating.slice(1, 3))}` : '';
};

const convertNameToNameAndBats = (name) => {
    return {
        hitterName: name.slice(-1) === '*'
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

const convertBpToBpWAndBpSi = (bp) => {
    return {
        bp: isNaN(bp.charAt(0))
            ? 0
            : bp.charAt(0),
        w: bp.charAt(0) === 'w'
            ? 'w'
            : '',
        bpsi: bp.slice(-1) === '*'
            ? 0
            : 2,
    };
};

const processInsertData = (csvData, realTeams) => {
    const modifiedArray = csvData.map(row => {
        const { hitterName, bats } = convertNameToNameAndBats(row.HITTERS);
        const { bp: bpVsL, w: wVsL, bpsi: bpSiVsL } = convertBpToBpWAndBpSi(row.BP_v_lhp);
        const { bp: bpVsR, w: wVsR, bpsi: bpSiVsR } = convertBpToBpWAndBpSi(row.BP_v_rhp);

        const { real_team_abbrev: realTeam, real_team_id: realTeamId } = realTeams.find((team) => {
            return team.strat_abbrev === row.TM;
        });

        const hitterObj = {
            year: parseInt(row.Year),
            realTeam,
            realTeamId,
            hitterName,
            bats,
            inj: row.INJ,
            ab: parseInt(row.AB),
            soVsL: parseInt(row.SO_v_lhp),
            bbVsL: Math.round(parseFloat(row.OB_v_lhp) - parseFloat(row.HIT_v_lhp)),
            hitVsL: parseFloat(row.HIT_v_lhp),
            obVsL: parseFloat(row.OB_v_lhp),
            tbVsL: parseFloat(row.TB_v_lhp),
            hrVsL: parseFloat(row.HR_v_lhp),
            bpVsL,
            wVsL,
            bpSiVsL,
            clVsL: parseInt(row.CL_v_lhp),
            dpVsL: parseInt(row.DP_v_lhp),
            soVsR: parseInt(row.SO_v_rhp),
            bbVsR: Math.round(parseFloat(row.OB_v_rhp) - parseFloat(row.HIT_v_rhp)),
            hitVsR: parseFloat(row.HIT_v_rhp),
            obVsR: parseFloat(row.OB_v_rhp),
            tbVsR: parseFloat(row.TB_v_rhp),
            hrVsR: parseFloat(row.HR_v_rhp),
            bpVsR,
            wVsR,
            bpSiVsR,
            clVsR: parseInt(row.CL_v_rhp),
            dpVsR: parseInt(row.DP_v_rhp),
            stealing: row.STEALING,
            stl: row.STL,
            spd: parseInt(row.SPD),
            bunt: row.B,
            hitRun: row.H,
            dCA: convertPositionlFielding(row.d_CA),
            d1B: convertPositionlFielding(row.d_1B),
            d2B: convertPositionlFielding(row.d_2B),
            d3B: convertPositionlFielding(row.d_3B),
            dSS: convertPositionlFielding(row.d_SS),
            dLF: convertPositionlFielding(row.d_LF),
            dCF: convertPositionlFielding(row.d_CF),
            dRF: convertPositionlFielding(row.d_RF),
            fielding: row.FIELDING,
            rmlTeamId: row.rml_team_id ? parseInt(row.rml_team_id) : null,
        };

        return Object.values(hitterObj);
    });

    return modifiedArray;
};

const processHittersCSV = async (realTeams) => {
    const csvData = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '../uploads/hitter_ratings.csv'))
            .pipe(
                parse({
                    delimiter: ',',
                    columns: true,
                    // from_line: 1,
                    // to_line: 2,
                    trim: true,
                }),
            )
            .on('data', row => {
                csvData.push(row);
                // console.log(row);
            })
            .on('error', error => reject(error))
            .on('end', async function () {
                try {
                    await fs.promises.unlink(path.join(__dirname, '../uploads/hitter_ratings.csv'));
                    const processedHitters = processInsertData(csvData, realTeams);
                    resolve(processedHitters);
                } catch (error) {
                    console.log(error);
                    reject(error);
                }
            });
    });
};

module.exports = processHittersCSV;
