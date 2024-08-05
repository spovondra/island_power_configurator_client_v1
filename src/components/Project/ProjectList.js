import React, { useReducer, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProjects, deleteProject } from '../../services/ProjectService';
import { ProjectContext } from '../../context/ProjectContext';
import { projectReducer, initialState } from '../../reducers/projectReducer';

const ProjectList = () => {
    const [state, dispatch] = useReducer(projectReducer, initialState);
    const { setSelectedProject } = useContext(ProjectContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            dispatch({ type: 'FETCH_START' });
            try {
                const data = await getUserProjects();
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (error) {
                dispatch({ type: 'FETCH_FAILURE', payload: error.message });
            }
        };

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
        setSelectedProject(project.id);
        navigate('/wizard', { state: { isNewProject: false, project } });
    };

    const handleCreateNewProject = () => {
        setSelectedProject(null); // Ensure the selected project is null for new project creation
        navigate('/wizard', { state: { isNewProject: true } });
    };

    if (state.loading) return <p>Loading...</p>;
    if (state.error) return <p>Error: {state.error}</p>;

    return (
        <div>
            <h2>Projects</h2>
            <button onClick={handleCreateNewProject}>Create New Project</button>
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
