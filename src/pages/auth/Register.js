import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';
import './Register.css';
import { useTranslation } from 'react-i18next';

/**
 * The Register module provides a user interface for account registration.
 *
 * @module Register
 */

/**
 * Register component for new user account creation.
 *
 * @component
 * @returns {JSX.Element} The rendered Register component.
 */
function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { t } = useTranslation('auth');
    const navigate = useNavigate();

    /**
     * Handles user registration.
     *
     * @async
     * @function handleRegister
     * @memberof Register
     * @param {Object} e - The event object from the form submission.
     */
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register(username, password, 'USER');
            setMessage(t('register.register_success'));
            navigate('/login'); // redirect to login page
        } catch (error) {
            if (error.message === 'Username already exists') {
                setMessage(t('register.username_exists'));
            } else {
                setMessage(t('register.register_failed'));
            }
        }
    };

    return (
        <div className="register-container">
            <h2>{t('register.title')}</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder={t('register.username_placeholder')}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder={t('register.password_placeholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{t('register.register_button')}</button>
            </form>
            <p>{message}</p>
            <button onClick={() => navigate('/login')}>
                {t('register.back_to_login')}
            </button>
        </div>
    );
}

export default Register;
