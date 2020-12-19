const pool = require('../config/connectionPool.js').getDb();

const Hitters = {
    getHittersDataByYear: async (year) => {
        const queryString = 'SELECT h.*, b.st_si_l, b.st_si_r, b.st_hr_l, b.st_hr_r, r.rml_team_name FROM hitter_ratings AS h LEFT JOIN bp_ratings AS b ON h.h_year=b.bp_year && h.real_team_id=b.real_team_id LEFT JOIN rml_teams AS r ON h.rml_team_id=r.rml_team_id WHERE h.h_year=? ORDER BY h.real_team ASC, h.hitter_name ASC;';
        const queryParams = [year];
        return await pool.query(queryString, queryParams)
            .then(([rows]) => [rows, null])
            .catch(error => [null, error]);
    },
    getSeasonsListWithHitterData: async () => {
        const queryString = 'SELECT DISTINCT(h_year) FROM hitter_ratings ORDER BY h_year DESC;';
        const queryParams = [];
        return await pool.query(queryString, queryParams)
            .then(([rows]) => [rows, null])
            .catch(error => [null, error]);
    },
};

module.exports = Hitters;
