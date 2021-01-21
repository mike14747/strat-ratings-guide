const parse = require('csv-parse');
const fs = require('fs');
const path = require('path');

const processMultiTeamPitchersInsertData = (csvData, realTeams) => {
    return csvData.map(row => {
        const { real_team_id: realTeamId } = realTeams.find(team => team.bbref_abbrev === row.Tm);

        const pitcherObj = {
            year: row.Year,
            realTeamId,
            pitcher: row.Name,
            throws: row.Throws,
            ip: row.IP,
        };

        return Object.values(pitcherObj);
    });
};

const processMultiTeamPitchersCSV = async () => {
    const csvData = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '../uploads/multi_team_pitchers.csv'))
            .pipe(
                parse({
                    delimiter: ',',
                    columns: true,
                    // from_line: 1,
                    // to_line: 2,
                    trim: true,
                    cast: true,
                }),
            )
            .on('data', row => csvData.push(row))
            .on('error', error => reject(error))
            .on('end', async function () {
                try {
                    await fs.promises.unlink(path.join(__dirname, '../uploads/multi_team_pitchers.csv'));
                    resolve(csvData);
                } catch (error) {
                    console.log(error);
                    reject(error);
                }
            });
    });
};

module.exports = {
    processMultiTeamPitchersCSV,
    processMultiTeamPitchersInsertData,
};
