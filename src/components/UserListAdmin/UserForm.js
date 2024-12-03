import React from 'react';
import './UserForm.css';
import { useTranslation } from 'react-i18next';

/**
 * User Form Component
 *
 * @module UserForm
 */

/**
 * Renders a form for creating or editing user information.
 *
 * @component
 * @param {object} props - Component properties.
 * @param {object|null} props.selectedUser - The currently selected user for editing, or null if adding a new user.
 * @param {object} props.formData - The form data object containing user fields (e.g., username, password, role, etc.).
 * @param {function} props.handleInputChange - Callback function to handle changes in input fields.
 * @param {function} props.handleSubmit - Callback function to handle form submission.
 * @param {boolean} props.updatePassword - Indicates if the password should be updated for an existing user.
 * @param {function} props.dispatch - Dispatch function for managing password update toggle state.
 * @returns {JSX.Element} The rendered User Form component.
 */
const UserForm = ({
                      selectedUser,
                      formData,
                      handleInputChange,
                      handleSubmit,
                      updatePassword,
                      dispatch,
                  }) => {
    const { t } = useTranslation('admin');

    return (
        <div className="user-form">
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <div className="form-group">
                        <label>{t('userForm.username')}:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('userForm.password')}:</label>
                        {selectedUser ? (
                            <>
                                <input
                                    type="checkbox"
                                    name="updatePassword"
                                    checked={updatePassword}
                                    onChange={(e) =>
                                        dispatch({ type: 'TOGGLE_PASSWORD_UPDATE', payload: e.target.checked })
                                    }
                                />
                                {updatePassword && (
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                )}
                            </>
                        ) : (
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        )}
                    </div>
                    <div className="form-group">
                        <label>{t('userForm.role')}:</label>
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
                        <label>{t('userForm.first_name')}:</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('userForm.last_name')}:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('userForm.email')}:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button type="submit">
                        {selectedUser ? t('userForm.update_user') : t('userForm.add_user')}
                    </button>
                </fieldset>
            </form>
        </div>
    );
};

export default UserForm;
