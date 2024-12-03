import React from 'react';
import './NotFound.css';
import { useTranslation } from 'react-i18next';

/**
 * NotFound component for displaying a 404 error page.
 *
 * @component
 * @returns {JSX.Element} The rendered NotFound component.
 */
const NotFound = () => {
    const { t } = useTranslation('pages');

    return (
        <div className="not-found-container">
            <h1 className="not-found-title">{t('notFound.title')}</h1>
            <p className="not-found-message">{t('notFound.message')}</p>
            <a href="/" className="not-found-button">{t('notFound.go_home')}</a>
        </div>
    );
};

export default NotFound;
