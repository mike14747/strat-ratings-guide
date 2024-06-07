import { getDb, type RowDataPacket } from '../config/connectionPool';
import type { RmlTeamObj } from '../types';
const pool = getDb();

export async function getAllRmlTeams() {
    const queryString = 'SELECT id, rml_team_name FROM rml_teams';
    const queryParams: never[] = [];
    const [rows] = await pool.query<RowDataPacket[]>(queryString, queryParams);
    return rows as RmlTeamObj[];
}
