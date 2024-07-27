import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './Navbar.css'; // Include your CSS for styling

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
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/map">Map</Link>
            {user && (
                <div className="navbar-user">
                    <span onClick={toggleDropdown} className="navbar-username">
                        {user.username} ({user.userId})
                    </span>
                    {dropdownOpen && (
                        <div className="navbar-dropdown">
                            {user.roles && user.roles.includes('ADMIN') && (
                                <Link to="/users">User List</Link>
                            )}
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;
