import React, { useState } from 'react';
import authService from '../../services/authService'

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await authService.register(username, password, role);
            setMessage('Registration successful');
        } catch (error) {
            setMessage('Registration failed');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Role (ADMIN or USER)"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                />
                <button type="submit">Register</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default Register;
