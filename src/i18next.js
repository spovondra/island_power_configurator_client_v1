import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import the translations
import pagesEN from './locales/en/pages.json';
import navigationEN from './locales/en/navigation.json';
import authEN from './locales/en/auth.json'; // Import English auth translations
import wizardEN from './locales/en/wizard.json';

import pagesCS from './locales/cs/pages.json';
import navigationCS from './locales/cs/navigation.json';
import authCS from './locales/cs/auth.json'; // Import Czech auth translations
import wizardCS from './locales/cs/wizard.json';

// Define the resource object with separate namespaces for pages, navigation, and auth
const resources = {
    en: {
        pages: pagesEN, // English pages translations
        navigation: navigationEN, // English navigation translations
        auth: authEN, // English auth translations
        wizard: wizardEN
    },
    cs: {
        pages: pagesCS, // Czech pages translations
        navigation: navigationCS, // Czech navigation translations
        auth: authCS, // Czech auth translations
        wizard: wizardCS
    }
};

i18next
    .use(LanguageDetector) // Detects language automatically
    .use(initReactI18next) // Passes i18n down to react-i18next
    .init({
        resources, // Load the resources
        fallbackLng: 'en', // Fallback to English if translation is missing
        ns: ['pages', 'navigation', 'auth', 'wizard'], // Define namespaces
        defaultNS: 'pages', // Default namespace
        interpolation: {
            escapeValue: false // React already handles escaping
        },
        detection: {
            order: ['querystring', 'cookie', 'localStorage', 'navigator'], // Language detection order
            caches: ['cookie'] // Save language in cookies
        }
    });

export default i18next;
