const fs = require('fs');
const apiFields = require('common/const/enum.js').API_FIELDS;
const parse = require('csv-parse/lib/sync');
const Relations = require('../model/Relations');

const RelationsController = {};

RelationsController.getAllLocationRelations = (req, res) => {
    //TODO: handle db response and remove and remove mocked one
    Relations.getAll(req.params.locationName);
    sendMockedResponse(res);
};

//TODO: remove that functions once db call is implemented
function sendMockedResponse(res) {
    fs.readFile('./db/Film_Locations_in_San_Francisco.csv', 'utf8', function (err, contents) {
        if (err) {
            throw err;
        }

        const [/*headerRow*/, ...rows] = parse(contents);

        const data = rows.map(row => {
            return row.slice(0, 8)
                .concat([row.slice(8).filter(r => r.trim())]);
        });

        res.json(mapLocations(data));
    });
}

function mapLocations(rows) {
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
                });
            });
        }
    });

    return response;
}

module.exports = RelationsController;