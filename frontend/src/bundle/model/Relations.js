/**
 * Model represents relations between such entries as
 * locations to movie name, locations to actor name e.t.c.
 * Wraps optimized server data structure (needed to reduce bandwidth).
 */
class Relations {
    constructor(data) {
        this._private = {
            data: data
        };
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
