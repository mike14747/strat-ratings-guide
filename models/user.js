const pool = require('../config/connectionPool.js').getDb();

const User = {
    getUserByUsername: async (username) => {
        const queryString = 'SELECT username, password, salt, admin FROM users WHERE username=? LIMIT 1';
        const queryParams = [username];
        return await pool.query(queryString, queryParams)
            .then(([rows]) => [rows, null])
            .catch(error => [null, error]);
    },
};

module.exports = User;
