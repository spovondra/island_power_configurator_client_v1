import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

/**
 * AuthRoute restricts access to child components based on user roles.
 *
 * @param {Object} props - The component properties.
 * @param {string} props.role - The required role for access.
 * @param {JSX.Element} props.children - The components to render if access is granted.
 * @returns {JSX.Element} Child components or redirection.
 */
const AuthRoute = ({ role, children }) => {
    const user = getCurrentUser();

    /* Render children if user has the required role otherwise -> redirect home */
    return user && user.roles.includes(role) ? children : <Navigate to="/" />;
};

export default AuthRoute;
