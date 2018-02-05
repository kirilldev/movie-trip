const template = require('!raw-loader!./TypeaheadComponent.html');

require('./TypeaheadComponent.css');

// TODO: improve UX, highlight match in a list.
// TODO: add possibility to chose first entry in a list with a tab key.
// TODO: add possibility to navigate in a list via keyboard or scroll.
// TODO: implement case when forceListValue === 'false'.
// TODO: provide default values for some params.
module.exports = {
    template: template,
    bindings: {
        datasource: '<',
        limitList: '<',
        forceListValue: '<',
        onUpdated: '='
    },
    controller: function () {
        'ngInject';

        const self = this;

        self.filterdValues = [];
        self.hasFocus = false;
        self.inputValue = '';

        self.$onChanges = function () {
            self.datasource.sort((a, b) => a > b ? 1 : -1);
            self.filterdValues = self.datasource;
        };

        self.selectValue = (value) => self.inputValue = value;

        // TODO: optimize, for cases when it is enough to search in filterdValues array
        self.onInputChanged = () => {
            const lowerCaseInput = self.inputValue.toLowerCase().trim();
            self.filterdValues = self.datasource.filter(value => value.toLowerCase().includes(lowerCaseInput));

            if (self.filterdValues.length === 1
                && self.filterdValues[0] === self.inputValue) {
                self.filterdValues = [];
                self.onUpdated(self.inputValue);
            }
        };

        self.onBlur = function () {
            self.hasFocus = false;

            if (!self.datasource.includes(self.inputValue)) {
                self.inputValue = '';
            }

            self.onUpdated(self.inputValue);
        }
    }
};