import React from 'react';
import './NotFound.css'; // Create a CSS file for styling if needed

const NotFound = () => {
    return (
        <div className="not-found-container">
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <a href="/" className="button">Go to Home</a>
        </div>
    );
};

export default NotFound;
