import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import helmet from 'helmet';
import { dbTest } from './config/connectionPool';
import testController from './controllers/testController';
import authController from './controllers/authController';
import mainController from './controllers';

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
        useDefaults: false,
        directives: {
            /* eslint-disable quotes */
            'default-src': ["'self'"],
            'script-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
            'style-src': ["'self'", "'unsafe-inline'"],
            'img-src': ["'self'", 'data:'],
            'font-src': ["'self'"],
            /* eslint-enable quotes */
        },
    }),
);

app.use(express.urlencoded({ limit: '20mb', parameterLimit: 100000, extended: true }));
app.use(express.json({ limit: '20mb' }));

app.use(express.static(path.join(__dirname, 'frontend/components')));
app.use(express.static(path.join(__dirname, 'frontend/css')));
app.use(express.static(path.join(__dirname, 'frontend/images')));
app.use(express.static(path.join(__dirname, 'frontend/js')));

app.get('/', (_req, res) => res.sendFile(path.join(__dirname, '/frontend/pages/index.html')));
app.get('/hitter-analysis', (_req, res) => res.sendFile(path.join(__dirname, '/frontend/pages/hitter-analysis.html')));
app.get('/upload-hitter-data', (_req, res) => res.sendFile(path.join(__dirname, '/frontend/pages/upload-hitter-data.html')));
app.get('/upload-multi-team-hitter-data', (_req, res) => res.sendFile(path.join(__dirname, '/frontend/pages/upload-multi-team-hitter-data.html')));
app.get('/pitcher-analysis', (_req, res) => res.sendFile(path.join(__dirname, '/frontend/pages/pitcher-analysis.html')));
app.get('/upload-pitcher-data', (_req, res) => res.sendFile(path.join(__dirname, '/frontend/pages/upload-pitcher-data.html')));
app.get('/upload-multi-team-pitcher-data', (_req, res) => res.sendFile(path.join(__dirname, '/frontend/pages/upload-multi-team-pitcher-data.html')));
app.get('/upload-carded-player-data', (_req, res) => res.sendFile(path.join(__dirname, '/frontend/pages/upload-carded-player-data.html')));
app.get('/login', (_req, res) => res.sendFile(path.join(__dirname, '/frontend/pages/login.html')));

function authenticateToken(_req: Request, _res: Response, next: NextFunction) {
    // const authHeader = req.headers.authorization;
    // const token = authHeader && authHeader.split(' ')[1];
    // if (token == null) return res.sendStatus(401);

    // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    //     if (err) return res.sendStatus(403);
    //     req.user = user;
    //     next();
    // });
    next();
}

dbTest()
    .then(() => {
        app.use('/api/test', authenticateToken, testController);
        app.use('/api/auth', authController);
        app.use('/api', authenticateToken, mainController);
    })
    .catch((error: unknown) => {
        if (error instanceof Error) {
            console.error(error.name + ': ' + error.message);
        } else {
            console.error(error);
        }
        app.get('/api/*', (_req, res) => {
            res.status(500).json({ message: 'An error occurred connecting to the database!' });
        });
    })
    .finally(() => {
        app.get('*', (_req, res) => res.sendFile(path.join(__dirname, '/frontend/pages/404.html')));
    });

app.listen(PORT, () => console.log('Server is listening on port ' + PORT));

export default app;
