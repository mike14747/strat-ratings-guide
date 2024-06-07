import ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import { assignCellValue } from './assignCellValue';
import type { RealTeam, MultiTeamHitterArrForDBImport } from '../../types';

type XlsxData = {
    Year: number,
    Name: string,
    Bats: string,
    Tm: string,
    AB: number,
}

type HeadingKey = keyof XlsxData;

export function processMultiTeamHittersInsertData(xlsxData: XlsxData[], realTeams: RealTeam[]) {
    return xlsxData.map(row => {
        const foundTeam = realTeams.find(team => team.bbref_abbrev === row.Tm);
        if (!foundTeam) throw new RangeError(`No match found for the bbref abbreviation (${row.Tm}) in the .xlsx file!`);
        const { id: realTeamId } = foundTeam;

        return [
            row.Year, // year
            realTeamId,
            row.Name, // hitter
            row.Bats, // bats
            row.AB, // ab
        ];
    }) as MultiTeamHitterArrForDBImport[];
}

export async function processMultiTeamHittersXLSX() {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(path.join(__dirname, '../uploads/multi_team_hitters.xlsx'));

        const xlsxData: XlsxData[] = [];
        const headingRow: HeadingKey[] = [];

        const worksheet = workbook.getWorksheet('multi_team_hitters');
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
                    }
                });
                xlsxData.push(rowObject);
            }
        });

        await fs.promises.unlink(path.join(__dirname, '../uploads/multi_team_hitters.xlsx'));

        return xlsxData;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.name + ': ' + error.message);
        } else {
            console.error('An unknown error occurred:', error);
        }
    }
}
