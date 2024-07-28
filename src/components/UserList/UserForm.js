import React from 'react';

const UserForm = ({
                      selectedUser,
                      formData,
                      handleInputChange,
                      handleSubmit,
                      updatePassword,
                      dispatch,
                  }) => {
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>{selectedUser ? 'Edit User' : 'Add User'}</legend>
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
                    <button type="submit">{selectedUser ? 'Update User' : 'Add User'}</button>
                </fieldset>
            </form>
        </div>
    );
};

export default UserForm;
