import { getDb, type RowDataPacket } from '../config/connectionPool';
import { RealTeam } from '../types';
const pool = getDb();

export async function getAllRealTeams() {
    const queryString = 'SELECT id, real_team_abbrev, strat_abbrev, bbref_abbrev FROM real_teams';
    const queryParams: never[] = [];
    const [rows] = await pool.query<RowDataPacket[]>(queryString, queryParams);
    return rows as RealTeam[];
}
