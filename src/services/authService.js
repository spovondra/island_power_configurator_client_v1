import axios from 'axios';

const API_URL = 'http://localhost:80/api/auth/';

// Helper function to get token from localStorage
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : null;
};

// Register a new user
const register = (username, password, role, firstName = '', lastName = '', email = '') => {
    return axios.post(`${API_URL}register`, {
        username,
        password,
        role,
        firstName,
        lastName,
        email
    });
};

const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}login`, null, {
            params: {
                username,
                password
            }
        });

        if (response.status === 200 && response.data) {
            const { jwt, userId, role } = response.data;
            localStorage.setItem('user', JSON.stringify({ username, userId, roles: role.split(','), token: jwt }));
            return { username, userId, roles: role.split(','), token: jwt };
        } else {
            throw new Error('Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        throw new Error('Login failed: ' + (error.response?.data?.message || error.message));
    }
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user;
};

const authApiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

authApiClient.interceptors.request.use(config => {
    const token = getAuthToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Handle response errors, including token expiration
authApiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // Unauthorized error, log out the user and notify them
            logout();
            alert('Your session has expired. Please log in again.');
        } else {
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
        return Promise.reject(error);
    }
);

// Function to fetch all users
const getAllUsers = async () => {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    const response = await authApiClient.get(`${API_URL}getAll`);
    return response.data;
};

// Function to delete a user
const deleteUser = async (userId) => {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    await authApiClient.delete(`${API_URL}delete/${userId}`);
};

const getUserById = async (userId) => {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    const response = await authApiClient.get(`${API_URL}user/${userId}`);
    return response.data;
};

const updateUser = async (userId, userDetails) => {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    const response = await authApiClient.put(`${API_URL}update/${userId}`, userDetails);
    return response.data;
};

export default {
    register,
    login,
    logout,
    getCurrentUser,
    getAllUsers,
    deleteUser,
    getUserById,
    updateUser
};
