const parse = require('csv-parse');
const fs = require('fs');
const path = require('path');
const cardedPlayers = require('./cardedPlayers');

const convertPositionlFielding = (rating) => {
    return rating !== '' ? `${rating.charAt(0)}e${parseInt(rating.slice(1, 3))}` : '';
};

const convertNameToNameAndBats = (name) => {
    return {
        hitterName: (name.slice(-1) === '*' || name.slice(-1) === '+')
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

const processHittersInsertData = (csvData, realTeams, rmlTeams) => {
    return csvData.map(row => {
        const { hitterName, bats } = convertNameToNameAndBats(row.HITTERS);
        const { bp: bpVsL, w: wVsL, bpsi: bpSiVsL } = convertBpToBpWAndBpSi(row.BP_v_lhp);
        const { bp: bpVsR, w: wVsR, bpsi: bpSiVsR } = convertBpToBpWAndBpSi(row.BP_v_rhp);

        const foundTeam = realTeams.find(team => team.strat_abbrev === row.TM);
        if (!foundTeam) throw new RangeError(`No match found for the strat abbreviation (${row.TM}) in the csv file!`);
        const { real_team_abbrev: realTeam, real_team_id: realTeamId } = foundTeam;

        const hitterObj = {
            year: row.Year,
            realTeam,
            realTeamId,
            hitterName,
            bats,
            inj: row.INJ || row.INJ === 0 ? row.INJ : null,
            ab: row.AB,
            soVsL: row.SO_v_lhp,
            bbVsL: Math.round(row.OB_v_lhp - row.HIT_v_lhp),
            hitVsL: row.HIT_v_lhp,
            obVsL: row.OB_v_lhp,
            tbVsL: row.TB_v_lhp,
            hrVsL: row.HR_v_lhp,
            bpVsL,
            wVsL,
            bpSiVsL,
            clVsL: row.CL_v_lhp,
            dpVsL: row.DP_v_lhp,
            soVsR: row.SO_v_rhp,
            bbVsR: Math.round(row.OB_v_rhp - row.HIT_v_rhp),
            hitVsR: row.HIT_v_rhp,
            obVsR: row.OB_v_rhp,
            tbVsR: row.TB_v_rhp,
            hrVsR: row.HR_v_rhp,
            bpVsR,
            wVsR,
            bpSiVsR,
            clVsR: row.CL_v_rhp,
            dpVsR: row.DP_v_rhp,
            stealing: row.STEALING,
            stl: row.STL,
            spd: row.SPD,
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
            rmlTeamId: row.rml_team_id || rmlTeams[cardedPlayers[cardedPlayers.findIndex((item) => (item.abbrevName.toLowerCase() === hitterName.toLowerCase() && item.year === row.Year && item.ab === row.AB))]?.rmlTeam] || null,
        };

        return Object.values(hitterObj);
    });
};

const processHittersCSV = () => {
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
                    // cast: true,
                    cast: function (value, { header, index }) {
                        const castInts = [0, 5, 6, 7, 13, 14, 15, 16, 22, 23, 26];
                        const castFloats = [8, 9, 10, 11, 17, 18, 19, 20];
                        const possibleNull = [2, 4, 38];
                        if (header) {
                            return value;
                        } else {
                            if (castInts.includes(index)) {
                                return parseInt(value);
                            } else if (castFloats.includes(index)) {
                                return parseFloat(value);
                            } else if (possibleNull.includes(index)) {
                                return value ? parseInt(value) : null;
                            } else {
                                return value;
                            }
                        }
                    },
                    skip_empty_lines: true,
                }),
            )
            .on('data', row => csvData.push(row))
            .on('error', error => reject(error))
            .on('end', async function () {
                try {
                    await fs.promises.unlink(path.join(__dirname, '../uploads/hitter_ratings.csv'));
                    resolve(csvData);
                } catch (error) {
                    console.log(error);
                    reject(error);
                }
            });
    });
};

module.exports = {
    processHittersCSV,
    processHittersInsertData,
};
