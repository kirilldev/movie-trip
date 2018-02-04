const template = require('!raw-loader!./FilterConfiguratorComponent.html');

require('./FilterConfiguratorComponent.css');

module.exports = {
    template: template,
    transclude: true,
    bindings: {
        filterTypes: '<',
        onApplyFilter: '='
    },
    controller: function () {
        'ngInject';

        const self = this;

        self.selectedFilter = {
            type: null,
            value: null,
        };

        self.datasource = ['usa', 'smth else', 'sdass', 'xxxx', 'zzz', 'rxtra'];

        self.onSelectedFilter = function (selectedFilter) {
            // TODO: change value selection view;
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