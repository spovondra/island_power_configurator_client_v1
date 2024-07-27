import React from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

const Navbar = ({ auth, onLogout }) => {
    const handleLogout = () => {
        authService.logout();
        onLogout();
    };

    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/map">Map</Link>
            <Link to="/users">Users</Link>
            {auth ? (
                <button onClick={handleLogout}>Logout</button>
            ) : (
                <Link to="/login">Login</Link>
            )}
        </nav>
    );
};

export default Navbar;
