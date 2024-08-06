import React from 'react';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <h1 className="not-found-title">404 - Page Not Found</h1>
            <p className="not-found-message">The page you are looking for does not exist.</p>
            <a href="/" className="not-found-button">Go to Home</a>
        </div>
    );
};

export default NotFound;
