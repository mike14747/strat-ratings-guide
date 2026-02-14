import ExcelJS from 'exceljs';
import type { Worksheet, CellValue } from 'exceljs';
import path from 'path';

function getHeadings(ws: ExcelJS.Worksheet): string[] {
    const values = ws.getRow(1).values;
    if (!Array.isArray(values)) return [];

    return values
        .slice(1)
        .map(v => (typeof v === 'string' ? v.trim() : ''));
}

function getColumnIndex(ws: ExcelJS.Worksheet, name: string): number {
    const headers = getHeadings(ws);
    const idx = headers.indexOf(name);

    if (idx === -1) throw new Error(`Column not found: ${name}`);

    return idx + 1;
}

function checkHeadingsMatchExpected(a: string[], b: string[]) {
    a.forEach((value, i) => {
        if (value !== b[i]) console.log(value, 'should match:', b[i]);
    });
    return a.length === b.length && a.every((v, i) => v === b[i]);
}

function moveColumnToAfterColumn(
    ws: Worksheet,
    columnName: string,
    afterColumnName: string,
): void {
    const headerRow = ws.getRow(1);

    if (!Array.isArray(headerRow.values)) throw new Error('There was an error reading header row.');

    const headers = headerRow.values
        .slice(1)
        .map(v => String(v).trim());

    const fromIdx = headers.indexOf(columnName);
    const afterIdx = headers.indexOf(afterColumnName);

    if (fromIdx === -1) throw new Error(`Column not found: ${columnName}`);
    if (afterIdx === -1) throw new Error(`Target column not found: ${afterColumnName}`);

    // clone values, but not the header cell (avoids readonly errors)
    const values: CellValue[] = ws.getColumn(fromIdx + 1).values.slice(2);

    // remove original column
    ws.spliceColumns(fromIdx + 1, 1);

    // if the column was before the target, the target shifted left
    const insertIdx = fromIdx < afterIdx ? afterIdx : afterIdx + 1;

    // insert column in new position
    ws.spliceColumns(insertIdx + 1, 0, [null, ...values]);

    // ensure header is explicitly defined
    ws.getRow(1).getCell(insertIdx + 1).value = columnName;
}

function rebuildWorksheet(ws: Worksheet): Worksheet {
    const wb = ws.workbook!;
    const newSheet = wb.addWorksheet('_temp');

    const headerRow = ws.getRow(1);
    if (!Array.isArray(headerRow.values)) throw new Error('Header row is not an array');

    // determine the last header column
    const headers = headerRow.values.slice(1).map(v => String(v ?? '').trim());
    const lastCol = headers.length;

    // add header row
    newSheet.addRow(headers);

    // copy data rows, skipping empty rows
    for (let r = 2; r <= ws.rowCount; r++) {
        const row = ws.getRow(r);
        // extract only the values for the columns that exist
        const rowValues = [];
        let hasData = false;
        for (let c = 1; c <= lastCol; c++) {
            const val = row.getCell(c).value ?? null;
            rowValues.push(val);
            if (val !== null && val !== undefined && val !== '') hasData = true;
        }
        // only add rows that have at least one non-empty cell
        if (hasData) newSheet.addRow(rowValues);
    }

    // remove the old worksheet
    wb.removeWorksheet(ws.id);

    // rename the new worksheet to the desired name
    newSheet.name = ws.name;

    return newSheet;
}

