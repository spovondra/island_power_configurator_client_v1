import React, { useEffect, useState, useContext } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { getBatteries, selectBattery } from '../../services/ProjectService';
import "./Step5_Batteries.css";

const Step5_Batteries = () => {
    const { selectedProject } = useContext(ProjectContext);
    const [batteryType, setBatteryType] = useState('Li-ion');
    const [temperature, setTemperature] = useState(25);
    const [autonomyDays, setAutonomyDays] = useState(1);
    const [selectedBattery, setSelectedBattery] = useState(null);
    const [batteries, setBatteries] = useState([]);
    const [config, setConfig] = useState(null);

    useEffect(() => {
        const fetchBatteries = async () => {
            if (!selectedProject) return;

            try {
                const batteryData = await getBatteries(selectedProject, batteryType);
                setBatteries(batteryData);
                // Reset selectedBattery if there are no batteries
                if (batteryData.length === 0) {
                    setSelectedBattery(null);
                } else {
                    // Clear the config since we are just fetching batteries
                    setConfig(null);
                }
            } catch (error) {
                console.error('Error fetching batteries:', error);
            }
        };

        fetchBatteries();
    }, [selectedProject, batteryType]);

    useEffect(() => {
        const handleCalculate = async () => {
            if (!selectedBattery) {
                setConfig(null); // Clear config if no battery is selected
                return;
            }

            // Prepare parameters for calculation
            const params = {
                batteryId: selectedBattery,
                autonomyDays: autonomyDays,
                temperature: temperature
            };

            try {
                const result = await selectBattery(selectedProject, params);
                setConfig(result);
            } catch (error) {
                console.error('Error calculating configuration:', error);
            }
        };

        if (selectedBattery) {
            handleCalculate(); // Call calculate only when a battery is selected
        }
    }, [selectedBattery, autonomyDays, temperature, selectedProject]);

    const handleBatterySelect = (batteryId) => {
        setSelectedBattery(batteryId); // Set the selected battery ID
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
                    <p>No batteries available</p>
                ) : (
                    batteries.map((battery) => (
                        <div key={battery.id}>
                            <label>
                                <input
                                    type="radio"
                                    name="battery" // Group radio buttons
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
                    <p>Required Capacity: {config.requiredCapacity} Ah</p>
                    <p>Total battery available capacity: {config.totalAvailableCapacity} Ah</p>
                    <p>Operational Days: {config.operationalDays} days</p>
                </div>
            )}
        </div>
    );
};

export default Step5_Batteries;
