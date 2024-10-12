import React, { useEffect, useState, useContext } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { getBatteries, selectBattery, getProjectBattery } from '../../services/ProjectService';
import "./Step5_Batteries.css";

const Step5_Batteries = () => {
    const { selectedProject } = useContext(ProjectContext);
    const [batteryType, setBatteryType] = useState('Li-ion'); // Default battery type
    const [temperature, setTemperature] = useState(25); // Default temperature
    const [autonomyDays, setAutonomyDays] = useState(1); // Initial value, will be updated from GET response
    const [selectedBattery, setSelectedBattery] = useState(null);
    const [batteries, setBatteries] = useState([]);
    const [config, setConfig] = useState({
        batteryCapacityDod: 0,
        parallelBatteries: 1,
        seriesBatteries: 1,
        requiredBatteryCapacity: 0,
        totalAvailableCapacity: 0,
        operationalDays: 0
    });

    // Fetch suitable batteries based on battery type
    useEffect(() => {
        const fetchBatteries = async () => {
            if (!selectedProject) return;

            try {
                const batteryData = await getBatteries(selectedProject, batteryType);
                setBatteries(batteryData);
            } catch (error) {
                console.error('Error fetching batteries:', error);
            }
        };

        fetchBatteries();
    }, [selectedProject, batteryType]);

    // Fetch the existing battery configuration for the project
    useEffect(() => {
        const fetchBatteryConfig = async () => {
            if (!selectedProject) return;

            try {
                const projectBattery = await getProjectBattery(selectedProject);
                if (projectBattery) {
                    // Automatically set values based on the retrieved data
                    setSelectedBattery(projectBattery.batteryId); // Set the selected battery
                    setBatteryType(projectBattery.type || 'Li-ion'); // Set battery type
                    setTemperature(projectBattery.temperature || 25); // Set temperature
                    setAutonomyDays(projectBattery.batteryAutonomy || 1); // Set autonomy days
                    setConfig({
                        batteryCapacityDod: projectBattery.batteryCapacityDod,
                        parallelBatteries: projectBattery.parallelBatteries,
                        seriesBatteries: projectBattery.seriesBatteries,
                        requiredBatteryCapacity: projectBattery.requiredBatteryCapacity,
                        totalAvailableCapacity: projectBattery.totalAvailableCapacity,
                        operationalDays: projectBattery.operationalDays
                    });
                }
            } catch (error) {
                console.error('Error fetching battery configuration:', error);
            }
        };

        fetchBatteryConfig();
    }, [selectedProject]);

    // Handle battery selection and perform calculations (POST request happens only when the user selects a new battery)
    const handleBatterySelect = async (batteryId) => {
        setSelectedBattery(batteryId);

        // Trigger the POST request to select the battery and calculate the configuration
        try {
            const result = await selectBattery(selectedProject, {
                batteryId,
                autonomyDays,
                temperature
            });
            setConfig(result); // Update the configuration after the battery is selected
        } catch (error) {
            console.error('Error selecting battery:', error);
        }
    };

    return (
        <div>
            <h2>Battery Configurator</h2>

            <div>
                <label>Battery Type</label>
                <select value={batteryType} onChange={(e) => setBatteryType(e.target.value)}>
                    <option value="Li-ion">Li-ion</option>
                    <option value="LiFePO4">LiFePO4</option>
                    <option value="Lead Acid">Lead Acid</option>
                </select>
            </div>

            <div>
                <label>Select Temperature</label>
                <select value={temperature} onChange={(e) => setTemperature(parseInt(e.target.value))}>
                    <option value={0}>0°C</option>
                    <option value={10}>10°C</option>
                    <option value={20}>20°C</option>
                    <option value={25}>25°C</option>
                    <option value={30}>30°C</option>
                    <option value={40}>40°C</option>
                    <option value={-30}>-30°C</option>
                    <option value={-20}>-20°C</option>
                    <option value={-10}>-10°C</option>
                </select>
            </div>

            <div>
                <label>Autonomy Days</label>
                <input
                    type="number"
                    value={autonomyDays}
                    min="1"
                    onChange={(e) => setAutonomyDays(parseInt(e.target.value))}
                />
            </div>

            <div>
                <h3>Select Battery</h3>
                {batteries.length === 0 ? (
                    <p>No suitable batteries available</p>
                ) : (
                    batteries.map((battery) => (
                        <div key={battery.id}>
                            <label>
                                <input
                                    type="radio"
                                    name="battery"
                                    checked={selectedBattery === battery.id}
                                    onChange={() => handleBatterySelect(battery.id)}
                                />
                                {battery.name} - Capacity: {battery.capacity}Ah, Voltage: {battery.voltage}V, DOD: {battery.dod}
                            </label>
                        </div>
                    ))
                )}
            </div>

            {config && (
                <div>
                    <h3>Calculated Configuration</h3>
                    <p>Battery Capacity DOD: {config.batteryCapacityDod} Ah</p>
                    <p>Parallel Batteries: {config.parallelBatteries}</p>
                    <p>Series Batteries: {config.seriesBatteries}</p>
                    <p>Required Capacity: {config.requiredBatteryCapacity} Ah</p>
                    <p>Total battery available capacity: {config.totalAvailableCapacity} Ah</p>
                    <p>Operational Days: {config.operationalDays} days</p>
                </div>
            )}
        </div>
    );
};

export default Step5_Batteries;
