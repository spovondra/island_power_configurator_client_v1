import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-container">
            <h1 className="home-heading">Welcome to the IslandPower Configurator</h1>
            <div className="home-content">
                <Link to="/projects" className="projects-button">
                    Go to Projects
                </Link>
                <div className="old-version">
                    <h2>Old Version</h2>
                    <Link to="/random-adress123" className="old-version-link">
                        ErrorPage testing
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Home;
