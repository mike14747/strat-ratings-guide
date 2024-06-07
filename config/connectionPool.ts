import mysql, { PoolOptions } from 'mysql2/promise';

export type RowDataPacket = mysql.RowDataPacket;
export type FieldPacket = mysql.FieldPacket;
export type ResultSetHeader = mysql.ResultSetHeader;

const access: PoolOptions = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
};

const pool = mysql.createPool(access);

export const dbTest = () => {
    return new Promise<void>((resolve, reject) => {
        pool.query('SELECT 1')
            .then(() => resolve())
            .catch(error => reject(error));
    });
};

export const getDb = () => pool;
