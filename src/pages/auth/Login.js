import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './Login.css';
import { useTranslation } from 'react-i18next'; // Import translation hook

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { t } = useTranslation('auth'); // Use 'auth' namespace
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const user = await authService.login(username, password);
            if (user) {
                setMessage(t('login.login_success'));
                navigate('/');
            } else {
                setMessage(t('login.login_failed'));
            }
        } catch (error) {
            setMessage(t('login.login_failed'));
        }
    };

    return (
        <div className="login-container">
            <h2>{t('login.title')}</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder={t('login.username_placeholder')}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder={t('login.password_placeholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{t('login.login_button')}</button>
            </form>
            <p>{message}</p>
            <button onClick={() => navigate('/register')}>
                {t('login.register_prompt')}
            </button>
        </div>
    );
}

export default Login;
