import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProjects, createProject } from '../services/ProjectService';
import { ProjectContext } from '../context/ProjectContext'; // Import the context

const ProjectSelection = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [newProjectName, setNewProjectName] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // For navigation
    const { setSelectedProject: setContextSelectedProject } = useContext(ProjectContext); // Use context

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectsData = await getUserProjects();
                setProjects(projectsData);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleCreateProject = async () => {
        if (!newProjectName.trim()) {
            alert('Project name cannot be empty');
            return;
        }

        try {
            const newProject = await createProject(newProjectName);
            setContextSelectedProject(newProject.id); // Set context state
            navigate('/wizard'); // Redirect to wizard
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Error creating project');
        }
    };

    const handleSelectProject = () => {
        if (!selectedProject) {
            alert('Please select a project');
            return;
        }
        setContextSelectedProject(selectedProject); // Set context state
        navigate('/wizard'); // Redirect to wizard
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="project-selection-container">
            <h1>Select or Create a Project</h1>
            <div className="project-selection">
                <div className="form-group">
                    <label htmlFor="projectSelect">Select Existing Project:</label>
                    <select
                        id="projectSelect"
                        className="form-control"
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                    >
                        <option value="">-- Select Project --</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button className="btn" onClick={handleSelectProject}>Start Wizard</button>
                <div className="form-group">
                    <label htmlFor="newProjectName">Create New Project:</label>
                    <input
                        type="text"
                        id="newProjectName"
                        className="form-control"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        placeholder="Enter new project name"
                    />
                </div>
                <button className="btn" onClick={handleCreateProject}>Create Project</button>
            </div>
        </div>
    );
};

export default ProjectSelection;
