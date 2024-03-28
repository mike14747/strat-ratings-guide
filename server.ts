import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import helmet from 'helmet';

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

// const jwt = require('jsonwebtoken');

app.use(express.urlencoded({ limit: '20mb', parameterLimit: 100000, extended: true }));
app.use(express.json({ limit: '20mb' }));

app.use(express.static(path.join(__dirname, 'frontend/components')));
app.use(express.static(path.join(__dirname, 'frontend/css')));
app.use(express.static(path.join(__dirname, 'frontend/images')));
app.use(express.static(path.join(__dirname, 'frontend/js')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/frontend/pages/index.html')));
app.get('/hitter-analysis', (req, res) => res.sendFile(path.join(__dirname, '/frontend/pages/hitter-analysis.html')));
app.get('/upload-hitter-data', (req, res) => res.sendFile(path.join(__dirname, '/frontend/pages/upload-hitter-data.html')));
app.get('/upload-multi-team-hitter-data', (req, res) => res.sendFile(path.join(__dirname, '/frontend/pages/upload-multi-team-hitter-data.html')));
app.get('/pitcher-analysis', (req, res) => res.sendFile(path.join(__dirname, '/frontend/pages/pitcher-analysis.html')));
app.get('/upload-pitcher-data', (req, res) => res.sendFile(path.join(__dirname, '/frontend/pages/upload-pitcher-data.html')));
app.get('/upload-multi-team-pitcher-data', (req, res) => res.sendFile(path.join(__dirname, '/frontend/pages/upload-multi-team-pitcher-data.html')));
app.get('/upload-carded-player-data', (req, res) => res.sendFile(path.join(__dirname, '/frontend/pages/upload-carded-player-data.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '/frontend/pages/login.html')));

function authenticateToken(req: Request, res: Response, next: NextFunction) {
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

const { dbTest } = require('./config/connectionPool');

app.use(require('./controllers/testController'));

dbTest()
    .then(() => {
        app.use('/api/test', authenticateToken, require('./controllers/testController'));
        app.use('/api/auth', require('./controllers/authController'));
        app.use('/api', authenticateToken, require('./controllers'));
    })
    .catch((error: unknown) => {
        if (error instanceof Error) {
            console.error(error.name + ': ' + error.message);
        } else {
            console.error(error);
        }
        app.get('/api/*', (req, res) => {
            res.status(500).json({ message: 'An error occurred connecting to the database!' });
        });
    })
    .finally(() => {
        app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/frontend/pages/404.html')));
    });

app.listen(PORT, () => console.log('Server is listening on port ' + PORT));

module.exports = app;
