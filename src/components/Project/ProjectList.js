import React, { useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProjects, deleteProject, createProject, updateProject } from '../../services/ProjectService'; // Adjust imports if needed
import Modal from '../Modal/Modal';
import ProjectForm from './ProjectForm';

const projectReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, projects: action.payload };
        case 'FETCH_FAILURE':
            return { ...state, loading: false, error: action.payload };
        case 'DELETE_PROJECT':
            return {
                ...state,
                projects: state.projects.filter(project => project.id !== action.payload)
            };
        case 'OPEN_MODAL':
            return { ...state, isModalOpen: true, selectedProject: action.payload };
        case 'CLOSE_MODAL':
            return { ...state, isModalOpen: false, selectedProject: null };
        default:
            return state;
    }
};

const initialState = {
    projects: [],
    loading: false,
    error: null,
    isModalOpen: false,
    selectedProject: null
};

const ProjectList = () => {
    const [state, dispatch] = useReducer(projectReducer, initialState);
    useNavigate();

    const fetchProjects = async () => {
        dispatch({ type: 'FETCH_START' });
        try {
            const data = await getUserProjects(); // Fetch projects specific to the logged-in user
            console.log('Fetched projects:', data);
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (error) {
            console.error('Error fetching projects:', error.message);
            dispatch({ type: 'FETCH_FAILURE', payload: error.message });
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (projectId) => {
        console.log('Deleting project with ID:', projectId);
        try {
            await deleteProject(projectId);
            dispatch({ type: 'DELETE_PROJECT', payload: projectId });
            console.log('Project deleted:', projectId);
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const handleCreate = () => {
        console.log('Opening modal to create a new project');
        dispatch({ type: 'OPEN_MODAL', payload: null });
    };

    const handleEdit = (project) => {
        console.log('Opening modal to edit project:', project);
        dispatch({ type: 'OPEN_MODAL', payload: project });
    };

    const handleSubmit = async (formData) => {
        console.log('Submitting form data:', formData);
        if (state.selectedProject) {
            // Edit existing project
            try {
                await updateProject(state.selectedProject.id, formData);
                console.log('Project updated:', state.selectedProject.id);
                dispatch({ type: 'CLOSE_MODAL' });
                await fetchProjects(); // Refresh the list after update
            } catch (error) {
                console.error('Failed to update project:', error);
            }
        } else {
            // Create new project
            try {
                await createProject(formData);
                console.log('New project created');
                dispatch({ type: 'CLOSE_MODAL' });
                await fetchProjects(); // Refresh the list after creation
            } catch (error) {
                console.error('Failed to create project:', error);
            }
        }
    };

    const handleCloseModal = () => {
        console.log('Closing modal');
        dispatch({ type: 'CLOSE_MODAL' });
    };

    if (state.loading) return <p>Loading...</p>;
    if (state.error) return <p>Error: {state.error}</p>;

    return (
        <div>
            <h2>Projects</h2>
            <button onClick={handleCreate}>Create New Project</button>
            <ul>
                {state.projects.map(project => (
                    <li key={project.id}>
                        {project.name}
                        <button onClick={() => handleEdit(project)}>Edit</button>
                        <button onClick={() => handleDelete(project.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <Modal
                isOpen={state.isModalOpen}
                onClose={handleCloseModal}
                title={state.selectedProject ? 'Edit Project' : 'Add Project'}
            >
                <ProjectForm
                    formData={state.selectedProject || {
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
                    }}
                    handleInputChange={(e, category, componentId) => {
                        console.log('Input change in form:', { e, category, componentId });
                        // Implement input change handling if needed
                    }}
                    handleSubmit={handleSubmit}
                    onClose={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default ProjectList;
