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
                        <td>{`${project.location.latitude}, ${project.location.longitude}`}</td>
                        <td>{`${project.temperature.min} to ${project.temperature.max}`}</td>
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
