const clusterImgUrl = 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m';

require('js-marker-clusterer'); // window.MarkerClusterer
const MarkerWithLabel = require('markerwithlabel');

const disablePoiStyle = [
    {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [
            {visibility: 'off'}
        ]
    }
];

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

        const marker = new (MarkerWithLabel(this._gmapAPI))({
            position: points[name],
            draggable: false,
            map: map._map,
            labelContent: name,
            labelAnchor: new this._gmapAPI.Point(30, 0),
            labelClass: 'MapMarkerLabel',
        });

        markers.push(marker);

        const onMarkerClicked = this.onMarkerClicked;

        this._gmapAPI.event.addListener(marker, "click", function () {
            onMarkerClicked(this);
        });
    });

    this._markerCluster = new window.MarkerClusterer(this._map, markers, {
        imagePath: clusterImgUrl
    });

    this.markers = markers;
};

// MapModel.prototype.clearMarkers = function () {
//     this._markerCluster.clearMarkers();
//     console.log(this._markerCluster);
// };

MapModel.prototype.updateMarkersVisibility = function (isVisible) {
    this._markerCluster.clearMarkers();

    const visibleMarkers = this.markers.filter(marker => isVisible(marker));

    this._markerCluster.addMarkers(visibleMarkers);
};

//clearMarkers()
module.exports = MapModel;