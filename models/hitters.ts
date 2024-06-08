import { getDb, type RowDataPacket, type ResultSetHeader } from '../config/connectionPool';
import type { HitterDataFromDB, HitterArrForDBImport, MultiTeamHitterDataFromDB, MultiTeamHitterArrForDBImport, SeasonList } from '../types';
const pool = getDb();

export async function getHittersDataByYear(year: number) {
    const queryString = 'SELECT h.*, b.st_si_l, b.st_si_r, b.st_hr_l, b.st_hr_r, r.rml_team_name FROM hitter_ratings AS h LEFT JOIN bp_ratings AS b ON h.year=b.year && h.real_team_id=b.real_team_id LEFT JOIN rml_teams AS r ON h.rml_team_id=r.id WHERE h.year=? ORDER BY h.name ASC, h.real_team ASC;';
    const queryParams = [year];
    const [rows] = await pool.query<RowDataPacket[]>(queryString, queryParams);
    return rows as HitterDataFromDB[];
}

export async function getMultiTeamHittersPartialByYear(year: number) {
    const queryString = 'SELECT m.real_team_id, m.hitter, m.ab, b.st_si_l, b.st_si_r, b.st_hr_l, b.st_hr_r FROM multi_team_hitters AS m LEFT JOIN bp_ratings AS b ON m.year=b.year && m.real_team_id=b.real_team_id WHERE m.year=?;';
    const queryParams = [year];
    const [rows] = await pool.query<RowDataPacket[]>(queryString, queryParams);
    return rows as MultiTeamHitterDataFromDB[];
}

export async function getSeasonsListWithHitterData() {
    const queryString = 'SELECT DISTINCT(year) FROM hitter_ratings ORDER BY year DESC;';
    const queryParams: never[] = [];
    const [rows] = await pool.query<RowDataPacket[]>(queryString, queryParams);
    return rows as SeasonList[];
}

export async function addNewHittersData(hitterArr: HitterArrForDBImport[] = []) {
    if (hitterArr.length === 0) throw new Error('Hitter array data being sent to the db was empty.');

    const queryString = 'TRUNCATE TABLE hitter_ratings;INSERT INTO hitter_ratings (year, real_team, real_team_id, name, bats, injury, ab, so_v_l, bb_v_l, hit_v_l, ob_v_l, tb_v_l, hr_v_l, bp_hr_v_l, w_v_l, bp_si_v_l, cl_v_l, dp_v_l, so_v_r, bb_v_r, hit_v_r, ob_v_r, tb_v_r, hr_v_r, bp_hr_v_r, w_v_r, bp_si_v_r, cl_v_r, dp_v_r, stealing, stl, spd, bunt, h_r, d_ca, d_1b, d_2b, d_3b, d_ss, d_lf, d_cf, d_rf, fielding, rml_team_id) VALUES ?;SHOW WARNINGS;';
    const queryParams = [hitterArr];
    const [results] = await pool.query<ResultSetHeader[]>(queryString, queryParams);
    return results[1];
}

export async function addMultiTeamHittersData(hitterArr: MultiTeamHitterArrForDBImport[] = []) {
    if (hitterArr.length === 0) throw new Error('Multi-team hitter array data being sent to the db was empty.');

    const queryString = 'TRUNCATE TABLE multi_team_hitters;INSERT INTO multi_team_hitters (year, real_team_id, hitter, bats, ab) VALUES ?;';
    const queryParams = [hitterArr];
    const [results] = await pool.query<ResultSetHeader[]>(queryString, queryParams);
    return results[1];
}
