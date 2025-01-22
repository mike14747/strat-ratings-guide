import ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import castCellTypes from './castCellTypes';
import { assignCellValue } from './assignCellValue';
import type { RealTeam, RmlTeam, CardedPlayer, HitterArrForDBImport } from '../../types';

type XlsxData = {
    Year: number,
    TM: string,
    Location: string | null,
    HITTERS: string,
    INJ: number | null, // 5
    AB: number,
    SO_v_lhp: number,
    BB_v_lhp: number,
    HIT_v_lhp: number,
    OB_v_lhp: number, // 10
    TB_v_lhp: number,
    HR_v_lhp: number,
    BP_v_lhp: string,
    CL_v_lhp: number,
    DP_v_lhp: number, // 15
    SO_v_rhp: number,
    BB_v_rhp: number,
    HIT_v_rhp: number,
    OB_v_rhp: number,
    TB_v_rhp: number, // 20
    HR_v_rhp: number,
    BP_v_rhp: string,
    CL_v_rhp: number,
    DP_v_rhp: number,
    STEALING: string, // 25
    STL: string,
    SPD: number,
    B: string,
    H: string,
    d_CA: string, // 30
    d_1B: string,
    d_2B: string,
    d_3B: string,
    d_SS: string,
    d_LF: string, // 35
    d_CF: string,
    d_RF: string,
    FIELDING: string,
    rml_team_id: number | null,
}

type HeadingKey = keyof XlsxData;

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
            : parseInt(bp.charAt(0)),
        w: bp.charAt(0) === 'w'
            ? 'w'
            : '',
        bpsi: bp.slice(-1) === '*'
            ? 0
            : 2,
    };
}

export function processHittersInsertData(xlsxData: XlsxData[], realTeams: RealTeam[], rmlTeams: RmlTeam, cardedPlayers: CardedPlayer[]) {
    // create a lookup table for cardedPlayers
    const cardedLookupTable = new Map<string, string>();
    cardedPlayers.forEach(player => {
        const key = `${player.year}-${player.abbrev_name.toLowerCase()}-${player.ab ?? 'data_missing'}`;
        cardedLookupTable.set(key, player.rml_team);
    });

    // function to find rml_team using the lookup table
    const getRmlTeam = (lookup: Map<string, string>, year: number, hitterName: string, AB: number): string | null => {
        const key = `${year}-${hitterName.toLowerCase()}-${AB}`;
        return lookup.get(key) || null;
    };

    return xlsxData.map(row => {
        const { hitterName, bats } = convertNameToNameAndBats(row.HITTERS);
        const { bp: bpVsL, w: wVsL, bpsi: bpSiVsL } = convertBpToBpWAndBpSi(row.BP_v_lhp);
        const { bp: bpVsR, w: wVsR, bpsi: bpSiVsR } = convertBpToBpWAndBpSi(row.BP_v_rhp);

        const foundTeam = realTeams.find(team => team.strat_abbrev === row.TM);
        if (!foundTeam) throw new RangeError(`No match found for the strat abbreviation (${row.TM}) in the .xlsx file!`);
        const { real_team_abbrev: realTeam, id: realTeamId } = foundTeam;

        // get the rml_team_id using the new Map
        const rmlTeam = getRmlTeam(cardedLookupTable, row.Year, hitterName, row.AB);
        const rmlTeamId = rmlTeam ? rmlTeams[rmlTeam] : null;

        return [
            row.Year, // year
            realTeam,
            realTeamId,
            hitterName,
            bats,
            row.INJ || row.INJ === 0 ? row.INJ : null, // inj
            row.AB, // ab
            row.SO_v_lhp, // soVsL
            Math.round(row.OB_v_lhp - row.HIT_v_lhp), // bbVsL
            row.HIT_v_lhp, // hitVsL
            row.OB_v_lhp, // obVsL
            row.TB_v_lhp, // tbVsL
            row.HR_v_lhp, // hrVsL
            bpVsL,
            wVsL,
            bpSiVsL,
            row.CL_v_lhp, // clVsL
            row.DP_v_lhp, // dpVsL
            row.SO_v_rhp, // soVsR
            Math.round(row.OB_v_rhp - row.HIT_v_rhp), // bbVsR
            row.HIT_v_rhp, // hitVsR
            row.OB_v_rhp, // obVsR
            row.TB_v_rhp, // tbVsR
            row.HR_v_rhp, // hrVsR
            bpVsR,
            wVsR,
            bpSiVsR,
            row.CL_v_rhp, // clVsR
            row.DP_v_rhp, // dpVsR
            row.STEALING, // stealing
            row.STL, // stl
            row.SPD, // spd
            row.B, // bunt
            row.H, // hitRun
            convertPositionlFielding(row.d_CA), // dCA
            convertPositionlFielding(row.d_1B), // d1B
            convertPositionlFielding(row.d_2B), // d2B
            convertPositionlFielding(row.d_3B), // d3B
            convertPositionlFielding(row.d_SS), // dSS
            convertPositionlFielding(row.d_LF), // dLF
            convertPositionlFielding(row.d_CF), // dCF
            convertPositionlFielding(row.d_RF), // dRF
            row.FIELDING, // fielding
            // row.rml_team_id || rmlTeams[cardedPlayers[cardedPlayers.findIndex((item) => (item.abbrev_name.toLowerCase() === hitterName.toLowerCase() && item.year === row.Year && item.ab === row.AB))]?.rml_team] || null, // rml_team_id
            row.rml_team_id || rmlTeamId, // rml_team_id
        ];
    }) as HitterArrForDBImport[];
}

export async function processHittersXLSX() {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(path.join(__dirname, '../uploads/hitter_ratings.xlsx'));

        const xlsxData: XlsxData[] = [];
        const headingRow: HeadingKey[] = [];

        const worksheet = workbook.getWorksheet('hitter_ratings');
        if (!worksheet) throw new Error('The worksheet could not be found or read.');

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                row.eachCell(cell => {
                    if (typeof (cell.value) !== 'string') throw new TypeError(`Header row cell was expected to be a "string", but was instead: "${cell.value}"... a "${typeof (cell.value)}" type.`);
                    headingRow.push(cell.value as HeadingKey);
                });
            } else {
                const castingTypes = {
                    // 39 possible columns (1 through 39)
                    castInts: [1, 6, 7, 8, 14, 15, 16, 17, 23, 24, 27], // 11
                    castFloats: [9, 10, 11, 12, 18, 19, 20, 21], // 8
                    castStrings: [2, 4, 13, 22, 25, 26, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38], // 17
                    possibleNull: [3, 5, 39], // 3
                };

                const rowObject = {} as XlsxData;
                row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    if (typeof (cell.value) !== 'string' && typeof (cell.value) !== 'number' && cell.value !== null) {
                        throw new TypeError(`Data in row/column: "${rowNumber}/${colNumber}" was expected to be a "string | number | null", but was instead: "${cell.value}" was a "${typeof (cell.value)}" type.`);
                    } else {
                        const key = headingRow[colNumber - 1] as keyof XlsxData;
                        assignCellValue(rowObject, key, castCellTypes(rowNumber, colNumber, cell.value, castingTypes));

                        // this is how I was doing it when I had an index signature
                        // rowObject[headingRow[colNumber - 1]] = castCellTypes(rowNumber, colNumber, cell.value, castingTypes);
                    }
                });
                xlsxData.push(rowObject);
            }
        });

        await fs.promises.unlink(path.join(__dirname, '../uploads/hitter_ratings.xlsx'));

        return xlsxData;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.name + ': ' + error.message);
        } else {
            console.error('An unknown error occurred:', error);
        }
    }
}
