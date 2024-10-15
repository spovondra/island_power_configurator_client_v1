import React, { useState, useEffect, useContext } from 'react';
import { getProjectById, updateProject, createProject } from '../../services/ProjectService';
import { ProjectContext } from '../../context/ProjectContext';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import translation hook
import './Step1_Introduction.css';

const Step1Introduction = () => {
    const { t } = useTranslation('wizard'); // Use the 'wizard' namespace for translations
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
                    setError(t('step1.error_message')); // Use translated error message
                }
            };

            createNewProject();
        }
    }, [name, isNewProject, isProjectCreated, setSelectedProject, t]);

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
                setError(t('step1.error_message')); // Use translated error message
            }
        };

        saveProjectData();
    }, [name, selectedProject, isNewProject, newProjectId, t]);

    return (
        <div className="step1-intro-wrapper">
            <div className="step1-intro-container">
                <h2>{t('step1.title')}</h2>
                <div className="step1-form-group">
                    <label htmlFor="projectName">{t('step1.project_name_label')}</label>
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
