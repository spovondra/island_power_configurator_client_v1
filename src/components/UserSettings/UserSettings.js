import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { getCurrentUser, getUserById, updateUser } from '../../services/authService';
import './UserSettings.css';

const UserSettings = () => {
    const { t } = useTranslation('settings'); // Load the 'settings' namespace
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [updatePassword, setUpdatePassword] = useState(false);
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
            alert(t('update_success')); // Use translation for success message
        } catch (error) {
            alert(t('update_fail')); // Use translation for error message
        }
    };

    if (!user) {
        return <div>{t('loading')}</div>; // Use translation for loading text
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
