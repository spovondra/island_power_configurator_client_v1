import axios from 'axios';

const LocationService = {
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
