import { getDb } from '../config/connectionPool';
const pool = getDb();

export async function getAllRealTeams() {
    const queryString = 'SELECT id, real_team_abbrev, strat_abbrev, bbref_abbrev FROM real_teams';
    const queryParams: never[] = [];
    return await pool.query(queryString, queryParams)
        .then(([rows]) => [rows, null])
        .catch(error => [null, error]);
}
