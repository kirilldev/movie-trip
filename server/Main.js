// Avoid problems with a path if we
// run script from other directory
process.chdir(__dirname);

global.SERVER_ENV = process.argv[2] === 'prod' ? 'prod' : 'dev';

const express = require('express');
const path = require('path');
const log4js = require('log4js');
const fs = require('fs');
const csv = require('csv');
const parse = require('csv-parse/lib/sync');
const app = express();
const GeocodePlaces = require('./GeocodePlaces.js');
const logger = log4js.getLogger('Main.js');
const PORT = process.env.PORT || 8090;
const IP = SERVER_ENV === 'dev' ? 'localhost' : '0.0.0.0';

// TODO: Improve logging, I just added a library..
// For example. Write error logs to a separate file,
// Take line number and a file name automatically. etc.
log4js.configure({
    appenders: {console: {type: 'console'}},
    categories: {default: {appenders: ['console'], level: 'debug'}}
});

logger.info(`Going to start server with SERVER_ENV '${SERVER_ENV}'`);

app.disable('x-powered-by');

// static routes
app.use('/', express.static(path.join(__dirname, '../dist'), { index: 'index.html' }));
app.use('assets', express.static(path.join(__dirname, '../dist/assets')));

// apis
app.get('/health', (req, res) => res.status(200).send('OK'));

app.get('/api/heatmap', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(path.resolve(__dirname, 'db/Coordinates_in_San_Francisco.csv'))
});

app.get('/api/dataset', (req, res) => {
    // fs.readFile('./../Film_Locations_in_San_Francisco.csv', 'utf8', function (err, contents) {
    //     const [header, ...rows] = parse(contents);
    //     const places = Array.from(new Set(rows.map(e => e[2])));
    //     const placeNameToCoordinate = {};
    //
    //     places.reduce(mapNameToCoordinate, Promise.resolve(true)).then(writeToAFile);
    //
    //     function mapNameToCoordinate(prevPromise, placeName) {
    //         return prevPromise.then(_ => GeocodePlaces.getCoordinatesByName(placeName)
    //             .then(coordinate => placeNameToCoordinate[placeName] = coordinate));
    //     }
    //
    // });
});

// start server
app.listen(PORT, IP, _ => logger.info(`App (PID ${process.pid}) listening on a port: ${PORT}!`));