import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * About component for displaying application details.
 *
 * @component
 * @returns {JSX.Element} The rendered About component.
 */
const About = () => {
    const { t } = useTranslation();

    return (
        <div>
            <h1>{t('about.title')}</h1>
            <p>{t('about.description')}</p>
        </div>
    );
};

export default About;
