import React, { useState, useEffect, useContext, useCallback } from 'react';
import { getProjectById, updateProject, createProject } from '../../services/ProjectService';
import { ProjectContext } from '../../context/ProjectContext';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Step1_Introduction.css';

const Step1Introduction = ({ onComplete }) => {
    const { t } = useTranslation('wizard');
    const { selectedProject, setSelectedProject } = useContext(ProjectContext);
    const location = useLocation();
    const { project, isNewProject } = location.state || {};

    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [newProjectId, setNewProjectId] = useState(null);

    useEffect(() => {
        // Load existing project name
        if (!isNewProject && selectedProject) {
            const loadProjectName = async () => {
                try {
                    const existingProject = await getProjectById(selectedProject);
                    setName(existingProject.name);
                } catch (error) {
                    console.error('Error loading project:', error);
                    setError(t('step1.error_message'));
                }
            };
            loadProjectName();
        } else if (isNewProject && project) {
            setName(project.name || '');
        }
    }, [isNewProject, selectedProject, project, t]);

    const handleSaveProject = useCallback(async (projectName) => {
        try {
            if (isNewProject && !newProjectId) {
                // Create a new project
                const createdProject = await createProject({ name: projectName });
                setNewProjectId(createdProject.id);
                setSelectedProject(createdProject.id);
            } else if (newProjectId || selectedProject) {
                // Update existing project
                const projectId = newProjectId || selectedProject;
                await updateProject(projectId, { name: projectName });
            }
        } catch (error) {
            console.error('Error saving project data:', error);
            setError(t('step1.error_message'));
        }
    }, [isNewProject, newProjectId, selectedProject, setSelectedProject, t]);

    // Debounce saving project to avoid multiple requests
    useEffect(() => {
        if (name) {
            const timeoutId = setTimeout(() => handleSaveProject(name), 500);
            return () => clearTimeout(timeoutId); // Clear timeout on name change
        }
    }, [name, handleSaveProject]);

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
