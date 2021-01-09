const mysql = require('mysql2/promise');

let pool;

if (process.env.JAWSDB_URL) {
    const url = new URL(process.env.JAWSDB_URL);
    pool = mysql.createPool({
        host: url.hostname,
        port: url.port,
        user: url.username,
        password: url.password,
        database: url.pathname.replace('/', ''),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        multipleStatements: true,
    });
} else {
    pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        multipleStatements: true,
    });
}

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     password: process.env.DB_PW,
//     database: process.env.DB_NAME,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
//     multipleStatements: true,
// });

const dbTest = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT 1')
            .then(() => resolve())
            .catch(error => reject(error));
    });
};

const getDb = () => pool;

module.exports = { getDb, dbTest };
