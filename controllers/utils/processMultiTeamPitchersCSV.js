const parse = require('csv-parse');
const fs = require('fs');
const path = require('path');
const Pitchers = require('../../models/pitchers');
const RealTeam = require('../../models/realTeam');

const processInsertData = async (csvData) => {
    try {
        const [result] = await RealTeam.getAllRealTeams();
        const realTeams = JSON.parse(JSON.stringify(result));

        const modifiedArray = csvData.map(row => {
            const { real_team_id: realTeamId } = realTeams.find(team => team.bbref_abbrev === row.Tm);

            const pitcherObj = {
                year: parseInt(row.Year),
                realTeamId,
                pitcher: row.Name,
                throws: row.Throws,
                ip: parseFloat(row.IP),
            };

            return Object.values(pitcherObj);
        });

        const [data, error] = await Pitchers.addMultiTeamPitchersData(modifiedArray);
        if (error) console.log(error);
        return (data && data.affectedRows) || 0;
    } catch (error) {
        console.log(error.message);
    }
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
                }),
            )
            .on('data', async row => {
                csvData.push(row);
            })
            .on('error', error => {
                reject(error);
            })
            .on('end', async function () {
                const numInserted = await processInsertData(csvData) || 0;
                try {
                    await fs.promises.unlink(path.join(__dirname, '../uploads/multi_team_pitchers.csv'));
                } catch (error) {
                    console.log(error);
                }
                resolve(numInserted);
            });
    });
};

module.exports = processMultiTeamPitchersCSV;
