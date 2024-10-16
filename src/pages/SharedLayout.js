import Navbar from '../navigation/Navbar';
import { Outlet } from 'react-router-dom';
import './SharedLayout.css';

const SharedLayout = ({ onLogout }) => {
    return (
        <div className="shared-layout">
            <Navbar onLogout={onLogout} />
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default SharedLayout;
