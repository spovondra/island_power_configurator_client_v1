import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();

    return (
        <div className="home-container">
            <h1 className="home-heading">{t('home.welcome')}</h1>
            <div className="home-content">
                <Link to="/projects" className="projects-button">
                    {t('home.go_to_projects')}
                </Link>
                <div className="old-version">
                    <h2>{t('home.old_version')}</h2>
                    <Link to="/random-adress123" className="old-version-link">
                        {t('home.error_page_testing')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
