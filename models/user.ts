import { getDb, type RowDataPacket } from '../config/connectionPool';
import type { UserObjForLogin } from '../types';
const pool = getDb();

export async function getUserByUsername(username: string) {
    const queryString = 'SELECT username, password, salt, admin FROM users WHERE username=? LIMIT 1';
    const queryParams = [username];
    const [rows] = await pool.query<RowDataPacket[]>(queryString, queryParams);
    return rows as UserObjForLogin[];
}
