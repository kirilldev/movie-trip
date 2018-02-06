/**
 * Service uses Google Maps API. Read more about geocoding:
 * https://developers.google.com/maps/documentation/javascript/geocoding
 */
const GoogleMapsAPI = require('googlemaps');
const GOOGLE_API_KEY = require('../../common/props.js').GOOGLE_API_KEY;

const publicConfig = {
    key: GOOGLE_API_KEY,
    stagger_time: 1000, // for elevationPath
    encode_polylines: false,
    secure: true, // use https
};

const gmAPI = new GoogleMapsAPI(publicConfig);

module.exports = {
    getCoordinatesByName: function (name, aria) {
        return new Promise(resolve => {
            const geocodeParams = {
                address: name + ' ' + aria, //force location
                componentRestrictions: {
                    country: 'US',
                    administrativeArea: aria,
                },
                'language': 'en',
            };

            gmAPI.geocode(geocodeParams, function (err, result) {
                if (err) {
                   throw err;
                }

                const geometry = ((result.results || [])[0] || {}).geometry;
                resolve(geometry ? geometry.location : null);
            });
        });
    }
};