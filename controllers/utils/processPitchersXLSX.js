const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

function convertNameToNameAndThrows(name) {
    return {
        pitcherName: (name.slice(-1) === '*' || name.slice(-1) === '+')
            ? name.slice(0, -1)
            : name,
        throws: name.slice(-1) === '*'
            ? 'L'
            : name.slice(-1) === '+'
                ? 'S'
                : 'R',
    };
}

function convertBpToBpAndBpSi(bp) {
    return {
        bp: isNaN(bp.charAt(0))
            ? 0
            : parseInt(bp.charAt(0)),
        bpsi: bp.slice(-1) === '*'
            ? 0
            : 2,
    };
}

function processPitchersInsertData(csvData, realTeams, rmlTeams, cardedPlayers) {
    return csvData.map(row => {
        const { pitcherName, throws } = convertNameToNameAndThrows(row.PITCHERS);

        const { bp: bpVsL, bpsi: bpSiVsL } = convertBpToBpAndBpSi(`${row.BP_v_l}`);
        const { bp: bpVsR, bpsi: bpSiVsR } = convertBpToBpAndBpSi(`${row.BP_v_r}`);

        const foundTeam = realTeams.find(team => team.strat_abbrev === row.TM);
        if (!foundTeam) throw new RangeError(`No match found for the strat abbreviation (${row.TM}) in the csv file!`);
        const { real_team_abbrev: realTeam, id: realTeamId } = foundTeam;

        const pitcherObj = {
            year: row.Year,
            realTeam,
            realTeamId,
            pitcherName,
            throws,
            ip: row.IP,
            soVsL: row.SO_v_l,
            bbVsL: row.BB_v_l,
            hitVsL: row.HIT_v_l,
            obVsL: row.OB_v_l,
            tbVsL: row.TB_v_l,
            hrVsL: row.HR_v_l,
            bpVsL,
            bpSiVsL,
            dpVsL: row.DP_v_l,
            soVsR: row.SO_v_r,
            bbVsR: row.BB_v_r,
            hitVsR: row.HIT_v_r,
            obVsR: row.OB_v_r,
            tbVsR: row.TB_v_r,
            hrVsR: row.HR_v_r,
            bpVsR,
            bpSiVsR,
            dpVsR: row.DP_v_r,
            hold: row.HO,
            endurance: row.ENDURANCE,
            field: row.FIELD.replace('\'', '').replace('-', 'e').replace(' ', ''),
            balk: row.BK,
            wp: row.WP,
            batting: row.BAT_B,
            stl: row.STL,
            spd: row.SPD,
            rmlTeamId: row.rml_team_id || rmlTeams[cardedPlayers[cardedPlayers.findIndex((item) => (item.abbrev_name.toLowerCase() === pitcherName.toLowerCase() && item.year === row.Year && item.ip === row.IP))]?.rml_team] || null,
        };

        return Object.values(pitcherObj);
    });
}

async function processPitchersXLSX() {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(path.join(__dirname, '../uploads/pitcher_ratings.xlsx'));

        const xlsxData = [];
        const headingRow = [];

        const worksheet = workbook.getWorksheet('pitcher_ratings');

        // 30 possible columns (1 through 30)
        const castInts = [1, 5, 6, 7, 13, 14, 15, 21, 22, 25, 26, 29]; // 12
        const castFloats = [8, 9, 10, 11, 16, 17, 18, 19]; // 8
        const castStrings = [2, 4, 12, 20, 23, 27, 28, 30]; // 8
        const possibleNull = [3, 30]; // 2

        function castCellTypes(column, value) {
            if (castInts.includes(column)) {
                return parseInt(value);
            } else if (castFloats.includes(column)) {
                return parseFloat(value);
            } else if (castStrings.includes(column)) {
                return value || value === 0 ? value.toString() : '';
            } else if (possibleNull.includes(column)) {
                return value ? parseInt(value) : null;
            } else {
                return value;
            }
        }

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
                row.eachCell(cell => headingRow.push(cell.value));
            } else {
                const rowObject = {};
                row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    rowObject[headingRow[colNumber - 1]] = castCellTypes(colNumber, cell.value);
                });
                xlsxData.push(rowObject);
            }
        });

        await fs.promises.unlink(path.join(__dirname, '../uploads/pitcher_ratings.xlsx'));

        return xlsxData;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    processPitchersXLSX,
    processPitchersInsertData,
};
