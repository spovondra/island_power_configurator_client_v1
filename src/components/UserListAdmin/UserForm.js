import React from 'react';
import './UserForm.css';
import { useTranslation } from 'react-i18next'; // Import i18next hook

const UserForm = ({
                      selectedUser,
                      formData,
                      handleInputChange,
                      handleSubmit,
                      updatePassword,
                      dispatch,
                  }) => {
    const { t } = useTranslation('admin'); // Add translation hook

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
                    <button type="submit">{selectedUser ? t('userForm.update_user') : t('userForm.add_user')}</button>
                </fieldset>
            </form>
        </div>
    );
};

export default UserForm;
