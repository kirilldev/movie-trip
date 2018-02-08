const template = require('./FilterConfiguratorComponent.tpl.html');

module.exports = {
    template: template,
    bindings: {
        filterTypes: '<',
        filterData: '<',
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
            const excludeValues = new Set(self.filterData[selectedFilter].values);
            self.selectedFilter.value = null;

            locationsService.getRelations().then(relations => {
                self.datasource = relations.getAllTypeValues(selectedFilter)
                    .filter(value => !excludeValues.has(value));
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