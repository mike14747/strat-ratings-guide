const pool = require('../config/connectionPool.js').getDb();

async function getAllRmlTeams() {
    const queryString = 'SELECT id, rml_team_name FROM rml_teams';
    const queryParams = [];
    return await pool.query(queryString, queryParams)
        .then(([rows]) => [rows, null])
        .catch(error => [null, error]);
}

async function getAllRealTeams() {
    const queryString = 'SELECT id, real_team_abbrev, strat_abbrev, bbref_abbrev FROM real_teams';
    const queryParams = [];
    return await pool.query(queryString, queryParams)
        .then(([rows]) => [rows, null])
        .catch(error => [null, error]);
}

async function getRealTeamIdByStratName(name) {
    const queryString = 'SELECT id, real_team_abbrev FROM real_teams WHERE strat_abbrev=? LIMIT 1;';
    const queryParams = [name];
    return await pool.query(queryString, queryParams)
        .then(([rows]) => [rows, null])
        .catch(error => [null, error]);
}

async function getRealTeamIdByBBRefName(name) {
    const queryString = 'SELECT id, real_team_abbrev FROM real_teams WHERE bbref_abbrev=? LIMIT 1;';
    const queryParams = [name];
    return await pool.query(queryString, queryParams)
        .then(([rows]) => [rows, null])
        .catch(error => [null, error]);
}

module.exports = {
    getAllRmlTeams,
    getAllRealTeams,
    getRealTeamIdByStratName,
    getRealTeamIdByBBRefName,
};
