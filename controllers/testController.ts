import express from 'express';
const router = express.Router();

// const router = require('express').Router();
// const { dbTest } = require('../config/connectionPool');

router.get('/', (_req, _res) => {
    // dbTest()
    //     .then(() => {
    //         res.status(200).send('Sending this from the /api/test endpoint!');
    //     })
    //     .catch((error: unknown) => {
    //         if (error instanceof Error) {
    //             console.error(error.name + ': ' + error.message);
    //         } else {
    //             console.error('An unknown error occurred:', error);
    //         }
    //         res.status(500).json({ message: 'An error occurred connecting to the database!' });
    //     });

    router.get('/', (req, res) => {
        res.send('This is the test controller.');
    });
});

export default router;
