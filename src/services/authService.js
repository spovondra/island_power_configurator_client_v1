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
        const { username, id, role } = response.data; // Ensure role is extracted correctly
        // Temporarily store password for debugging
        localStorage.setItem('user', JSON.stringify({ username, userId: id, roles: role.split(','), password }));
        return { username, userId: id, roles: role.split(','), password }; // Ensure this returns the ID
    } else {
        throw new Error('Login failed');
    }
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    // Check if the user object has the password, if not, add it
    if (user && !user.password) {
        user.password = JSON.parse(localStorage.getItem('user')).password;
    }
    return user;
};

const getAllUsers = async () => {
    const user = getCurrentUser();
    if (!user) throw new Error('No user logged in');

    // Log the username and password being used
    console.log('Username:', user.username);
    console.log('Password:', user.password);

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
