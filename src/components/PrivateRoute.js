import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ auth, children }) => {
    return auth ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
