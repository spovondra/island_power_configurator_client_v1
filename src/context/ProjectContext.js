import React, { createContext, useState } from 'react';

const ProjectContext = createContext();

const ProjectProvider = ({ children }) => {
    const [selectedProject, setSelectedProject] = useState(null);

    return (
        <ProjectContext.Provider value={{ selectedProject, setSelectedProject }}>
            {children}
        </ProjectContext.Provider>
    );
};

export { ProjectContext, ProjectProvider };
