import React, { useContext, useEffect, useState } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { getSuitableInverters, selectInverter, getProjectInverter } from '../../services/ProjectService'; // Import the new method
import './Step4_Inverter.css';

const Step4_Inverter = () => {
    const { selectedProject } = useContext(ProjectContext);
    const [systemVoltage, setSystemVoltage] = useState('48'); // Default voltage
    const [temperature, setTemperature] = useState('25'); // Default temperature
    const [suitableInverters, setSuitableInverters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedInverterId, setSelectedInverterId] = useState(null);
    const [energyCalculations, setEnergyCalculations] = useState({ totalAdjustedAcEnergy: 0, totalDailyEnergy: 0 });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSuitableInverters = async () => {
            if (!selectedProject) return;

            setLoading(true);
            try {
                const inverters = await getSuitableInverters(selectedProject, systemVoltage, temperature);
                setSuitableInverters(inverters);
            } catch (error) {
                console.error('Error fetching suitable inverters:', error);
                setError('Failed to fetch suitable inverters.');
            } finally {
                setLoading(false);
            }
        };

        fetchSuitableInverters();
    }, [selectedProject, systemVoltage, temperature]);

    useEffect(() => {
        const fetchProjectInverterDetails = async () => {
            if (!selectedProject) return;

            try {
                const projectInverter = await getProjectInverter(selectedProject); // Use the new method to get inverter details
                setEnergyCalculations({
                    totalAdjustedAcEnergy: projectInverter.totalAdjustedAcEnergy || 0,
                    totalDailyEnergy: projectInverter.totalDailyEnergy || 0,
                });
            } catch (error) {
                console.error('Error fetching project inverter details:', error);
                setError('Failed to fetch project inverter details.');
            }
        };

        fetchProjectInverterDetails();
    }, [selectedProject]);

    const handleSystemVoltageChange = (e) => {
        setSystemVoltage(e.target.value);
    };

    const handleTemperatureChange = (e) => {
        setTemperature(e.target.value);
    };

    const handleInverterSelection = async (inverterId) => {
        setSelectedInverterId(inverterId);
        setLoading(true);

        try {
            const result = await selectInverter(selectedProject, inverterId);
            setEnergyCalculations({
                totalAdjustedAcEnergy: result.totalAdjustedAcEnergy || 0,
                totalDailyEnergy: result.totalDailyEnergy || 0,
            });
            console.log('Inverter selection updated:', result);
        } catch (error) {
            console.error('Error selecting inverter:', error);
            setError('Failed to update inverter selection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="inverter-page-container">
            <h2>Select Inverter Configuration</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="selection-section">
                <div className="input-group">
                    <label htmlFor="systemVoltage">System Voltage:</label>
                    <select
                        id="systemVoltage"
                        value={systemVoltage}
                        onChange={handleSystemVoltageChange}
                    >
                        <option value="12">12V</option>
                        <option value="24">24V</option>
                        <option value="48">48V</option>
                    </select>
                </div>
                <div className="input-group">
                    <label htmlFor="temperature">Select Temperature:</label>
                    <select
                        id="temperature"
                        value={temperature}
                        onChange={handleTemperatureChange}
                    >
                        <option value="25">25°C</option>
                        <option value="40">40°C</option>
                        <option value="65">65°C</option>
                    </select>
                </div>
            </div>
            <div className="inverter-list-section">
                <h3>Suitable Inverters:</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="inverter-table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Continuous Power ({temperature}°C)</th>
                            <th>Max Power</th>
                            <th>Efficiency</th>
                            <th>Voltage</th>
                            <th>Select</th>
                        </tr>
                        </thead>
                        <tbody>
                        {suitableInverters.map((inverter) => (
                            <tr key={inverter.id}>
                                <td>{inverter.name}</td>
                                <td>{inverter.continuousPower}</td>
                                <td>{inverter.maxPower}</td>
                                <td>{inverter.efficiency}</td>
                                <td>{inverter.voltage}</td>
                                <td>
                                    <button onClick={() => handleInverterSelection(inverter.id)}>Select</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
            <div className="energy-calculations">
                <h4>Energy Calculations:</h4>
                <p>Adjusted AC Load: {energyCalculations.totalAdjustedAcEnergy.toFixed(2) || 'Not calculated'}</p>
                <p>Total Daily Energy: {energyCalculations.totalDailyEnergy.toFixed(2) || 'Not calculated'}</p>
            </div>
        </div>
    );
};

export default Step4_Inverter;
