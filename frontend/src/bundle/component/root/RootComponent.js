const template = require('./RootComponent.tpl.html');
const tripIcon = require('img/icon/icon-trip.png');
const filterIcon = require('img/icon/icon-filter.png');

module.exports = {
    template: template,
    bindings: {},
    controller: function (locationsService, mapModel, $scope, apiFields, gmapAPI) {
        'ngInject';

        const self = this;
        const sanFranciscoLatLng = {lat: 37.774, lng: -122.433};

        self.map = {
            trip: {
                distance: 0,
                time: 0
            }
        };

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
            [apiFields.actors, 'By Starring Actor'],
            [apiFields.director, 'By Movie Director'],
            [apiFields.title, 'By Movie Title'],
            [apiFields.writer, 'By Scriptwriter'],
        ];

        self.filterData = createEmptyFilterData(self.filterTypes);

        self.removeSelectedPlace = function (place) {
            self.map.deselectPlace(place);
            self.map.calculateAndDisplayRoute().then(() => $scope.$apply());
        };

        self.addFilterValue = function (key, value) {
            self.filterData[key].values.push(value);

            self.filterData = Object.assign({}, self.filterData);
            locationsService.getRelations().then(updateMap);
        };

        self.removeFilterValue = function (key, value) {
            if (value) {
                self.filterData[key].values
                    = self.filterData[key].values.filter(v => v !== value);
            } else {
                self.filterData[key].values = [];
            }

            self.filterData = Object.assign({}, self.filterData);
            locationsService.getRelations().then(updateMap);
        };

        function updateMap(relations) {
            const [isAllVisible, visibleNames] = getVisibleNames(self.filterData, relations);
            self.map.updateMarkersVisibility(m => isAllVisible || visibleNames[m.labelContent]);

            //TODO: It would be nice if camera zooms out to fit all points instead of reset
            self.map.resetCamera();
        }

        function createEmptyFilterData(filterTypes) {
            const filterData = {};

            filterTypes.forEach(([type, label]) => {
                filterData[type] = {
                    label: label,
                    values: []
                };
            });

            return filterData;
        }

        self.map = new mapModel(gmapAPI,
            document.getElementById('map'),
            sanFranciscoLatLng,
            handleMarkerClick);

        locationsService.getHeatMapData().then(points => {
            self.map.setMarkers(points);
        });

        function handleMarkerClick(marker) {
            const isSelected = self.map.isSelectedPlace(marker);
            let questionTxt = '';

            if (isSelected) {
                questionTxt = 'Are you sure want to remove "'
                    + marker.labelContent + '" from your trip?';
            } else {
                questionTxt = 'Are you sure want to add "'
                    + marker.labelContent + '" to your trip?';
            }

            if (confirm(questionTxt)) {
                self.map.togglePlaceSelection(marker);
                self.map.calculateAndDisplayRoute().then(() => $scope.$apply());
                $scope.$apply();
            }
        }

        function getVisibleNames(filterSetup, relations) {
            const filterKeys = getNotEmptyKeys(filterSetup);
            const out = {};

            if (!filterKeys.length) {
                return [true];
            }

            filterKeys.forEach(key => {
                filterSetup[key].values.forEach(value => {
                    const locationNames = relations.getRelatedLocations(key, value);
                    locationNames.forEach(name => out[name] = true);
                });
            });

            return [false, out];
        }

        function getNotEmptyKeys(filterSetup) {
            return Object.keys(filterSetup)
                .filter(key => (filterSetup[key].values || []).length);
        }
    }
};
