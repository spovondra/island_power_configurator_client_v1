import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:80/api/calculations/';

// Get token from local storage
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : null;
};

// Axios instance with default headers
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Attach token to every request
apiClient.interceptors.request.use(config => {
    const token = getAuthToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // Unauthorized error, log out the user
            authService.logout();
        }
        return Promise.reject(error);
    }
);

export const calculateLoad = async (data) => {
    try {
        const response = await apiClient.post('/load', data);
        return response.data;
    } catch (error) {
        console.error('API request error:', error);
        throw new Error('Error fetching data from API');
    }
};
