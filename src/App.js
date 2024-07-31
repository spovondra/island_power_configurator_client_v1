import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Map from "./pages/Map";
import SharedLayout from "./pages/SharedLayout";
import Login from "./pages/auth/Login";
import UserList from "./components/UserList/UserList";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/auth/Register";
import UserSettings from "./components/UserSettings/UserSettings";
import Calculation from "./pages/Calculation";
import ProjectList from "./components/Project/ProjectList";
import ProjectForm from "./components/Project/ProjectForm";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<ProtectedRoute><SharedLayout /></ProtectedRoute>}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="map" element={<Map />} />
                    <Route path="settings" element={<UserSettings />} />
                    <Route path="users" element={<UserList />} />
                    <Route path="calculation" element={<Calculation />} />
                    <Route path="projects" element={<ProjectList />} />
                    <Route path="projects/new" element={<ProjectForm />} />
                    <Route path="projects/:projectId" element={<ProjectForm />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
