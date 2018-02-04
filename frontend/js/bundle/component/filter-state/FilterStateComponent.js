const template = require('!raw-loader!./FilterStateComponent.html');

require('./FilterStateComponent.css');

module.exports = {
    template: template,
    transclude: true,
    bindings: {
        filterData: '<',
        onRemove: '='
    },
    controller: function () {
        'ngInject';

        this.$onChanges = () => {
            const hasValueInArr = (k, data) => (data[k].values || []).length;
            this.keys = Object.keys(this.filterData).sort((a, b) => a > b ? 1 : -1);
            console.log(this.filterData);
            this.isFilterEnabled = this.keys.some(k => hasValueInArr(k, this.filterData));
        };
    }
};