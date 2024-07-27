import axios from 'axios';

const API_URL = 'http://localhost:80/api/auth/';

const register = (username, password, role) => {
    return axios.post(API_URL + 'register', {
        username,
        password,
        role
    });
};

const login = async (username, password) => {
    const response = await axios.post(API_URL + 'authenticate', null, {
        params: {
            username,
            password
        }
    });

    if (response.status === 200 && response.data) {
        const { username, id } = response.data; // Ensure id is extracted correctly
        localStorage.setItem('user', JSON.stringify({ username, userId: id }));
        return { username, userId: id }; // Ensure this returns the ID
    } else {
        throw new Error('Login failed');
    }
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const getAllUsers = async () => {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');
    const response = await axios.get(API_URL + 'getAll', {
        auth: {
            username: user.username,
            password: user.password
        }
    });
    return response.data;
};

export default {
    register,
    login,
    logout,
    getCurrentUser,
    getAllUsers
};
