import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Map from "./pages/Map";
import SharedLayout from "./pages/SharedLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register"; // Import the Register component
import UserList from "./components/UserList";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} /> {/* Add route for Register */}
                <Route path="/" element={<ProtectedRoute><SharedLayout /></ProtectedRoute>}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="map" element={<Map />} />
                    <Route path="users" element={<UserList />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
