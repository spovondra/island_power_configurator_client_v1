import React from 'react';
import Navbar from "../navigation/Navbar";
import Footer from "../navigation/Footer";
import { Outlet } from "react-router-dom";
import './SharedLayout.css'; // Importujte vlastní CSS soubor

const SharedLayout = () => {
    return (
        <div className="shared-layout">
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default SharedLayout;
