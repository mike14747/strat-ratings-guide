const parse = require('csv-parse');
const fs = require('fs');
const path = require('path');

const processMultiTeamHittersInsertData = (csvData, realTeams) => {
    return csvData.map(row => {
        const foundTeam = realTeams.find(team => team.bbref_abbrev === row.Tm);
        if (!foundTeam) throw new RangeError(`No match found for the bbref abbreviation (${row.Tm}) in the csv file!`);
        const { real_team_id: realTeamId } = foundTeam;

        const hitterObj = {
            year: row.Year,
            realTeamId,
            hitter: row.Name,
            bats: row.Bats,
            ab: row.AB,
        };

        return Object.values(hitterObj);
    });
};

const processMultiTeamHittersCSV = () => {
    const csvData = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '../uploads/multi_team_hitters.csv'))
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
                    await fs.promises.unlink(path.join(__dirname, '../uploads/multi_team_hitters.csv'));
                    resolve(csvData);
                } catch (error) {
                    console.log(error);
                    reject(error);
                }
            });
    });
};

module.exports = {
    processMultiTeamHittersCSV,
    processMultiTeamHittersInsertData,
};
