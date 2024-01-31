const pool = require('../config/connectionPool.js').getDb();

const RealTeam = {
    getAllRealTeams: async () => {
        const queryString = 'SELECT id, real_team_abbrev, strat_abbrev, bbref_abbrev FROM real_teams';
        const queryParams = [];
        return await pool.query(queryString, queryParams)
            .then(([rows]) => [rows, null])
            .catch(error => [null, error]);
    },
    getRealTeamIdByStratName: async (name) => {
        const queryString = 'SELECT real_team_abbrev, id FROM real_teams WHERE strat_abbrev=? LIMIT 1;';
        const queryParams = [name];
        return await pool.query(queryString, queryParams)
            .then(([rows]) => [rows, null])
            .catch(error => [null, error]);
    },
    getRealTeamIdByBBRefName: async (name) => {
        const queryString = 'SELECT real_team_abbrev, id FROM real_teams WHERE bbref_abbrev=? LIMIT 1;';
        const queryParams = [name];
        return await pool.query(queryString, queryParams)
            .then(([rows]) => [rows, null])
            .catch(error => [null, error]);
    },
};

module.exports = RealTeam;
