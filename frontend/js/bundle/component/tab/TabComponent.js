const template = require('!raw-loader!./TabComponent.html');

require('./TabComponent.css');

//TODO: https://toddmotto.com/angular-1-5-lifecycle-hooks
module.exports = {
    template: template,
    transclude: true,
    bindings: {
        nav: '<',
    },
    controller: function ($element) {
        'ngInject';

        this.$onInit = () => {
            this.active = this.nav.find(e => e.active) || this.nav[0];
        };

        this.$postLink = () => {
            const tabs = $element[0].querySelectorAll('[data-tab-id]');
            this.showHideTabs = showHideTabs.bind(this, tabs);
            this.showHideTabs();
        };

        this.changeTab = (item) => {
            this.active = item;
            this.showHideTabs();
        };

        function showHideTabs(tabs) {
            tabs.forEach(tab => {
                if (this.active.tabId === tab.dataset.tabId) {
                    tab.style.display = 'block'
                } else {
                    tab.style.display = 'none';
                }
            });
        }
    }
};