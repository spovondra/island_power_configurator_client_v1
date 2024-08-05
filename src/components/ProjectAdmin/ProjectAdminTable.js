import React from 'react';

const ProjectTable = ({ projects, handleSelectProject, handleDeleteProject }) => {
    return (
        <div>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Temperature</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {projects.map(project => (
                    <tr key={project.id}>
                        <td>{project.id}</td>
                        <td>{project.name}</td>
                        <td>{`${project.site.latitude}, ${project.site.longitude}`}</td>
                        <td>{`${project.site.minTemperature} to ${project.site.maxTemperature}`}</td>
                        <td>
                            <button onClick={() => handleSelectProject(project)}>Edit</button>
                            <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectTable;
