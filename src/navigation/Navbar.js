import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import authService from '../services/authService';
import './Navbar.css';
import { useTranslation } from 'react-i18next'; // Import translation hook

const Navbar = () => {
    const user = authService.getCurrentUser();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { t, i18n } = useTranslation('navigation'); // Use 'navigation' namespace for translations
    const [language, setLanguage] = useState(i18n.language); // Get the current language

    const handleLogout = () => {
        authService.logout();
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setLanguage(lng); // Update language state
    };

    return (
        <nav className="navbar">
            <div className="navbar-links">
                <NavLink to="/">{t('navbar.home')}</NavLink>
                <NavLink to="/projects">{t('navbar.projects')}</NavLink>
            </div>
            <div className="navbar-user-container">
                {/* Language Switcher */}
                <div className="navbar-language-switcher">
                    <button
                        onClick={() => changeLanguage('en')}
                        className={language === 'en' ? 'active' : ''}
                    >
                        EN
                    </button>
                    <span>|</span>
                    <button
                        onClick={() => changeLanguage('cs')}
                        className={language === 'cs' ? 'active' : ''}
                    >
                        CS
                    </button>
                </div>
                {user && (
                    <div className="navbar-user" onClick={toggleDropdown}>
                        <span className="navbar-username">
                            {user.username}
                        </span>
                        <div className={`navbar-dropdown ${dropdownOpen ? 'open' : ''}`}>
                            <NavLink to="/settings">{t('navbar.settings')}</NavLink>
                            {user.roles.includes('ADMIN') && (
                                <>
                                    <NavLink to="/admin/users">{t('navbar.userList')}</NavLink>
                                    <NavLink to="/admin/projects">{t('navbar.projectManagement')}</NavLink>
                                    <NavLink to="/admin/components">{t('navbar.componentManagement')}</NavLink>
                                </>
                            )}
                            <button onClick={handleLogout}>{t('navbar.logout')}</button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
