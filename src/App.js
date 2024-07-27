import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Map from './pages/Map';
import SharedLayout from './pages/SharedLayout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserList from './components/UserList';
import PrivateRoute from './components/PrivateRoute';
import authService from './services/authService';

const App = () => {
    const [auth, setAuth] = useState(authService.getCurrentUser());

    const handleLoginSuccess = (user) => {
        setAuth(user);
    };

    const handleLogout = () => {
        authService.logout();
        setAuth(null);
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={auth ? <SharedLayout onLogout={handleLogout} /> : <Navigate to="/login" />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="map" element={<Map />} />
                    <Route path="users" element={<UserList />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
