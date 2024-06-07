import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { CustomError } from '../types';
import hittersController from './hittersController';
import pitchersController from './pitchersController';
import cardedPlayersController from './cardedPlayersController';

const router = express.Router();

router.get('/', (_req, res) => {
    res.status(200).send('Sending this from the /api root!');
});

// router.use('/hitters', hittersController);
// router.use('/pitchers', pitchersController);
router.use('/carded-players', cardedPlayersController);

router.use((_req: Request, _res: Response, next: NextFunction) => {
    const error: CustomError = new Error('API route not found!');
    error.status = 404;
    next(error);
});

const errorHandler: ErrorRequestHandler = (error: CustomError, _req: Request, res: Response) => {
    if (error.isJoi || error instanceof RangeError) error.status = 400;
    res.status(error.status || 500).json({ message: 'An error occurred! ' + error.message });
};

router.use(errorHandler);

export default router;
