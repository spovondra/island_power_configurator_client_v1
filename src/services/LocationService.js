import axios from 'axios';
import { API_LOCATION_URL } from '../config';

const LocationService = {
    calculatePVGISData: (latitude, longitude, angle, aspect) => {
        console.log(`Sending request to calculate PVGIS data with lat: ${latitude}, lng: ${longitude}, angle: ${angle}, aspect: ${aspect}`);
        return axios.get(`${API_LOCATION_URL}/calculatePVGISData`, {
            params: { latitude, longitude, angle, aspect }
        }).then(response => {
            console.log('PVGIS data response:', response.data);
            return response;
        }).catch(error => {
            console.error('Error in calculatePVGISData request:', error);
            throw error;
        });
    },

    fetchOptimalValues: (latitude, longitude) => {
        console.log(`Sending request to fetch optimal values with lat: ${latitude}, lng: ${longitude}`);
        return axios.get(`${API_LOCATION_URL}/fetchOptimalValues`, {
            params: { latitude, longitude }
        }).then(response => {
            console.log('Optimal values response:', response.data);
            return response;
        }).catch(error => {
            console.error('Error in fetchOptimalValues request:', error);
            throw error;
        });
    },

    getMinMaxTemperatures: (latitude, longitude) => {
        console.log(`Sending request to get min/max temperatures with lat: ${latitude}, lng: ${longitude}`);
        return axios.get(`${API_LOCATION_URL}/min-max-temperatures`, {
            params: { latitude, longitude }
        }).then(response => {
            console.log('Min/max temperatures response:', response.data);
            return response;
        }).catch(error => {
            console.error('Error in getMinMaxTemperatures request:', error);
            throw error;
        });
    },

    searchLocation: (locationQuery) => {
        console.log(`Sending request to search location with query: ${locationQuery}`);
        return axios.get('https://nominatim.openstreetmap.org/search', {
            params: { q: locationQuery, format: 'json', limit: 1 }
        }).then(response => {
            console.log('Location search response:', response.data);
            return response;
        }).catch(error => {
            console.error('Error in searchLocation request:', error);
            throw error;
        });
    }
};

export default LocationService;
