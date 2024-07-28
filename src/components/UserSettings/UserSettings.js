import React, { useState, useEffect } from 'react';
import authService from '../../services/authService';
import './UserSettings.css';

const UserSettings = () => {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [updatePassword, setUpdatePassword] = useState(false);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUserId(currentUser.userId);
            authService.getUserById(currentUser.userId).then(userData => {
                setUser(userData);
                setUsername(userData.username);
                setFirstName(userData.firstName);
                setLastName(userData.lastName);
                setEmail(userData.email);
            });
        }
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const userData = {
            username,
            firstName,
            lastName,
            email
        };
        if (updatePassword) {
            userData.password = password;
        }
        try {
            await authService.updateUser(userId, userData);
            alert('User updated successfully');
        } catch (error) {
            alert('Failed to update user');
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="user-settings">
            <h2>User Settings</h2>
            <form onSubmit={handleUpdate}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={updatePassword}
                            onChange={(e) => setUpdatePassword(e.target.checked)}
                        />{' '}
                        Update Password
                    </label>
                </div>
                {updatePassword && (
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                )}
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default UserSettings;
