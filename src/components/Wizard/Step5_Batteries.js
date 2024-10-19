import React, { useContext, useEffect, useState } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { getBatteries, selectBattery, getProjectBattery } from '../../services/ProjectService';
import { useTranslation } from 'react-i18next'; // Import translation hook
import "./Step5_Batteries.css";

const Step5_Batteries = ({ onComplete }) => {
    const { t } = useTranslation('wizard'); // Use translation for the wizard namespace
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

    const handleBatterySelect = async (batteryId) => {
        setSelectedBattery(batteryId);

        try {
            const result = await selectBattery(selectedProject, {
                batteryId,
                autonomyDays,
                temperature
            });
            setConfig(result);
            onComplete();
        } catch (error) {
            console.error('Error selecting battery:', error);
        }
    };

    return (
        <div className="step5-batteries-page-container">
            <h2>{t('step5.battery_configurator')}</h2> {/* Translated title */}

            <div className="step5-battery-type-section">
                <label>{t('step5.battery_type')}</label>
                <select value={batteryType} onChange={(e) => setBatteryType(e.target.value)} className="step5-select">
                    <option value="Li-ion">Li-ion</option>
                    <option value="LiFePO4">LiFePO4</option>
                    <option value="Lead Acid">Lead Acid</option>
                </select>
            </div>

            <div className="step5-temperature-section">
                <label>{t('step5.select_temperature')}</label>
                <select value={temperature} onChange={(e) => setTemperature(parseInt(e.target.value))} className="step5-select">
                    <option value={-30}>-30°C</option>
                    <option value={-20}>-20°C</option>
                    <option value={-10}>-10°C</option>
                    <option value={0}>0°C</option>
                    <option value={10}>10°C</option>
                    <option value={20}>20°C</option>
                    <option value={25}>25°C</option>
                    <option value={30}>30°C</option>
                    <option value={40}>40°C</option>
                </select>
            </div>

            <div className="step5-autonomy-section">
                <label>{t('step5.autonomy_days')}</label>
                <input
                    type="number"
                    value={autonomyDays}
                    min="1"
                    onChange={(e) => setAutonomyDays(parseInt(e.target.value))}
                    className="step5-input"
                />
            </div>

            <div className="step5-select-battery-section">
                <h3>{t('step5.select_battery')}</h3>
                {batteries.length === 0 ? (
                    <p>{t('step5.no_batteries_available')}</p>
                ) : (
                    batteries.map((battery) => (
                        <div key={battery.id} className="step5-battery-option">
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
                <div className="step5-calculated-configuration">
                    <h3>{t('step5.calculated_configuration')}</h3>
                    <p>{t('step5.battery_capacity_dod')}: {config.batteryCapacityDod} Ah</p>
                    <p>{t('step5.parallel_batteries')}: {config.parallelBatteries}</p>
                    <p>{t('step5.series_batteries')}: {config.seriesBatteries}</p>
                    <p>{t('step5.required_capacity')}: {config.requiredBatteryCapacity} Ah</p>
                    <p>{t('step5.total_available_capacity')}: {config.totalAvailableCapacity} Ah</p>
                    <p>{t('step5.operational_days')}: {config.operationalDays} days</p>
                </div>
            )}
        </div>
    );
};

export default Step5_Batteries;
