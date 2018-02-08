const path = require('path');
const Marker = require('../model/Marker.js');

const MarkerController = {};

MarkerController.getAllLocationMarkers = (req, res) => {
    //TODO: implement it and send query data instead of mocked file.
    Marker.getAll(req.params.locationName);
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(path.resolve(__dirname, '../db/Coordinates_in_San_Francisco.json'));
};

module.exports = MarkerController;