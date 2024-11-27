import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SharedLayout from './pages/SharedLayout';
import Login from './pages/auth/Login';
import UserListAdmin from './components/UserListAdmin/UserListAdmin';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/auth/Register';
import UserSettings from './components/UserSettings/UserSettings';
import ProjectList from './components/Project/ProjectList';
import ProjectForm from './components/ProjectAdmin/ProjectForm';
import AuthRoute from './components/AuthRoute';
import ProjectAdminPanel from './components/ProjectAdmin/ProjectAdminPanel';
import Wizard from './pages/Wizard';
import NotFound from './pages/NotFound';
import { ProjectProvider } from './context/ProjectContext';
import "./App.css";
import ComponentAdminPanel from "./components/ComponentAdmin/ComponentAdminPanel";

/**
 * main application component defining routing and context
 *
 * @component
 * @returns {JSX.Element} main application structure
 */
const App = () => (
    <BrowserRouter
        future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
        }}
    >
        <ProjectProvider>
            <Routes>
                {/* public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* protected routes */}
                <Route path="/" element={<ProtectedRoute><SharedLayout /></ProtectedRoute>}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="settings" element={<UserSettings />} />
                    <Route path="projects" element={<ProjectList />} />
                    <Route path="projects/new" element={<ProjectForm />} />

                    {/**
                     * route for editing an existing project
                     *
                     * @param {string} id - unique identifier of the project to edit
                     */}
                    <Route path="projects/edit/:id" element={<ProjectForm />} />

                    {/* admin routes */}
                    <Route path="/admin/users" element={<AuthRoute role="ADMIN"><UserListAdmin /></AuthRoute>} />
                    <Route path="/admin/projects" element={<AuthRoute role="ADMIN"><ProjectAdminPanel /></AuthRoute>} />
                    <Route path="/admin/components" element={<AuthRoute role="ADMIN"><ComponentAdminPanel /></AuthRoute>} />

                    {/* wizard guide */}
                    <Route path="wizard" element={<Wizard />} />
                </Route>

                {/* fallback 404 route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </ProjectProvider>
    </BrowserRouter>
);

export default App;
