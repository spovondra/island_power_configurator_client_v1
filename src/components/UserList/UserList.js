import { useEffect, useReducer, useState } from 'react';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal/Modal';
import './UserList.css';
import UserForm from './UserForm';

const initialState = {
    users: [],
    error: '',
    isLoading: true,
    isModalOpen: false,
    selectedUser: null,
    updatePassword: false,
    modalContent: null,
};

const userReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            return { ...state, users: action.payload, isLoading: false };
        case 'FETCH_ERROR':
            return { ...state, error: action.payload, isLoading: false, isModalOpen: true, modalContent: 'error' };
        case 'SET_SELECTED_USER':
            return { ...state, selectedUser: action.payload, isModalOpen: true, modalContent: 'form' };
        case 'ADD_USER':
            return { ...state, users: [...state.users, action.payload], selectedUser: null, isModalOpen: false };
        case 'UPDATE_USER':
            return {
                ...state,
                users: state.users.map(user =>
                    user.id === action.payload.id ? action.payload : user
                ),
                selectedUser: null,
                isModalOpen: false,
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
    const { users, error, isLoading, isModalOpen, selectedUser, updatePassword, modalContent } = state;
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'USER',
        firstName: '',
        lastName: '',
        email: '',
    });
    const [searchQuery, setSearchQuery] = useState('');
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
            await fetchUsers();
        } catch (error) {
            alert('Failed to update user');
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        const { username, password, role, firstName, lastName, email } = formData;
        try {
            const newUser = await authService.register(username, password, role, firstName, lastName, email);
            dispatch({ type: 'ADD_USER', payload: newUser.data });
            alert('User added successfully');
            await fetchUsers();
        } catch (error) {
            alert(`Failed to add user: ${error.response ? error.response.data.message : error.message}`);
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
        if (modalContent === 'error') {
            navigate(-1);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAddUserClick = () => {
        setFormData({
            username: '',
            password: '',
            role: 'USER',
            firstName: '',
            lastName: '',
            email: '',
        });
        dispatch({ type: 'SET_SELECTED_USER', payload: null });
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="user-list-container">
            <h2 className="user-list-header">User List</h2>
            <div className="user-list-controls">
                <div className="user-list-search-container">
                    <input
                        type="text"
                        placeholder="Search by username"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="user-list-search-input"
                    />
                    <button className="user-list-search-button">🔍</button>
                </div>
                <button className="user-list-add-button" onClick={handleAddUserClick}>Add User</button>
            </div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="user-list-table-container">
                    <table className="user-list-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Login</th>
                            <th>Role</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Projects</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.role}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.projects}</td>
                                <td>
                                    <button className="user-list-button user-list-button-edit" onClick={() => handleSelectUser(user)}>Edit</button>
                                    <button className="user-list-button user-list-button-delete" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <Modal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        title={modalContent === 'form' ? (selectedUser ? 'Edit User' : 'Add User') : 'Error'}
                        className={modalContent === 'error' ? 'user-list-error-modal' : ''}
                    >
                        {modalContent === 'form' ? (
                            <UserForm
                                selectedUser={selectedUser}
                                formData={formData}
                                handleInputChange={handleInputChange}
                                handleSubmit={selectedUser ? handleUpdateUser : handleAddUser}
                                updatePassword={updatePassword}
                                dispatch={dispatch}
                            />
                        ) : (
                            <p>{error}</p>
                        )}
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default UserList;
