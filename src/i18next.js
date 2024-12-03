/**
 * initializes i18next for managing translations in the application
 */

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

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
 * translation resources for the application
 *
 * @constant
 * @type {object}
 * @property {object} en - translations for English
 * @property {object} cs - translations for Czech
 */
const resources = {
    en: { pages: pagesEN, navigation: navigationEN, auth: authEN, wizard: wizardEN, admin: adminEN, project: projectEN, settings: settingsEN },
    cs: { pages: pagesCS, navigation: navigationCS, auth: authCS, wizard: wizardCS, admin: adminCS, project: projectCS, settings: settingsCS }
};

i18next
    .use(LanguageDetector) // detects the user's language
    .use(initReactI18next) // integrates i18next with React
    .init({
        resources, // translation data
        fallbackLng: 'en', // default language
        ns: ['pages', 'navigation', 'auth', 'wizard', 'admin', 'project', 'settings'], // namespaces for translations
        defaultNS: 'pages', // default namespace
        interpolation: {
            escapeValue: false // disables escaping for React
        },
        detection: {
            order: ['querystring', 'cookie', 'localStorage', 'navigator'], // language detection priority
            caches: ['cookie'] // caches the detected language
        }
    });

export default i18next;
