const router = require('express').Router();

router.get('/', (req, res) => {
    res.status(200).send('Sending this from the /api root!');
});

router.use('/hitters', require('./hittersController'));

router.use('/pitchers', require('./pitchersController'));

router.use((req, res, next) => {
    const error = new Error('API route not found!');
    error.status = 404;
    next(error);
});

router.use((error, req, res, next) => {
    if (error.isJoi) {
        return res.status(400).send(error.message);
    } else if (error instanceof RangeError) {
        return res.status(400).send(error.message);
    }
    res.status(error.status || 500);
    error.status === 404 ? res.send(error.message) : res.json({ message: 'An error occurred! ' + error.message });
});

module.exports = router;
