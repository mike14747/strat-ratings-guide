const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res, next) => {
    const accessToken = jwt.sign({ username: req.username }, process.env.ACCESS_TOKEN_SECRET);
    res.status(201).json({ accessToken });
});

module.exports = router;
