import React, { useContext, useEffect, useState } from 'react';
import { ProjectContext } from '../../context/ProjectContext'; // Adjust the path as needed
import { getUserProjects } from '../../services/ProjectService';
import './Step1_Introduction.css'; // Import your custom CSS file for Step1_Introduction

const Step1_Introduction = () => {
    const { selectedProject, setSelectedProject } = useContext(ProjectContext);

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectsData = await getUserProjects();
                setProjects(projectsData);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className="step1-container">
            <div className="form-group">
                <label htmlFor="projectSelect">Select Project:</label>
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
        </div>
    );
};

export default Step1_Introduction;
