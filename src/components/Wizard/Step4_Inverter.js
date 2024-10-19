import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import translation hook
import { ProjectContext } from '../../context/ProjectContext';
import { getSuitableInverters, selectInverter, getProjectInverter } from '../../services/ProjectService';
import './Step4_Inverter.css';

const Step4_Inverter = ({ onComplete }) => {  // Přidáno onComplete prop
    const { t } = useTranslation('wizard'); // Initialize translation function
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
                console.log('GET suitable inverters response:', inverters); // Log the incoming data
                setSuitableInverters(inverters);
            } catch (error) {
                console.error('Error fetching suitable inverters:', error);
                setError(t('step4.error_message')); // Use translation for error message
            } finally {
                setLoading(false);
            }
        };

        fetchSuitableInverters();
    }, [selectedProject, systemVoltage, temperature, t]);

    useEffect(() => {
        const fetchProjectInverterDetails = async () => {
            if (!selectedProject) return;

            try {
                const projectInverter = await getProjectInverter(selectedProject);
                console.log('GET project inverter details response:', projectInverter); // Log the incoming data
                setEnergyCalculations({
                    totalAdjustedAcEnergy: projectInverter.totalAdjustedAcEnergy || 0,
                    totalDailyEnergy: projectInverter.totalDailyEnergy || 0,
                });
            } catch (error) {
                console.error('Error fetching project inverter details:', error);
                setError(t('step4.error_message')); // Use translation for error message
            }
        };

        fetchProjectInverterDetails();
    }, [selectedProject, t]);

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
            onComplete();
        } catch (error) {
            console.error('Error selecting inverter:', error);
            setError(t('step4.error_message'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="step4-inverter-page-container">
            <h2>{t('step4.select_inverter_configuration')}</h2>
            {error && <p className="error-message">{error}</p>}
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
                    <table className="step4-inverter-table">
                        <thead>
                        <tr>
                            <th>{t('step4.name')}</th>
                            <th>{t('step4.continuous_power')} ({temperature}°C)</th>
                            <th>{t('step4.max_power')}</th>
                            <th>{t('step4.efficiency')}</th>
                            <th>{t('step4.voltage')}</th>
                            <th>{t('step4.select')}</th>
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
                                    <button
                                        className="step4-select-button"
                                        onClick={() => handleInverterSelection(inverter.id)}>
                                        {t('step4.select')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
            <div className="step4-energy-calculations">
                <h4>{t('step4.energy_calculations')}</h4>
                <p>{t('step4.adjusted_ac_load')}: {energyCalculations.totalAdjustedAcEnergy.toFixed(2) || t('step4.not_calculated')}</p>
                <p>{t('step4.total_daily_energy')}: {energyCalculations.totalDailyEnergy.toFixed(2) || t('step4.not_calculated')}</p>
            </div>
        </div>
    );
};

export default Step4_Inverter;
