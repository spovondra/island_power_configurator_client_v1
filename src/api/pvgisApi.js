import axios from 'axios';

const API_BASE_URL = 'http://localhost:80/api';

// Funkce pro výpočet PVGIS dat
export const calculatePVGISData = (latitude, longitude, angle, aspect) => {
    return axios.get(`${API_BASE_URL}/calculatePVGISData`, {
        params: { latitude, longitude, angle, aspect }
    });
};

// Funkce pro získání optimálních hodnot
export const fetchOptimalValues = (latitude, longitude) => {
    return axios.get(`${API_BASE_URL}/fetchOptimalValues`, {
        params: { latitude, longitude }
    });
};
