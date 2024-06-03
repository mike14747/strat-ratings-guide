import ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import type { RealTeam } from '../../types';

export function processMultiTeamPitchersInsertData(xlsxData, realTeams) {
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

        const xlsxData = [];
        const headingRow = [];

        const worksheet = workbook.getWorksheet('multi_team_pitchers');

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

        await fs.promises.unlink(path.join(__dirname, '../uploads/multi_team_pitchers.xlsx'));

        return xlsxData;
    } catch (error) {
        console.log(error);
        return null;
    }
}
