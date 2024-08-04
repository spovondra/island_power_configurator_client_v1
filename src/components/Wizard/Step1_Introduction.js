import React, { useState, useEffect, useCallback } from 'react';
import { getProjectById, updateProject } from '../../services/ProjectService';
import { ProjectContext } from '../../context/ProjectContext';
import { useContext } from 'react';

const Step1Introduction = ({ projectName }) => {
    const { selectedProject } = useContext(ProjectContext);
    const [name, setName] = useState(projectName);
    const [error, setError] = useState('');

    // Log when projectName prop changes
    useEffect(() => {
        console.log('Received new projectName prop:', projectName);
        setName(projectName);
    }, [projectName]);

    // Log whenever the name state changes
    useEffect(() => {
        console.log('Project name changed to:', name);

        const saveProjectName = async () => {
            if (!name) {
                return;
            }

            if (selectedProject) {
                try {
                    console.log('Fetching project data for update...');
                    const project = await getProjectById(selectedProject);
                    console.log('Project data fetched:', project);

                    // Update project data with new name
                    const updatedProjectData = {
                        ...project,
                        name: name
                    };

                    console.log('Updating project with data:', updatedProjectData);
                    await updateProject(selectedProject, updatedProjectData);
                    console.log('Project name updated successfully');
                } catch (error) {
                    console.error('Error updating project name:', error);
                    setError('Error updating project name');
                }
            }
        };

        saveProjectName();
    }, [name, selectedProject]);

    return (
        <div>
            <h2>Introduction</h2>
            <p>Content for step 1</p>
            <label>
                Project Name:
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </label>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default Step1Introduction;
