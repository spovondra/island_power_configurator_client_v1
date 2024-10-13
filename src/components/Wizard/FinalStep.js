import React, { useContext, useState, useEffect } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { getProjectById } from '../../services/ProjectService';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    LabelList,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import './FinalStep.css';

const FinalStep = () => {
    const { selectedProject } = useContext(ProjectContext);
    const [project, setProject] = useState(null);
    const [pvgisData, setPVGISData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            if (selectedProject) {
                try {
                    const data = await getProjectById(selectedProject);
                    setProject(data);
                    if (data.site && data.site.monthlyDataList) {
                        setPVGISData(data.site.monthlyDataList);
                    }
                } catch (err) {
                    setError('Failed to fetch project details.');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchProject();
    }, [selectedProject]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const site = project?.site || {};
    const appliances = project?.appliances || [];
    const configuration = project?.configurationModel || {};

    const totalEnergyData = [
        {
            name: 'Total AC Energy',
            value: configuration?.projectAppliance?.totalAcEnergy || 0,
        },
        {
            name: 'Total DC Energy',
            value: configuration?.projectAppliance?.totalDcEnergy || 0,
        },
    ];

    const chartData = pvgisData.map(item => ({
        month: item.month,
        irradiance: item.irradiance,
        ambientTemperature: item.ambientTemperature,
    }));

    return (
        <div className="final-step-container">
            <h2>Final System Overview</h2>

            {/* Project Information */}
            <div className="final-step-section">
                <h3>Project Information</h3>
                <ul>
                    <li><strong>Project ID:</strong> {project?.id || 'N/A'}</li>
                    <li><strong>Project Name:</strong> {project?.name || 'N/A'}</li>
                    <li><strong>User ID:</strong> {project?.userId || 'N/A'}</li>
                </ul>
            </div>

            {/* Site Information */}
            <div className="final-step-section">
                <h3>Site Details</h3>
                <ul>
                    <li><strong>Latitude:</strong> {site.latitude || 'N/A'}</li>
                    <li><strong>Longitude:</strong> {site.longitude || 'N/A'}</li>
                    <li><strong>Min Temperature:</strong> {site.minTemperature || 'N/A'} °C</li>
                    <li><strong>Max Temperature:</strong> {site.maxTemperature || 'N/A'} °C</li>
                    <li><strong>Panel Angle:</strong> {site.panelAngle || 'N/A'}°</li>
                    <li><strong>Panel Aspect:</strong> {site.panelAspect || 'N/A'}</li>
                    <li><strong>Used Optimal Values:</strong> {site.usedOptimalValues ? 'Yes' : 'No'}</li>
                </ul>
            </div>

            {/* Monthly Irradiance & Ambient Temperature Charts */}
            <div className="chart-flex-container">
                <div className="chart-container">
                    <h3>Monthly Irradiance</h3>
                    <BarChart width={400} height={250} data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: 'Irradiance (kWh/m²)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Bar dataKey="irradiance" fill="#8884d8">
                            <LabelList dataKey="irradiance" position="top" />
                        </Bar>
                    </BarChart>
                </div>
                <div className="chart-container">
                    <h3>Monthly Avg Ambient Temperature</h3>
                    <BarChart width={400} height={250} data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Bar dataKey="ambientTemperature" fill="#82ca9d">
                            <LabelList dataKey="ambientTemperature" position="top" />
                        </Bar>
                    </BarChart>
                </div>
            </div>

            {/* Appliances Information */}
            <div className="final-step-section">
                <h3>Appliances</h3>
                <ul className="final-step-list">
                    {appliances.map(appliance => (
                        <li key={appliance.id}>
                            <strong>{appliance.name}</strong>:
                            <ul>
                                <li>Type: {appliance.type}</li>
                                <li>Quantity: {appliance.quantity}</li>
                                <li>Power: {appliance.power} W</li>
                                <li>Hours per Day: {appliance.hours}</li>
                                <li>Days per Week: {appliance.days}</li>
                                <li>Peak Power: {appliance.peakPower} W</li>
                                <li>Energy: {appliance.energy} Wh</li>
                                <li>Cost: {appliance.cost} CZK</li>
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Total Energy Consumption Pie Chart */}
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

            {/* Configuration Model */}
            <div className="final-step-section">
                <h3>Configuration Model</h3>
                <ul>
                    <li><strong>Total AC Energy:</strong> {configuration?.projectAppliance?.totalAcEnergy || 'N/A'} Wh</li>
                    <li><strong>Total DC Energy:</strong> {configuration?.projectAppliance?.totalDcEnergy || 'N/A'} Wh</li>
                    <li><strong>System Voltage:</strong> {configuration.systemVoltage || 'N/A'} V</li>
                    <li><strong>Recommended System Voltage:</strong> {configuration.recommendedSystemVoltage || 'N/A'} V</li>
                    <li><strong>Total AC Peak Power:</strong> {configuration?.projectAppliance?.totalAcPeakPower || 'N/A'} W</li>
                    <li><strong>Total DC Peak Power:</strong> {configuration?.projectAppliance?.totalDcPeakPower || 'N/A'} W</li>
                    <li><strong>Inverter ID:</strong> {configuration?.projectInverter?.inverterId || 'N/A'}</li>
                    <li><strong>Inverter Temperature:</strong> {configuration?.projectInverter?.inverterTemperature || 'N/A'} °C</li>
                    <li><strong>Total Adjusted AC Energy:</strong> {configuration?.projectInverter?.totalAdjustedAcEnergy || 'N/A'} Wh</li>
                    <li><strong>Total Daily Energy:</strong> {configuration?.projectInverter?.totalDailyEnergy || 'N/A'} Wh</li>
                </ul>
            </div>

            {/* Solar Panel Configuration */}
            <div className="final-step-section">
                <h3>Solar Panel Configuration</h3>
                <ul>
                    <li><strong>Solar Panel ID:</strong> {configuration?.projectSolarPanel?.solarPanelId || 'N/A'}</li>
                    <li><strong>Number of Panels:</strong> {configuration?.projectSolarPanel?.numberOfPanels || 'N/A'}</li>
                    <li><strong>Total Power Generated:</strong> {configuration?.projectSolarPanel?.totalPowerGenerated || 'N/A'} W</li>
                    <li><strong>Efficiency Loss:</strong> {configuration?.projectSolarPanel?.efficiencyLoss || 'N/A'}</li>
                    <li><strong>Estimated Daily Energy Production:</strong> {configuration?.projectSolarPanel?.estimatedDailyEnergyProduction || 'N/A'} Wh</li>
                    <li><strong>Installation Type:</strong> {configuration?.projectSolarPanel?.installationType || 'N/A'}</li>
                </ul>
            </div>

            {/* Battery Configuration */}
            <div className="final-step-section">
                <h3>Battery Configuration</h3>
                <ul>
                    <li><strong>Battery ID:</strong> {configuration?.projectBattery?.batteryId || 'N/A'}</li>
                    <li><strong>Battery Type:</strong> {configuration?.projectBattery?.type || 'N/A'}</li>
                    <li><strong>Temperature:</strong> {configuration?.projectBattery?.temperature || 'N/A'} °C</li>
                    <li><strong>Battery Capacity (DOD):</strong> {configuration?.projectBattery?.batteryCapacityDod || 'N/A'} Wh</li>
                    <li><strong>Parallel Batteries:</strong> {configuration?.projectBattery?.parallelBatteries || 'N/A'}</li>
                    <li><strong>Series Batteries:</strong> {configuration?.projectBattery?.seriesBatteries || 'N/A'}</li>
                    <li><strong>Total Available Capacity:</strong> {configuration?.projectBattery?.totalAvailableCapacity || 'N/A'} Wh</li>
                </ul>
            </div>
        </div>
    );
};

export default FinalStep;
