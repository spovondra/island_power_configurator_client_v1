import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { I18nextProvider } from 'react-i18next';
import i18next from './i18next';

/**
 * entry point of the application for initializing and rendering the React app
 *
 * @module root
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

/**
 * renders the application wrapped with the I18nextProvider for managing translations
 */
root.render(
    <I18nextProvider i18next={i18next}>
        <App />
    </I18nextProvider>
);
