const template = require('!raw-loader!./RootComponent.html');
const tripIcon = require('../../../../img/icon-trip.png');
const filterIcon = require('../../../../img/icon-filter.png');

require('./RootComponent.css');

module.exports = {
    template: template,
    bindings: {},
    controller: function () {
        'ngInject';

        const self = this;

        self.tabNavConfig = [{
            active: true,
            title: 'My Trip',
            tabId: 'my-trip',
            img: tripIcon
        }, {
            title: 'Filters',
            tabId: 'filters',
            img: filterIcon
        }];

        self.filterTypes = [
            ['byActor', 'By Starring Actor'],
            ['byDirector', 'By Movie Director'],
            ['byTitle', 'By Movie Title'],
            ['byWriter', 'By Scriptwriter'],
        ];

        self.filterData = createEmptyFilterData(self.filterTypes);

        self.selectedPlaces = ['Facebook HQ', 'Whatever Mocked Place With some really long name'];

        self.removeFilterValue = function (key, value) {
            if (value) {
                self.filterData[key].values
                    = self.filterData[key].values.filter(v => v !== value);
            } else {
                self.filterData[key].values = [];
            }
        };

        function createEmptyFilterData(filterTypes) {
            const filterData = {};

            filterTypes.forEach(([type, label]) => {
                filterData[type] = {
                    label: label,
                    values: []
                }
            });

            return filterData;
        }
    }
};