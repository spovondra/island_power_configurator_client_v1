import React, { useContext, useState, useEffect } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { getProjectById } from '../../services/ProjectService';
import './FinalStep.css'; // Import the CSS file

const FinalStep = () => {
    const { selectedProject } = useContext(ProjectContext);
    const [project, setProject] = useState({
        site: {},
        solarComponents: {
            solarPanels: {},
            controllers: {},
            batteries: {},
            inverters: {},
            accessories: {}
        },
        appliances: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            if (selectedProject) {
                try {
                    const data = await getProjectById(selectedProject);
                    setProject(data);
                } catch (err) {
                    setError('Failed to fetch project details.');
                } finally {
                    setLoading(false);
                }
            } else {
                setError('No project ID provided.');
                setLoading(false);
            }
        };

        fetchProject();
    }, [selectedProject]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!project) return <p>No project data available.</p>;

    const site = project.site || {};
    const solarComponents = project.solarComponents || {};
    const appliances = project.appliances || [];

    return (
        <div className="final-step-container">
            <div className="final-step-header">
                <h2>Project Summary</h2>
            </div>
            <div className="final-step-section">
                <h3>Project Details</h3>
                <p><strong>Name:</strong> {project.name || 'N/A'}</p>
                <p><strong>User ID:</strong> {project.userId || 'N/A'}</p>
            </div>

            <div className="final-step-section">
                <h3>Site Information</h3>
                <p><strong>Latitude:</strong> {site.latitude ?? 'N/A'}</p>
                <p><strong>Longitude:</strong> {site.longitude ?? 'N/A'}</p>
                <p><strong>Min Temperature:</strong> {site.minTemperature ?? 'N/A'}</p>
                <p><strong>Max Temperature:</strong> {site.maxTemperature ?? 'N/A'}</p>
                <p><strong>Panel Angle:</strong> {site.panelAngle ?? 'N/A'}</p>
                <p><strong>Panel Aspect:</strong> {site.panelAspect ?? 'N/A'}</p>
                <p><strong>Used Optimal Values:</strong> {site.usedOptimalValues ? 'Yes' : 'No'}</p>
            </div>

            <div className="final-step-section">
                <h3>Monthly Irradiance</h3>
                <ul className="final-step-list">
                    {(site.monthlyIrradianceList ?? []).map((irradiance, index) => (
                        <li key={index}>
                            Month {irradiance.month ?? 'N/A'}: {irradiance.irradiance ?? 'N/A'} kWh/m²
                        </li>
                    ))}
                </ul>
            </div>

            <div className="final-step-section">
                <h3>Solar Components</h3>
                {Object.entries(solarComponents).map(([category, components]) => (
                    category !== 'appliances' && (
                        <div key={category}>
                            <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                            <ul className="final-step-list">
                                {Object.entries(components || {}).map(([id, component]) => (
                                    <li key={id}>
                                        <strong>ID:</strong> {component.id ?? 'N/A'}, <strong>Quantity:</strong> {component.quantity ?? 'N/A'}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                ))}
            </div>

            <div className="final-step-section">
                <h3>Appliances</h3>
                <ul className="final-step-list">
                    {appliances.map((appliance, index) => (
                        <li key={index}>
                            <strong>Name:</strong> {appliance.name ?? 'N/A'}, <strong>Power:</strong> {appliance.power ?? 'N/A'}W, <strong>Quantity:</strong> {appliance.quantity ?? 'N/A'}, <strong>Daily Usage:</strong> {appliance.dailyUsageHours ?? 'N/A'} hours
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FinalStep;