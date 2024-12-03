import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectContext } from '../../context/ProjectContext';
import { getBatteries, selectBattery, getProjectBattery } from '../../services/ProjectService';
import './Step5_Batteries.css';

/**
 * Step5_Batteries component allows users to select a battery, select system temperature and autonomy days,
 * and view the calculated battery configuration.
 * 
 * @module Step5_Batteries
 */

/**
 * Step5_Batteries component is for selecting suitable batteries.
 * It handles fetching available batteries, batteries selection with real-time updates.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {function} props.onComplete - Callback invoked when the step is completed.
 * @returns {JSX.Element} Step5_Batteries component.
 */
const Step5_Batteries = ({ onComplete }) => {
    const { t } = useTranslation('wizard');
    const { selectedProject } = useContext(ProjectContext);

    const [batteryType, setBatteryType] = useState('Li-ion');
    const [temperature, setTemperature] = useState(25);
    const [autonomyDays, setAutonomyDays] = useState(1);
    const [selectedBattery, setSelectedBattery] = useState(null);
    const [batteries, setBatteries] = useState([]);
    const [config, setConfig] = useState({
        batteryCapacityDod: 0,
        parallelBatteries: 1,
        seriesBatteries: 1,
        requiredBatteryCapacity: 0,
        totalAvailableCapacity: 0,
        operationalDays: 0,
    });

    /**
     * Fetches the available batteries based on the selected project and battery type.
     *
     * @async
     * @function fetchBatteries
     */
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

    /**
     * Fetches the current battery configuration for the selected project.
     *
     * @async
     * @function fetchBatteryConfig
     */
    useEffect(() => {
        const fetchBatteryConfig = async () => {
            if (!selectedProject) return;

            try {
                const projectBattery = await getProjectBattery(selectedProject);
                if (projectBattery) {
                    setSelectedBattery(projectBattery.batteryId);
                    setBatteryType(projectBattery.type || 'Li-ion');
                    setTemperature(projectBattery.temperature || 25);
                    setAutonomyDays(projectBattery.batteryAutonomy || 1);
                    setConfig({
                        batteryCapacityDod: projectBattery.batteryCapacityDod,
                        parallelBatteries: projectBattery.parallelBatteries,
                        seriesBatteries: projectBattery.seriesBatteries,
                        requiredBatteryCapacity: projectBattery.requiredBatteryCapacity,
                        totalAvailableCapacity: projectBattery.totalAvailableCapacity,
                        operationalDays: projectBattery.operationalDays,
                    });
                }
            } catch (error) {
                console.error('Error fetching battery configuration:', error);
            }
        };

        fetchBatteryConfig();
    }, [selectedProject]);

    /**
     * Handles the selection of a battery.
     * Sends the selected battery, autonomy days, and temperature to the backend and updates the configuration.
     *
     * @async
     * @function handleBatterySelect
     * @param {string} batteryId - ID of the selected battery.
     */
    const handleBatterySelect = async (batteryId) => {
        setSelectedBattery(batteryId);

        try {
            const result = await selectBattery(selectedProject, {
                batteryId,
                autonomyDays,
                temperature,
            });
            setConfig(result);
            onComplete();
        } catch (error) {
            console.error('Error selecting battery:', error);
        }
    };

    return (
        <div className="step5-batteries-page-container">
            <div className="step5-header">
                <h2 className="step5-config-title">{t('step5.battery_configurator')}</h2>
            </div>

            <div className="step5-content">
                <div className="step5-selection-section">
                    <div className="step5-input-group">
                        <label>{t('step5.battery_type')}</label>
                        <select
                            value={batteryType}
                            onChange={(e) => setBatteryType(e.target.value)}
                            className="step5-select"
                        >
                            <option value="Li-ion">Li-ion</option>
                            <option value="LiFePO4">LiFePO4</option>
                            <option value="Lead Acid">Lead Acid</option>
                        </select>
                    </div>

                    <div className="step5-input-group">
                        <label>{t('step5.select_temperature')}</label>
                        <select
                            value={temperature}
                            onChange={(e) => setTemperature(parseInt(e.target.value))}
                            className="step5-select"
                        >
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

                    <div className="step5-input-group">
                        <label>{t('step5.autonomy_days')}</label>
                        <input
                            type="number"
                            value={autonomyDays}
                            min="1"
                            onChange={(e) => setAutonomyDays(parseInt(e.target.value))}
                            className="step5-input"
                        />
                    </div>
                </div>

                <div className="step5-select-battery-section">
                    <h3>{t('step5.select_battery')}</h3>
                    {batteries.length === 0 ? (
                        <p>{t('step5.no_batteries_available')}</p>
                    ) : (
                        <div className="step5-battery-options">
                            {batteries.map((battery) => (
                                <div
                                    key={battery.id}
                                    className={`step5-battery-option ${selectedBattery === battery.id ? 'selected' : ''}`}
                                    onClick={() => handleBatterySelect(battery.id)}
                                >
                                    <label>
                                        <input
                                            type="radio"
                                            name="battery"
                                            checked={selectedBattery === battery.id}
                                            onChange={() => handleBatterySelect(battery.id)}
                                        />
                                        <strong>{battery.name}</strong><br />
                                        {t('step5.capacity')}: {battery.capacity}Ah,{' '}
                                        {t('step5.voltage')}: {battery.voltage}V,{' '}
                                        {t('step5.dod')}: {battery.dod}, {' '}
                                        {t('step5.optimal_current')}: {battery.optimalChargingCurrent}A, {' '}
                                        {t('step5.max_current')}: {battery.maxChargingCurrent}A
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {config && (
                    <div className="step5-calculated-configuration">
                        <h3>{t('step5.calculated_configuration')}</h3>
                        <p>{t('step5.battery_capacity_dod')}: {config.batteryCapacityDod} Ah</p>
                        <p>{t('step5.parallel_batteries')}: {config.parallelBatteries}</p>
                        <p>{t('step5.series_batteries')}: {config.seriesBatteries}</p>
                        <p>{t('step5.required_capacity')}: {config.requiredBatteryCapacity.toFixed(2)} Ah</p>
                        <p>{t('step5.total_available_capacity')}: {config.totalAvailableCapacity.toFixed(2)} Ah</p>
                        <p>{t('step5.operational_days')}: {config.operationalDays.toFixed(1)} days</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Step5_Batteries;
