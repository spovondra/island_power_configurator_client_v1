import axios from 'axios';
import { API_URL } from '../config';

/**
 * This module provides an axios instance for making API requests with token management and automatic token refresh.
 * It includes functions to retrieve authentication and refresh tokens, check token validity, and handle request/response interception for token management.
 *
 * @module apiClient
 */

/**
 * Retrieves the authentication token from localStorage.
 *
 * @function getAuthToken
 * @returns {string|null} The authentication token, or null if not available.
 */
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : null;
};

/**
 * Retrieves the refresh token from localStorage.
 *
 * @function getRefreshToken
 * @returns {string|null} The refresh token, or null if not available.
 */
const getRefreshToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.refreshToken : null;
};

/**
 * Creates an axios instance configured with default headers.
 *
 * @const apiClient
 * @type {AxiosInstance}
 */
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Checks if a given JWT token is valid and not expired.
 *
 * @function isTokenValid
 * @param {string} token - The JWT token to be validated.
 * @returns {boolean} True if the token is valid, false otherwise.
 */
const isTokenValid = (token) => {
    if (!token) return false;

    const parts = token.split('.');
    if (parts.length !== 3) return false; // JWT has 3 parts

    try {
        const payload = JSON.parse(atob(parts[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        return !isExpired;
    } catch (error) {
        console.error('Token decoding failed:', error);
        return false;
    }
};

/**
 * Axios interceptor for adding Authorization headers with the valid token.
 *
 * @function
 * @param {object} config - The request configuration object.
 * @returns {object} The modified request configuration with Authorization header if token is valid.
 */
apiClient.interceptors.request.use(config => {
    const token = getAuthToken();
    if (isTokenValid(token)) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

/**
 * Axios response interceptor for handling token expiration and refreshing.
 *
 * @function
 * @param {object} response - The response object from the API.
 * @returns {object} The response data.
 * @throws {Promise} If an error occurs, the promise will be rejected.
 */
apiClient.interceptors.response.use(
    response => {
        return response;
    },
    async (error) => {
        if (error.response && error.response.status === 401) {
            const originalRequest = error.config;

            if (!originalRequest._retry) {
                originalRequest._retry = true;

                const refreshToken = getRefreshToken();

                if (refreshToken) {
                    try {
                        /* Attempt to refresh the token */
                        console.log('Attempting to refresh token:', refreshToken);

                        const refreshResponse = await axios.post(`${API_URL}/auth/refresh-token`, null, {
                            params: { refreshToken }
                        });

                        const { jwt } = refreshResponse.data;
                        const user = JSON.parse(localStorage.getItem('user'));
                        user.token = jwt;
                        localStorage.setItem('user', JSON.stringify(user));
                        originalRequest.headers['Authorization'] = `Bearer ${jwt}`;

                        return apiClient(originalRequest);

                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                        localStorage.removeItem('user');
                    }
                }
            }

            console.error('Token refresh failed or already retried, logging out.');
            localStorage.removeItem('user');
            window.location.replace('/login'); //move back to login
        }

        return Promise.reject(error);
    }
);

export default apiClient;