export async function modifyHitters(): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path.join(__dirname, '/filesToModify/Hitters.xlsx'));
    const originalSheet = workbook.worksheets[0];
    if (!originalSheet) throw new Error('No worksheet found');

    const originalExpectedHeadings = [
        'TM', 'Location', 'HITTERS', 'AB', 'W', 'SO v lhp', 'BB v lhp', 'HIT v lhp', 'OB v lhp',
        'TB v lhp', 'HR v lhp', 'BP v lhp', 'CL v lhp', 'DP v lhp',
        'SO v rhp', 'BB v rhp', 'HIT v rhp', 'OB v rhp', 'TB v rhp', 'HR v rhp', 'BP v rhp',
        'CL v rhp', 'DP v rhp', 'STEALING', 'STL', 'SPD', 'B', 'H', 'INJ',
        'CA', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'FIELDING',
    ];

    // make sure the headings in the file match what are expected
    const initialHeaderRow = getHeadings(originalSheet);
    if (!checkHeadingsMatchExpected(originalExpectedHeadings, initialHeaderRow)) throw new Error('Initial header row does not match expected headings!');
    console.log('Initial headings verified successfully.');

    // change the name of the original sheet of this file to 'Original Hitters'
    originalSheet.name = 'Original Hitters';

    // create a duplicate'temp' sheet, then copy the original sheet data to it
    const duplicateSheet = workbook.addWorksheet('temp');
    originalSheet.eachRow({ includeEmpty: true }, (row, rowNum) => {
        const newRow = duplicateSheet.getRow(rowNum);
        row.eachCell({ includeEmpty: true }, (cell, colNum) => {
            newRow.getCell(colNum).value = cell.value;
        });
        newRow.commit();
    });

    // switch to the duplicate sheet as the working sheet
    const ws = duplicateSheet;

    // insert a 'Year' column and set each cell in that column to the current year minus one
    const year = new Date().getFullYear() - 1;
    ws.spliceColumns(1, 0, []);
    ws.getCell('A1').value = 'Year';

    ws.eachRow((row, rowNum) => {
        if (rowNum > 1) row.getCell(1).value = year;
    });

    // remove leading '+' from 'CL v lhp' and 'CL v rhp' columns (if any are present)
    ws.eachRow((row, rowNum) => {
        if (rowNum === 1) return;
        const clLhpCol = getColumnIndex(ws, 'CL v lhp');
        const clRhpCol = getColumnIndex(ws, 'CL v rhp');
        [clLhpCol, clRhpCol].forEach(col => {
            const cell = row.getCell(col);
            if (typeof cell.value === 'string') {
                cell.value = cell.value.replace(/\+/g, '');
            }
        });
    });

    // remove rows where 'Location' equals 'M' or 'X' and where 'AB' are less than 100
    for (let i = ws.rowCount; i > 1; i--) {
        const row = ws.getRow(i);
        const locationCol = getColumnIndex(ws, 'Location');
        const location =
            typeof row.getCell(locationCol).value === 'string'
                ? row.getCell(locationCol).value
                : '';

        const abCol = getColumnIndex(ws, 'AB');
        const abCellValue = row.getCell(abCol).value;

        const ab: number =
            typeof abCellValue === 'number'
                ? abCellValue
                : Number(abCellValue ?? 0);

        if (location === 'M' || location === 'X' || ab < 100) {
            ws.spliceRows(i, 1);
        }
    }

    // add 'rml_team_id' to the far right
    ws.spliceColumns(ws.columnCount + 1, 0, []);
    ws.getRow(1).getCell(ws.columnCount).value = 'rml_team_id';

    // delete the 'W' column
    const wIdx = getColumnIndex(ws, 'W');
    ws.spliceColumns(wIdx, 1);

    // move the 'INJ' column to right after the 'HITTERS' column
    moveColumnToAfterColumn(ws, 'INJ', 'HITTERS');

    // rebuild sheet to remove all empty columns and rows
    const rebuiltSheet = rebuildWorksheet(duplicateSheet);
    rebuiltSheet.name = 'Carded Hitters';

    // final headers
    const finalHeadings = getHeadings(ws);
    // console.log({ finalHeadings });

    const finalExpectedHeadings = [
        'Year', 'TM', 'Location', 'HITTERS', 'INJ', 'AB',
        'SO v lhp', 'BB v lhp', 'HIT v lhp', 'OB v lhp', 'TB v lhp',
        'HR v lhp', 'BP v lhp', 'CL v lhp', 'DP v lhp',
        'SO v rhp', 'BB v rhp', 'HIT v rhp', 'OB v rhp', 'TB v rhp',
        'HR v rhp', 'BP v rhp', 'CL v rhp', 'DP v rhp',
        'STEALING', 'STL', 'SPD', 'B', 'H',
        'CA', '1B', '2B', '3B', 'SS',
        'LF', 'CF', 'RF', 'FIELDING', 'rml_team_id',
    ];

    if (!checkHeadingsMatchExpected(finalExpectedHeadings, finalHeadings)) throw new Error('Final header row does not match expected headings!');
    console.log('Final headings verified successfully.');

    // switch to the rebuilt 'Carded Hitters' sheet
    const cardedSheet = workbook.getWorksheet('Carded Hitters');
    if (!cardedSheet) throw new Error('Carded Hitters sheet not found!');

    // style cells with data
    cardedSheet.eachRow({ includeEmpty: true }, row => {
        for (let col = 1; col <= cardedSheet.columnCount; col++) {
            const cell = row.getCell(col);

            // ensure Excel recognizes the cell
            if (cell.value == null) cell.value = '';

            // font
            cell.font = { name: 'Calibri', size: 12 };

            // row height
            row.height = 18;

            // alignment
            const leftAlign = new Set(['HITTERS', 'STEALING', 'FIELDING']);
            cell.alignment = { vertical: 'bottom', horizontal: leftAlign.has(String(cardedSheet.getRow(1).getCell(col).value)) ? 'left' : 'center' };

            // border
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        }
    });

    // style the header row (background color to a light gray)
    const headerRow = cardedSheet.getRow(1);
    headerRow.eachCell(cell => {
        if (cell.value == null) cell.value = '';
        cell.font = { name: 'Calibri', size: 12, bold: true };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD9D9D9' },
        };
        cell.alignment = { vertical: 'bottom', horizontal: 'center' };
    });

    cardedSheet.views = [{ state: 'frozen', ySplit: 1 }];

    // alignment
    const leftAlign = new Set(['HITTERS', 'STEALING', 'FIELDING']);

    cardedSheet.columns.forEach(col => {
        if (!col.header) return;

        col.alignment = {
            vertical: 'bottom',
            horizontal: leftAlign.has(String(col.header)) ? 'left' : 'center',
        };
    });

    // write changes to the same file
    await workbook.xlsx.writeFile(path.join(__dirname, '/filesToModify/Hitters.xlsx'));
    console.log('Hitters.xlsx updated successfully!');
}
