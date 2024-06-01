import ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import type { RealTeam } from '../../types';

export function processMultiTeamHittersInsertData(xlsxData, realTeams: RealTeam[]) {
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

        const xlsxData = [];
        const headingRow = [];

        const worksheet = workbook.getWorksheet('multi_team_hitters');

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                row.eachCell(cell => headingRow.push(cell.value));
            } else {
                const rowObject = {};
                row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    rowObject[headingRow[colNumber - 1]] = cell.value;
                });
                xlsxData.push(rowObject);
            }
        });

        await fs.promises.unlink(path.join(__dirname, '../uploads/multi_team_hitters.xlsx'));

        return xlsxData;
    } catch (error) {
        console.log(error);
        return null;
    }
}
