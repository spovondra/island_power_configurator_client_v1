import React, { useContext, useState, useEffect } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { getProjectById } from '../../services/ProjectService';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import './FinalStep.css';

const FinalStep = () => {
    const { selectedProject } = useContext(ProjectContext);
    const [project, setProject] = useState({
        site: {},
        solarComponents: {
            solarPanels: {},
            controllers: {},
            batteries: {},
            inverters: {},
            accessories: {},
        },
        appliances: [],
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
    const appliances = project.appliances || [];
    const configuration = project.configurationModel || {};

    // Prepare data for charts
    const monthlyIrradiance = (site.monthlyIrradianceList ?? []).map(irr => ({
        month: `Month ${irr.month}`,
        irradiance: irr.irradiance,
    }));

    // Preparing data for Total Energy Consumption Pie Chart
    const totalEnergyData = [
        {
            name: 'Total AC Energy',
            value: configuration.totalAcEnergy,
        },
        {
            name: 'Total DC Energy',
            value: configuration.totalDcEnergy,
        },
    ];

    return (
        <div className="final-step-container">
            <div className="final-step-header">
                <h2>Project Summary</h2>
            </div>

            {/* Display Project Information */}
            <div className="final-step-section">
                <h3>Project Information</h3>
                <p><strong>Project ID:</strong> {project.id || 'N/A'}</p>
                <p><strong>Project Name:</strong> {project.name || 'N/A'}</p>
                <p><strong>User ID:</strong> {project.userId || 'N/A'}</p>
            </div>

            {/* Display Site Information */}
            <div className="final-step-section">
                <h3>Site Details</h3>
                <p><strong>Latitude:</strong> {site.latitude || 'N/A'}</p>
                <p><strong>Longitude:</strong> {site.longitude || 'N/A'}</p>
                <p><strong>Min Temperature:</strong> {site.minTemperature || 'N/A'}</p>
                <p><strong>Max Temperature:</strong> {site.maxTemperature || 'N/A'}</p>
                <p><strong>Panel Angle:</strong> {site.panelAngle || 'N/A'}°</p>
                <p><strong>Panel Aspect:</strong> {site.panelAspect || 'N/A'}</p>
                <p><strong>Used Optimal Values:</strong> {site.usedOptimalValues ? 'Yes' : 'No'}</p>
            </div>

            {/* Monthly Irradiance Bar Chart under Site Details */}
            <div className="final-step-section graph-container">
                <h3>Monthly Irradiance</h3>
                <BarChart
                    width={600}
                    height={300}
                    data={monthlyIrradiance}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="irradiance" fill="#82ca9d" />
                </BarChart>
            </div>

            {/* Display Appliances */}
            <div className="final-step-section">
                <h3>Appliances</h3>
                <ul className="final-step-list">
                    {appliances.map(appliance => (
                        <li key={appliance.id}>
                            <strong>{appliance.name}</strong>:
                            <p>Type: {appliance.type}</p>
                            <p>Quantity: {appliance.quantity}</p>
                            <p>Power: {appliance.power} W</p>
                            <p>Hours per Day: {appliance.hours}</p>
                            <p>Days per Week: {appliance.days}</p>
                            <p>Peak Power: {appliance.peakPower} W</p>
                            <p>Energy: {appliance.energy} Wh</p>
                            <p>Cost: {appliance.cost} CZK</p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Total Energy Consumption Pie Chart under Appliances */}
            <div className="final-step-section graph-container">
                <h3>Total Energy Consumption</h3>
                <PieChart width={400} height={400}>
                    <Pie
                        data={totalEnergyData}
                        cx={200}
                        cy={200}
                        labelLine={false}
                        label={entry => entry.name}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {totalEnergyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#ff7300' : '#0088FE'} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </div>

            {/* Display Configuration Model */}
            <div className="final-step-section">
                <h3>Configuration Model</h3>
                <p><strong>Total AC Energy:</strong> {configuration.totalAcEnergy || 'N/A'} Wh</p>
                <p><strong>Total DC Energy:</strong> {configuration.totalDcEnergy || 'N/A'} Wh</p>
                <p><strong>System Voltage:</strong> {configuration.systemVoltage || 'N/A'} V</p>
                <p><strong>Recommended System Voltage:</strong> {configuration.recommendedSystemVoltage || 'N/A'} V</p>
                <p><strong>Total AC Peak Power:</strong> {configuration.totalAcPeakPower || 'N/A'} W</p>
                <p><strong>Total DC Peak Power:</strong> {configuration.totalDcPeakPower || 'N/A'} W</p>
                <p><strong>Inverter ID:</strong> {configuration.inverterId || 'N/A'}</p>
                <p><strong>Inverter Temperature:</strong> {configuration.inverterTemperature || 'N/A'} °C</p>
                <p><strong>Total Adjusted AC Energy:</strong> {configuration.totalAdjustedAcEnergy || 'N/A'} Wh</p>
                <p><strong>Total Daily Energy:</strong> {configuration.totalDailyEnergy || 'N/A'} Wh</p>
            </div>
        </div>
    );
};

export default FinalStep;
