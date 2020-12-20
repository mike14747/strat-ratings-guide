const parse = require('csv-parse');
const fs = require('fs');
const path = require('path');
const Hitters = require('../../models/hitters');
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

const processInsertData = async (row) => {
    // console.log(row);

    const { realTeam, realTeamId } = await getRealTeamId(row.TM);

    // h_year, real_team, real_team_id, hitter_name, bats, injury, ab, so_v_l, bb_v_l, hit_v_l, ob_v_l, tb_v_l, hr_v_l, bp_hr_v_l, w_v_l, bp_si_v_l, cl_v_l, dp_v_l, so_v_r, bb_v_r, hit_v_r, ob_v_r, tb_v_r, hr_v_r, bp_hr_v_r, w_v_r, bp_si_v_r, cl_v_r, dp_v_r, stealing, stl, spd, bunt, h_r, d_ca, d_1b, d_2b, d_3b, d_ss, d_lf, d_cf, d_rf, fielding, rml_team_id

    const modifiedObj = {
        year: parseInt(row.Year),
        realTeam,
        realTeamId,
        hitter: row.HITTERS.slice(-1) === '*' ? row.HITTERS.slice(0, -1) : row.HITTERS.slice(-1) === '+' ? row.HITTERS.slice(0, -1) : row.HITTERS,
        bats: row.HITTERS.slice(-1) === '*' ? 'L' : row.HITTERS.slice(-1) === '+' ? 'S' : 'R',
        inj: row.INJ,
        ab: parseInt(row.AB),
        soVsL: parseInt(row.SO_v_lhp),
        bbVsL: parseInt(row.BB_v_lhp),
        hitVsL: Number(row.HIT_v_lhp),
        obVsL: Number(row.OB_v_lhp),
        tbVsL: Number(row.TB_v_lhp),
        hrVsL: Number(row.HR_v_lhp),
        bpVsL: isNaN(row.BP_v_lhp.charAt[0]) ? 0 : row.BP_v_lhp.charAt[0],
        wVsL: row.BP_v_lhp.charAt[0] === 'w' ? 'w' : '',
        bpSiVsL: row.BP_v_lhp.slice(-1) === '*' ? 0 : 2,
        clVsL: parseInt(row.CL_v_lhp),
        dpVsL: parseInt(row.DP_v_lhp),
        soVsR: parseInt(row.SO_v_rhp),
        bbVsR: parseInt(row.BB_v_rhp),
        hitVsR: Number(row.HIT_v_rhp),
        obVsR: Number(row.OB_v_rhp),
        tbVsR: Number(row.TB_v_rhp),
        hrVsR: Number(row.HR_v_rhp),
        bpVsR: isNaN(row.BP_v_rhp.charAt[0]) ? 0 : row.BP_v_rhp.charAt[0],
        wVsR: row.BP_v_rhp.charAt[0] === 'w' ? 'w' : '',
        bpSiVsR: row.BP_v_rhp.slice(-1) === '*' ? 0 : 2,
        clVsR: parseInt(row.CL_v_rhp),
        dpVsR: parseInt(row.DP_v_rhp),
        stealing: row.STEALING,
        stl: row.STL,
        spd: parseInt(row.SPD),
        bunt: row.B,
        hitRun: row.H,
        dCA: row.d_CA !== '' ? `${row.d_CA.charAt(0)}e${parseInt(row.d_CA.slice(1, 3))}` : '',
        d1B: row.d_1B !== '' ? `${row.d_1B.charAt(0)}e${parseInt(row.d_1B.slice(1, 3))}` : '',
        d2B: row.d_2B !== '' ? `${row.d_2B.charAt(0)}e${parseInt(row.d_2B.slice(1, 3))}` : '',
        d3B: row.d_3B !== '' ? `${row.d_3B.charAt(0)}e${parseInt(row.d_3B.slice(1, 3))}` : '',
        dSS: row.d_SS !== '' ? `${row.d_SS.charAt(0)}e${parseInt(row.d_SS.slice(1, 3))}` : '',
        dLF: row.d_LF !== '' ? `${row.d_LF.charAt(0)}e${parseInt(row.d_LF.slice(1, 3))}` : '',
        dCF: row.d_CF !== '' ? `${row.d_CF.charAt(0)}e${parseInt(row.d_CF.slice(1, 3))}` : '',
        dRF: row.d_RF !== '' ? `${row.d_RF.charAt(0)}e${parseInt(row.d_RF.slice(1, 3))}` : '',
        fielding: row.FIELDING,
        rmlTeamId: row.rml_team_id !== '' ? parseInt(row.rml_team_id) : '',
    };

    // console.log(modifiedObj);

    const [, error] = await Hitters.addNewHittersRow(modifiedObj);
    if (error) console.log(error);
};

const readHittersFile = () => {
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
                resolve();
            });
    });
};

module.exports = {
    readHittersFile,
};
