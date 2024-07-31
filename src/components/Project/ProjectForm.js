import React, { useState } from 'react';
import { createProject, updateProject } from '../../services/ProjectService';
import './ProjectForm.css';

const ProjectForm = ({ currentProject, onSave }) => {
    const [form, setForm] = useState(currentProject || { name: '', location: '', appliances: [], solarPanels: [], regulators: [], batteries: [], inverters: [], accessories: [] });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (form.id) {
                await updateProject(form.id, form);
            } else {
                await createProject(form);
            }
            onSave();
        } catch (error) {
            console.error('Error saving project:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="project-form">
            <input
                type="text"
                name="name"
                placeholder="Project Name"
                value={form.name}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="location"
                placeholder="Location"
                value={form.location}
                onChange={handleChange}
                required
            />
            {"spotřebič 1,2..."}
            <button type="submit">Save</button>
        </form>
    );
};

export default ProjectForm;
