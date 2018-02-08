const Marker = {};

Marker.getAll = function (locationName) {
    //TODO: do actual call to a db..
    return Promise.resolve(locationName);
};

module.exports = Marker;