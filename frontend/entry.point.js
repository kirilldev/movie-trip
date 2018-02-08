const angular = require('angular');
const movieTripApp = angular.module('movieTripApp', []);

require('normalize.css');
require('./index.html');
require('./css/Core.scss');
require('./css/Utility.scss');
require('./css/Buttons.scss');

//Config
movieTripApp.config(require('./src/bundle/AppConfig.js'));

//Constants
movieTripApp.constant('mapModel', require('./src/bundle/model/MapModel'));
movieTripApp.constant('relationsModel', require('./src/bundle/model/Relations'));
movieTripApp.constant('apiFields', require('../common/enum').API_FIELDS);
movieTripApp.factory('gmapAPI', () => window.google.maps);

//Components
movieTripApp.component('filterState', require('./src/bundle/component/filter-state'));
movieTripApp.component('filterConfigurator', require('./src/bundle/component/filter-configurator'));
movieTripApp.component('tab', require('./src/bundle/component/tab'));
movieTripApp.component('typeahead', require('./src/bundle/component/typeahead'));
movieTripApp.component('root', require('./src/bundle/component/root'));

//Services
movieTripApp.service('locationsService', require('./src/bundle/service/LocationsService'));

//Run
movieTripApp.run(require('./src/bundle/AppBootstrap.js'));