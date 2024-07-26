import axios from 'axios';

const API_URL = 'http://localhost:80/api/auth/';

const register = (username, password, role) => {
    return axios.post(API_URL + 'register', {
        username,
        password,
        role
    });
};

const login = (username, password) => {
    return axios.get(API_URL + 'login', {}, {
        auth: {
            username,
            password
        }
    });
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    register,
    login,
    logout,
    getCurrentUser
};
