const path = require('path');
const fs = require('fs');

const csv = require(path.resolve(__dirname, '../server/node_modules', 'csv'));
const parse = require(path.resolve(__dirname, '../server/node_modules', 'csv-parse/lib/sync'));
const GeocodePlacesService = require('../server/service/GeocodePlacesService.js');

const csvFilePath = '../../server/db/Film_Locations_in_San_Francisco.csv';
const outFilePath = './GeocodedData.json';
const area = 'San Francisco';

fs.readFile(csvFilePath, 'utf8', function (err, contents) {
    const [/*header*/, ...rows] = parse(contents);
    const places = Array.from(new Set(rows.map(e => e[2])));
    const placeNameToCoordinate = {};

    function writeToAFile() {
        fs.writeFileSync(outFilePath, JSON.stringify(placeNameToCoordinate));
    }

    function mapNameToCoordinate(prevPromise, placeName) {
        if (!placeName || !placeName.trim()) {
            return Promise.resolve(true);
        }

        /* eslint-disable no-console */
        return prevPromise.then(_ => GeocodePlacesService.getCoordinatesByName(placeName, area)
            .then(coordinate => {
                console.log(JSON.stringify({
                    placeName: placeName,
                    coordinate: coordinate
                }));
                return placeNameToCoordinate[placeName] = coordinate
            })).catch(console.error);
        /* eslint-enable no-console */
    }

    places.reduce(mapNameToCoordinate, Promise.resolve(true)).then(writeToAFile);
});
