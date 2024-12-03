import React, { createContext, useState } from 'react';

/**
 * React context for managing the selected project.
 *
 * @module ProjectContext
 */
const ProjectContext = createContext();

/**
 * Provider component for ProjectContext, managing the selected project state.
 *
 * @component
 * @param {object} props - The component props.
 * @param {JSX.Element} props.children - The child components that will have access to the context.
 * @returns {JSX.Element} The provider wrapping its children with the ProjectContext.
 */
const ProjectProvider = ({ children }) => {
    const [selectedProject, setSelectedProject] = useState(null);

    return (
        <ProjectContext.Provider value={{ selectedProject, setSelectedProject }}>
            {children}
        </ProjectContext.Provider>
    );
};

export { ProjectContext, ProjectProvider };
