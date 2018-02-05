const template = require('!raw-loader!./FilterConfiguratorComponent.html');

require('./FilterConfiguratorComponent.css');

module.exports = {
    template: template,
    transclude: true,
    bindings: {
        filterTypes: '<',
        onApplyFilter: '='
    },
    controller: function (locationsService) {
        'ngInject';

        const self = this;

        self.selectedFilter = {
            type: null,
            value: null,
        };

        self.datasource = [];

        self.onSelectedFilter = function (selectedFilter) {
            self.selectedFilter.value = null;

            locationsService.getRelations().then(relations => {
                self.datasource = relations.getAllTypeValues(selectedFilter);
            });
        };

        self.filterValueChanged = function (value) {
            self.selectedFilter.value = value;
        };

        self.onApplyBtnClicked = function () {
            self.onApplyFilter(self.selectedFilter.type, self.selectedFilter.value);
            self.selectedFilter = {
                type: null,
                value: null,
            };
        };
    }
};