import React, { useEffect, useReducer, useState } from 'react';
import { createProject, deleteProject, getAllProjects, updateProject } from '../../services/ProjectService'; // Named imports
import { useNavigate } from 'react-router-dom';
import ProjectTable from './ProjectAdminTable'; // Ensure this component exists
import ProjectForm from './ProjectForm'; // Ensure this component exists
import Modal from '../Modal/Modal'; // Ensure this component exists
import './ProjectAdminPanel.css';

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
    const [formData, setFormData] = useState({
        name: '',
        location: { latitude: '', longitude: '' },
        temperature: { min: '', max: '' },
        solarComponents: {
            appliances: {},
            solarPanels: {},
            controllers: {},
            batteries: {},
            inverters: {},
            accessories: {}
        }
    });
    const navigate = useNavigate(); // Use navigate if needed

    const fetchProjects = async () => {
        try {
            const data = await getAllProjects(); // Use named import
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR', payload: error.message });
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleUpdateProject = async (e) => {
        e.preventDefault();
        try {
            const updatedProject = await updateProject(selectedProject.id, formData); // Use named import
            dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
            alert('Project updated successfully');
            await fetchProjects();
        } catch (error) {
            alert('Failed to update project');
        }
    };

    const handleAddProject = async (e) => {
        e.preventDefault();
        try {
            const newProject = await createProject(formData); // Use named import
            dispatch({ type: 'ADD_PROJECT', payload: newProject });
            alert('Project added successfully');
            await fetchProjects();
        } catch (error) {
            alert(`Failed to add project: ${error.message}`);
        }
    };

    const handleDeleteProject = async (projectId) => {
        try {
            await deleteProject(projectId); // Use named import
            dispatch({ type: 'DELETE_SUCCESS', payload: projectId });
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR', payload: error.message });
        }
    };

    const handleSelectProject = (project) => {
        setFormData({
            name: project.name || '',
            location: {
                latitude: project.location?.latitude || '',
                longitude: project.location?.longitude || ''
            },
            temperature: {
                min: project.temperature?.min || '',
                max: project.temperature?.max || ''
            },
            solarComponents: {
                appliances: project.solarComponents?.appliances || {},
                solarPanels: project.solarComponents?.solarPanels || {},
                controllers: project.solarComponents?.controllers || {},
                batteries: project.solarComponents?.batteries || {},
                inverters: project.solarComponents?.inverters || {},
                accessories: project.solarComponents?.accessories || {}
            }
        });
        dispatch({ type: 'SET_SELECTED_PROJECT', payload: project });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const [section, key] = name.split('.');

        if (section === 'location') {
            setFormData(prevFormData => ({
                ...prevFormData,
                location: {
                    ...prevFormData.location,
                    [key]: value
                }
            }));
        } else if (section === 'temperature') {
            setFormData(prevFormData => ({
                ...prevFormData,
                temperature: {
                    ...prevFormData,
                    [key]: value
                }
            }));
        } else if (section === 'solarComponents') {
            // Handle nested components if needed
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value
            }));
        }
    };

    const handleCloseModal = () => {
        dispatch({ type: 'CLOSE_MODAL' });
    };

    return (
        <div className="container">
            <h2>Project Admin Panel</h2>
            <button className="add-project-button" onClick={() => handleSelectProject({})}>Add New Project</button>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <ProjectTable
                        projects={projects}
                        handleSelectProject={handleSelectProject}
                        handleDeleteProject={handleDeleteProject}
                    />
                    <Modal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        title={modalContent === 'form' ? (selectedProject ? 'Edit Project' : 'Add Project') : 'Error'}
                    >
                        {modalContent === 'form' ? (
                            <ProjectForm
                                formData={formData}
                                handleInputChange={handleInputChange}
                                handleSubmit={selectedProject ? handleUpdateProject : handleAddProject}
                            />
                        ) : (
                            <p>{error}</p>
                        )}
                    </Modal>
                </>
            )}
        </div>
    );
};

export default ProjectAdminPanel;
