import React, { useContext, useState, useEffect, useCallback } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { addOrUpdateAppliance, deleteAppliance, getProjectById } from '../../services/ProjectService';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next'; // Import translation hook
import './Step2_Appliance.css';

const Step2_Appliance = ({ onComplete }) => {  // Přidáme onComplete jako prop
    const { t } = useTranslation('wizard');
    const { selectedProject } = useContext(ProjectContext);

    const [appliance, setAppliance] = useState({
        id: '',
        name: '',
        type: 'AC',
        quantity: 0,
        power: 0,
        hours: 0,
        days: 7,
        peakPower: 0,
        energy: 0,
        cost: 0
    });

    const [appliances, setAppliances] = useState([]);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const fetchAppliances = async () => {
            if (selectedProject) {
                try {
                    const project = await getProjectById(selectedProject);
                    setAppliances(project.appliances || []);
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
            setAppliance({
                id: '',
                name: '',
                type: 'AC',
                quantity: 0,
                power: 0,
                hours: 0,
                days: 7,
                peakPower: 0,
                energy: 0,
                cost: 0
            });
            setEditMode(false);
            alert(t('step2.save_button'));
            onComplete();  // Zavoláme onComplete, když je krok dokončen
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
            alert(t('step2.delete_button'));
        } catch (error) {
            console.error(t('step2.error_message'), error);
            alert(t('step2.error_message'));
        }
    };

    const chartData = appliances.reduce((acc, appliance) => {
        const typeIndex = acc.findIndex(item => item.type === appliance.type);
        if (typeIndex > -1) {
            acc[typeIndex].totalEnergy += appliance.energy;
        } else {
            acc.push({
                type: appliance.type,
                totalEnergy: appliance.energy,
            });
        }
        return acc;
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="step2-appliance-page-container">
            <div className="step2-form-section">
                <form onSubmit={handleSave} className="step2-appliance-form">
                    <div className="step2-input-group">
                        <label htmlFor="name">{t('step2.name_label')}:</label>
                        <input
                            type="text"
                            id="name"
                            value={appliance.name}
                            onChange={(e) => setAppliance({ ...appliance, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="step2-input-group">
                        <label htmlFor="type">{t('step2.type_label')}:</label>
                        <select
                            id="type"
                            value={appliance.type}
                            onChange={(e) => setAppliance({ ...appliance, type: e.target.value })}
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
                            value={appliance.power}
                            onChange={(e) => setAppliance({ ...appliance, power: parseFloat(e.target.value) })}
                            required
                        />
                    </div>
                    <div className="step2-input-group">
                        <label htmlFor="quantity">{t('step2.quantity_label')}:</label>
                        <input
                            type="number"
                            id="quantity"
                            value={appliance.quantity}
                            onChange={(e) => setAppliance({ ...appliance, quantity: parseInt(e.target.value, 10) })}
                            required
                        />
                    </div>
                    <div className="step2-input-group">
                        <label htmlFor="hours">{t('step2.hours_label')}:</label>
                        <input
                            type="number"
                            id="hours"
                            value={appliance.hours}
                            onChange={(e) => setAppliance({ ...appliance, hours: parseFloat(e.target.value) })}
                            required
                        />
                    </div>
                    <div className="step2-input-group">
                        <label htmlFor="days">{t('step2.days_label')}:</label>
                        <input
                            type="number"
                            id="days"
                            value={appliance.days}
                            onChange={(e) => setAppliance({ ...appliance, days: parseFloat(e.target.value) })}
                            required
                        />
                    </div>
                    <div className="step2-input-group">
                        <label htmlFor="peakPower">{t('step2.peak_power_label')}:</label>
                        <input
                            type="number"
                            id="peakPower"
                            value={appliance.peakPower}
                            onChange={(e) => setAppliance({ ...appliance, peakPower: parseFloat(e.target.value) })}
                        />
                    </div>
                    <div className="step2-input-group">
                        <label htmlFor="energy">{t('step2.energy_label')}:</label>
                        <input
                            type="number"
                            id="energy"
                            value={appliance.energy}
                            onChange={(e) => setAppliance({ ...appliance, energy: parseFloat(e.target.value) })}
                            disabled
                        />
                    </div>
                    <div className="step2-input-group">
                        <label htmlFor="cost">{t('step2.cost_label')}:</label>
                        <input
                            type="number"
                            id="cost"
                            value={appliance.cost}
                            onChange={(e) => setAppliance({ ...appliance, cost: parseFloat(e.target.value) })}
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
                        <th style={{ minWidth: '200px' }}>{t('step2.name_label')}</th>
                        <th>{t('step2.type_label')}</th>
                        <th>{t('step2.power_label')}</th>
                        <th>{t('step2.quantity_label')}</th>
                        <th>{t('step2.hours_label')}</th>
                        <th>{t('step2.days_label')}</th>
                        <th>{t('step2.peak_power_label')}</th>
                        <th>{t('step2.energy_label')}</th>
                        <th>{t('step2.cost_label')}</th>
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
                            <td>{appl.cost}</td>
                            <td className="step2-button-group">
                                <button
                                    className="step2-edit-button"
                                    onClick={() => handleEdit(appl)}
                                >
                                    {t('step2.edit_button')}
                                </button>
                                <button
                                    className="step2-delete-button"
                                    onClick={() => handleDelete(appl.id)}
                                >
                                    {t('step2.delete_button')}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="chart-section">
                <h2>{t('step2.energy_chart_title')}</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="totalEnergy"
                            nameKey="type"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            label
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Step2_Appliance;
