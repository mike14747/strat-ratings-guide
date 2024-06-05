import ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { assignCellValue } from './assignCellValue';
import type { RealTeam } from '../../types';

type XlsxData = {
    Year: number,
    Name: string,
    Throws: string,
    Tm: string,
    IP: number,
}

type HeadingKey = keyof XlsxData;

export function processMultiTeamPitchersInsertData(xlsxData: XlsxData[], realTeams: RealTeam[]) {
    return xlsxData.map(row => {
        const foundTeam = realTeams.find(team => team.bbref_abbrev === row.Tm);
        if (!foundTeam) throw new RangeError(`No match found for the bbref abbreviation (${row.Tm}) in the .xlsx file!`);
        const { id: realTeamId } = foundTeam;

        const pitcherObj = {
            year: row.Year,
            realTeamId,
            pitcher: row.Name,
            throws: row.Throws,
            ip: row.IP,
        };

        return Object.values(pitcherObj);
    });
}

export async function processMultiTeamPitchersXLSX() {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(path.join(__dirname, '../uploads/multi_team_pitchers.xlsx'));

        const xlsxData: XlsxData[] = [];
        const headingRow: HeadingKey[] = [];

        const worksheet = workbook.getWorksheet('multi_team_pitchers');
        if (!worksheet) throw new Error('The worksheet could not be found or read.');

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                row.eachCell(cell => {
                    if (typeof (cell.value) !== 'string') throw new TypeError(`Header row cell was expected to be a "string", but was instead: "${cell.value}"... a "${typeof (cell.value)}" type.`);
                    headingRow.push(cell.value as HeadingKey);
                });
            } else {
                const rowObject = {} as XlsxData;
                row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    if (typeof (cell.value) !== 'string' && typeof (cell.value) !== 'number') {
                        throw new TypeError(`Data in row/column: "${rowNumber}/${colNumber}" was expected to be a "string | number", but was instead: "${cell.value}" was a "${typeof (cell.value)}" type.`);
                    } else {
                        const key = headingRow[colNumber - 1] as keyof XlsxData;
                        assignCellValue(rowObject, key, cell.value);

                        // this is how I was doing it when I had an index signature
                        // rowObject[headingRow[colNumber - 1]] = cell.value;
                    }
                });
                xlsxData.push(rowObject);
            }
        });

        await fs.promises.unlink(path.join(__dirname, '../uploads/multi_team_pitchers.xlsx'));

        return xlsxData;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.name + ': ' + error.message);
        } else {
            console.error('An unknown error occurred:', error);
        }
    }
}
