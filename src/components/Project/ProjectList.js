import React, { useReducer, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProjects, deleteProject } from '../../services/ProjectService';
import { ProjectContext } from '../../context/ProjectContext'; // Ensure this import is correct

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
        default:
            return state;
    }
};

const initialState = {
    projects: [],
    loading: false,
    error: null
};

const ProjectList = () => {
    const [state, dispatch] = useReducer(projectReducer, initialState);
    const context = useContext(ProjectContext);

    if (!context) {
        throw new Error('ProjectContext must be used within a ProjectProvider');
    }

    const { setSelectedProject } = context;
    const navigate = useNavigate();

    const fetchProjects = async () => {
        dispatch({ type: 'FETCH_START' });
        try {
            const data = await getUserProjects();
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (error) {
            dispatch({ type: 'FETCH_FAILURE', payload: error.message });
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (projectId) => {
        try {
            await deleteProject(projectId);
            dispatch({ type: 'DELETE_PROJECT', payload: projectId });
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const handleProjectAction = (project) => {
        setSelectedProject(project.id); // Set selected project in context
        navigate('/wizard', { state: { project } }); // Redirect to wizard
    };

    if (state.loading) return <p>Loading...</p>;
    if (state.error) return <p>Error: {state.error}</p>;

    return (
        <div>
            <h2>Projects</h2>
            <button onClick={() => handleProjectAction({})}>Create New Project</button>
            <ul>
                {state.projects.map(project => (
                    <li key={project.id}>
                        {project.name}
                        <button onClick={() => handleProjectAction(project)}>Edit / Start Wizard</button>
                        <button onClick={() => handleDelete(project.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProjectList;
