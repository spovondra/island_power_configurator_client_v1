import Navbar from "../navigation/Navbar";
import Footer from "../navigation/Footer";
import {Outlet} from "react-router-dom";

const SharedLayout = () => {
    return (
        <div>
            <Navbar/>
            <Outlet/>
            <Footer/>
        </div>
    );
}

export default SharedLayout;