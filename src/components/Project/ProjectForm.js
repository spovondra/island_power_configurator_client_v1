import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, createProject, updateProject } from '../../services/ProjectService';

const ProjectForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState({
        name: '',
        location: { latitude: '', longitude: '' },
        temperature: { min: '', max: '' },
        solarComponents: {
            appliances: {},
            solarPanels: {},
            controllers: {},
            batteries: {},
            inverters: {},
            accessories: {}
        }
    });
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (id) {
            setIsEdit(true);
            const fetchProject = async () => {
                try {
                    const data = await getProjectById(id);
                    setProject(data);
                } catch (error) {
                    console.error('Failed to fetch project', error);
                }
            };
            fetchProject();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const [field, subfield] = name.split('.');

        if (subfield) {
            setProject(prevProject => ({
                ...prevProject,
                [field]: {
                    ...prevProject[field],
                    [subfield]: value
                }
            }));
        } else {
            setProject(prevProject => ({
                ...prevProject,
                [name]: value
            }));
        }
    };

    const handleComponentChange = (e, category, componentId) => {
        const { name, value } = e.target;
        setProject(prevProject => ({
            ...prevProject,
            solarComponents: {
                ...prevProject.solarComponents,
                [category]: {
                    ...prevProject.solarComponents[category],
                    [componentId]: {
                        ...prevProject.solarComponents[category][componentId],
                        [name]: value
                    }
                }
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await updateProject(id, project);
            } else {
                await createProject(project);
            }
            navigate('/projects');
        } catch (error) {
            console.error('Failed to save project', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="project-form">
            <input
                type="text"
                name="name"
                value={project.name}
                onChange={handleChange}
                placeholder="Project Name"
                required
            />
            <input
                type="number"
                name="location.latitude"
                value={project.location.latitude}
                onChange={handleChange}
                placeholder="Latitude"
                required
            />
            <input
                type="number"
                name="location.longitude"
                value={project.location.longitude}
                onChange={handleChange}
                placeholder="Longitude"
                required
            />
            <input
                type="number"
                name="temperature.min"
                value={project.temperature.min}
                onChange={handleChange}
                placeholder="Min Temperature"
                required
            />
            <input
                type="number"
                name="temperature.max"
                value={project.temperature.max}
                onChange={handleChange}
                placeholder="Max Temperature"
                required
            />
            {project.solarComponents && Object.keys(project.solarComponents).map(category => (
                <div key={category}>
                    <h3>{category}</h3>
                    {project.solarComponents[category] && Object.keys(project.solarComponents[category]).map(componentId => (
                        <div key={componentId}>
                            <input
                                type="number"
                                name="quantity"
                                value={project.solarComponents[category][componentId].quantity}
                                onChange={(e) => handleComponentChange(e, category, componentId)}
                                placeholder={`${category} Quantity`}
                            />
                        </div>
                    ))}
                </div>
            ))}
            <button type="submit">{isEdit ? 'Update' : 'Create'} Project</button>
        </form>
    );
};

export default ProjectForm;
