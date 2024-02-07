const router = require('express').Router();

router.get('/', (req, res) => {
    res.status(200).send('Sending this from the /api root!');
});

router.use('/hitters', require('./hittersController'));

router.use('/pitchers', require('./pitchersController'));

router.use('/carded-players', require('./cardedPlayersController'));

router.use((req, res, next) => {
    const error = new Error('API route not found!');
    error.status = 404;
    next(error);
});

router.use((error, req, res, next) => {
    if (error.isJoi || error instanceof RangeError) error.status = 400;
    res.status(error.status || 500).json({ message: 'An error occurred! ' + error.message });
});

module.exports = router;
