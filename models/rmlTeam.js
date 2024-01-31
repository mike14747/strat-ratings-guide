const pool = require('../config/connectionPool.js').getDb();

const RmlTeam = {
    getAllRmlTeams: async () => {
        const queryString = 'SELECT id, rml_team_name FROM rml_teams';
        const queryParams = [];
        return await pool.query(queryString, queryParams)
            .then(([rows]) => [rows, null])
            .catch(error => [null, error]);
    },
};

module.exports = RmlTeam;
