import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Map from './pages/Map';
import SharedLayout from './pages/SharedLayout';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import authService from './services/authService';

const App = () => {
    const [auth, setAuth] = useState(authService.getCurrentUser());

    const handleLoginSuccess = (user) => {
        setAuth(user);
    };

    const handleLogout = () => {
        setAuth(null);
    };

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user) {
            setAuth(user);
        }
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SharedLayout auth={auth} onLogout={handleLogout} />}>
                    <Route index element={
                        <PrivateRoute auth={auth}>
                            <Home />
                        </PrivateRoute>
                    } />
                    <Route path="/" element={
                        <PrivateRoute auth={auth}>
                            <Home />
                        </PrivateRoute>
                    } />
                    <Route path="/about" element={
                        <PrivateRoute auth={auth}>
                            <About />
                        </PrivateRoute>
                    } />
                    <Route path="/map" element={
                        <PrivateRoute auth={auth}>
                            <Map />
                        </PrivateRoute>
                    } />
                </Route>
                <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
