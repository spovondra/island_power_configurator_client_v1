import React, { useContext, useState, useEffect, useCallback } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { addOrUpdateAppliance, deleteAppliance, getProjectById } from '../../services/ProjectService';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useTranslation } from 'react-i18next';
import './Step2_Appliance.css';

const Step2_Appliance = ({ onComplete }) => {
    const { t } = useTranslation('wizard');
    const { selectedProject } = useContext(ProjectContext);

    const [appliance, setAppliance] = useState({
        id: '',
        name: '',
        type: 'AC',
        quantity: 1,
        power: 0,
        hours: 0,
        days: 7,
        peakPower: 0,
        energy: 0,
    });

    const [appliances, setAppliances] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [configurationModel, setConfigurationModel] = useState(null);

    useEffect(() => {
        const fetchAppliances = async () => {
            if (selectedProject) {
                try {
                    const project = await getProjectById(selectedProject);
                    setAppliances(project.appliances || []);
                    setConfigurationModel(project.configurationModel?.projectAppliance || null);
                } catch (error) {
                    console.error(t('step2.error_message'), error);
                }
            }
        };

        fetchAppliances();
    }, [selectedProject, t]);

    const handleSave = useCallback(async (e) => {
        e.preventDefault();
        try {
            if (!selectedProject) {
                alert(t('step2.error_message'));
                return;
            }
            await addOrUpdateAppliance(selectedProject, appliance);
            const updatedProject = await getProjectById(selectedProject);
            setAppliances(updatedProject.appliances);
            setConfigurationModel(updatedProject.configurationModel?.projectAppliance || null);
            setAppliance({
                id: '',
                name: '',
                type: 'AC',
                quantity: 1,
                power: 0,
                hours: 0,
                days: 7,
                peakPower: 0,
                energy: 0,
            });
            setEditMode(false);
            onComplete();
        } catch (error) {
            console.error(t('step2.error_message'), error);
            alert(t('step2.error_message'));
        }
    }, [selectedProject, appliance, t, onComplete]);

    const handleEdit = (appl) => {
        setAppliance(appl);
        setEditMode(true);
    };

    const handleDelete = async (applianceId) => {
        if (!applianceId) {
            alert(t('step2.error_message'));
            return;
        }

        try {
            if (!selectedProject) {
                alert(t('step2.error_message'));
                return;
            }
            await deleteAppliance(selectedProject, applianceId);
            setAppliances(appliances.filter(appl => appl.id !== applianceId));
        } catch (error) {
            console.error(t('step2.error_message'), error);
            alert(t('step2.error_message'));
        }
    };

    const handleInputChange = (e) => {
        const { id, value, type } = e.target;
        const parsedValue = type === 'number' ? parseFloat(value) : value;

        setAppliance(prevState => ({
            ...prevState,
            [id]: parsedValue
        }));
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    // Data for total power chart
    const powerChartData = [
        { name: t('step2.legend.total_ac_power'), value: configurationModel?.totalAcPower || 0 },
        { name: t('step2.legend.total_dc_power'), value: configurationModel?.totalDcPower || 0 },
    ];

    // Data for total energy chart
    const energyChartData = [
        { name: t('step2.legend.total_ac_energy'), value: configurationModel?.totalAcEnergy || 0 },
        { name: t('step2.legend.total_dc_energy'), value: configurationModel?.totalDcEnergy || 0 },
    ];

    // Data for total peak power chart
    const peakPowerChartData = [
        { name: t('step2.legend.total_ac_peak_power'), value: configurationModel?.totalAcPeakPower || 0 },
        { name: t('step2.legend.total_dc_peak_power'), value: configurationModel?.totalDcPeakPower || 0 },
    ];

    return (
        <div className="step2-container">
            <div className="step2-appliance-page-container">
                <div className="step2-form-section">
                    <form onSubmit={handleSave} className="step2-appliance-form">
                        <div className="step2-input-group">
                            <label htmlFor="name">{t('step2.name_label')}:</label>
                            <input
                                type="text"
                                id="name"
                                value={appliance.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="step2-input-group">
                            <label htmlFor="type">{t('step2.type_label')}:</label>
                            <select
                                id="type"
                                value={appliance.type}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="AC">AC</option>
                                <option value="DC">DC</option>
                            </select>
                        </div>
                        <div className="step2-input-group">
                            <label htmlFor="power">{t('step2.power_label')}:</label>
                            <input
                                type="number"
                                id="power"
                                min="0"
                                step="0.01"
                                value={appliance.power}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="step2-input-group">
                            <label htmlFor="quantity">{t('step2.quantity_label')}:</label>
                            <input
                                type="number"
                                id="quantity"
                                min="1"
                                value={appliance.quantity}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="step2-input-group">
                            <label htmlFor="hours">{t('step2.hours_label')}:</label>
                            <input
                                type="number"
                                id="hours"
                                min="0"
                                max="24"
                                step="0.1"
                                value={appliance.hours}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="step2-input-group">
                            <label htmlFor="days">{t('step2.days_label')}:</label>
                            <input
                                type="number"
                                id="days"
                                min="1"
                                max="7"
                                value={appliance.days}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="step2-input-group">
                            <label htmlFor="peakPower">{t('step2.peak_power_label')}:</label>
                            <input
                                type="number"
                                id="peakPower"
                                min="0"
                                step="0.01"
                                value={appliance.peakPower}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button type="submit" className="step2-action-button">
                            {editMode ? t('step2.edit_button') : t('step2.save_button')}
                        </button>
                    </form>
                </div>

                <div className="step2-appliance-list-section">
                    <table className="step2-appliance-table">
                        <thead>
                        <tr>
                            <th style={{minWidth: '200px'}}>{t('step2.name_label')}</th>
                            <th>{t('step2.type_label')}</th>
                            <th>{t('step2.power_label')}</th>
                            <th>{t('step2.quantity_label')}</th>
                            <th>{t('step2.hours_label')}</th>
                            <th>{t('step2.days_label')}</th>
                            <th>{t('step2.peak_power_label')}</th>
                            <th>{t('step2.energy_label')}</th>
                            <th>{t('step2.actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {appliances.map((appl) => (
                            <tr key={appl.id}>
                                <td>{appl.name}</td>
                                <td>{appl.type}</td>
                                <td>{appl.power}</td>
                                <td>{appl.quantity}</td>
                                <td>{appl.hours}</td>
                                <td>{appl.days}</td>
                                <td>{appl.peakPower}</td>
                                <td>{appl.energy}</td>
                                <td className="step2-button-group">
                                    <button className="step2-edit-button" onClick={() => handleEdit(appl)}>
                                        {t('step2.edit_button')}
                                    </button>
                                    <button className="step2-delete-button" onClick={() => handleDelete(appl.id)}>
                                        {t('step2.delete_button')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Chart Section - Placed outside and below the main container */}
            <div className="step2-chart-section">
                <div className="step2-chart-container">
                    <h2 className="chart-title">{t('step2.power_chart_title')}</h2>
                    <PieChart width={300} height={300}>
                        <Pie data={powerChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                            {powerChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                            ))}
                        </Pie>
                        <Tooltip/>
                        <Legend/>
                    </PieChart>
                </div>
                <div className="step2-chart-container">
                    <h2 className="chart-title">{t('step2.peak_power_chart_title')}</h2>
                    <PieChart width={300} height={300}>
                        <Pie data={peakPowerChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                            {peakPowerChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                            ))}
                        </Pie>
                        <Tooltip/>
                        <Legend/>
                    </PieChart>
                </div>
                <div className="step2-chart-container">
                    <h2 className="chart-title">{t('step2.energy_chart_title')}</h2>
                    <PieChart width={300} height={300}>
                        <Pie data={energyChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                            {energyChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                            ))}
                        </Pie>
                        <Tooltip/>
                        <Legend/>
                    </PieChart>
                </div>
            </div>
        </div>
    );
};

export default Step2_Appliance;
