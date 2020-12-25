const pool = require('../config/connectionPool.js').getDb();

const Hitters = {
    getAllRealTeams: async () => {
        const queryString = 'SELECT real_team_id, real_team_abbrev, strat_abbrev FROM real_teams';
        const queryParams = [];
        return await pool.query(queryString, queryParams)
            .then(([rows]) => [rows, null])
            .catch(error => [null, error]);
    },
    getRealTeamIdByStratName: async (name) => {
        const queryString = 'SELECT real_team_abbrev, real_team_id FROM real_teams WHERE strat_abbrev=? LIMIT 1;';
        const queryParams = [name];
        return await pool.query(queryString, queryParams)
            .then(([rows]) => [rows, null])
            .catch(error => [null, error]);
    },
};

module.exports = Hitters;
