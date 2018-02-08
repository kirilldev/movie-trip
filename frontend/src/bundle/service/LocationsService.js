module.exports = function ($http, $q, relationsModel) {
    'ngInject';

    //TODO: When we will have switch location feature we will store
    // in cache only location which is currently on a screen
    let cachedData = null;

    this.getRelations = function () {
        if (cachedData) {
            $q.resolve(cachedData);
        }

        return $http({
            url: '/api/relations/',
        }).then(res => {
            cachedData = new relationsModel(res.data);
            return cachedData;
        });
    };

    this.getHeatMapData = function () {
        return $http.get('/api/markers/').then(res => res.data);
    };
};
