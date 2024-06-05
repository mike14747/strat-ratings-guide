import { getDb } from '../config/connectionPool';
const pool = getDb();

export async function getAllRmlTeams() {
    const queryString = 'SELECT id, rml_team_name FROM rml_teams';
    const queryParams: never[] = [];
    return await pool.query(queryString, queryParams)
        .then(([rows]) => [rows, null])
        .catch(error => [null, error]);
}
