import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectContext } from '../../context/ProjectContext';
import { getSuitableInverters, selectInverter, getProjectInverter, getVoltage } from '../../services/ProjectService';
import './Step4_Inverter.css';

/**
 * Step4_Inverter component for selecting a suitable inverter. It handles system voltage, temperature,
 * and inverter selection with real-time updates based on user input.
 *
 * @module Step4_Inverter
 */

/**
 * Step4_Inverter component allows users to select an inverter, adjust system voltage and temperature,
 * and view energy calculations based on the selected inverter.
 *
 * @component
 * @param {object} props - The component properties.
 * @param {function} props.onComplete - Callback function triggered when the step is completed.
 * @returns {JSX.Element} Step4_Inverter component.
 */
const Step4_Inverter = ({ onComplete }) => {
    const { t } = useTranslation('wizard');
    const { selectedProject } = useContext(ProjectContext);
    const [systemVoltage, setSystemVoltage] = useState('');
    const [recommendedSystemVoltage, setRecommendedSystemVoltage] = useState(null);
    const [useRecommendedVoltage, setUseRecommendedVoltage] = useState(true);
    const [temperature, setTemperature] = useState(25);
    const [suitableInverters, setSuitableInverters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedInverterId, setSelectedInverterId] = useState(null);
    const [energyCalculations, setEnergyCalculations] = useState({ totalAdjustedAcEnergy: 0, totalDailyEnergy: 0 });
    const [error, setError] = useState(null);

    /**
     * Fetches system voltage and suitable inverters when the component loads.
     * Uses the recommended voltage if system voltage is not set.
     *
     * @async
     * @function fetchVoltageAndInverters
     */
    useEffect(() => {
        const fetchVoltageAndInverters = async () => {
            if (!selectedProject) return;

            setLoading(true);
            setError(null);
            try {
                const { systemVoltage: fetchedVoltage, recommendedSystemVoltage: fetchedRecommendedVoltage } =
                    await getVoltage(selectedProject);

                if (fetchedVoltage) {
                    setSystemVoltage(fetchedVoltage);
                } else {
                    setSystemVoltage(fetchedRecommendedVoltage);
                    setRecommendedSystemVoltage(fetchedRecommendedVoltage);
                    setUseRecommendedVoltage(true);
                }

                const inverters = await getSuitableInverters(
                    selectedProject,
                    fetchedVoltage || fetchedRecommendedVoltage,
                    temperature
                );
                setSuitableInverters(inverters);
            } catch (error) {
                console.error('Error fetching suitable inverters or voltage:', error);
                setError(t('step4.error_message'));
            } finally {
                setLoading(false);
            }
        };

        fetchVoltageAndInverters();
    }, [selectedProject, temperature, t]);

    /**
     * Refetches suitable inverters when the system voltage or temperature changes.
     *
     * @async
     * @function fetchInverters
     */
    useEffect(() => {
        if (!selectedProject || !systemVoltage) return;

        const fetchInverters = async () => {
            setLoading(true);
            setError(null);
            try {
                const inverters = await getSuitableInverters(selectedProject, systemVoltage, temperature);
                setSuitableInverters(inverters);
            } catch (error) {
                console.error('Error fetching suitable inverters:', error);
                setError(t('step4.error_message'));
            } finally {
                setLoading(false);
            }
        };

        fetchInverters();
    }, [systemVoltage, temperature, selectedProject, t]);

    /**
     * Fetches details of the currently selected project inverter.
     * Updates energy calculations and temperature settings.
     *
     * @async
     * @function fetchProjectInverterDetails
     */
    useEffect(() => {
        const fetchProjectInverterDetails = async () => {
            if (!selectedProject) return;

            try {
                const projectInverter = await getProjectInverter(selectedProject);

                if (projectInverter?.inverterTemperature) {
                    setTemperature(projectInverter.inverterTemperature);
                }

                setEnergyCalculations({
                    totalAdjustedAcEnergy: projectInverter?.totalAdjustedAcEnergy || 0,
                    totalDailyEnergy: projectInverter?.totalDailyEnergy || 0,
                });
                setSelectedInverterId(projectInverter?.inverterId || null);
            } catch (error) {
                console.error('Error fetching project inverter details:', error);
                setError(t('step4.error_message'));
            }
        };

        fetchProjectInverterDetails();
    }, [selectedProject, t]);

    /**
     * Handles changes to the system voltage dropdown.
     * Stops using the recommended voltage if manually changed.
     *
     * @param {object} e - Event object from the dropdown change.
     */
    const handleSystemVoltageChange = (e) => {
        setSystemVoltage(e.target.value);
        setUseRecommendedVoltage(false);
    };

    /**
     * Handles changes to the temperature dropdown.
     *
     * @param {object} e - Event object from the dropdown change.
     */
    const handleTemperatureChange = (e) => {
        setTemperature(parseInt(e.target.value, 10));
    };

    /**
     * Handles the selection of an inverter.
     * Updates energy calculations and project inverter details.
     *
     * @async
     * @function handleInverterSelection
     * @param {string} inverterId - ID of the selected inverter.
     */
    const handleInverterSelection = async (inverterId) => {
        const newSelectedInverterId = selectedInverterId === inverterId && suitableInverters.length > 1 ? null : inverterId;

        if (newSelectedInverterId !== selectedInverterId) {
            setSelectedInverterId(newSelectedInverterId);

            if (newSelectedInverterId) {
                setLoading(true);
                try {
                    const result = await selectInverter(selectedProject, newSelectedInverterId);
                    setEnergyCalculations({
                        totalAdjustedAcEnergy: result?.totalAdjustedAcEnergy || 0,
                        totalDailyEnergy: result?.totalDailyEnergy || 0,
                    });

                    setSystemVoltage(result?.systemVoltage || systemVoltage);
                    setTemperature(result?.inverterTemperature || temperature);

                    onComplete();
                } catch (error) {
                    console.error('Error selecting inverter:', error);
                    setError(t('step4.error_message'));
                } finally {
                    setLoading(false);
                }
            }
        }
    };

    /**
     * Determines the continuous power of an inverter based on the selected temperature.
     *
     * @param {object} inverter - The inverter object.
     * @returns {number} The continuous power value at the selected temperature.
     */
    const getContinuousPowerByTemperature = (inverter) => {
        switch (temperature) {
            case 40:
                return inverter.continuousPower40C;
            case 65:
                return inverter.continuousPower65C;
            case 25:
            default:
                return inverter.continuousPower25C;
        }
    };

    return (
        <div className="step4-inverter-page-container">
            <div className="step4-header">
                <h2 className="step4-config-title">{t('step4.select_inverter_configuration')}</h2>
                {error && <p className="step4-error-message">{error}</p>}
            </div>

            <div className="step4-content">
                <div className="step4-selection-section">
                    <div className="step4-input-group">
                        <label htmlFor="systemVoltage">{t('step4.system_voltage_label')}</label>
                        <select id="systemVoltage" value={systemVoltage} onChange={handleSystemVoltageChange}>
                            <option value="12">12V</option>
                            <option value="24">24V</option>
                            <option value="48">48V</option>
                        </select>
                    </div>
                    <div className="step4-input-group">
                        <label htmlFor="temperature">{t('step4.select_temperature_label')}</label>
                        <select id="temperature" value={temperature} onChange={handleTemperatureChange}>
                            <option value="25">25°C</option>
                            <option value="40">40°C</option>
                            <option value="65">65°C</option>
                        </select>
                    </div>
                </div>

                <div className="step4-inverter-list-section">
                    <h3>{t('step4.suitable_inverters')}</h3>
                    {loading ? (
                        <p>{t('step4.loading')}</p>
                    ) : (
                        <div className="step4-inverter-options">
                            {suitableInverters.map((inverter) => (
                                <div
                                    key={inverter.id}
                                    className={`step4-inverter-option ${selectedInverterId === inverter.id ? 'selected' : ''}`}
                                    onClick={() => handleInverterSelection(inverter.id)}
                                >
                                    <label>
                                        <input
                                            type="radio"
                                            name="inverter"
                                            checked={selectedInverterId === inverter.id}
                                            onChange={() => handleInverterSelection(inverter.id)}
                                        />
                                        <strong>{inverter.name}</strong><br />
                                        {t('step4.voltage')}: {inverter.voltage}V,{' '}
                                        {t('step4.continuous_power', { temperature })}: {getContinuousPowerByTemperature(inverter)}W,{' '}
                                        {t('step4.max_power')}: {inverter.maxPower}W,{' '}
                                        {t('step4.efficiency')}: {inverter.efficiency}%
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="step4-energy-calculations">
                    <h3>{t('step4.energy_calculations')}</h3>
                    <p>
                        {t('step4.adjusted_ac_load')}: {energyCalculations.totalAdjustedAcEnergy ? `${energyCalculations.totalAdjustedAcEnergy.toFixed(2)} Wh` : t('step4.not_calculated')}
                    </p>
                    <p>
                        {t('step4.total_daily_energy')}: {energyCalculations.totalDailyEnergy ? `${energyCalculations.totalDailyEnergy.toFixed(2)} Wh` : t('step4.not_calculated')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Step4_Inverter;
