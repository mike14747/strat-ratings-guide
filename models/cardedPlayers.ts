import { getDb, type RowDataPacket, type ResultSetHeader } from '../config/connectionPool';
import { CardedPlayer, CardedPlayerArrForDBImport } from '../types';
const pool = getDb();

export async function getAllCardedPlayers() {
    const queryString = 'SELECT year, abbrev_name, full_name, rml_team, ip, ab FROM carded_players ORDER BY year ASC, abbrev_name ASC';
    const queryParams: never[] = [];
    const [rows] = await pool.query<RowDataPacket[]>(queryString, queryParams);
    return rows as CardedPlayer[];
}

export async function getCardedPlayersByYear(year: number) {
    const queryString = 'SELECT year, abbrev_name, full_name, rml_team, ip, ab FROM carded_players WHERE year=? ORDER BY abbrev_name ASC';
    const queryParams = [year];
    const [rows] = await pool.query<RowDataPacket[]>(queryString, queryParams);
    return rows as CardedPlayer[];
}

export async function addNewCardedPlayerData(playerArr: CardedPlayerArrForDBImport[] = []) {
    if (playerArr.length === 0) throw new Error('Carded player list being sent to the db was empty.');

    const queryString = 'TRUNCATE TABLE carded_players;INSERT INTO carded_players (year, abbrev_name, full_name, rml_team, ip, ab) VALUES ?;SHOW WARNINGS;';
    const queryParams = [playerArr];
    const [results] = await pool.query<ResultSetHeader[]>(queryString, queryParams);
    return results[1];
}
