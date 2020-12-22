const parse = require('csv-parse');
const fs = require('fs');
const path = require('path');
const Hitters = require('../../models/hitters');
const RealTeam = require('../../models/realTeam');

const getRealTeamId = async (name) => {
    try {
        const [data, error] = await RealTeam.getRealTeamIdByStratName(name);
        if (error) console.log(error.message);
        if (data && data.length === 1) {
            return {
                realTeam: data[0].real_team_abbrev,
                realTeamId: parseInt(data[0].real_team_id),
            };
        }
    } catch (error) {
        console.log(error.message);
    }
};

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

const processInsertData = async (row) => {
    try {
        const { realTeam, realTeamId } = await getRealTeamId(row.TM);
        const { hitterName, bats } = convertNameToNameAndBats(row.HITTERS);
        const { bp: bpVsL, w: wVsL, bpsi: bpSiVsL } = convertBpToBpWAndBpSi(`${row.BP_v_lhp}`);
        const { bp: bpVsR, w: wVsR, bpsi: bpSiVsR } = convertBpToBpWAndBpSi(`${row.BP_v_rhp}`);

        const modifiedObj = {
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
            rmlTeamId: row.rml_team_id !== '' ? parseInt(row.rml_team_id) : '',
        };

        await Hitters.addNewHittersRow(modifiedObj);
    } catch (error) {
        console.log(error.message);
    }
};

const processHittersCSV = async () => {
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
            .on('data', async row => {
                await processInsertData(row);
            })
            .on('error', error => {
                reject(error);
            })
            .on('end', async function () {
                const fs = require('fs').promises;
                try {
                    await fs.unlink(path.join(__dirname, '../uploads/hitter_ratings.csv'));
                } catch (error) {
                    console.log(error);
                }
                resolve();
            });
    });
};

module.exports = processHittersCSV;
