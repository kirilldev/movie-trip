//TODO: find a way to import in a variable instead of window
require('js-marker-clusterer'); // window.MarkerClusterer

const MarkerWithLabel = require('markerwithlabel');
const markerDefaultImage = require('../../../img/marker-default.png');
const markerSelectedImage = require('../../../img/marker-selected.png');

const markerClusterOptions = {
    //TODO: host own pictures
    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
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

/**
 *
 * @param gmapAPI
 * @param element
 * @param center
 * @param onMarkerClicked
 * @constructor
 */
function MapModel(gmapAPI, element, center, onMarkerClicked) {
    this._gmapAPI = gmapAPI;
    this._directionsDisplay = null;
    this._markerCluster = null;
    this._initialView = {
        zoom: 13,
        center: center
    };

    this.onMarkerClicked = onMarkerClicked;

    this._map = new gmapAPI.Map(element, {
        zoom: this._initialView.zoom,
        center: this._initialView.center,
        mapTypeId: gmapAPI.MapTypeId.TERRAIN,
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: true,
        styles: disablePoiStyle
    });

    this.markers = [];
    this.selectedPlaces = [];
    this.trip = {
        distance: 0,
        time: 0
    };
}

MapModel.prototype.resetCamera = function () {
    this._map.setCenter(this._initialView.center);
    this._map.setZoom(this._initialView.zoom);
};

MapModel.prototype.setMarkers = function (points) {
    const markers = [];

    Object.keys(points).forEach(name => {
        if (!name || !points[name]) {
            return;
        }

        const markerParams = {
            position: points[name],
            draggable: false,
            map: this._map,
            icon: createMarkerIcon(this._gmapAPI, false),
            labelContent: name,
            labelAnchor: new this._gmapAPI.Point(24, 0),
            labelClass: 'MapMarkerLabel',
        };

        const marker = new (MarkerWithLabel(this._gmapAPI))(markerParams);

        markers.push(marker);

        const onMarkerClicked = this.onMarkerClicked;

        this._gmapAPI.event.addListener(marker, 'click', function () {
            onMarkerClicked(this);
        });
    });

    this._markerCluster = new window.MarkerClusterer(this._map, markers, markerClusterOptions);

    this.markers = markers;
};

MapModel.prototype.updateMarkersVisibility = function (isVisible) {
    this._markerCluster.clearMarkers();

    const visibleMarkers = this.markers.filter(marker => isVisible(marker));

    this._markerCluster.addMarkers(visibleMarkers);
};

MapModel.prototype.isSelectedPlace = function (marker) {
    return this.selectedPlaces.includes(marker);
};

MapModel.prototype.togglePlaceSelection = function (marker) {
    if (this.isSelectedPlace(marker)) {
        this.deselectPlace(marker);
    } else {
        this.selectPlace(marker);
    }
};

MapModel.prototype.selectPlace = function (marker) {
    marker.setIcon(createMarkerIcon(this._gmapAPI, true));
    this.selectedPlaces.push(marker);
};

MapModel.prototype.deselectPlace = function (marker) {
    marker.setIcon(createMarkerIcon(this._gmapAPI));
    this.selectedPlaces = this.selectedPlaces.filter(p => p !== marker);
};


MapModel.prototype.removeRouteFromMap = function (isClearRouteInfo) {
    if (this._directionsDisplay !== null) {
        this._directionsDisplay.setMap(null);
    }

    this._directionsDisplay = new this._gmapAPI.DirectionsRenderer({
        suppressMarkers: true,
        preserveViewport: true
    });

    this._directionsDisplay.setMap(this._map);

    if (isClearRouteInfo) {
        this.trip = {
            distance: 0,
            time: 0
        };
    }
};

// The maximum number of waypoints allowed when using the
// Directions service in the Google Maps JavaScript API is 23, plus the origin and destination.
// https://developers.google.com/maps/documentation/javascript/directions#GeocodedWaypoints
MapModel.prototype.calculateAndDisplayRoute = function () {
    const self = this;

    this.removeRouteFromMap(true);

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

    return requestRouteData(this._gmapAPI, waypoints).then(data => {
        self._directionsDisplay.setDirections(data);
        self.trip = getRouteInfo(data.routes[0]);
        return self.trip;
    });
};

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