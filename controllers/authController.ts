import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { generateRandom, hashPassword } from './utils/cryptoUtils';
import { loginSchema } from './validation/schema/loginSchema';
import { getUserByUsername } from '../models/user';

const router = express.Router();

const SECONDS_IN_ONE_MONTH = 60 * 60 * 24 * 30;

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await loginSchema.validateAsync({ username: req.body.username, password: req.body.password });
        const [data, error] = await getUserByUsername(req.body.username);
        if (error) return next(error);
        if (data && data.length === 1) {
            const hashedPassword = hashPassword(req.body.password, data[0].salt);
            if (!hashedPassword) return res.status(400).json({ message: 'username and/or password are invalid!' });

            if (hashedPassword === data[0].password) {
                const accessToken = jwt.sign({ username: req.body.username }, process.env.ACCESS_TOKEN_SECRET || '', { expiresIn: SECONDS_IN_ONE_MONTH });
                const refreshToken = jwt.sign({ username: req.body.username }, process.env.REFRESH_TOKEN_SECRET || '');
                return res.status(201).json({ accessToken, refreshToken });
            } else {
                return res.status(400).json({ message: 'username and/or password are invalid!' });
            }
        } else {
            return res.status(400).json({ message: 'username and/or password are invalid!' });
        }
    } catch (error) {
        next(error);
    }
});

router.get('/salt', async (_req: Request, res: Response) => {
    const salt = generateRandom(32);
    return res.send({ salt }).end();
});

router.get('/hash', async (_req: Request, res: Response) => {
    const hashedPassword = hashPassword('some-password', 'some-salt');
    return res.send({ hashedPassword }).end();
});

router.get('/logout', (_req: Request, res: Response) => {
    res.status(200).send('you hit the logged out endpoint');
});

export default router;
