import express from 'express';
import logging from './config/logging';
import config from './config/config';
import routes from './routes';
import db from './config/db';
import path from 'path';

const NAMESPACE = 'Server';
const app = express();

/** Database connection */
db.connect();

/** Logging the request */
app.use((req, res, next) => {
    logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`);
    });
    next();
});

/** parse json */
app.use(express.json());

/** Rules of API */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

/** Routers of API */
app.use('/api', routes);

/** Error Handler */
// app.use('*', (req, res) => {
//     logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);
//     return res.status(404).json({ message: 'Not found' });
// });

/** Only for heroku build */
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
    });
}

/** App listener */
app.listen(`${config.server.port}`, () => {
    logging.info(NAMESPACE, `RUNNING AT PORT - [${config.server.port}] ENV MODE - [${config.server.env}]`);
});
