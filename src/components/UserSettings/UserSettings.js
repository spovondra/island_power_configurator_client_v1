import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { getCurrentUser, getUserById, updateUser } from '../../services/authService';
import './UserSettings.css';

/**
 * UserSettings component allows the logged-in user to update their personal details and password.
 *
 * @module UserSettings
 */

/**
 * UserSettings component.
 *
 * @component
 * @returns {JSX.Element} The rendered UserSettings component.
 */
const UserSettings = () => {
    const { t } = useTranslation('settings');

    /** @type {object|null} user - The current user data. */
    const [user, setUser] = useState(null);

    /** @type {string} username - The user's username. */
    const [username, setUsername] = useState('');

    /** @type {string} firstName - The user's first name. */
    const [firstName, setFirstName] = useState('');

    /** @type {string} lastName - The user's last name. */
    const [lastName, setLastName] = useState('');

    /** @type {string} email - The user's email address. */
    const [email, setEmail] = useState('');

    /** @type {string} password - The user's password (used for updates). */
    const [password, setPassword] = useState('');

    /** @type {boolean} updatePassword - Whether the user wants to update their password. */
    const [updatePassword, setUpdatePassword] = useState(false);

    /** @type {string} userId - The ID of the logged-in user. */
    const [userId, setUserId] = useState('');
    
    useEffect(() => {
        const currentUser = getCurrentUser();
        if (currentUser) {
            setUserId(currentUser.userId);
            getUserById(currentUser.userId).then(userData => {
                setUser(userData);
                setUsername(userData.username);
                setFirstName(userData.firstName);
                setLastName(userData.lastName);
                setEmail(userData.email);
            });
        }
    }, []);

    /**
     * Handles updating the user's details.
     *
     * @function handleUpdate
     * @memberof UserSettings
     * @param {Event} e - The form submission event.
     */
    const handleUpdate = async (e) => {
        e.preventDefault();
        const userData = {
            username,
            firstName,
            lastName,
            email
        };
        if (updatePassword) {
            userData.password = password;
        }
        try {
            await updateUser(userId, userData);
            alert(t('update_success'));
        } catch (error) {
            alert(t('update_fail'));
        }
    };

    /* Display loading if user data is not loaded */
    if (!user) {
        return <div>{t('loading')}</div>;
    }

    return (
        <div className="user-settings">
            <h2>{t('title')}</h2>
            <form onSubmit={handleUpdate}>
                <div className="user-settings form-group">
                    <label htmlFor="username">{t('username')}</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="user-settings form-group">
                    <label htmlFor="firstName">{t('first_name')}</label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className="user-settings form-group">
                    <label htmlFor="lastName">{t('last_name')}</label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div className="user-settings form-group">
                    <label htmlFor="email">{t('email')}</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="user-settings form-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={updatePassword}
                            onChange={(e) => setUpdatePassword(e.target.checked)}
                        />{' '}
                        {t('update_password')}
                    </label>
                </div>
                {updatePassword && (
                    <div className="user-settings form-group">
                        <label htmlFor="password">{t('password')}</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                )}
                <button type="submit">{t('update_button')}</button>
            </form>
        </div>
    );
};

export default UserSettings;
