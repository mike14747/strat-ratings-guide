const pool = require('../config/connectionPool.js').getDb();

const Hitters = {
    getHittersDataByYear: async (year) => {
        const queryString = 'SELECT h.*, b.st_si_l, b.st_si_r, b.st_hr_l, b.st_hr_r, r.rml_team_name FROM hitter_ratings AS h LEFT JOIN bp_ratings AS b ON h.h_year=b.bp_year && h.real_team_id=b.real_team_id LEFT JOIN rml_teams AS r ON h.rml_team_id=r.rml_team_id WHERE h.h_year=? ORDER BY h.hitter_name ASC, h.real_team ASC;';
        const queryParams = [year];
        return await pool.query(queryString, queryParams)
            .then(([rows]) => [rows, null])
            .catch(error => [null, error]);
    },
    getMultiTeamHittersDataByYear: async (year) => {
        const queryString = 'SELECT h.*, r.rml_team_name FROM hitter_ratings AS h LEFT JOIN rml_teams AS r ON h.rml_team_id=r.rml_team_id WHERE h.h_year=? && h.real_team_id=1 ORDER BY h.hitter_name ASC, h.real_team ASC;';
        const queryParams = [year];
        return await pool.query(queryString, queryParams)
            .then(([rows]) => [rows, null])
            .catch(error => [null, error]);
    },
    getMultiTeamHittersPartialByYear: async (year) => {
        const queryString = 'SELECT m.real_team_id, m.hitter, m.ab, b.st_si_l, b.st_si_r, b.st_hr_l, b.st_hr_r FROM multi_team_hitters AS m LEFT JOIN bp_ratings AS b ON m.year=b.bp_year && m.real_team_id=b.real_team_id WHERE year=?;';
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
    getSeasonsListWithMultiTeamHitterData: async () => {
        const queryString = 'SELECT DISTINCT(year) FROM multi_team_hitters ORDER BY year DESC;';
        const queryParams = [];
        return await pool.query(queryString, queryParams)
            .then(([rows]) => [rows, null])
            .catch(error => [null, error]);
    },
    addNewHittersData: async (hitterArr) => {
        const queryString = 'INSERT INTO hitter_ratings (h_year, real_team, real_team_id, hitter_name, bats, injury, ab, so_v_l, bb_v_l, hit_v_l, ob_v_l, tb_v_l, hr_v_l, bp_hr_v_l, w_v_l, bp_si_v_l, cl_v_l, dp_v_l, so_v_r, bb_v_r, hit_v_r, ob_v_r, tb_v_r, hr_v_r, bp_hr_v_r, w_v_r, bp_si_v_r, cl_v_r, dp_v_r, stealing, stl, spd, bunt, h_r, d_ca, d_1b, d_2b, d_3b, d_ss, d_lf, d_cf, d_rf, fielding, rml_team_id) VALUES ?;';
        const queryParams = [hitterArr];
        return await pool.query(queryString, queryParams)
            .then(([rows]) => [rows, null])
            .catch(error => [null, error]);
    },
    truncateHittersTable: async () => {
        const queryString = 'TRUNCATE TABLE hitter_ratings;';
        const queryParams = [];
        return await pool.query(queryString, queryParams)
            .then(([rows]) => [rows, null])
            .catch(error => [null, error]);
    },
    addMultiTeamHittersData: async (hitterArr) => {
        const queryString = 'INSERT INTO multi_team_hitters (year, real_team_id, hitter, bats, ab) VALUES ?;';
        const queryParams = [hitterArr];
        return await pool.query(queryString, queryParams)
            .then(([rows]) => [rows, null])
            .catch(error => [null, error]);
    },
    truncateMultiTeamHittersTable: async () => {
        const queryString = 'TRUNCATE TABLE multi_team_hitters;';
        const queryParams = [];
        return await pool.query(queryString, queryParams)
            .then(([rows]) => [rows, null])
            .catch(error => [null, error]);
    },
};

module.exports = Hitters;
