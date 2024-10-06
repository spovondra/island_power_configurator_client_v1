import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SharedLayout from './pages/SharedLayout';
import Login from './pages/auth/Login';
import UserList from './components/UserList/UserList';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/auth/Register';
import UserSettings from './components/UserSettings/UserSettings';
import ProjectList from './components/Project/ProjectList';
import ProjectForm from './components/ProjectAdmin/ProjectForm';
import AuthRoute from './components/AuthRoute';
import ProjectAdminPanel from './components/ProjectAdmin/ProjectAdminPanel';
import Location from './pages/Location';
import Wizard from './pages/Wizard';
import NotFound from './pages/NotFound';
import { ProjectProvider } from './context/ProjectContext';

import "./App.css"
import ComponentAdminPanel from "./components/ComponentAdmin/ComponentAdminPanel";

const App = () => {
    return (
        <BrowserRouter>
            <ProjectProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<ProtectedRoute><SharedLayout /></ProtectedRoute>}>
                        <Route index element={<Home />} />
                        <Route path="about" element={<About />} />
                        <Route path="location" element={<Location />} />
                        <Route path="settings" element={<UserSettings />} />
                        <Route path="projects" element={<ProjectList />} />
                        <Route path="projects/new" element={<ProjectForm />} />
                        <Route path="projects/edit/:id" element={<ProjectForm />} />
                        <Route path="/admin/users" element={
                            <AuthRoute role="ADMIN">
                                <UserList />
                            </AuthRoute>}/>
                        <Route path="/admin/projects" element={
                            <AuthRoute role="ADMIN">
                                <ProjectAdminPanel />
                            </AuthRoute>}/>
                        <Route path="/admin/components" element={
                            <AuthRoute role="ADMIN">
                                <ComponentAdminPanel />
                            </AuthRoute>}/>
                        <Route path="wizard" element={<Wizard />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </ProjectProvider>
        </BrowserRouter>
    );
};

export default App;
