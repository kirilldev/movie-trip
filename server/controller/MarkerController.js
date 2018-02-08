const path = require('path');

const MarkerController = {};

MarkerController.getAllLocationMarkers = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(path.resolve(__dirname, '../db/Coordinates_in_San_Francisco.json'));
};

module.exports = MarkerController;