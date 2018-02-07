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
const logger = log4js.getLogger('Main.js');
const Place = require('./api/Place');
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

// config express server
app.disable('x-powered-by');

// register static routes
app.use('/', express.static(path.join(__dirname, '../dist'), {index: 'index.html'}));
app.use('assets', express.static(path.join(__dirname, '../dist/assets')));

// register apis
app.get('/health', (req, res) => res.status(200).send('OK'));

app.get('/api/heatmap', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(path.resolve(__dirname, 'db/Coordinates_in_San_Francisco.csv'))
});

app.get('/api/place/:name*', Place.getPlaceDataByName);

app.get('/api/relations/:locationName?', (req, res) => {
    fs.readFile('./db/Film_Locations_in_San_Francisco.csv', 'utf8', function (err, contents) {
        if (err) {
            throw err;
        }

        const [/*headerRow*/, ...rows] = parse(contents);

        const data = rows.map(row => {
            return row.slice(0, 8)
                .concat([row.slice(8).filter(r => r.trim())])
        });

        res.json(mapLocations(data))
    });
});

function mapLocations(rows) {
    const apiFields = require('../common/enum.js').API_FIELDS;
    const collumn = {
        [apiFields.title]: 0,
        //releaseYear: 1,
        [apiFields.locations]: 2,
        //funFacts: 3,
        //productionCompany: 4,
        //distributor: 5,
        [apiFields.director]: 6,
        [apiFields.writer]: 7,
        [apiFields.actors]: 8
    };

    const locationToId = {};

    const response = {
        [apiFields.locations]: [],
        relations: {
            [apiFields.actors]: {},
            [apiFields.title]: {},
            [apiFields.director]: {},
            [apiFields.writer]: {}
        }
    };

    const outFields = Object.keys(response.relations);

    rows.forEach(row => {
        const locationName = row[collumn.locations];

        if (locationName && locationName.trim()) {
            let mappedId = locationToId[locationName];

            if (mappedId === undefined) {
                mappedId = response.locations.length;
                locationToId[locationName] = mappedId;
                response.locations.push(locationName);
            }

            outFields.forEach(outField => {
                let currentCell = row[collumn[outField]];

                if (!Array.isArray(currentCell)) {
                    currentCell = [currentCell];
                }

                currentCell.forEach(cellVal => {
                    let locationIds = response.relations[outField][cellVal] || [];
                    locationIds.push(mappedId);
                    response.relations[outField][cellVal] = locationIds;
                })
            });
        }
    });

    return response
}

// start server
app.listen(PORT, IP, _ => logger.info(`App (PID ${process.pid}) listening on a port: ${PORT}!`));