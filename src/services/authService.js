import apiClient from './apiClient';
import { API_AUTH_URL } from '../config';

export const register = async (username, password, role, firstName = '', lastName = '', email = '') => {
    return apiClient.post(`${API_AUTH_URL}register`, {
        username,
        password,
        role,
        firstName,
        lastName,
        email
    });
};

export const login = async (username, password) => {
    const response = await apiClient.post(`${API_AUTH_URL}login`, null, {
        params: {
            username,
            password
        }
    });

    if (response.status === 200 && response.data) {
        const { jwt, refreshToken, userId, role } = response.data;
        localStorage.setItem('user', JSON.stringify({ username, userId, roles: role.split(','), token: jwt, refreshToken }));
        return { username, userId, roles: role.split(','), token: jwt, refreshToken };
    } else {
        throw new Error('Login failed');
    }
};

export const logout = () => {
    localStorage.removeItem('user');
    window.location.replace('/login');
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const getAllUsers = async () => {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    const response = await apiClient.get(`${API_AUTH_URL}getAll`);
    return response.data;
};

export const deleteUser = async (userId) => {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    await apiClient.delete(`${API_AUTH_URL}delete/${userId}`);
};

export const getUserById = async (userId) => {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    const response = await apiClient.get(`${API_AUTH_URL}user/${userId}`);
    return response.data;
};

export const updateUser = async (userId, userDetails) => {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    const response = await apiClient.put(`${API_AUTH_URL}update/${userId}`, userDetails);
    return response.data;
};