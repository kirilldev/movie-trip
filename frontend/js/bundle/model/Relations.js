function Relations(data) {
    this.data = data;
}

Relations.prototype.getAllTypeValues = function (type) {
    return Object.keys(this.data.relations[type] || {});
};

Relations.prototype.getRelatedLocations = function (type, value) {
    const locationIds = this.data.relations[type][value];
    return locationIds.map(id=> this.data.locations[id]);
};

module.exports = Relations;