import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// import translations
import pagesEN from './locales/en/pages.json';
import navigationEN from './locales/en/navigation.json';
import authEN from './locales/en/auth.json';
import wizardEN from './locales/en/wizard.json';
import adminEN from './locales/en/admin.json';
import projectEN from './locales/en/project.json';
import settingsEN from './locales/en/settings.json';

import pagesCS from './locales/cs/pages.json';
import navigationCS from './locales/cs/navigation.json';
import authCS from './locales/cs/auth.json';
import wizardCS from './locales/cs/wizard.json';
import adminCS from './locales/cs/admin.json';
import projectCS from './locales/cs/project.json';
import settingsCS from './locales/cs/settings.json';

/**
 * configures and initializes i18next for translation management in the application
 */
const resources = {
    en: { pages: pagesEN, navigation: navigationEN, auth: authEN, wizard: wizardEN, admin: adminEN, project: projectEN, settings: settingsEN },
    cs: { pages: pagesCS, navigation: navigationCS, auth: authCS, wizard: wizardCS, admin: adminCS, project: projectCS, settings: settingsCS }
};

i18next
    .use(LanguageDetector) // automatically detects the user's language
    .use(initReactI18next) // integrates i18next with React
    .init({
        resources, // translation resources
        fallbackLng: 'en', // default to English if no translation is found
        ns: ['pages', 'navigation', 'auth', 'wizard', 'admin', 'project', 'settings'], // namespaces
        defaultNS: 'pages', // default namespace for translations
        interpolation: {
            escapeValue: false // disables escaping as React handles it
        },
        detection: {
            order: ['querystring', 'cookie', 'localStorage', 'navigator'], // language detection priority
            caches: ['cookie'] // caches the detected language in cookies
        }
    });

export default i18next;
