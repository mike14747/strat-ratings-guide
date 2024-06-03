import ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import castCellTypes from './castCellTypes';

type XlsxData = {
    [key: string]: string | number | null,
    year: number,
    full_name: string,
    rml_team: string,
    ip: number | null,
    ab: number | null,

}

function roundInnings(ip: number) {
    if (!ip) return null;
    if (ip.toString().endsWith('.2')) {
        return Math.ceil(ip);
    } else {
        return Math.floor(ip);
    }
}

function abbreviateName(fullName: string) {
    const nameParts = fullName.split(', ');
    return nameParts[0] + ',' + nameParts[1][0];
}

export async function processCardedPlayersXLSX() {
    try {
        const workbook = new ExcelJS.Workbook();
        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        await sleep(1000);
        const fileExits = fs.existsSync(path.join(__dirname, '../uploads/carded_players.xlsx'));
        if (!fileExits) {
            console.log('File does not exist');
            return [];
        }
        await workbook.xlsx.readFile(path.join(__dirname, '../uploads/carded_players.xlsx'));

        const xlsxData: XlsxData[] = [];
        const headingRow: string[] = [];

        const worksheet = workbook.getWorksheet('carded_players');
        if (!worksheet) return null;

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                row.eachCell(cell => {
                    if (typeof (cell.value) !== 'string') {
                        throw new TypeError(`Header row cell was expected to be a "string", but was instead: "${cell.value}"... a "${typeof (cell.value)}" type.`);
                    }
                    headingRow.push(cell.value);
                });
            } else {
                const castingTypes = {
                    // 5 possible columns (1 through 5, but only 3 might need to be cast... 2 by the castCellTypes function and 1 by the roundInnings function)
                    castInts: [1], // 1
                    castFloats: [], // 0
                    castStrings: [], // 0
                    possibleNull: [5], // 1
                };

                const rowObject = {} as XlsxData;
                row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    if (typeof (cell.value) !== 'string' || typeof (cell.value) !== 'number' || cell.value !== null || cell.value !== undefined) {
                        throw new TypeError(`Cell in row/column: "${rowNumber}/${colNumber}" was expected to be a "string | number | null | undefined", but was instead: ${cell.value}... a "${typeof (cell.value)}" type.`);
                    } else {
                        if (colNumber === 2) rowObject.abbrev_name = abbreviateName(cell.value);
                        if (colNumber === 4) {
                            rowObject[headingRow[colNumber - 1]] = roundInnings(cell.value);
                        } else {
                            rowObject[headingRow[colNumber - 1]] = castCellTypes(rowNumber, colNumber, cell.value, castingTypes);
                        }
                    }
                });
                xlsxData.push(rowObject);
            }
        });

        await fs.promises.unlink(path.join(__dirname, '../uploads/carded_players.xlsx'));

        return xlsxData;
    } catch (error) {
        console.log(error);
        return null;
    }
}
