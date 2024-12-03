/**
 * @typedef {Object} ProjectState
 * @property {Array} projects - List of projects.
 * @property {boolean} loading - Indicates if the data is being loaded.
 * @property {string} error - Error message, if any.
 */

/**
 * @typedef {function} Dispatch - The dispatch function for the reducer.
 */

import { useReducer, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProjects, deleteProject } from '../../services/ProjectService';
import { ProjectContext } from '../../context/ProjectContext';
import { projectReducer, initialState } from '../../reducers/projectReducer';
import { useTranslation } from 'react-i18next';
import './ProjectList.css';

/**
 * Project List module
 *
 * @module ProjectList
 */

/**
 * Displays the list of projects for the user with options to edit, delete, or create a new project.
 *
 * @component
 * @memberof module:ProjectList
 * @returns {JSX.Element} The rendered project list component.
 */
const ProjectList = () => {
    const [state, dispatch] = useReducer(projectReducer, initialState);
    const { setSelectedProject } = useContext(ProjectContext);
    const navigate = useNavigate();
    const { t } = useTranslation('project');

    useEffect(() => {
        /**
         * Fetches all user projects and updates the state.
         *
         * @async
         * @function fetchProjects
         * @memberof ProjectList
         * @returns {Promise<void>} Resolves when the projects are fetched.
         */
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

    /**
     * Handles deletion of a project and updates the state.
     *
     * @async
     * @function handleDelete
     * @memberof ProjectList
     * @param {string} projectId - The ID of the project to delete.
     * @returns {Promise<void>} Resolves when the project is deleted.
     */
    const handleDelete = async (projectId) => {
        try {
            await deleteProject(projectId);
            dispatch({ type: 'DELETE_PROJECT', payload: projectId });
        } catch (error) {
            console.error(t('error', { error }));
        }
    };

    /**
     * Handles actions (like editing) for a specific project.
     *
     * @function handleProjectAction
     * @memberof ProjectList
     * @param {string} projectId - The ID of the project to edit.
     */
    const handleProjectAction = (projectId) => {
        setSelectedProject(projectId);
        navigate('/wizard', { state: { isNewProject: false, projectId } });
    };

    /**
     * Navigates to the project creation wizard.
     *
     * @function handleCreateNewProject
     * @memberof ProjectList
     */
    const handleCreateNewProject = () => {
        setSelectedProject(null);
        navigate('/wizard', { state: { isNewProject: true } });
    };

    if (state.loading) return <p>{t('loading')}</p>;
    if (state.error) return <p>{t('error', { error: state.error })}</p>;

    return (
        <div className="project-list">
            <h2>{t('title')}</h2>
            <button className="create" onClick={handleCreateNewProject}>{t('create_new_project')}</button>
            <div className="projects-container">
                {state.projects.map(project => (
                    <div key={project.id} className="project-item">
                        <span className="project-name">{project.name}</span>
                        <div className="project-actions">
                            <button className="edit" onClick={() => handleProjectAction(project.id)}>{t('edit')}</button>
                            <button className="delete" onClick={() => handleDelete(project.id)}>{t('delete')}</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectList;
