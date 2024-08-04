// src/context/ProjectContext.js
import React, { createContext, useState } from 'react';

// Vytvoření kontextu
export const ProjectContext = createContext();

// Vytvoření Provideru
export const ProjectProvider = ({ children }) => {
    const [selectedProject, setSelectedProject] = useState('');

    return (
        <ProjectContext.Provider value={{ selectedProject, setSelectedProject }}>
            {children}
        </ProjectContext.Provider>
    );
};
