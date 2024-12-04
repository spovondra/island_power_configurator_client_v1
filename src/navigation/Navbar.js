import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/authService';
import './Navbar.css';
import { useTranslation } from 'react-i18next';

/**
 * The Navbar component provides navigation links, user authentication handling,
 * language switching, and user-specific dropdown options.
 *
 * @module Navbar
 */

/**
 * Navbar component for navigation, language switching, and user options.
 *
 * @component
 * @returns {JSX.Element} The rendered Navbar component.
 */
const Navbar = () => {
    /** @type {object|null} */
    const user = getCurrentUser();

    /** @type {boolean} */
    const [dropdownOpen, setDropdownOpen] = useState(false);

    /** @type {function} */
    const { t, i18n } = useTranslation('navigation');

    /** @type {string} */
    const [language, setLanguage] = useState(i18n.language); // get the current language

    /** @type {React.RefObject} */
    const dropdownRef = useRef(null); // ref for the dropdown

    /**
     * Handles user logout by calling the logout function.
     *
     * @function handleLogout
     */
    const handleLogout = () => {
        logout();
    };

    /**
     * Toggles the state of the dropdown menu.
     *
     * @function toggleDropdown
     */
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    /**
     * Changes the application's language.
     *
     * @function changeLanguage
     * @param {string} lng - The language code (e.g., 'en', 'cs').
     */
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setLanguage(lng); // Update language state
    };

    /**
     * Handles closing the dropdown when clicking outside of it.
     *
     * @function handleClickOutside
     * @param {Event} event - The event that triggered the action.
     */
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false); //close dropdown if clicked outside
        }
    };

    /* close dropdown when clicking outside th dropdown*/
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                    <div className="navbar-user" onClick={toggleDropdown} ref={dropdownRef}>
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
};

export default Navbar;
