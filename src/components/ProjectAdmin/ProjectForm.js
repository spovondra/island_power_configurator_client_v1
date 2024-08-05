import React, { useState, useEffect } from 'react';

// Helper function to initialize empty component categories
const initializeComponents = () => ({
    appliances: [],
    solarPanels: [],
    controllers: [],
    batteries: [],
    inverters: []
});

const ProjectForm = ({ formData, handleSubmit, onClose }) => {
    const [localFormData, setLocalFormData] = useState({
        name: '',
        site: {
            latitude: '',
            longitude: '',
            minTemperature: '',
            maxTemperature: '',
            panelAngle: '',
            panelAspect: '',
            usedOptimalValues: false,
            monthlyIrradianceList: []
        },
        solarComponents: initializeComponents()
    });

    useEffect(() => {
        if (formData) {
            setLocalFormData({
                name: formData.name || '',
                site: {
                    latitude: formData.site?.latitude || '',
                    longitude: formData.site?.longitude || '',
                    minTemperature: formData.site?.minTemperature || '',
                    maxTemperature: formData.site?.maxTemperature || '',
                    panelAngle: formData.site?.panelAngle || '',
                    panelAspect: formData.site?.panelAspect || '',
                    usedOptimalValues: formData.site?.usedOptimalValues || false,
                    monthlyIrradianceList: formData.site?.monthlyIrradianceList || []
                },
                solarComponents: {
                    appliances: formData.solarComponents?.appliances || [],
                    solarPanels: formData.solarComponents?.solarPanels || [],
                    controllers: formData.solarComponents?.controllers || [],
                    batteries: formData.solarComponents?.batteries || [],
                    inverters: formData.solarComponents?.inverters || []
                }
            });
        }
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSiteChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLocalFormData(prevData => ({
            ...prevData,
            site: {
                ...prevData.site,
                [name]: type === 'checkbox' ? checked : value
            }
        }));
    };

    const handleSubmitClick = (e) => {
        e.preventDefault();
        handleSubmit(localFormData);
    };

    return (
        <form onSubmit={handleSubmitClick}>
            <div>
                <label htmlFor="name">Project Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={localFormData.name || ''}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <h3>Site Information</h3>
                <label htmlFor="latitude">Latitude:</label>
                <input
                    type="number"
                    id="latitude"
                    name="latitude"
                    value={localFormData.site?.latitude || ''}
                    onChange={handleSiteChange}
                    required
                />
                <label htmlFor="longitude">Longitude:</label>
                <input
                    type="number"
                    id="longitude"
                    name="longitude"
                    value={localFormData.site?.longitude || ''}
                    onChange={handleSiteChange}
                    required
                />
                <label htmlFor="minTemperature">Min Temperature:</label>
                <input
                    type="number"
                    id="minTemperature"
                    name="minTemperature"
                    value={localFormData.site?.minTemperature || ''}
                    onChange={handleSiteChange}
                />
                <label htmlFor="maxTemperature">Max Temperature:</label>
                <input
                    type="number"
                    id="maxTemperature"
                    name="maxTemperature"
                    value={localFormData.site?.maxTemperature || ''}
                    onChange={handleSiteChange}
                />
                <label htmlFor="panelAngle">Panel Angle:</label>
                <input
                    type="number"
                    id="panelAngle"
                    name="panelAngle"
                    value={localFormData.site?.panelAngle || ''}
                    onChange={handleSiteChange}
                />
                <label htmlFor="panelAspect">Panel Aspect:</label>
                <input
                    type="number"
                    id="panelAspect"
                    name="panelAspect"
                    value={localFormData.site?.panelAspect || ''}
                    onChange={handleSiteChange}
                />
                <label htmlFor="usedOptimalValues">Used Optimal Values:</label>
                <input
                    type="checkbox"
                    id="usedOptimalValues"
                    name="usedOptimalValues"
                    checked={localFormData.site?.usedOptimalValues || false}
                    onChange={handleSiteChange}
                />
            </div>

            <div>
                <h3>Monthly Irradiance</h3>
                {/* Here you would add a way to dynamically add/remove months of irradiance */}
                <p>Details for monthly irradiance will be added here later.</p>
            </div>

            <div>
                <h3>Solar Components</h3>
                {Object.keys(localFormData.solarComponents).map(category => (
                    <div key={category}>
                        <h4>{category}</h4>
                        {/* Currently displaying only the category name */}
                        <p>Component details for {category} will be added here later.</p>
                    </div>
                ))}
            </div>

            <div>
                <button type="submit">Save</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </div>
        </form>
    );
};

export default ProjectForm;
