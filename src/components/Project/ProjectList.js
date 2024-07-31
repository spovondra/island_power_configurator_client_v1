import React, { useEffect, useState } from 'react';
import { getProjects, deleteProject } from '../../services/ProjectService';
import ProjectForm from './ProjectForm';
import './ProjectList.css';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [currentProject, setCurrentProject] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteProject(id);
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const handleEdit = (project) => {
        setCurrentProject(project);
    };

    const handleSave = () => {
        setCurrentProject(null);
        fetchProjects();
    };

    return (
        <div>
            <h2>Project List</h2>
            <ProjectForm currentProject={currentProject} onSave={handleSave} />
            <ul>
                {projects.map((project) => (
                    <li key={project.id}>
                        {project.name} - {project.location}
                        <button onClick={() => handleEdit(project)}>Edit</button>
                        <button onClick={() => handleDelete(project.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProjectList;
