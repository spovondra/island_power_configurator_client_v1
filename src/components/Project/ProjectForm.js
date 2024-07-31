import React, { useState, useEffect } from 'react';

const ProjectForm = ({ formData, handleSubmit, onClose }) => {
    const [localFormData, setLocalFormData] = useState(formData);

    useEffect(() => {
        setLocalFormData(formData);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setLocalFormData(prevData => ({
            ...prevData,
            location: {
                ...prevData.location,
                [name]: value
            }
        }));
    };

    const handleTemperatureChange = (e) => {
        const { name, value } = e.target;
        setLocalFormData(prevData => ({
            ...prevData,
            temperature: {
                ...prevData.temperature,
                [name]: value
            }
        }));
    };

    const handleSubmitClick = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        handleSubmit(localFormData); // Call the handleSubmit prop with the localFormData
    };

    return (
        <form onSubmit={handleSubmitClick}>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={localFormData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <h3>Location</h3>
                <label htmlFor="latitude">Latitude:</label>
                <input
                    type="text"
                    id="latitude"
                    name="latitude"
                    value={localFormData.location.latitude}
                    onChange={handleLocationChange}
                    required
                />
                <label htmlFor="longitude">Longitude:</label>
                <input
                    type="text"
                    id="longitude"
                    name="longitude"
                    value={localFormData.location.longitude}
                    onChange={handleLocationChange}
                    required
                />
            </div>
            <div>
                <h3>Temperature</h3>
                <label htmlFor="min">Min Temperature:</label>
                <input
                    type="text"
                    id="min"
                    name="min"
                    value={localFormData.temperature.min}
                    onChange={handleTemperatureChange}
                    required
                />
                <label htmlFor="max">Max Temperature:</label>
                <input
                    type="text"
                    id="max"
                    name="max"
                    value={localFormData.temperature.max}
                    onChange={handleTemperatureChange}
                    required
                />
            </div>
            <div>
                <button type="submit">Save</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </div>
        </form>
    );
};

export default ProjectForm;
