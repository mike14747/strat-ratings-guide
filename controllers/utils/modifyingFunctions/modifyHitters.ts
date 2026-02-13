import ExcelJS from 'exceljs';
import type { CellValue } from 'exceljs';
import path from 'path';

async function verifyHeadingsAndThrow() {
    const filePath = path.join(process.cwd(), 'controllers', 'utils', 'modifyingFunctions', 'Hitters.xlsx');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const sheet = workbook.worksheets[0]; // original sheet
    const headerRow = sheet.getRow(1);

    // ExcelJS values start at 1, trim spaces
    const values = headerRow.values;

    // Ensure we have an array
    const headers: string[] = Array.isArray(values)
        ? values.slice(1).map(v => (typeof v === 'string' ? v.trim() : ''))
        : [];

    const expectedHeaders = [
        'TM', 'Location', 'HITTERS', 'AB', 'W', 'SO v lhp', 'BBv lhp', 'HIT v lhp', 'OB v lhp',
        'TB v lhp', 'HR v lhp', 'BP v lhp', 'CL v lhp', 'DP v lhp',
        'SO v rhp', 'BB v rhp', 'HIT v rhp', 'OB v rhp', 'TB v rhp', 'HR v rhp', 'BP v rhp',
        'CL v rhp', 'DP v rhp', 'STEALING', 'STL', 'SPD', 'B', 'H', 'INJ',
        'CA', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'FIELDING',
    ];

    const mismatch = headers.some((h, i) => h !== expectedHeaders[i]);
    if (mismatch || headers.length !== expectedHeaders.length) {
        console.error('Found headers:', headers);
        console.error('Expected headers:', expectedHeaders);
        throw new Error('Header row does not match expected headings!');
    }

    console.log('Headers verified successfully.');
}

export async function modifyHitters(): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path.join(__dirname, 'Hitters.xlsx'));

    const originalSheet = workbook.worksheets[0];
    if (!originalSheet) throw new Error('No worksheet found');

    // use the above function to verify that the headers are what I'm expecting them to be
    await verifyHeadingsAndThrow();

    // change the name of the original sheet of this file to 'Original Hitters'
    originalSheet.name = 'Original Hitters';

    // create a 'Carded Hitters' sheet and copy the original sheet data to it
    const cardedSheet = workbook.addWorksheet('Carded Hitters');

    originalSheet.eachRow({ includeEmpty: true }, (row, rowNum) => {
        const newRow = cardedSheet.getRow(rowNum);
        row.eachCell({ includeEmpty: true }, (cell, colNum) => {
            newRow.getCell(colNum).value = cell.value;
        });
        newRow.commit();
    });

    // switch to 'Carded Hitters' as the working sheet
    const ws = cardedSheet;

    // insert a 'Year' column and set each cell in that column to the current year minus one
    const year = new Date().getFullYear() - 1;
    ws.spliceColumns(1, 0, []);
    ws.getCell('A1').value = 'Year';

    ws.eachRow((row, rowNum) => {
        if (rowNum > 1) row.getCell(1).value = year;
    });

    const headerRow = ws.getRow(1);
    const rawValues = headerRow.values;
    const headers: string[] = Array.isArray(rawValues)
        ? rawValues.slice(1).map((v: CellValue): string =>
            typeof v === 'string' ? v : '',
        )
        : [];

    console.log({ headers });

    const getCol = (name: string): number => {
        const idx = headers.indexOf(name);
        if (idx === -1) throw new Error(`Missing column: ${name}`);
        return idx + 1;
    };

    // remove leading '+' from 'CL v lhp' and 'CL v rhp' columns
    ws.eachRow((row, rowNum) => {
        if (rowNum === 1) return;
        const clLhpCol = getCol('CL v lhp');
        const clRhpCol = getCol('CL v rhp');
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
        const locationCol = getCol('Location');
        const location =
            typeof row.getCell(locationCol).value === 'string'
                ? row.getCell(locationCol).value
                : '';

        const abCol = getCol('AB');
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
    const wIdx = getCol('W');
    ws.spliceColumns(wIdx, 1);

    const injIdx = getCol('INJ');
    // copy 'INJ' values including header
    const injValues = [];
    for (let r = 1; r <= ws.rowCount; r++) {
        injValues.push(ws.getRow(r).getCell(injIdx).value ?? '');
    }

    // remove original 'INJ' column
    ws.spliceColumns(injIdx, 1);

    // insert 'INJ' after 'HITTERS'
    const hittersIdx = getCol('HITTERS');
    ws.spliceColumns(hittersIdx + 1, 0, injValues);

    // alignment
    const leftAlign = new Set(['HITTERS', 'STEALING', 'FIELDING']);

    ws.columns.forEach(col => {
        if (!col.header) return;

        col.alignment = {
            vertical: 'middle',
            horizontal: leftAlign.has(String(col.header)) ? 'left' : 'center',
        };
    });

    // final headers
    const finalHeaderRow = ws.getRow(1);
    const finalRawValues = finalHeaderRow.values;
    const finalHeaders: string[] = Array.isArray(finalRawValues)
        ? finalRawValues.slice(1).map((v: CellValue): string =>
            typeof v === 'string' ? v : '',
        )
        : [];

    const finalExpectedHeaders = [
        'Year', 'TM', 'Location', 'HITTERS', 'INJ', 'AB',
        'SO_v_lhp', 'BB_v_lhp', 'HIT_v_lhp', 'OB_v_lhp', 'TB_v_lhp',
        'HR_v_lhp', 'BP_v_lhp', 'CL_v_lhp', 'DP_v_lhp',
        'SO_v_rhp', 'BB_v_rhp', 'HIT_v_rhp', 'OB_v_rhp', 'TB_v_rhp',
        'HR_v_rhp', 'BP_v_rhp', 'CL_v_rhp', 'DP_v_rhp',
        'STEALING', 'STL', 'SPD', 'B', 'H',
        'd_CA', 'd_1B', 'd_2B', 'd_3B', 'd_SS',
        'd_LF', 'd_CF', 'd_RF', 'FIELDING', 'rml_team_id',
    ];

    const mismatch = finalHeaders.some((h, i) => h !== finalExpectedHeaders[i]);
    if (mismatch || finalHeaders.length !== finalExpectedHeaders.length) {
        console.error('Found final headers:', finalHeaders);
        console.error('Expected final headers:', finalExpectedHeaders);
        throw new Error('Header row does not match expected final headers!');
    }

    console.log('Final headers verified successfully.');

    ws.eachRow({ includeEmpty: true }, row => {
        for (let col = 1; col <= ws.columnCount; col++) {
            const cell = row.getCell(col);

            // Ensure Excel recognizes the cell
            if (cell.value == null) cell.value = '';

            // Font
            cell.font = { name: 'Calibri', size: 12 };

            // Alignment
            const leftAlign = new Set(['HITTERS', 'STEALING', 'FIELDING']);
            cell.alignment = { vertical: 'middle', horizontal: leftAlign.has(String(ws.getRow(1).getCell(col).value)) ? 'left' : 'center' };

            // Border
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        }
    });

    // style the header row (background color to a light gray)
    headerRow.eachCell(cell => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD9D9D9' },
        };
        cell.alignment = { vertical: 'bottom', horizontal: 'center' };
    });

    ws.views = [{ state: 'frozen', ySplit: 1 }];

    // write changes to the same file
    await workbook.xlsx.writeFile(path.join(__dirname, 'Hitters.xlsx'));
    console.log('Hitters.xlsx updated successfully!');
}
