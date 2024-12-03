import React, { useEffect, useReducer, useState } from 'react';
import { createProject, deleteProject, getAllProjects, updateProject } from '../../services/ProjectService';
import Modal from '../Modal/Modal';
import ProjectForm from './ProjectForm';
import './ProjectAdminPanel.css';
import { useTranslation } from 'react-i18next';

/**
 * Project Admin Panel Module
 *
 * @module ProjectAdminPanel
 */

/**
 * Initial state for the project admin panel.
 *
 * @constant
 * @type {object}
 */
const initialState = {
    projects: [],
    error: '',
    isLoading: true,
    isModalOpen: false,
    selectedProject: null,
    modalContent: null,
};

/**
 * Reducer function to manage the project admin panel state.
 *
 * @function projectReducer
 * @param {object} state - The current state.
 * @param {object} action - The dispatched action.
 * @returns {object} The updated state.
 */
const projectReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            return { ...state, projects: action.payload, isLoading: false };
        case 'FETCH_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'ADD_PROJECT':
            return { ...state, projects: [...state.projects, action.payload], selectedProject: null, isModalOpen: false };
        case 'UPDATE_PROJECT':
            return {
                ...state,
                projects: state.projects.map((project) =>
                    project.id === action.payload.id ? action.payload : project
                ),
                selectedProject: null,
                isModalOpen: false,
            };
        case 'DELETE_SUCCESS':
            return { ...state, projects: state.projects.filter((project) => project.id !== action.payload) };
        case 'SET_SELECTED_PROJECT':
            return { ...state, selectedProject: action.payload, isModalOpen: true, modalContent: 'form' };
        case 'CLOSE_MODAL':
            return { ...state, isModalOpen: false, selectedProject: null };
        default:
            return state;
    }
};

/**
 * ProjectAdminPanel component for managing projects in an admin interface.
 *
 * @component
 * @returns {JSX.Element} The rendered project admin panel.
 */
const ProjectAdminPanel = () => {
    const [state, dispatch] = useReducer(projectReducer, initialState);
    const { projects, error, isLoading, isModalOpen, selectedProject } = state;
    const { t } = useTranslation('admin'); // Translation hook
    const [formData, setFormData] = useState({}); // State for form data

    /**
     * Fetches the list of projects.
     *
     * @async
     * @function fetchProjects
     * @returns {Promise<void>} Resolves when projects are fetched.
     */
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getAllProjects();
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (error) {
                dispatch({ type: 'FETCH_ERROR', payload: error.message });
            }
        };

        fetchProjects();
    }, []);

    /**
     * Adds a new project.
     *
     * @async
     * @function handleAddProject
     * @param {object} formData - The project data to add.
     * @returns {Promise<void>} Resolves when the project is added.
     */
    const handleAddProject = async (formData) => {
        try {
            const newProject = await createProject(formData);
            dispatch({ type: 'ADD_PROJECT', payload: newProject });
            alert(t('projectAdminPanel.project_added'));
        } catch (error) {
            console.error('Error adding project:', error);
            alert(t('projectAdminPanel.failed_to_add'));
        }
    };

    /**
     * Updates an existing project.
     *
     * @async
     * @function handleUpdateProject
     * @param {object} formData - The updated project data.
     * @returns {Promise<void>} Resolves when the project is updated.
     */
    const handleUpdateProject = async (formData) => {
        try {
            const existingProject = projects.find((project) => project.id === selectedProject.id);

            const updatedData = {
                ...existingProject,
                ...formData,
                site: {
                    ...existingProject.site,
                    ...formData.site,
                },
                solarComponents: {
                    ...existingProject.solarComponents,
                    ...formData.solarComponents,
                },
            };

            const updatedProject = await updateProject(selectedProject.id, updatedData);
            dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
            alert(t('projectAdminPanel.project_updated'));
        } catch (error) {
            console.error('Error updating project:', error);
            alert(t('projectAdminPanel.failed_to_update'));
        }
    };

    /**
     * Deletes a project.
     *
     * @async
     * @function handleDeleteProject
     * @param {string} projectId - The ID of the project to delete.
     * @returns {Promise<void>} Resolves when the project is deleted.
     */
    const handleDeleteProject = async (projectId) => {
        try {
            await deleteProject(projectId);
            dispatch({ type: 'DELETE_SUCCESS', payload: projectId });
            alert(t('projectAdminPanel.project_deleted'));
        } catch (error) {
            console.error('Error deleting project:', error);
            alert(t('projectAdminPanel.failed_to_delete'));
        }
    };

    /**
     * Selects a project for editing.
     *
     * @function handleSelectProject
     * @param {object} project - The selected project.
     */
    const handleSelectProject = (project) => {
        setFormData({
            name: project.name || '',
            site: project.site || {},
            solarComponents: project.solarComponents || {},
        });
        dispatch({ type: 'SET_SELECTED_PROJECT', payload: project });
    };

    /**
     * Initializes a new project for creation.
     *
     * @function handleCreateProject
     */
    const handleCreateProject = () => {
        setFormData({
            name: '',
            site: {
                latitude: '',
                longitude: '',
            },
            solarComponents: {},
        });
        dispatch({ type: 'SET_SELECTED_PROJECT', payload: null });
    };

    /**
     * Closes the modal and resets the form.
     *
     * @function handleCloseModal
     */
    const handleCloseModal = () => {
        dispatch({ type: 'CLOSE_MODAL' });
        setFormData({});
    };

    return (
        <div className="project-admin-panel-container">
            <h2>{t('projectAdminPanel.title')}</h2>
            <button className="project-add-button" onClick={handleCreateProject}>
                {t('projectAdminPanel.add_project')}
            </button>
            {isLoading ? (
                <p>{t('projectAdminPanel.loading')}</p>
            ) : (
                <table className="project-table">
                    <thead>
                    <tr>
                        <th>{t('projectAdminPanel.id')}</th>
                        <th>{t('projectAdminPanel.name')}</th>
                        <th>{t('projectAdminPanel.location')}</th>
                        <th>{t('projectAdminPanel.actions')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {projects.map((project) => (
                        <tr key={project.id}>
                            <td>{project.id}</td>
                            <td>{project.name}</td>
                            <td>
                                {project.site?.latitude && project.site?.longitude
                                    ? `${project.site.latitude}, ${project.site.longitude}`
                                    : t('projectAdminPanel.location_unavailable')}
                            </td>
                            <td>
                                <button
                                    className="project-table-button project-table-button-edit"
                                    onClick={() => handleSelectProject(project)}
                                >
                                    {t('projectAdminPanel.edit_button')}
                                </button>
                                <button
                                    className="project-table-button project-table-button-delete"
                                    onClick={() => handleDeleteProject(project.id)}
                                >
                                    {t('projectAdminPanel.delete_button')}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={
                        selectedProject
                            ? t('projectAdminPanel.edit_project')
                            : t('projectAdminPanel.add_project_modal')
                    }
                >
                    <ProjectForm
                        formData={formData}
                        handleSubmit={selectedProject ? handleUpdateProject : handleAddProject}
                        onClose={handleCloseModal}
                    />
                </Modal>
            )}
            {error && <p className="error-message">{t('projectAdminPanel.error')}: {error}</p>}
        </div>
    );
};

export default ProjectAdminPanel;
