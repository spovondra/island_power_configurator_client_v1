import { useReducer, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProjects, deleteProject } from '../../services/ProjectService';
import { ProjectContext } from '../../context/ProjectContext';
import { projectReducer, initialState } from '../../reducers/projectReducer';
import './ProjectList.css';

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

    const handleProjectAction = (projectId) => {
        setSelectedProject(projectId);
        navigate('/wizard', { state: { isNewProject: false, projectId } });
    };

    const handleCreateNewProject = () => {
        setSelectedProject(null); // Ensure the selected project is null for new project creation
        navigate('/wizard', { state: { isNewProject: true } });
    };

    if (state.loading) return <p>Loading...</p>;
    if (state.error) return <p>Error: {state.error}</p>;

    return (
        <div className="project-list">
            <h2>Projects</h2>
            <button className="create" onClick={handleCreateNewProject}>Create New Project</button>
            <div className="projects-container">
                {state.projects.map(project => (
                    <div key={project.id} className="project-item">
                        <span className="project-name">{project.name}</span>
                        <div className="project-actions">
                            <button className="edit" onClick={() => handleProjectAction(project.id)}>Edit / Start Wizard</button>
                            <button className="delete" onClick={() => handleDelete(project.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectList;
