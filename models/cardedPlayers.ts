import { getDb } from '../config/connectionPool';
const pool = getDb();

export async function getAllCardedPlayers() {
    const queryString = 'SELECT year, abbrev_name, full_name, rml_team, ip, ab FROM carded_players ORDER BY year ASC, abbrev_name ASC';
    const queryParams: never[] = [];
    return await pool.query(queryString, queryParams)
        .then(([rows]) => [rows, null])
        .catch(error => [null, error]);
}

export async function getCardedPlayersByYear(year: number) {
    const queryString = 'SELECT year, abbrev_name, full_name, rml_team, ip, ab FROM carded_players WHERE year=? ORDER BY abbrev_name ASC';
    const queryParams = [year];
    return await pool.query(queryString, queryParams)
        .then(([rows]) => [rows, null])
        .catch(error => [null, error]);
}

export async function addNewCardedPlayerData(playerArr: (string | number | null)[][] = []) {
    if (playerArr.length > 0) {
        const queryString = 'TRUNCATE TABLE carded_players;INSERT INTO carded_players (year, abbrev_name, full_name, rml_team, ip, ab) VALUES ?;SHOW WARNINGS;';
        const queryParams = [playerArr];
        return await pool.query(queryString, queryParams)
            .then(([rows]) => [rows, null])
            .catch(error => [null, error]);
    } else {
        return [[[], { affectedRows: 0 }], null];
    }
}
