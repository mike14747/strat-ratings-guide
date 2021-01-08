const parse = require('csv-parse');
const fs = require('fs');
const path = require('path');
const Hitters = require('../../models/hitters');
const RealTeam = require('../../models/realTeam');

const processInsertData = async (csvData) => {
    try {
        const [result] = await RealTeam.getAllRealTeams();
        const realTeams = JSON.parse(JSON.stringify(result));

        const modifiedArray = csvData.map(row => {
            const { real_team_id: realTeamId } = realTeams.find((team) => {
                return team.bbref_abbrev === row.Tm;
            });

            const hitterObj = {
                year: parseInt(row.Year),
                realTeamId,
                hitter: row.Name,
                bats: row.Bats,
                ab: parseInt(row.AB),
            };

            return Object.values(hitterObj);
        });

        const [data, error] = await Hitters.addMultiTeamHittersData(modifiedArray);
        if (error) console.log(error);
        return (data && data.affectedRows) || 0;
    } catch (error) {
        console.log(error.message);
    }
};

const processHittersCSV = async () => {
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
                }),
            )
            .on('data', row => csvData.push(row))
            .on('error', error => reject(error))
            .on('end', async function () {
                try {
                    await fs.promises.unlink(path.join(__dirname, '../uploads/multi_team_hitters.csv'));
                    const numInserted = await processInsertData(csvData) || 0;
                    resolve(numInserted);
                } catch (error) {
                    console.log(error);
                    reject(error);
                }
            });
    });
};

module.exports = processHittersCSV;
