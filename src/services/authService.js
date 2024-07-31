import axios from 'axios';

const API_URL = 'http://localhost:80/api/auth/';

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
};

const logout = () => {
    localStorage.removeItem('user');
    window.location.replace('/login');
};

const getCurrentUser = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user;
};

const getAllUsers = async () => {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    const response = await axios.get(`${API_URL}getAll`, {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    });
    return response.data;
};

const deleteUser = async (userId) => {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    await axios.delete(`${API_URL}delete/${userId}`, {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    });
};

const getUserById = async (userId) => {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    const response = await axios.get(`${API_URL}user/${userId}`, {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    });
    return response.data;
};

const updateUser = async (userId, userDetails) => {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    const response = await axios.put(`${API_URL}update/${userId}`, userDetails, {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    });
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
