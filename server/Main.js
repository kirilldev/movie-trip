process.chdir(__dirname);

const express = require('express');
const path = require('path');
const log4js = require('log4js');
const fs = require('fs');
const csv = require('csv');
const parse = require('csv-parse/lib/sync');
const app = express();
const GeocodePlaces = require('./GeocodePlaces.js');

log4js.configure({
    appenders: {console: {type: 'console'}},
    categories: {default: {appenders: ['console'], level: 'debug'}}
});

const LOGGER = log4js.getLogger('Main.js');
const PORT = process.env.PORT || 8090;

global.SERVER_ENV = process.argv[2] === 'prod' ? 'prod' : 'dev';

LOGGER.info(`Going to start server with SERVER_ENV '${global.SERVER_ENV}'`);

const IP = SERVER_ENV === 'dev' ? 'localhost' : '0.0.0.0';

// fs.readFile('./../Film_Locations_in_San_Francisco.csv', 'utf8', function (err, contents) {
//     const [header, ...rows] = parse(contents);
//     const places = Array.from(new Set(rows.map(e => e[2])));
//     const placeNameToCoordinate = {};
//
//     places.reduce(mapNameToCoordinate, Promise.resolve(true)).then(writeToAFile);
//
//     function writeToAFile() {
//         const fs = require('fs');
//         fs.writeFileSync('./../Coordinates_in_San_Francisco.csv', JSON.stringify(placeNameToCoordinate));
//     }
//
//     function mapNameToCoordinate(prevPromise, placeName) {
//         return prevPromise.then(_ => GeocodePlaces.getCoordinatesByName(placeName)
//             .then(coordinate => placeNameToCoordinate[placeName] = coordinate));
//     }
//
// });


app.disable('x-powered-by');

app.use('/', express.static(path.join(__dirname, '../dist'), { index: 'index.html' }));
app.use('assets', express.static(path.join(__dirname, '../dist/assets')));
app.get('/health', (req, res) => res.status(200).send('OK'));
app.get('/api/heatmap', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(path.resolve(__dirname, 'db/Coordinates_in_San_Francisco.csv'))
});

app.listen(PORT, IP, _ => LOGGER.info(`App ${process.pid} listening on port ${PORT}!`));