const Place = {};

Place.getPlaceDataByName = function (req, res) {
    // TODO: return all interesting data related to a location
    // That api is needed for thing not implemented yet on UI
    // The Idea was that after you click on a map marker you could
    // see fun facts movies actors and photos of that location
    // in a modal window. Currently I just
    // add/remove location from user list on that action.
    res.send('TODO')
};

module.exports = Place;