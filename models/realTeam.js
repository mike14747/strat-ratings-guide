const pool = require('../config/connectionPool.js').getDb();

async function getAllRealTeams() {
    const queryString = 'SELECT id, real_team_abbrev, strat_abbrev, bbref_abbrev FROM real_teams';
    const queryParams = [];
    return await pool.query(queryString, queryParams)
        .then(([rows]) => [rows, null])
        .catch(error => [null, error]);
}

module.exports = {
    getAllRealTeams,
};
