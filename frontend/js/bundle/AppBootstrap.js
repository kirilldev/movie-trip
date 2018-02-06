module.exports = function (locationsService) {
    'ngInject';

    //prefetch
    locationsService.getRelations().catch(console.log);
};
