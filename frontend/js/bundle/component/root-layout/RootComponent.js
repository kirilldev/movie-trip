const template = require('!raw-loader!./RootComponent.html');
const tripIcon = require('../../../../img/icon-trip.png');
const filterIcon = require('../../../../img/icon-filter.png');
const apiFields = require('../../../../../props').API_FIELDS;

require('./RootComponent.css');

module.exports = {
    template: template,
    bindings: {},
    controller: function (locationsService, mapModel) {
        'ngInject';

        const self = this;
        const sanFranciscoLatLng = {lat: 37.774, lng: -122.433};

        let map = null;
        let locationPoints = null;

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

        self.selectedPlaces = [];
        self.travelTime = 0;
        self.travelDistance = 0;

        self.filterTypes = [
            [apiFields.actors, 'By Starring Actor'],
            [apiFields.director, 'By Movie Director'],
            [apiFields.title, 'By Movie Title'],
            [apiFields.writer, 'By Scriptwriter'],
        ];

        self.filterData = createEmptyFilterData(self.filterTypes);

        self.removeSelectedPlace = function (place) {
            self.selectedPlaces = self.selectedPlaces.filter(p => p !== place);
        };

        self.addFilterValue = function (key, value) {
            self.filterData[key].values.push(value);
            self.filterData = Object.assign({}, self.filterData);

            locationsService.getRelations().then(relations => {
                const visibleNames = getVisibleNames(self.filterData, relations);
                map.updateMarkersVisibility(m => visibleNames[m.title]);

                //TODO: It would be nice if camera zooms out to fit all points instead of reset
                map.resetCamera();
            });
        };

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

        window.googleMapsAPILoader.listen(gmapAPI => {
            map = new mapModel(gmapAPI, document.getElementById('map'), sanFranciscoLatLng);

            locationsService.getHeatMapData().then(points => {
                locationPoints = points;
                map.setMarkers(points);
            });
        });

        function getVisibleNames(filterSetup, relations) {
           // console.log(filterSetup, relations);
            return {
                '200 Block of Sansome Street (Financial District)': true
            }
        }
    }
};