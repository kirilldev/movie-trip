// Avoid problems with a path if we
// run script from another directory
process.chdir(__dirname);

global.SERVER_ENV = process.argv[2] === 'prod' ? 'prod' : 'dev';

const express = require('express');
const path = require('path');
const log4js = require('log4js');
const app = express();
const logger = log4js.getLogger('Main.js');
const PlaceController = require('./controller/PlaceController');
const MarkerController = require('./controller/MarkerController');
const RelationsController = require('./controller/RelationsController');
const PORT = process.env.PORT || 8090;
const IP = global.SERVER_ENV === 'dev' ? 'localhost' : '0.0.0.0';
const frontendDist = 'node_modules/frontend/dist';

// TODO: Improve logging, I just added a library..
// For example. Write error logs to a separate file,
// Take line number and a file name automatically. etc.
log4js.configure({
    appenders: {console: {type: 'console'}},
    categories: {default: {appenders: ['console'], level: 'debug'}}
});

logger.info(`Going to start server with SERVER_ENV '${global.SERVER_ENV}'`);

// config express server
app.disable('x-powered-by');

// register static routes
app.use('/', express.static(frontendDist, {index: 'index.html'}));
app.use('assets', express.static(path.join(frontendDist, 'assets')));

// register apis
app.get('/health', (req, res) => res.status(200).send('OK'));

//TODO: pass locationName from UI and remove a question mark
app.get('/api/markers/:locationName?', MarkerController.getAllLocationMarkers);

//TODO: pass locationName from UI and remove a question mark
app.get('/api/relations/:locationName?', RelationsController.getAllLocationRelations);

app.get('/api/places/:name*', PlaceController.getPlaceDataByName);


// start server
app.listen(PORT, IP, () => {
    logger.info(`App (PID ${process.pid}) listening on a port: ${PORT}!`);
});