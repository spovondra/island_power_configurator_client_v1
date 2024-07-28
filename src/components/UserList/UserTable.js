import React from 'react';

const UserTable = ({ users, handleSelectUser, handleDeleteUser, searchQuery, handleSearchChange }) => {
    return (
        <div>
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search by username"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <button className="search-button">🔍</button>
            </div>
            <table>
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
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.role}</td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.projects}</td>
                        <td>
                            <button onClick={() => handleSelectUser(user)}>Edit</button>
                            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
