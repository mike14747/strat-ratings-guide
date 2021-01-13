const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
// const salt = bcryptjs.genSaltSync(10);
const loginSchema = require('./validation/schema/loginSchema');
const User = require('../models/user');

const SECONDS_IN_ONE_HOUR = 60 * 60;

router.post('/login', async (req, res, next) => {
    try {
        await loginSchema.validateAsync({ username: req.body.username, password: req.body.password });
        // console.log(bcryptjs.hashSync(req.body.password, salt));
        const [data, error] = await User.getUserByUsername(req.body.username);
        if (error) return next(error);
        if (data && data.length === 1) {
            bcryptjs.compare(req.body.password, data[0].password)
                .then((response) => {
                    if (response) {
                        const accessToken = jwt.sign({ username: req.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: SECONDS_IN_ONE_HOUR });
                        const refreshToken = jwt.sign({ username: req.username }, process.env.REFRESH_TOKEN_SECRET);
                        return res.status(201).json({ accessToken, refreshToken });
                    } else {
                        return res.status(400).json({ message: 'username and/or password are invalid!' });
                    }
                })
                .catch(error => next(error));
        } else {
            return res.status(400).json({ message: 'username and/or password are invalid!' });
        }
    } catch (error) {
        next(error);
    }
});

router.get('/logout', (req, res, next) => {
    res.status(200).send('you hit the logged out endpoint');
});

module.exports = router;
