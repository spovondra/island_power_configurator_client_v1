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
                    {/** default home route */}
                    <Route index element={<Home />} />
                    {/* about page */}
                    <Route path="about" element={<About />} />
                    {/* user settings page */}
                    <Route path="settings" element={<UserSettings />} />
                    {/* project list page */}
                    <Route path="projects" element={<ProjectList />} />
                    {/* new project form */}
                    <Route path="projects/new" element={<ProjectForm />} />
                    {/* project edit form */}
                    <Route path="projects/edit/:id" element={<ProjectForm />} />

                    {/* admin routes */}
                    {/* user management page */}
                    <Route path="/admin/users" element={<AuthRoute role="ADMIN"><UserListAdmin /></AuthRoute>} />
                    {/* project admin panel */}
                    <Route path="/admin/projects" element={<AuthRoute role="ADMIN"><ProjectAdminPanel /></AuthRoute>} />
                    {/* component admin panel */}
                    <Route path="/admin/components" element={<AuthRoute role="ADMIN"><ComponentAdminPanel /></AuthRoute>} />

                    {/* wizard guide */}
                    <Route path="wizard" element={<Wizard />} />
                </Route>

                {/* 404 page */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </ProjectProvider>
    </BrowserRouter>
);

export default App;
