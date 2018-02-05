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
            map: map._map,
            icon: createMarkerIcon(this._gmapAPI, false),
            labelContent: name,
            labelAnchor: new this._gmapAPI.Point(24, 0),
            labelClass: 'MapMarkerLabel',
        };

        const marker = new (MarkerWithLabel(this._gmapAPI))(markerParams);

        markers.push(marker);

        const onMarkerClicked = this.onMarkerClicked;

        this._gmapAPI.event.addListener(marker, "click", function () {
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