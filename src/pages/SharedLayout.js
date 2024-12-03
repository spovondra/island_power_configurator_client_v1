import Navbar from '../navigation/Navbar';
import { Outlet } from 'react-router-dom';
import './SharedLayout.css';

/**
 * The SharedLayout module provides a common layout for the application (with a navbar and main content)
 *
 * @module SharedLayout
 */

/**
 * SharedLayout component that renders the Navbar and the current content screen.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Function} props.onLogout - Callback function for handling user logout.
 * @returns {JSX.Element} The rendered SharedLayout component.
 */
const SharedLayout = ({ onLogout }) => {
    return (
        <div className="shared-layout">
            <Navbar onLogout={onLogout} />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default SharedLayout;
