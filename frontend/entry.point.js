const angular = require('angular');
const movieTripApp = angular.module('movieTripApp', []);

require('googlemaps-v3-utility-library/markerclusterer/src/markerclusterer');

require('./index.html');
require('normalize.css');
require('./css/Core.css');
require('./css/Buttons.scss');

//Config
movieTripApp.config(require('./js/bundle/AppConfig.js'));

//Components
movieTripApp.component('filterState', require('./js/bundle/component/filter-state/FilterStateComponent'));
movieTripApp.component('filterConfigurator', require('./js/bundle/component/filter-configurator/FilterConfiguratorComponent'));
movieTripApp.component('tab', require('./js/bundle/component/tab/TabComponent'));
movieTripApp.component('typeahead', require('./js/bundle/component/typeahead/TypeaheadComponent'));
movieTripApp.component('rootLayout', require('./js/bundle/component/root-layout/RootComponent'));

//Run
movieTripApp.run(require('./js/bundle/AppBootstrap.js'));