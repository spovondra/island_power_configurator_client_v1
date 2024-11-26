import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { I18nextProvider } from 'react-i18next';
import i18next from './i18next';

/**
 * Entry point of the application, which initializes and renders the React app.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

/**
 * Renders the application wrapped with the I18nextProvider for translations.
 */
root.render(
    <I18nextProvider i18next={i18next}>
        <App />
    </I18nextProvider>
);
