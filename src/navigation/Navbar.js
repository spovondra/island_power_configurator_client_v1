import {NavLink} from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    return (
        <header>
            <nav className="navbar">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/map">Map</NavLink>
            </nav>
        </header>

    );
}

export default Navbar;