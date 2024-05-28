import ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

type RealTeam = {
    id: number;
    real_team_abbrev: string;
    strat_abbrev: string;
    bbref_abbrev: string;
};

type CardedPlayer = {
    year: number;
    abbrev_name: string;
    full_name: string;
    rml_team: string;
    ip: number | null;
    ab: number | null;
};

type XlsxData = {
    Year: number;
    TM: string;
    Location: string | null;
    HITTERS: string;
    INJ: number | null; // 5
    AB: number;
    SO_v_lhp: number;
    BB_v_lhp: number;
    HIT_v_lhp: number;
    OB_v_lhp: number; // 10
    TB_v_lhp: number;
    HR_v_lhp: number;
    BP_v_lhp: string;
    CL_v_lhp: number;
    DP_v_lhp: number; // 15
    SO_v_rhp: number;
    BB_v_rhp: number;
    HIT_v_rhp: number;
    OB_v_rhp: number;
    TB_v_rhp: number; // 20
    HR_v_rhp: number;
    BP_v_rhp: string;
    CL_v_rhp: number;
    DP_v_rhp: number;
    STEALING: string; // 25
    STL: string;
    SPD: number;
    B: string;
    H: string;
    d_CA: string; // 30
    d_1B: string;
    d_2B: string;
    d_3B: string;
    d_SS: string;
    d_LF: string; // 35
    d_CF: string;
    d_RF: string;
    FIELDING: string;
    rml_team_id: number | null;
}

function convertPositionlFielding(rating: string) {
    return rating !== '' ? `${rating.charAt(0)}e${parseInt(rating.slice(1, 3))}` : '';
}

function convertNameToNameAndBats(name: string) {
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
}

function convertBpToBpWAndBpSi(bp: string) {
    return {
        bp: isNaN(parseInt(bp.charAt(0)))
            ? 0
            : bp.charAt(0),
        w: bp.charAt(0) === 'w'
            ? 'w'
            : '',
        bpsi: bp.slice(-1) === '*'
            ? 0
            : 2,
    };
}

export function processHittersInsertData(xlsxData: XlsxData[], realTeams: RealTeam[], rmlTeams: Record<string, number>[], cardedPlayers: CardedPlayer[]) {
    return xlsxData.map(row => {
        const { hitterName, bats } = convertNameToNameAndBats(row.HITTERS);
        const { bp: bpVsL, w: wVsL, bpsi: bpSiVsL } = convertBpToBpWAndBpSi(row.BP_v_lhp);
        const { bp: bpVsR, w: wVsR, bpsi: bpSiVsR } = convertBpToBpWAndBpSi(row.BP_v_rhp);

        const foundTeam = realTeams.find(team => team.strat_abbrev === row.TM);
        if (!foundTeam) throw new RangeError(`No match found for the strat abbreviation (${row.TM}) in the .xlsx file!`);
        const { real_team_abbrev: realTeam, id: realTeamId } = foundTeam;

        function calculateRMLTeamId() {
            const index = cardedPlayers.findIndex((item) => (item.abbrev_name.toLowerCase() === hitterName.toLowerCase() && item.year === row.Year && item.ab === row.AB));
            if (!index) return null;
            return rmlTeams[index]?.rml_team || null;
        }
        const rmlTeamId = row.rml_team_id || calculateRMLTeamId();

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
            // rmlTeamId: row.rml_team_id || rmlTeams[cardedPlayers[cardedPlayers.findIndex((item) => (item.abbrev_name.toLowerCase() === hitterName.toLowerCase() && item.year === row.Year && item.ab === row.AB))]?.rml_team] || null,
            rmlTeamId,
        };

        return Object.values(hitterObj);
    });
}

export async function processHittersXLSX() {
    // 39 possible columns (1 through 39)
    const castInts = [1, 6, 7, 8, 14, 15, 16, 17, 23, 24, 27]; // 11
    const castFloats = [9, 10, 11, 12, 18, 19, 20, 21]; // 8
    const castStrings = [2, 4, 13, 22, 25, 26, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38]; // 17
    const possibleNull = [3, 5, 39]; // 3

    function castCellTypes(column: number, value: string | number | null) {
        if (castInts.includes(column)) {
            if (typeof value === 'number' && Number.isInteger(value)) return value;
            throw new Error('Value in column ' + column + ' was expected to be an integer, but instead was: ' + value);
        } else if (castFloats.includes(column)) {
            if (typeof value === 'number') return value;
            throw new Error('Value in column ' + column + ' was expected to be a number, but instead was: ' + value);
        } else if (castStrings.includes(column)) {
            return value || value === 0 ? value.toString() : '';
        } else if (possibleNull.includes(column)) {
            if (typeof value === 'number') return value;
            if (!value) return null;
            return parseInt(value);
        } else {
            return value;
        }
    }

    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(path.join(__dirname, '../uploads/hitter_ratings.xlsx'));

        const xlsxData: Record<string, string | number | null>[] = [];
        const headingRow: string[] = [];

        const worksheet = workbook.getWorksheet('hitter_ratings');

        if (!worksheet) return null;

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                row.eachCell(cell => {
                    if (typeof (cell.value) !== 'string') {
                        throw new Error('Header row cell was expected to be a string, but was instead: ' + cell.value);
                    }
                    headingRow.push(cell.value);
                });
            } else {
                const rowObject: Record<string, string | number | null> = {};
                row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    if (typeof (cell.value) !== 'string' || typeof (cell.value) !== 'number' || cell.value === null || cell.value === undefined) {
                        rowObject[headingRow[colNumber - 1]] = null;
                    } else {
                        rowObject[headingRow[colNumber - 1]] = castCellTypes(colNumber, cell.value);
                    }
                });
                xlsxData.push(rowObject);
            }
        });

        await fs.promises.unlink(path.join(__dirname, '../uploads/hitter_ratings.xlsx'));

        return xlsxData;
    } catch (error) {
        console.log(error);
        return null;
    }
}
