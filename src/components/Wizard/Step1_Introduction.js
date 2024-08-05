import React, { useState, useEffect, useContext } from 'react';
import { getProjectById, updateProject, createProject } from '../../services/ProjectService';
import { ProjectContext } from '../../context/ProjectContext';
import { useLocation } from 'react-router-dom';

const Step1Introduction = () => {
    const { selectedProject, setSelectedProject } = useContext(ProjectContext);
    const location = useLocation();
    const { project, isNewProject } = location.state || {};

    const [name, setName] = useState(isNewProject ? '' : project?.name || '');
    const [error, setError] = useState('');
    const [newProjectId, setNewProjectId] = useState(null);

    // Effect to handle creation of new project on typing the first letter
    useEffect(() => {
        if (isNewProject && name && name.length === 1) {
            const createNewProject = async () => {
                try {
                    const newProjectData = { name: name };
                    const createdProject = await createProject(newProjectData);
                    setNewProjectId(createdProject.id);
                    setSelectedProject(createdProject.id); // Update context with new project ID
                } catch (error) {
                    console.error('Error creating new project:', error);
                    setError('Error creating new project');
                }
            };

            createNewProject();
        }
    }, [name, isNewProject, setSelectedProject]);

    // Effect to update project name
    useEffect(() => {
        const saveProjectData = async () => {
            if (!name) return;

            try {
                if (newProjectId) {
                    // Handle updating the newly created project
                    const updatedProjectData = { name: name };
                    await updateProject(newProjectId, updatedProjectData);
                } else if (!isNewProject && selectedProject) {
                    // Handle updating existing project
                    const project = await getProjectById(selectedProject);
                    const updatedProjectData = { ...project, name: name };
                    await updateProject(selectedProject, updatedProjectData);
                }
            } catch (error) {
                console.error('Error saving project data:', error);
                setError('Error saving project data');
            }
        };

        saveProjectData();
    }, [name, selectedProject, isNewProject, newProjectId]);

    return (
        <div>
            <h2>Introduction</h2>
            <label>
                Project Name:
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </label>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Step1Introduction;
