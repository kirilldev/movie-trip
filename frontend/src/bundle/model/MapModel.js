//TODO: find a way to import in a variable instead of window
//Update to marker cluster plus.
require('js-marker-clusterer'); // window.MarkerClusterer

const MarkerWithLabel = require('markerwithlabel');
const markerDefaultImage = require('img/icon/marker-default.png');
const markerSelectedImage = require('img/icon/marker-selected.png');

//It is ugly, but marker cluster forces me to do it..
const markerClusterOptions = {
    imagePath: '/assets/img/marker/m'
};

//removes all places from a google map
const disablePoiStyle = [
    {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [
            {
                visibility: 'off'
            }
        ]
    }
];

//TODO: Consider splitting that class to more entities.
//Maybe directions related stuff is a good candidate?

/**
 * It responsible for all manipulations with
 * google maps API and map rendering.
 * contains state of rendered map.
 */
class MapModel {

    constructor(gmapAPI, element, center, onMarkerClicked) {
        this._initialView = {
            zoom: 13,
            center: center
        };

        const map = new gmapAPI.Map(element, {
            zoom: this._initialView.zoom,
            center: this._initialView.center,
            mapTypeId: gmapAPI.MapTypeId.TERRAIN,
            disableDefaultUI: true,
            zoomControl: true,
            streetViewControl: true,
            styles: disablePoiStyle
        });

        this._private = {
            gmapAPI: gmapAPI,
            directionsDisplay: null,
            markerCluster: null,
            map: map
        };

        this.onMarkerClicked = onMarkerClicked;

        this.markers = [];
        this.selectedPlaces = [];
        this.trip = {
            distance: 0,
            time: 0
        };
    }

    resetCamera() {
        this._private.map.setCenter(this._initialView.center);
        this._private.map.setZoom(this._initialView.zoom);
    }

    /**
     *
     * @param points Object with has the next format
     *  {
     *      'Point name' : {lat: 11, lng: 11}
     *      ...
     *  }
     */
    setMarkers(points) {
        const markers = [];

        Object.keys(points).forEach(name => {
            if (!name || !points[name]) {
                return;
            }

            const markerParams = {
                position: points[name],
                draggable: false,
                map: this._private.map,
                icon: createMarkerIcon(this._private.gmapAPI, false),
                labelContent: name,
                labelAnchor: new this._private.gmapAPI.Point(24, 0),
                labelClass: 'MapMarkerLabel',
            };

            const marker = new (MarkerWithLabel(this._private.gmapAPI))(markerParams);

            markers.push(marker);

            const onMarkerClicked = this.onMarkerClicked;

            this._private.gmapAPI.event.addListener(marker, 'click', function () {
                onMarkerClicked(this);
            });
        });

        this._private.markerCluster = new window.MarkerClusterer(
            this._private.map, markers, markerClusterOptions);

        this.markers = markers;
    }

    updateMarkersVisibility(isVisible) {
        this._private.markerCluster.clearMarkers();

        const visibleMarkers = this.markers.filter(marker => isVisible(marker));

        this._private.markerCluster.addMarkers(visibleMarkers);
    }

    isSelectedPlace(marker) {
        return this.selectedPlaces.includes(marker);
    }

    togglePlaceSelection(marker) {
        if (this.isSelectedPlace(marker)) {
            this.deselectPlace(marker);
        } else {
            this.selectPlace(marker);
        }
    }

    selectPlace(marker) {
        marker.setIcon(createMarkerIcon(this._private.gmapAPI, true));
        this.selectedPlaces.push(marker);
    }

    deselectPlace(marker) {
        marker.setIcon(createMarkerIcon(this._private.gmapAPI));
        this.selectedPlaces = this.selectedPlaces.filter(p => p !== marker);
    }

    removeRouteFromMap(isClearRouteInfo) {
        if (this._private.directionsDisplay !== null) {
            this._private.directionsDisplay.setMap(null);
        }

        this._private.directionsDisplay = new this._private.gmapAPI.DirectionsRenderer({
            suppressMarkers: true,
            preserveViewport: true
        });

        this._private.directionsDisplay.setMap(this._private.map);

        if (isClearRouteInfo) {
            this.trip = {
                distance: 0,
                time: 0
            };
        }
    }

    ///TODO:
    // The maximum number of waypoints allowed when using the
    // Directions service in the Google Maps JavaScript API is 23, plus the origin and destination.
    // https://developers.google.com/maps/documentation/javascript/directions#GeocodedWaypoints
    calculateAndDisplayRoute() {
        const self = this;

        self.removeRouteFromMap(true);

        const waypoints = self.selectedPlaces.map(marker => {
            return {
                location: {
                    lat: marker.position.lat(),
                    lng: marker.position.lng()
                },
                stopover: true
            };
        });

        if (waypoints.length < 2) {
            return Promise.resolve(self.trip);
        }

        return requestRouteData(self._private.gmapAPI, waypoints).then(data => {
            //TODO: think about sybmols
            self._private.directionsDisplay.setDirections(data);
            self.trip = getRouteInfo(data.routes[0]);
            return self.trip;
        });
    }
}

function requestRouteData(gmapAPI, waypoints) {
    const routeParams = {
        origin: waypoints[0].location,
        destination: waypoints[waypoints.length - 1].location,
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: 'DRIVING'
    };

    return new Promise(resolve => {
        const responseHandler = (response, status) => {
            if (status !== 'OK') {
                throw new Error('Directions request failed due to ' + status);
            }

            resolve(response);
        };

        (new gmapAPI.DirectionsService()).route(routeParams, responseHandler);
    });
}

function getRouteInfo(route) {
    const routeSegments = route.legs.map(x => ({
        distance: x.distance.value, //meters
        time: x.duration.value //seconds
    }));

    return {
        distance: routeSegments.reduce((total, segment) => total + segment.distance, 0),
        time: routeSegments.reduce((total, segment) => total + segment.time, 0),
    };
}

function createMarkerIcon(gmapAPI, isSelected) {
    return new gmapAPI.MarkerImage(
        isSelected ? markerSelectedImage : markerDefaultImage,
        null, /* size is determined at runtime */
        null, /* origin is 0,0 */
        null, /* anchor is bottom center of the scaled image */
        new gmapAPI.Size(25, 38)
    );
}

module.exports = MapModel;
