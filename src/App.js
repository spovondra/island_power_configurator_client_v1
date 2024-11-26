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

import "./App.css"
import ComponentAdminPanel from "./components/ComponentAdmin/ComponentAdminPanel";

/**
 * Main application component defining routing and context.
 *
 * @component
 * @returns {JSX.Element} Main application structure.
 */
const App = () => (
    <BrowserRouter>
        <ProjectProvider>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes */}
                <Route path="/" element={<ProtectedRoute><SharedLayout /></ProtectedRoute>}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="settings" element={<UserSettings />} />
                    <Route path="projects" element={<ProjectList />} />
                    <Route path="projects/new" element={<ProjectForm />} />
                    <Route path="projects/edit/:id" element={<ProjectForm />} />

                    {/* Admin routes */}
                    <Route path="/admin/users" element={<AuthRoute role="ADMIN"><UserListAdmin /></AuthRoute>} />
                    <Route path="/admin/projects" element={<AuthRoute role="ADMIN"><ProjectAdminPanel /></AuthRoute>} />
                    <Route path="/admin/components" element={<AuthRoute role="ADMIN"><ComponentAdminPanel /></AuthRoute>} />

                    {/* Wizard guide */}
                    <Route path="wizard" element={<Wizard />} />
                </Route>

                {/* 404 Not Found */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </ProjectProvider>
    </BrowserRouter>
);

export default App;
