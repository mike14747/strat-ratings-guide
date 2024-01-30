const pool = require('../config/connectionPool.js').getDb();

const Pitchers = {
    getPitchersDataByYear: async (year) => {
        const queryString = 'SELECT p.*, b.st_si_l, b.st_si_r, b.st_hr_l, b.st_hr_r, r.rml_team_name FROM pitcher_ratings AS p LEFT JOIN bp_ratings AS b ON p.year=b.year && p.real_team_id=b.real_team_id LEFT JOIN rml_teams AS r ON p.rml_team_id=r.rml_team_id WHERE p.year=? ORDER BY name ASC, p.real_team ASC, p.name ASC;';
        const queryParams = [year];
        return await pool.query(queryString, queryParams)
            .then(([rows]) => [rows, null])
            .catch(error => [null, error]);
    },
    getMultiTeamPitchersPartialByYear: async (year) => {
        const queryString = 'SELECT m.real_team_id, m.pitcher, m.ip, b.st_si_l, b.st_si_r, b.st_hr_l, b.st_hr_r FROM multi_team_pitchers AS m LEFT JOIN bp_ratings AS b ON m.year=b.year && m.real_team_id=b.real_team_id WHERE year=?;';
        const queryParams = [year];
        return await pool.query(queryString, queryParams)
            .then(([rows]) => [rows, null])
            .catch(error => [null, error]);
    },
    getSeasonsListWithPitcherData: async () => {
        const queryString = 'SELECT DISTINCT(year) FROM pitcher_ratings ORDER BY year DESC;';
        const queryParams = [];
        return await pool.query(queryString, queryParams)
            .then(([rows]) => [rows, null])
            .catch(error => [null, error]);
    },
    addNewPitchersData: async (pitcherArr = []) => {
        if (pitcherArr.length > 0) {
            const queryString = 'TRUNCATE TABLE pitcher_ratings;INSERT INTO pitcher_ratings (year, real_team, real_team_id, name, throws, ip, so_v_l, bb_v_l, hit_v_l, ob_v_l, tb_v_l, hr_v_l, bp_hr_v_l, bp_si_v_l, dp_v_l, so_v_r, bb_v_r, hit_v_r, ob_v_r, tb_v_r, hr_v_r, bp_hr_v_r, bp_si_v_r, dp_v_r, hold, endurance, fielding, balk, wp, batting_b, stl, spd, rml_team_id) VALUES ?;';
            const queryParams = [pitcherArr];
            return await pool.query(queryString, queryParams)
                .then(([rows]) => [rows, null])
                .catch(error => [null, error]);
        } else {
            return [[[], { affectedRows: 0 }], null];
        }
    },
    addMultiTeamPitchersData: async (pitcherArr = []) => {
        if (pitcherArr.length > 0) {
            const queryString = 'TRUNCATE TABLE multi_team_pitchers;INSERT INTO multi_team_pitchers (year, real_team_id, pitcher, throws, ip) VALUES ?;';
            const queryParams = [pitcherArr];
            return await pool.query(queryString, queryParams)
                .then(([rows]) => [rows, null])
                .catch(error => [null, error]);
        } else {
            return [[[], { affectedRows: 0 }], null];
        }
    },
    getPitchersDataByYearAndId: async (year, id) => {
        const queryString = 'SELECT p.*, b.st_si_l, b.st_si_r, b.st_hr_l, b.st_hr_r, r.rml_team_name FROM pitcher_ratings AS p LEFT JOIN bp_ratings AS b ON p.year=b.year && p.real_team_id=b.real_team_id LEFT JOIN rml_teams AS r ON p.rml_team_id=r.rml_team_id WHERE p.year=? && p.pitcher_id=? ORDER BY name ASC, p.real_team ASC, p.name ASC;';
        const queryParams = [year, id];
        return await pool.query(queryString, queryParams)
            .then(([rows]) => [rows, null])
            .catch(error => [null, error]);
    },
};

module.exports = Pitchers;
