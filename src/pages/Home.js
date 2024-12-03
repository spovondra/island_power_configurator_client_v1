import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Home component for displaying the main landing page.
 *
 * @component
 * @returns {JSX.Element} The rendered Home component.
 */
const Home = () => {
    const { t } = useTranslation();

    return (
        <div className="home-container">
            <h1 className="home-heading">{t('home.welcome')}</h1>
            <div className="home-content">
                <Link to="/projects" className="home-projects-button">
                    {t('home.go_to_projects')}
                </Link>
                <div className="home-program-info">
                    <h2>{t('home.description')}</h2>
                    <p>{t('home.program_info')}</p>
                    <a
                        href="https://fve.firmisimo.eu/user-manual-cs.pdf"
                        className="home-manual-download-link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t('home.download_manual')}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Home;
