import React, { useState, useEffect, useContext } from 'react';
import { getProjectById, updateProject, createProject } from '../../services/ProjectService';
import { ProjectContext } from '../../context/ProjectContext';
import { useLocation } from 'react-router-dom';
import './Step1_Introduction.css';

const Step1Introduction = () => {
    const { selectedProject, setSelectedProject } = useContext(ProjectContext);
    const location = useLocation();
    const { project, isNewProject } = location.state || {};

    const [name, setName] = useState(isNewProject ? '' : project?.name || '');
    const [error, setError] = useState('');
    const [newProjectId, setNewProjectId] = useState(null);
    const [isProjectCreated, setIsProjectCreated] = useState(false);

    useEffect(() => {
        if (isNewProject && name && name.length === 1 && !isProjectCreated) {
            const createNewProject = async () => {
                try {
                    const newProjectData = { name: name };
                    const createdProject = await createProject(newProjectData);
                    setNewProjectId(createdProject.id);
                    setSelectedProject(createdProject.id); // Update context with new project ID
                    setIsProjectCreated(true); // Mark project as created
                } catch (error) {
                    console.error('Error creating new project:', error);
                    setError('Error creating new project');
                }
            };

            createNewProject();
        }
    }, [name, isNewProject, isProjectCreated, setSelectedProject]);

    useEffect(() => {
        const saveProjectData = async () => {
            if (!name) return;

            try {
                if (newProjectId) {
                    const updatedProjectData = { name: name };
                    await updateProject(newProjectId, updatedProjectData);
                } else if (!isNewProject && selectedProject) {
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
        <div className="step1-intro-wrapper">
            <div className="step1-intro-container">
                <h2>Introduction</h2>
                <div className="step1-form-group">
                    <label htmlFor="projectName">Project Name:</label>
                    <input
                        id="projectName"
                        type="text"
                        className="step1-form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="step1-error-message">{error}</p>}
            </div>
        </div>
    );
};

export default Step1Introduction;
