import * as fs from 'fs';
import * as path from 'path';

export async function ensureUploadsExists() {
    return new Promise<void>((resolve, reject) => {
        fs.promises.access(path.join(__dirname, '../uploads'), fs.constants.F_OK)
            .then(() => resolve())
            .catch(() => {
                fs.promises.mkdir(path.join(__dirname, '../uploads'))
                    .then(() => resolve())
                    .catch(error => reject(error));
            });
    });
}
