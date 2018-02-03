module.exports = function ($rootScope, $http) {
    'ngInject';

    $rootScope.getBodyClasses = () => ({
        'menu-unavailable': isMenuUnavailable(),
        'menu-active': $rootScope.nav.menuActive,
        'ie11': isIE11,
    });

    window.googleMapsAPILoader.listen(gmapAPI => {
        const disablePoiStyle = [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [
                    {visibility: "off"}
                ]
            }
        ];

        var sanFrancisco = new google.maps.LatLng(37.774546, -122.433523);

        const map = new gmapAPI.Map(document.getElementById('map'), {
            zoom: 13,
            center: sanFrancisco,
            mapTypeId: gmapAPI.MapTypeId.TERRAIN,
            disableDefaultUI: true,
            zoomControl: true,
            streetViewControl: true,
            styles: disablePoiStyle
        });

        $http.get('/api/heatmap').then(res => {
            const points = res.data;
            const markers = [];
            Object.keys(points).forEach(name => {
                if (!name || !points[name]) {
                    return;
                }

                markers.push(new google.maps.Marker({
                    position: points[name],
                    map: map,
                    title: name,
                    animation:google.maps.Animation.DROP
                }));
            });

            var markerCluster = new MarkerClusterer(map, markers,
                {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});


            // const heatmapPpoints = Object.values(points).filter(point => point).map(point => {
            //     return new gmapAPI.LatLng(point.lat, point.lng);
            // });
            //
            // const heatmap = new gmapAPI.visualization.HeatmapLayer({
            //     data: heatmapPpoints,
            //     maxIntensity: 6,
            //     map: map
            // });
            //
            // // heatmap.set('opacity', 1);
            // heatmap.set('radius', 20);
        });
    })
};


//TODO: add point weight


// function initMap() {
//     var directionsService = new google.maps.DirectionsService;
//     var directionsDisplay = new google.maps.DirectionsRenderer;
//     var map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 6,
//         center: {lat: 41.85, lng: -87.65}
//     });
//     directionsDisplay.setMap(map);
//
//     document.getElementById('submit').addEventListener('click', function() {
//         calculateAndDisplayRoute(directionsService, directionsDisplay);
//     });
// }
//
// function calculateAndDisplayRoute(directionsService, directionsDisplay) {
//     var waypts = [];
//     var checkboxArray = document.getElementById('waypoints');
//     for (var i = 0; i < checkboxArray.length; i++) {
//         if (checkboxArray.options[i].selected) {
//             waypts.push({
//                 location: checkboxArray[i].value,
//                 stopover: true
//             });
//         }
//     }
//
//     directionsService.route({
//         origin: document.getElementById('start').value,
//         destination: document.getElementById('end').value,
//         waypoints: waypts,
//         optimizeWaypoints: true,
//         travelMode: 'DRIVING'
//     }, function(response, status) {
//         if (status === 'OK') {
//             directionsDisplay.setDirections(response);
//             var route = response.routes[0];
//             var summaryPanel = document.getElementById('directions-panel');
//             summaryPanel.innerHTML = '';
//             // For each route, display summary information.
//             for (var i = 0; i < route.legs.length; i++) {
//                 var routeSegment = i + 1;
//                 summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
//                     '</b><br>';
//                 summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
//                 summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
//                 summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
//             }
//         } else {
//             window.alert('Directions request failed due to ' + status);
//         }
//     });
// }