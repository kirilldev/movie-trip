const template = require('!raw-loader!./FilterConfiguratorComponent.html');

require('./FilterConfiguratorComponent.css');

module.exports = {
    template: template,
    transclude: true,
    bindings: {
        filterTypes: '<',
    },
    controller: function () {
        'ngInject';

        this.selectedFilter = null;

        this.onSelectedFilter = function (selectedFilter) {
            console.log(selectedFilter)
        }
    }
};