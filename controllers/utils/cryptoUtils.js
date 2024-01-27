const { randomBytes, pbkdf2Sync } = require('node:crypto');

// this can only be used server-side

function generateRandom(size = 32) {
    if (!Number.isInteger(size)) size = 32;
    return randomBytes(size).toString('hex');
}

function hashPassword(password, salt) {
    if (!password || !salt) return null;
    return pbkdf2Sync(password, salt, 10000, 96, 'sha512').toString('hex');
}

module.exports = {
    generateRandom,
    hashPassword,
};
