import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * PrivateRoute component to restrict access to authenticated users.
 *
 * @component
 * @param {object} props - The component props.
 * @param {boolean} props.auth - Indicates if the user is authenticated.
 * @param {JSX.Element} props.children - The child components to render if authenticated.
 * @returns {JSX.Element} The child components if authenticated, or a redirect to the login page.
 */
const PrivateRoute = ({ auth, children }) => {
    return auth ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
