import axios from 'axios';
import { API_URL } from '../config';

const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : null;
};

const getRefreshToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.refreshToken : null;
};

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

const isTokenValid = (token) => {
    if (!token) return false;

    const parts = token.split('.');
    if (parts.length !== 3) return false; // JWT ma 3 casti

    try {
        const payload = JSON.parse(atob(parts[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        return !isExpired;
    } catch (error) {
        console.error('Token decoding failed:', error);
        return false;
    }
};

apiClient.interceptors.request.use(config => {
    const token = getAuthToken();
    if (isTokenValid(token)) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

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
                        // Attempt to refresh the token
                        console.log('Attempting to refresh token:', refreshToken);

                        const refreshResponse = await axios.post(`${API_URL}/auth/refresh-token`,
                            null, {params: { refreshToken }
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
                        window.location.replace('/login');
                    }
                }
            }

            console.error('Token refresh failed or already retried, logging out.');
            localStorage.removeItem('user');
            //window.location.replace('/login');
        }

        return Promise.reject(error);
    }
);

export default apiClient;
