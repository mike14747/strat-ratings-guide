const router = require('express').Router();
const { dbTest } = require('../config/connectionPool');

router.get('/api/test', (req, res) => {
    dbTest()
        .then(() => {
            res.status(200).end();
        })
        .catch(error => {
            res.status(500).json({ message: 'An error occurred connecting to the database! ' + error.message });
        });
});

module.exports = router;
