import axios from 'axios';

/**
 * Service for handling location-related requests using OpenStreetMap's Nominatim API.
 *
 * @module LocationService
 */

/**
 * Sends a request to search for a location by query.
 *
 * @function searchLocation
 * @memberof LocationService
 * @param {string} locationQuery - The location query string (e.g., city name, address).
 * @returns {Promise} Axios response containing the location data.
 * @throws {Error} Throws an error if the request fails.
 */
const LocationService = {
    /**
     * Sends a request to search for a location by query.
     *
     * @async
     * @function
     * @param {string} locationQuery - The location query string (e.g., city name, address).
     * @returns {Promise} Axios response containing the location data.
     * @throws {Error} Throws an error if the request fails.
     */
    searchLocation: (locationQuery) => {
        console.log(`Sending request to search location with query: ${locationQuery}`);

        return axios.get('https://nominatim.openstreetmap.org/search', {
            params: { q: locationQuery, format: 'json', limit: 1 }
        })
            .then(response => {
                console.log('Location search response:', response.data);
                return response;
            })
            .catch(error => {
                console.error('Error in searchLocation request:', error);
                throw error;
            });
    }
};

export default LocationService;
