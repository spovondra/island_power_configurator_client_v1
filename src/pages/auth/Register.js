import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';
import './Register.css';
import { useTranslation } from 'react-i18next'; // Import translation hook

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { t } = useTranslation('auth'); // Use 'auth' namespace
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register(username, password, 'USER'); // Call the specific register function
            setMessage(t('register.register_success'));
            navigate('/login');
        } catch (error) {
            setMessage(t('register.register_failed'));
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
        </div>
    );
}

export default Register;
