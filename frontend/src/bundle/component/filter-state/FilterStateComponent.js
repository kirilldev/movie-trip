const template = require('./FilterStateComponent.tpl.html');

/**
 * Displays all applied filter to the map
 */
module.exports = {
    template: template,
    bindings: {
        filterData: '<',
        onRemove: '='
    },
    controller: function () {
        'ngInject';

        this.$onChanges = () => {
            const hasValueInArr = (k, data) => (data[k].values || []).length;
            this.keys = Object.keys(this.filterData).sort((a, b) => a > b ? 1 : -1);
            this.isFilterEnabled = this.keys.some(k => hasValueInArr(k, this.filterData));
        };
    }
};