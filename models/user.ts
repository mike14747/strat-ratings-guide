import { getDb } from '../config/connectionPool';
const pool = getDb();

export async function getUserByUsername(username: string) {
    const queryString = 'SELECT username, password, salt, admin FROM users WHERE username=? LIMIT 1';
    const queryParams = [username];
    return await pool.query(queryString, queryParams)
        .then(([rows]) => [rows, null])
        .catch(error => [null, error]);
}
