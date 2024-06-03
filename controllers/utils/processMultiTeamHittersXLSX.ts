import ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import type { RealTeam } from '../../types';

type XlsxData = {
    [key: string]: string | number,
    Year: number,
    Name: string,
    Bats: string,
    Tm: string,
    AB: number,
}

export function processMultiTeamHittersInsertData(xlsxData: XlsxData[], realTeams: RealTeam[]) {
    return xlsxData.map(row => {
        const foundTeam = realTeams.find(team => team.bbref_abbrev === row.Tm);
        if (!foundTeam) throw new RangeError(`No match found for the bbref abbreviation (${row.Tm}) in the .xlsx file!`);
        const { id: realTeamId } = foundTeam;

        const hitterObj = {
            year: row.Year,
            realTeamId,
            hitter: row.Name,
            bats: row.Bats,
            ab: row.AB,
        };

        return Object.values(hitterObj);
    });
}

export async function processMultiTeamHittersXLSX() {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(path.join(__dirname, '../uploads/multi_team_hitters.xlsx'));

        const xlsxData: XlsxData[] = [];
        const headingRow: string[] = [];

        const worksheet = workbook.getWorksheet('multi_team_hitters');
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
                const rowObject = {} as XlsxData;
                row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    if (typeof (cell.value) !== 'string' || typeof (cell.value) !== 'number') {
                        throw new TypeError(`Cell in row/column: "${rowNumber}/${colNumber}" was expected to be a "string | number", but was instead: ${cell.value}... a "${typeof (cell.value)}" type.`);
                    } else {
                        rowObject[headingRow[colNumber - 1]] = cell.value;
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
