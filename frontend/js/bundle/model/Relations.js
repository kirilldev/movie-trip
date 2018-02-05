function Relations(data) {
    this.data = data;
}

Relations.prototype.getAllTypeValues = function (type) {
    return Object.keys(this.data.relations[type]);
};

module.exports = Relations;