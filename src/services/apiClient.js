import axios from 'axios';
import { API_URL } from '../config';

// Helper functions to get tokens from localStorage
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : null;
};

// Get the refresh token
const getRefreshToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.refreshToken : null;
};

// Create axios instance with base URL and default headers
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Helper function to validate the token
const isTokenValid = (token) => {
    if (!token) return false;

    const parts = token.split('.');
    if (parts.length !== 3) return false; // JWT should have 3 parts

    try {
        const payload = JSON.parse(atob(parts[1])); // Decode payload
        const isExpired = payload.exp * 1000 < Date.now(); // Check expiration
        return !isExpired;
    } catch (error) {
        console.error('Token decoding failed:', error);
        return false; // Token is invalid if decoding fails
    }
};

// Request interceptor to add authorization token
apiClient.interceptors.request.use(config => {
    const token = getAuthToken();
    if (isTokenValid(token)) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Log the outgoing request
    console.log('Outgoing request:', config);
    return config;
});

// Axios interceptor to handle responses
apiClient.interceptors.response.use(
    response => {
        // Log the response
        console.log('Response received:', response);
        return response;
    },
    async (error) => {
        if (error.response) {
            // Handle 401 error specifically
            if (error.response.status === 401) {
                const refreshToken = getRefreshToken(); // Get the stored refresh token
                if (refreshToken) {
                    try {
                        // Log the refresh token attempt
                        console.log('Attempting to refresh token without Authorization:', refreshToken);

                        // Send the refresh token request
                        const refreshResponse = await apiClient.post('/auth/refresh-token', null, {
                            params: { refreshToken } // Send the refresh token as a query parameter
                        });

                        // Assuming your response returns a new access token
                        const { jwt } = refreshResponse.data; // Adjust based on your response structure

                        // Update local storage with the new access token
                        const user = JSON.parse(localStorage.getItem('user'));
                        user.token = jwt; // Update the access token
                        localStorage.setItem('user', JSON.stringify(user));

                        // Retry the original request with the new access token
                        error.config.headers['Authorization'] = `Bearer ${jwt}`;
                        return apiClient(error.config);
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                    }
                }
            }
            // Handle other errors by logging the user out
            console.error('Request failed:', error.response);
            localStorage.removeItem('user'); // Remove user data on any other error
            window.location.replace('/login'); // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export default apiClient;
