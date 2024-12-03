import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

/**
 * ProtectedRoute component to guard routes for authenticated users.
 *
 * @component
 * @param {object} props - The component props.
 * @param {JSX.Element} props.children - The child components to render if the user is authenticated.
 * @returns {JSX.Element} The child components if authenticated, or a redirect to the login page.
 */
const ProtectedRoute = ({ children }) => {
    const user = getCurrentUser();
    return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
