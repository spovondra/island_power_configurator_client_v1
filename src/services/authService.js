import apiClient from './apiClient';
import { API_AUTH_URL } from '../config';

/**
 * Service for handling authentication and user management.
 *
 * @module AuthService
 */

/**
 * Registers a new user.
 *
 * @function register
 * @param {string} username - The username of the new user.
 * @param {string} password - The password of the new user.
 * @param {string} role - The role of the new user (e.g., "ADMIN", "USER").
 * @param {string} [firstName=''] - The first name of the new user (optional).
 * @param {string} [lastName=''] - The last name of the new user (optional).
 * @param {string} [email=''] - The email of the new user (optional).
 * @returns {Promise<object>} A promise that resolves to the response data from the registration request.
 * @throws {Error} If registration fails or if the username already exists.
 */
export const register = async (username, password, role, firstName = '', lastName = '', email = '') => {
    try {
        return await apiClient.post(`${API_AUTH_URL}register`, {
            username,
            password,
            role,
            firstName,
            lastName,
            email
        });
    } catch (error) {
        if (error.response && error.response.status === 409) {
            throw new Error('Username already exists');
        }
        throw new Error('Registration failed');
    }
};

/**
 * Logs in a user.
 *
 * @function login
 * @param {string} username - The username of the user logging in.
 * @param {string} password - The password of the user logging in.
 * @returns {Promise<object>} A promise that resolves to the login data, including JWT and user details.
 * @throws {Error} If login fails.
 */
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

/**
 * Logs out the current user and redirects to the login page.
 *
 * @function logout
 */
export const logout = () => {
    localStorage.removeItem('user');
    window.location.replace('/login');
};

/**
 * Retrieves the currently logged-in user from localStorage.
 *
 * @function getCurrentUser
 * @returns {object|null} The current user's data, or null if no user is logged in.
 */
export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

/**
 * Fetches all users.
 *
 * @function getAllUsers
 * @returns {Promise<object[]>} A promise that resolves to a list of all users.
 * @throws {Error} If no user is logged in.
 */
export const getAllUsers = async () => {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    const response = await apiClient.get(`${API_AUTH_URL}getAll`);
    return response.data;
};

/**
 * Deletes a user by their ID.
 *
 * @function deleteUser
 * @param {string} userId - The ID of the user to delete.
 * @returns {Promise<void>} A promise that resolves when the user is successfully deleted.
 * @throws {Error} If no user is logged in.
 */
export const deleteUser = async (userId) => {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    await apiClient.delete(`${API_AUTH_URL}delete/${userId}`);
};

/**
 * Fetches a user by their ID.
 *
 * @function getUserById
 * @param {string} userId - The ID of the user to fetch.
 * @returns {Promise<object>} A promise that resolves to the user data.
 * @throws {Error} If no user is logged in.
 */
export const getUserById = async (userId) => {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    const response = await apiClient.get(`${API_AUTH_URL}user/${userId}`);
    return response.data;
};

/**
 * Updates a user by their ID.
 *
 * @function updateUser
 * @param {string} userId - The ID of the user to update.
 * @param {object} userDetails - The updated user details.
 * @returns {Promise<object>} A promise that resolves to the updated user data.
 * @throws {Error} If no user is logged in.
 */
export const updateUser = async (userId, userDetails) => {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    const response = await apiClient.put(`${API_AUTH_URL}update/${userId}`, userDetails);
    return response.data;
};
