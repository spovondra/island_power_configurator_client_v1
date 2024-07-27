import React from 'react';
import Navbar from '../navigation/Navbar';
import Footer from '../navigation/Footer';
import { Outlet } from 'react-router-dom';
import './SharedLayout.css';

const SharedLayout = ({ onLogout }) => {
    return (
        <div className="shared-layout">
            <Navbar onLogout={onLogout} />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default SharedLayout;
