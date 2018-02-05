const angular = require('angular');
const movieTripApp = angular.module('movieTripApp', []);

require('./index.html');
require('normalize.css');
require('./css/Core.scss');
require('./css/Utility.scss');
require('./css/Buttons.scss');

//Config
movieTripApp.config(require('./js/bundle/AppConfig.js'));

//Constants
movieTripApp.constant('mapModel', require('./js/bundle/model/MapModel'));
movieTripApp.constant('relationsModel', require('./js/bundle/model/Relations'));

//Components
movieTripApp.component('filterState', require('./js/bundle/component/filter-state/FilterStateComponent'));
movieTripApp.component('filterConfigurator', require('./js/bundle/component/filter-configurator/FilterConfiguratorComponent'));
movieTripApp.component('tab', require('./js/bundle/component/tab/TabComponent'));
movieTripApp.component('typeahead', require('./js/bundle/component/typeahead/TypeaheadComponent'));
movieTripApp.component('root', require('./js/bundle/component/root/RootComponent'));

//Services
movieTripApp.service('locationsService', require('./js/bundle/service/LocationsService'));

//Run
movieTripApp.run(require('./js/bundle/AppBootstrap.js'));