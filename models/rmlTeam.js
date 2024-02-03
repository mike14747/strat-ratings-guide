const pool = require('../config/connectionPool.js').getDb();

async function getAllRmlTeams() {
    const queryString = 'SELECT id, rml_team_name FROM rml_teams';
    const queryParams = [];
    return await pool.query(queryString, queryParams)
        .then(([rows]) => [rows, null])
        .catch(error => [null, error]);
}

module.exports = {
    getAllRmlTeams,
};
