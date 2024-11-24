import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import translation hook
import { ProjectContext } from '../../context/ProjectContext';
import { getSuitableInverters, selectInverter, getProjectInverter, getVoltage } from '../../services/ProjectService'; // Import getVoltage
import './Step4_Inverter.css';

const Step4_Inverter = ({ onComplete }) => {
    const { t } = useTranslation('wizard');
    const { selectedProject } = useContext(ProjectContext);
    const [systemVoltage, setSystemVoltage] = useState(''); // Default to empty
    const [recommendedSystemVoltage, setRecommendedSystemVoltage] = useState(null);
    const [useRecommendedVoltage, setUseRecommendedVoltage] = useState(true); // Controls initial voltage behavior
    const [temperature, setTemperature] = useState(25); // Default temperature
    const [suitableInverters, setSuitableInverters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedInverterId, setSelectedInverterId] = useState(null);
    const [energyCalculations, setEnergyCalculations] = useState({ totalAdjustedAcEnergy: 0, totalDailyEnergy: 0 });
    const [error, setError] = useState(null);

    // Fetch voltage and suitable inverters
    useEffect(() => {
        const fetchVoltageAndInverters = async () => {
            if (!selectedProject) return;

            setLoading(true);
            try {
                // Fetch the voltage data
                const { systemVoltage: fetchedVoltage, recommendedSystemVoltage: fetchedRecommendedVoltage } = await getVoltage(selectedProject);
                console.log('Fetched voltages:', fetchedVoltage, fetchedRecommendedVoltage);

                // If the system voltage is not set, use recommended voltage
                if (fetchedVoltage) {
                    setSystemVoltage(fetchedVoltage);
                } else {
                    setSystemVoltage(fetchedRecommendedVoltage);
                    setRecommendedSystemVoltage(fetchedRecommendedVoltage);
                    setUseRecommendedVoltage(true); // Set flag to true to show recommended voltage initially
                }

                // Fetch suitable inverters after setting the voltage
                const inverters = await getSuitableInverters(selectedProject, fetchedVoltage || fetchedRecommendedVoltage, temperature);
                console.log('GET suitable inverters response:', inverters);
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

    // Refetch inverters when the voltage or temperature changes
    useEffect(() => {
        if (!selectedProject || !systemVoltage) return;

        const fetchInverters = async () => {
            setLoading(true);
            try {
                const inverters = await getSuitableInverters(selectedProject, systemVoltage, temperature);
                console.log('GET suitable inverters response:', inverters);
                setSuitableInverters(inverters);
            } catch (error) {
                console.error('Error fetching suitable inverters:', error);
                setError(t('step4.error_message'));
            } finally {
                setLoading(false);
            }
        };

        fetchInverters();
    }, [systemVoltage, temperature, selectedProject]);

    // Fetch the inverter details and load the temperature
    useEffect(() => {
        const fetchProjectInverterDetails = async () => {
            if (!selectedProject) return;

            try {
                const projectInverter = await getProjectInverter(selectedProject);
                console.log('GET project inverter details response:', projectInverter);

                // Set the initial temperature from the fetched inverter details
                if (projectInverter.inverterTemperature) {
                    setTemperature(projectInverter.inverterTemperature);
                }

                setEnergyCalculations({
                    totalAdjustedAcEnergy: projectInverter.totalAdjustedAcEnergy || 0,
                    totalDailyEnergy: projectInverter.totalDailyEnergy || 0,
                });
                setSelectedInverterId(projectInverter.inverterId); // Set the selected inverter ID from the fetched details
            } catch (error) {
                console.error('Error fetching project inverter details:', error);
                setError(t('step4.error_message'));
            }
        };

        fetchProjectInverterDetails();
    }, [selectedProject, t]);

    const handleSystemVoltageChange = (e) => {
        setSystemVoltage(e.target.value);
        setUseRecommendedVoltage(false); // User manually changed voltage, stop using recommended
    };

    const handleTemperatureChange = (e) => {
        setTemperature(parseInt(e.target.value)); // Update the temperature selection
    };

    const handleInverterSelection = async (inverterId) => {
        const newSelectedInverterId = selectedInverterId === inverterId && suitableInverters.length > 1 ? null : inverterId;

        if (newSelectedInverterId !== selectedInverterId) {
            setSelectedInverterId(newSelectedInverterId);

            if (newSelectedInverterId) {
                setLoading(true);
                try {
                    const result = await selectInverter(selectedProject, newSelectedInverterId);
                    setEnergyCalculations({
                        totalAdjustedAcEnergy: result.totalAdjustedAcEnergy || 0,
                        totalDailyEnergy: result.totalDailyEnergy || 0,
                    });
                    
                    setSystemVoltage(result.systemVoltage || systemVoltage);
                    setTemperature(result.inverterTemperature || temperature);

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
                <h2>{t('step4.select_inverter_configuration')}</h2>
                {error && <p className="step4-error-message">{error}</p>}
            </div>

            <div className="step4-content">
                <div className="step4-selection-section">
                    <div className="step4-input-group">
                        <label htmlFor="systemVoltage">{t('step4.system_voltage_label')}</label>
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
                    <div className="step4-input-group">
                        <label htmlFor="temperature">{t('step4.select_temperature_label')}</label>
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

                <div className="step4-inverter-list-section">
                    <h3>{t('step4.suitable_inverters')}</h3>
                    {loading ? (
                        <p>{t('step4.loading')}</p>
                    ) : (
                        suitableInverters.map((inverter) => (
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
                                    {inverter.name} - Continuous Power at {temperature}°C: {getContinuousPowerByTemperature(inverter)}W, Max Power: {inverter.maxPower}W, Efficiency: {inverter.efficiency}%, Voltage: {inverter.voltage}V
                                </label>
                            </div>
                        ))
                    )}
                </div>
                <div className="step4-energy-calculations">
                    <h4>{t('step4.energy_calculations')}</h4>
                    <p>{t('step4.adjusted_ac_load')}: {energyCalculations.totalAdjustedAcEnergy.toFixed(2) || t('step4.not_calculated')}</p>
                    <p>{t('step4.total_daily_energy')}: {energyCalculations.totalDailyEnergy.toFixed(2) || t('step4.not_calculated')}</p>
                </div>
            </div>
        </div>
    );
};

export default Step4_Inverter;
