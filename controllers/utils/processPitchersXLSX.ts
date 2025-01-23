import ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import castCellTypes from './castCellTypes';
import { assignCellValue } from './assignCellValue';
import type { RealTeam, RmlTeam, CardedPlayer, PitcherArrForDBImport } from '../../types';
import createCardedPlayerLookupTable from './createCardedPlayerLookupTable';
import getRmlTeam from './getRMLTeam';

type XlsxData = {
    Year: number,
    TM: string,
    Location: string | null,
    PITCHERS: string,
    IP: number, // 5
    SO_v_l: number,
    BB_v_l: number,
    HIT_v_l: number,
    OB_v_l: number,
    TB_v_l: number, // 10
    HR_v_l: number,
    BP_v_l: string,
    DP_v_l: number,
    SO_v_r: number,
    BB_v_r: number, // 15
    HIT_v_r: number,
    OB_v_r: number,
    TB_v_r: number,
    HR_v_r: number,
    BP_v_r: string, // 20
    DP_v_r: number,
    HO: number,
    ENDURANCE: string,
    FIELD: string,
    BK: number, // 25
    WP: number,
    BAT_B: string,
    STL: string,
    SPD: number,
    rml_team_id: number | null, // 30
}

type HeadingKey = keyof XlsxData;

function convertNameToNameAndThrows(name: string) {
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
}

function convertBpToBpAndBpSi(bp: string) {
    return {
        bp: isNaN(parseInt(bp.charAt(0)))
            ? 0
            : parseInt(bp.charAt(0)),
        bpsi: bp.slice(-1) === '*'
            ? 0
            : 2,
    };
}

export function processPitchersInsertData(xlsxData: XlsxData[], realTeams: RealTeam[], rmlTeams: RmlTeam, cardedPlayers: CardedPlayer[]) {
    const cardedLookupTable = createCardedPlayerLookupTable(cardedPlayers, 'ip');

    return xlsxData.map(row => {
        const { pitcherName, throws } = convertNameToNameAndThrows(row.PITCHERS);

        const { bp: bpVsL, bpsi: bpSiVsL } = convertBpToBpAndBpSi(`${row.BP_v_l}`);
        const { bp: bpVsR, bpsi: bpSiVsR } = convertBpToBpAndBpSi(`${row.BP_v_r}`);

        const foundTeam = realTeams.find(team => team.strat_abbrev === row.TM);
        if (!foundTeam) throw new RangeError(`No match found for the strat abbreviation (${row.TM}) in the csv file!`);
        const { real_team_abbrev: realTeam, id: realTeamId } = foundTeam;

        // get the rml_team_id using the new Map
        const rmlTeam = getRmlTeam(cardedLookupTable, row.Year, pitcherName, row.IP);
        const rmlTeamId = rmlTeam ? rmlTeams[rmlTeam] : null;

        return [
            row.Year, // year
            realTeam,
            realTeamId,
            pitcherName,
            throws,
            row.IP, // ip
            row.SO_v_l, // soVsL
            row.BB_v_l, // bbVsL
            row.HIT_v_l, // hitVsL
            row.OB_v_l, // obVsL
            row.TB_v_l, // tbVsL
            row.HR_v_l, // hrVsL
            bpVsL,
            bpSiVsL,
            row.DP_v_l, // dpVsL
            row.SO_v_r, // soVsR
            row.BB_v_r, // bbVsR
            row.HIT_v_r, // hitVsR
            row.OB_v_r, // obVsR
            row.TB_v_r, // tbVsR
            row.HR_v_r, // hrVsR
            bpVsR,
            bpSiVsR,
            row.DP_v_r, // dpVsR
            row.HO, // hold
            row.ENDURANCE, // endurance
            row.FIELD.replace('\'', '').replace('-', 'e').replace(' ', ''), // field
            row.BK, // balk
            row.WP, // wp
            row.BAT_B, // battinstlg
            row.STL, // stl
            row.SPD, // spd
            // row.rml_team_id || rmlTeams[cardedPlayers[cardedPlayers.findIndex((item) => (item.abbrev_name.toLowerCase() === pitcherName.toLowerCase() && item.year === row.Year && item.ip === row.IP))]?.rml_team] || null, // rmlTeamId
            row.rml_team_id || rmlTeamId, // rml_team_id
        ];
    }) as PitcherArrForDBImport[];
}

export async function processPitchersXLSX() {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(path.join(__dirname, '../uploads/pitcher_ratings.xlsx'));

        const xlsxData: XlsxData[] = [];
        const headingRow: HeadingKey[] = [];

        const worksheet = workbook.getWorksheet('pitcher_ratings');
        if (!worksheet) return null;

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                row.eachCell(cell => {
                    if (typeof (cell.value) !== 'string') throw new TypeError(`Header row cell was expected to be a "string", but was instead: "${cell.value}"... a "${typeof (cell.value)}" type.`);
                    headingRow.push(cell.value as HeadingKey);
                });
            } else {
                const castingTypes = {
                    // 30 possible columns (1 through 30)
                    castInts: [1, 5, 6, 7, 13, 14, 15, 21, 22, 25, 26, 29], // 12
                    castFloats: [8, 9, 10, 11, 16, 17, 18, 19], // 8
                    castStrings: [2, 4, 12, 20, 23, 27, 28, 30], // 8
                    possibleNull: [3, 30], // 2
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

        await fs.promises.unlink(path.join(__dirname, '../uploads/pitcher_ratings.xlsx'));

        return xlsxData;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.name + ': ' + error.message);
        } else {
            console.error('An unknown error occurred:', error);
        }
    }
}
