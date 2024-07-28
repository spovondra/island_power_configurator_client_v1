import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './Navbar.css';

const Navbar = () => {
    const user = authService.getCurrentUser();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-links">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/map">Map</Link>
            </div>
            {user && (
                <div className="navbar-user" onClick={toggleDropdown}>
                    <span className="navbar-username">
                        {user.username}
                    </span>
                    <div className={`navbar-dropdown ${dropdownOpen ? 'open' : ''}`}>
                        <Link to="/settings">Settings</Link>
                        {user.roles.includes('ADMIN') && (
                            <Link to="/users">User List</Link>
                        )}
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
