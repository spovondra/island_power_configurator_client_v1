import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './Navbar.css'; // Include your CSS for styling

const Navbar = () => {
    const user = authService.getCurrentUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/map">Map</Link>
            {user && (
                <div className="navbar-user">
                    <span>{user.username} ({user.userId})</span>
                    <div className="navbar-dropdown">
                        {user.roles && user.roles.includes('ADMIN') && (
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
