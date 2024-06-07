import ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { assignCellValue } from './assignCellValue';
import castCellTypes from './castCellTypes';
import type { CardedPlayer } from '../../types';

type HeadingKey = keyof CardedPlayer;

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
        if (!fileExits) throw new Error('Uploaded file cannot be found on the server.');
        await workbook.xlsx.readFile(path.join(__dirname, '../uploads/carded_players.xlsx'));

        const xlsxData: CardedPlayer[] = [];
        const headingRow: HeadingKey[] = [];

        const worksheet = workbook.getWorksheet('carded_players');
        if (!worksheet) return null;

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                row.eachCell(cell => {
                    if (typeof (cell.value) !== 'string') throw new TypeError(`Header row cell was expected to be a "string", but was instead: "${cell.value}"... a "${typeof (cell.value)}" type.`);
                    headingRow.push(cell.value as HeadingKey);
                });
            } else {
                const castingTypes = {
                    // 5 possible columns (1 through 5, but only 3 might need to be cast... 2 by the castCellTypes function and 1 by the roundInnings function)
                    castInts: [1], // 1
                    castFloats: [], // 0
                    castStrings: [], // 0
                    possibleNull: [5], // 1
                };

                const rowObject = {} as CardedPlayer;
                row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    if (typeof (cell.value) !== 'string' && typeof (cell.value) !== 'number') {
                        throw new TypeError(`Cell in row/column: "${rowNumber}/${colNumber}" was expected to be a "string | number", but was instead: ${cell.value}... a "${typeof (cell.value)}" type.`);
                    } else {
                        if (colNumber === 2) {
                            if (typeof (cell.value) !== 'string') throw new TypeError(`Cell in row/column: "${rowNumber}/${colNumber}" was expected to be a "non-empty string", but was instead: "${cell.value}" was a "${typeof (cell.value)}" type.`);
                            const key = 'abbrev_name' as keyof CardedPlayer;
                            assignCellValue(rowObject, key, castCellTypes(rowNumber, colNumber, abbreviateName(cell.value), castingTypes));
                        }
                        if (colNumber === 4) {
                            const key = headingRow[colNumber - 1] as keyof CardedPlayer;
                            let cellValue: number | null = null;
                            if (typeof (cell.value) === 'string') cellValue = roundInnings(parseFloat(cell.value));
                            if (typeof (cell.value) === 'number') cellValue = roundInnings(cell.value);
                            assignCellValue(rowObject, key, castCellTypes(rowNumber, colNumber, cellValue, castingTypes));
                        } else {
                            const key = headingRow[colNumber - 1] as keyof CardedPlayer;
                            assignCellValue(rowObject, key, castCellTypes(rowNumber, colNumber, cell.value, castingTypes));
                        }
                    }
                });
                xlsxData.push(rowObject);
            }
        });

        await fs.promises.unlink(path.join(__dirname, '../uploads/carded_players.xlsx'));

        return xlsxData;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.name + ': ' + error.message);
        } else {
            console.error('An unknown error occurred:', error);
        }
    }
}
