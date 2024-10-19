import React, { useEffect, useReducer, useState } from 'react';
import { createProject, deleteProject, getAllProjects, updateProject } from '../../services/ProjectService';
import { useNavigate } from 'react-router-dom';
import ProjectForm from './ProjectForm';
import Modal from '../Modal/Modal';
import './ProjectAdminPanel.css';
import { useTranslation } from 'react-i18next'; // Import translation hook

const initialState = {
    projects: [],
    error: '',
    isLoading: true,
    isModalOpen: false,
    selectedProject: null,
    modalContent: null,
};

const projectReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            return { ...state, projects: action.payload, isLoading: false };
        case 'FETCH_ERROR':
            return { ...state, error: action.payload, isLoading: false, isModalOpen: true, modalContent: 'error' };
        case 'SET_SELECTED_PROJECT':
            return { ...state, selectedProject: action.payload, isModalOpen: true, modalContent: 'form' };
        case 'ADD_PROJECT':
            return { ...state, projects: [...state.projects, action.payload], selectedProject: null, isModalOpen: false };
        case 'UPDATE_PROJECT':
            return {
                ...state,
                projects: state.projects.map(project =>
                    project.id === action.payload.id ? action.payload : project
                ),
                selectedProject: null,
                isModalOpen: false,
            };
        case 'DELETE_SUCCESS':
            return { ...state, projects: state.projects.filter(project => project.id !== action.payload) };
        case 'CLOSE_MODAL':
            return { ...state, isModalOpen: false };
        default:
            return state;
    }
};

const ProjectAdminPanel = () => {
    const [state, dispatch] = useReducer(projectReducer, initialState);
    const { projects, error, isLoading, isModalOpen, selectedProject, modalContent } = state;
    const { t } = useTranslation('admin'); // Translation hook
    const [formData, setFormData] = useState({
        name: '',
        site: {
            latitude: '',
            longitude: '',
            minTemperature: '',
            maxTemperature: '',
            panelAngle: '',
            panelAspect: '',
            usedOptimalValues: false,
            monthlyIrradianceList: []
        },
        solarComponents: {
            appliances: [],
            solarPanels: [],
            controllers: [],
            batteries: [],
            inverters: [],
            accessories: []
        }
    });
    const navigate = useNavigate();

    const fetchProjects = async () => {
        try {
            const data = await getAllProjects();
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR', payload: error.message });
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleUpdateProject = async (formData) => {
        try {
            const updatedProject = await updateProject(selectedProject.id, formData);
            dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
            alert(t('projectAdminPanel.project_updated'));
            await fetchProjects();
        } catch (error) {
            alert(t('projectAdminPanel.failed_to_update'));
        }
    };

    const handleAddProject = async (formData) => {
        try {
            const newProject = await createProject(formData);
            dispatch({ type: 'ADD_PROJECT', payload: newProject });
            alert(t('projectAdminPanel.project_added'));
            await fetchProjects();
        } catch (error) {
            alert(t('projectAdminPanel.failed_to_add'));
        }
    };

    const handleDeleteProject = async (projectId) => {
        try {
            await deleteProject(projectId);
            dispatch({ type: 'DELETE_SUCCESS', payload: projectId });
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR', payload: error.message });
        }
    };

    const handleSelectProject = (project) => {
        setFormData({
            name: project.name || '',
            site: {
                latitude: project.site?.latitude || '',
                longitude: project.site?.longitude || '',
                minTemperature: project.site?.minTemperature || '',
                maxTemperature: project.site?.maxTemperature || '',
                panelAngle: project.site?.panelAngle || '',
                panelAspect: project.site?.panelAspect || '',
                usedOptimalValues: project.site?.usedOptimalValues || false,
                monthlyIrradianceList: project.site?.monthlyIrradianceList || []
            },
            solarComponents: {
                appliances: project.solarComponents?.appliances || [],
                solarPanels: project.solarComponents?.solarPanels || [],
                controllers: project.solarComponents?.controllers || [],
                batteries: project.solarComponents?.batteries || [],
                inverters: project.solarComponents?.inverters || [],
                accessories: project.solarComponents?.accessories || []
            }
        });
        dispatch({ type: 'SET_SELECTED_PROJECT', payload: project });
    };

    const handleCloseModal = () => {
        dispatch({ type: 'CLOSE_MODAL' });
    };

    return (
        <div className="project-admin-panel-container">
            <h2>{t('projectAdminPanel.title')}</h2>
            <button className="project-add-button" onClick={() => handleSelectProject({})}>
                {t('projectAdminPanel.add_project')}
            </button>
            {isLoading ? (
                <p>{t('projectAdminPanel.loading')}</p>
            ) : (
                <div>
                    <table className="project-table">
                        <thead>
                        <tr>
                            <th>{t('projectAdminPanel.id')}</th>
                            <th>{t('projectAdminPanel.name')}</th>
                            <th>{t('projectAdminPanel.location')}</th>
                            <th>{t('projectAdminPanel.temperature')}</th>
                            <th>{t('projectAdminPanel.actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {projects.map(project => (
                            <tr key={project.id}>
                                <td>{project.id}</td>
                                <td>{project.name}</td>
                                <td>{project.site ? `${project.site.latitude}, ${project.site.longitude}` : 'N/A'}</td>
                                <td>{project.site ? `${project.site.minTemperature} to ${project.site.maxTemperature}` : 'N/A'}</td>
                                <td>
                                    <button className="project-table-button project-table-button-edit" onClick={() => handleSelectProject(project)}>
                                        {t('projectAdminPanel.edit_button')}
                                    </button>
                                    <button className="project-table-button project-table-button-delete" onClick={() => handleDeleteProject(project.id)}>
                                        {t('projectAdminPanel.delete_button')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <Modal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        title={modalContent === 'form' ? (selectedProject ? t('projectAdminPanel.edit_project') : t('projectAdminPanel.add_project_modal')) : t('projectAdminPanel.error')}
                    >
                        {modalContent === 'form' ? (
                            <ProjectForm
                                formData={formData}
                                handleSubmit={selectedProject ? handleUpdateProject : handleAddProject}
                                onClose={handleCloseModal}
                            />
                        ) : (
                            <p>{error}</p>
                        )}
                    </Modal>
                </div>
            )}
        </div>
    );
};

export default ProjectAdminPanel;
