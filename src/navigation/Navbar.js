import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import authService from '../services/authService';
import './Navbar.css';

const Navbar = () => {
    const user = authService.getCurrentUser();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        authService.logout();
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-links">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/projects">Projects</NavLink>
            </div>
            {user && (
                <div className="navbar-user" onClick={toggleDropdown}>
                    <span className="navbar-username">
                        {user.username}
                    </span>
                    <div className={`navbar-dropdown ${dropdownOpen ? 'open' : ''}`}>
                        <NavLink to="/settings">Settings</NavLink>
                        {user.roles.includes('ADMIN') && (
                            <>
                                <NavLink to="/admin/users">User List</NavLink>
                                <NavLink to="/admin/projects">Project Management</NavLink>
                            </>
                        )}
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
