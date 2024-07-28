import React, { useEffect, useReducer, useState } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../components/ErrorModal';
import './UserList.css';

const initialState = {
    users: [],
    error: '',
    isLoading: true,
    isModalOpen: false,
    selectedUser: null,
    updatePassword: false,
};

const userReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            return { ...state, users: action.payload, isLoading: false };
        case 'FETCH_ERROR':
            return { ...state, error: action.payload, isLoading: false, isModalOpen: true };
        case 'SET_SELECTED_USER':
            return { ...state, selectedUser: action.payload };
        case 'UPDATE_USER':
            return {
                ...state,
                users: state.users.map(user =>
                    user.id === action.payload.id ? action.payload : user
                ),
                selectedUser: null,
            };
        case 'DELETE_SUCCESS':
            return { ...state, users: state.users.filter(user => user.id !== action.payload) };
        case 'TOGGLE_PASSWORD_UPDATE':
            return { ...state, updatePassword: action.payload };
        case 'CLOSE_MODAL':
            return { ...state, isModalOpen: false };
        default:
            return state;
    }
};

const UserList = () => {
    const [state, dispatch] = useReducer(userReducer, initialState);
    const { users, error, isLoading, isModalOpen, selectedUser, updatePassword } = state;
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: '',
        firstName: '',
        lastName: '',
        email: '',
    });
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const data = await authService.getAllUsers();
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR', payload: error.message });
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        const userData = { ...formData };
        if (!updatePassword) {
            delete userData.password;
        }
        try {
            const updatedUser = await authService.updateUser(selectedUser.id, userData);
            dispatch({ type: 'UPDATE_USER', payload: updatedUser });
            alert('User updated successfully');
            await fetchUsers();  // Fetch the updated user list
        } catch (error) {
            alert('Failed to update user');
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await authService.deleteUser(userId);
            dispatch({ type: 'DELETE_SUCCESS', payload: userId });
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR', payload: error.message });
        }
    };

    const handleSelectUser = (user) => {
        setFormData(user);
        dispatch({ type: 'SET_SELECTED_USER', payload: user });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleCloseModal = () => {
        dispatch({ type: 'CLOSE_MODAL' });
        navigate(-1); // Navigate back to the previous page
    };

    return (
        <div className="container">
            <h2>User List</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {isModalOpen && (
                        <ErrorModal
                            isOpen={isModalOpen}
                            onClose={handleCloseModal}
                            title="Error"
                            message={error}
                        />
                    )}
                    <ul>
                        {users.map(user => (
                            <li key={user.id}>
                                {user.username} - {user.role}
                                <div>
                                    <button onClick={() => handleSelectUser(user)}>Edit</button>
                                    <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {selectedUser && (
                <form onSubmit={handleUpdateUser}>
                    <h3>Edit User</h3>
                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="checkbox"
                            name="updatePassword"
                            checked={updatePassword}
                            onChange={(e) => dispatch({ type: 'TOGGLE_PASSWORD_UPDATE', payload: e.target.checked })}
                        />
                        {updatePassword && (
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        )}
                    </div>
                    <div className="form-group">
                        <label>Role:</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                        >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>First Name:</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button type="submit">Update User</button>
                </form>
            )}
        </div>
    );
};

export default UserList;
