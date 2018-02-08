class Relations {
    constructor(data) {
        this._private = {
            data: data
        }
    }

    getAllTypeValues(type) {
        return Object.keys(this._private.data.relations[type] || {});
    }

    getRelatedLocations(type, value) {
        const locationIds = this._private.data.relations[type][value];
        return locationIds.map(id => this._private.data.locations[id]);
    }
}

module.exports = Relations;
