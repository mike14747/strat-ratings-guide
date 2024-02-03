const path = require('path');
const fs = require('fs');

function ensureUploadsExists() {
    return new Promise((resolve, reject) => {
        fs.promises.access(path.join(__dirname, '../uploads'), fs.constants.F_OK)
            .then(() => resolve())
            .catch(() => {
                fs.promises.mkdir(path.join(__dirname, '../uploads'))
                    .then(() => resolve())
                    .catch(error => reject(error));
            });
    });
}

module.exports = ensureUploadsExists;
