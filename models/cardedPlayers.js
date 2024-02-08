const pool = require('../config/connectionPool.js').getDb();

async function getAllCardedPlayers() {
    const queryString = 'SELECT * FROM carded_players ORDER BY year ASC, abbrev_name ASC';
    const queryParams = [];
    return await pool.query(queryString, queryParams)
        .then(([rows]) => [rows, null])
        .catch(error => [null, error]);
}

async function getCardedPlayersByYear(year) {
    const queryString = 'SELECT * FROM carded_players WHERE year=? ORDER BY abbrev_name ASC';
    const queryParams = [year];
    return await pool.query(queryString, queryParams)
        .then(([rows]) => [rows, null])
        .catch(error => [null, error]);
}

async function addNewCardedPlayerData(playerArr = []) {
    if (playerArr.length > 0) {
        const queryString = 'TRUNCATE TABLE carded_players;INSERT INTO carded_players (year, abbrev_name, full_name, rml_team, ip, ab) VALUES ?;SHOW WARNINGS;';
        const queryParams = [playerArr];
        return await pool.query(queryString, queryParams)
            .then(([rows]) => [rows, null])
            .catch(error => [null, error]);
    } else {
        return [[[], { affectedRows: 0 }], null];
    }
}

module.exports = {
    getAllCardedPlayers,
    getCardedPlayersByYear,
    addNewCardedPlayerData,
};
