import apiClient from './apiClient';

const API_URL = 'http://localhost:80/api/auth/';

const register = (username, password, role, firstName = '', lastName = '', email = '') => {
    return apiClient.post(`${API_URL}register`, {
        username,
        password,
        role,
        firstName,
        lastName,
        email
    });
};

const login = async (username, password) => {
    const response = await apiClient.post(`${API_URL}login`, null, {
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
};

const logout = () => {
    localStorage.removeItem('user');
    window.location.replace('/login');
};

const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    console.log('User from localStorage:', user);
    return user ? JSON.parse(user) : null;
};

const getAllUsers = async () => {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    const response = await apiClient.get(`${API_URL}getAll`);
    return response.data;
};

const deleteUser = async (userId) => {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    await apiClient.delete(`${API_URL}delete/${userId}`);
};

const getUserById = async (userId) => {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    const response = await apiClient.get(`${API_URL}user/${userId}`);
    return response.data;
};

const updateUser = async (userId, userDetails) => {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    const response = await apiClient.put(`${API_URL}update/${userId}`, userDetails);
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
