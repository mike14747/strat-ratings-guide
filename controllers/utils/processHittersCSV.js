const parse = require('csv-parse');
const fs = require('fs');
const path = require('path');

const csvData = [];

const processHittersData = async (data) => {
    console.log(data[0]);
    console.log('next array row');
};

const readHittersFile = () => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '../uploads/hitter_ratings.csv'))
            .pipe(
                parse({
                    delimiter: ',',
                }),
            )
            .on('data', function (dataRow) {
                csvData.push(dataRow);
                processHittersData(dataRow);
            })
            .on('error', error => {
                reject(error);
            })
            .on('end', async function () {
                await processHittersData(csvData);
                resolve();
            });
    });
};

module.exports = {
    processHittersData,
    readHittersFile,
};
