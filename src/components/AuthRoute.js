import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';

const AuthRoute = ({ role, children }) => {
    const user = getCurrentUser();

    console.log('User roles:', user?.roles);
    console.log('Required role:', role);

    if (user && user.roles.includes(role)) {
        return children;
    } else {
        return <Navigate to="/" />;
    }
};

export default AuthRoute;
