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
    if (response.data) {
        localStorage.setItem('user', JSON.stringify({ username, password }));
    }
    return response.data;
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
