const GoogleMapsAPI = require('googlemaps');
const GOOGLE_API_KEY = require('../props.js').GOOGLE_API_KEY;

const publicConfig = {
    key: GOOGLE_API_KEY,
    stagger_time: 1000, // for elevationPath
    encode_polylines: false,
    secure: true, // use https
};

const gmAPI = new GoogleMapsAPI(publicConfig);

//https://developers.google.com/maps/documentation/geocoding/intro
module.exports = {
    getCoordinatesByName: function (name) {
        return new Promise((resolve, reject) => {
            const geocodeParams = {
                'address': name,
                'components': 'components=country:US|administrative_area:California',
                'language': 'en',
            };

            gmAPI.geocode(geocodeParams, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    const geometry = ((result.results || [])[0] || {}).geometry;
                    resolve(geometry ? geometry.location : null);
                }
            });
        });
    }
};