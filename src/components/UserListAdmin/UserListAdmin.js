import { useEffect, useReducer, useState } from 'react';
import { getAllUsers, updateUser, register, deleteUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import Modal from '../Modal/Modal';
import './UserListAdmin.css';
import UserForm from './UserForm';
import { useTranslation } from 'react-i18next'; // Import i18next hook

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

const UserListAdmin = () => {
    const [state, dispatch] = useReducer(userReducer, initialState);
    const { users, error, isLoading, isModalOpen, selectedUser, updatePassword, modalContent } = state;
    const { t } = useTranslation('admin'); // Add translation hook
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
            const data = await getAllUsers();
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
            const updatedUser = await updateUser(selectedUser.id, userData);
            dispatch({ type: 'UPDATE_USER', payload: updatedUser });
            alert(t('userListAdmin.user_updated')); // Use translation
            await fetchUsers();
        } catch (error) {
            alert(t('userListAdmin.failed_to_update')); // Use translation
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        const { username, password, role, firstName, lastName, email } = formData;
        try {
            const newUser = await register(username, password, role, firstName, lastName, email);
            dispatch({ type: 'ADD_USER', payload: newUser.data });
            alert(t('userListAdmin.user_added')); // Use translation
            await fetchUsers();
        } catch (error) {
            alert(t('userListAdmin.failed_to_add', { message: error.message })); // Use translation
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await deleteUser(userId);
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

    function formatProjects(projects) {
        return projects.join('\n');
    }

    return (
        <div className="user-list-container">
            <h2 className="user-list-header">{t('userListAdmin.header')}</h2>
            <div className="user-list-controls">
                <div className="user-list-search-container">
                    <input
                        type="text"
                        placeholder={t('userListAdmin.search_placeholder')}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="user-list-search-input"
                    />
                    <button className="user-list-search-button">🔍</button>
                </div>
                <button className="user-list-add-button" onClick={handleAddUserClick}>
                    {t('userListAdmin.add_user')}
                </button>
            </div>
            {isLoading ? (
                <p>{t('userListAdmin.loading')}</p>
            ) : (
                <div className="user-list-table-container">
                    <table className="user-list-table">
                        <thead>
                        <tr>
                            <th>{t('userListAdmin.id')}</th>
                            <th>{t('userListAdmin.login')}</th>
                            <th>{t('userListAdmin.role')}</th>
                            <th>{t('userListAdmin.first_name')}</th>
                            <th>{t('userListAdmin.last_name')}</th>
                            <th>{t('userListAdmin.projects')}</th>
                            <th>{t('userListAdmin.actions')}</th>
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
                                <td className="projects">{formatProjects(user.projects)}</td>
                                <td>
                                    <button className="user-list-button user-list-button-edit" onClick={() => handleSelectUser(user)}>
                                        {t('userListAdmin.edit_button')}
                                    </button>
                                    <button className="user-list-button user-list-button-delete" onClick={() => handleDeleteUser(user.id)}>
                                        {t('userListAdmin.delete_button')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <Modal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        title={modalContent === 'form' ? (selectedUser ? t('userListAdmin.edit_user') : t('userListAdmin.add_user_modal')) : t('userListAdmin.error')}
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

export default UserListAdmin;
