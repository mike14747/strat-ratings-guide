const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

async function processCardedPlayersXLSX() {
    try {
        const workbook = new ExcelJS.Workbook();
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await sleep(1000);
        const fileExits = fs.existsSync(path.join(__dirname, '../uploads/carded_players.xlsx'));
        if (!fileExits) {
            console.log('File does not exist');
            return [];
        }
        await workbook.xlsx.readFile(path.join(__dirname, '../uploads/carded_players.xlsx'));

        const xlsxData = [];
        const headingRow = [];

        const worksheet = workbook.getWorksheet('carded_players');

        // 5 possible columns (1 through 5, but only 3 might need to be cast... 2 by the castCellTypes function and 1 by the roundInnings function)
        const castInts = [1]; // 1
        const possibleNull = [5]; // 1

        function castCellTypes(column, value) {
            if (castInts.includes(column)) {
                return parseInt(value);
            } else if (possibleNull.includes(column)) {
                return value || value === 0 ? parseInt(value) : null;
            } else {
                return value;
            }
        }

        function roundInnings(ip) {
            if (!ip) return null;
            if (ip.toString().endsWith('.2')) {
                return Math.ceil(ip);
            } else {
                return Math.floor(ip);
            }
        }

        function abbreviateName(fullName) {
            const nameParts = fullName.split(', ');
            return nameParts[0] + ',' + nameParts[1][0];
        }

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                row.eachCell(cell => headingRow.push(cell.value));
            } else {
                const rowObject = {};
                row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    if (colNumber === 2) rowObject.abbrev_name = abbreviateName(cell.value);
                    if (colNumber === 4) {
                        rowObject[headingRow[colNumber - 1]] = roundInnings(cell.value);
                    } else {
                        rowObject[headingRow[colNumber - 1]] = castCellTypes(colNumber, cell.value);
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

module.exports = {
    processCardedPlayersXLSX,
};
