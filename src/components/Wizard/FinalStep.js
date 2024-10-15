import React, { useContext, useState, useEffect } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { getProjectById } from '../../services/ProjectService';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    LabelList,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { useTranslation } from 'react-i18next'; // Import translation hook
import './FinalStep.css';

const FinalStep = () => {
    const { t } = useTranslation('wizard'); // Use translation for the wizard namespace
    const { selectedProject } = useContext(ProjectContext);
    const [project, setProject] = useState(null);
    const [pvgisData, setPVGISData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            if (selectedProject) {
                try {
                    const data = await getProjectById(selectedProject);
                    setProject(data);
                    if (data.site && data.site.monthlyDataList) {
                        setPVGISData(data.site.monthlyDataList);
                    }
                } catch (err) {
                    setError(t('final_step.fetch_error')); // Use translation for error message
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchProject();
    }, [selectedProject, t]);

    if (loading) return <p>{t('final_step.loading')}</p>; // Use translation for loading text
    if (error) return <p>{error}</p>;

    const site = project?.site || {};
    const appliances = project?.appliances || [];
    const configuration = project?.configurationModel || {};

    const totalEnergyData = [
        {
            name: t('final_step.total_ac_energy'), // Use translation for total AC energy
            value: configuration?.projectAppliance?.totalAcEnergy || 0,
        },
        {
            name: t('final_step.total_dc_energy'), // Use translation for total DC energy
            value: configuration?.projectAppliance?.totalDcEnergy || 0,
        },
    ];

    const chartData = pvgisData.map(item => ({
        month: item.month,
        irradiance: item.irradiance,
        ambientTemperature: item.ambientTemperature,
    }));

    return (
        <div className="final-step-container">
            <h2>{t('final_step.final_system_overview')}</h2>

            {/* Project Information */}
            <div className="final-step-section">
                <h3>{t('final_step.project_information')}</h3>
                <ul>
                    <li><strong>{t('final_step.project_id')}:</strong> {project?.id || 'N/A'}</li>
                    <li><strong>{t('final_step.project_name')}:</strong> {project?.name || 'N/A'}</li>
                    <li><strong>{t('final_step.user_id')}:</strong> {project?.userId || 'N/A'}</li>
                </ul>
            </div>

            {/* Site Information */}
            <div className="final-step-section">
                <h3>{t('final_step.site_details')}</h3>
                <ul>
                    <li><strong>{t('final_step.latitude')}:</strong> {site.latitude || 'N/A'}</li>
                    <li><strong>{t('final_step.longitude')}:</strong> {site.longitude || 'N/A'}</li>
                    <li><strong>{t('final_step.min_temperature')}:</strong> {site.minTemperature || 'N/A'} °C</li>
                    <li><strong>{t('final_step.max_temperature')}:</strong> {site.maxTemperature || 'N/A'} °C</li>
                    <li><strong>{t('final_step.panel_angle')}:</strong> {site.panelAngle || 'N/A'}°</li>
                    <li><strong>{t('final_step.panel_aspect')}:</strong> {site.panelAspect || 'N/A'}</li>
                    <li><strong>{t('final_step.used_optimal_values')}:</strong> {site.usedOptimalValues ? t('final_step.yes') : t('final_step.no')}</li>
                </ul>
            </div>

            {/* Monthly Irradiance & Ambient Temperature Charts */}
            <div className="chart-flex-container">
                <div className="chart-container">
                    <h3>{t('final_step.monthly_irradiance')}</h3>
                    <BarChart width={400} height={250} data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: 'Irradiance (kWh/m²)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Bar dataKey="irradiance" fill="#8884d8">
                            <LabelList dataKey="irradiance" position="top" />
                        </Bar>
                    </BarChart>
                </div>
                <div className="chart-container">
                    <h3>{t('final_step.monthly_avg_temperature')}</h3>
                    <BarChart width={400} height={250} data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Bar dataKey="ambientTemperature" fill="#82ca9d">
                            <LabelList dataKey="ambientTemperature" position="top" />
                        </Bar>
                    </BarChart>
                </div>
            </div>

            {/* Appliances Information */}
            <div className="final-step-section">
                <h3>{t('final_step.appliances')}</h3>
                <ul className="final-step-list">
                    {appliances.map(appliance => (
                        <li key={appliance.id}>
                            <strong>{appliance.name}</strong>:
                            <ul>
                                <li>{t('final_step.type')}: {appliance.type}</li>
                                <li>{t('final_step.quantity')}: {appliance.quantity}</li>
                                <li>{t('final_step.power')}: {appliance.power} W</li>
                                <li>{t('final_step.hours_per_day')}: {appliance.hours}</li>
                                <li>{t('final_step.days_per_week')}: {appliance.days}</li>
                                <li>{t('final_step.peak_power')}: {appliance.peakPower} W</li>
                                <li>{t('final_step.energy')}: {appliance.energy} Wh</li>
                                <li>{t('final_step.cost')}: {appliance.cost} CZK</li>
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Total Energy Consumption Pie Chart */}
            <div className="final-step-section graph-container">
                <h3>{t('final_step.total_energy_consumption')}</h3>
                <PieChart width={400} height={400}>
                    <Pie
                        data={totalEnergyData}
                        cx={200}
                        cy={200}
                        labelLine={false}
                        label={entry => entry.name}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {totalEnergyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#ff7300' : '#0088FE'} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </div>

            {/* Configuration Model */}
            <div className="final-step-section">
                <h3>{t('final_step.configuration_model')}</h3>
                <ul>
                    <li><strong>{t('final_step.total_ac_energy')}:</strong> {configuration?.projectAppliance?.totalAcEnergy || 'N/A'} Wh</li>
                    <li><strong>{t('final_step.total_dc_energy')}:</strong> {configuration?.projectAppliance?.totalDcEnergy || 'N/A'} Wh</li>
                    <li><strong>{t('final_step.system_voltage')}:</strong> {configuration.systemVoltage || 'N/A'} V</li>
                    <li><strong>{t('final_step.recommended_system_voltage')}:</strong> {configuration.recommendedSystemVoltage || 'N/A'} V</li>
                    <li><strong>{t('final_step.total_ac_peak_power')}:</strong> {configuration?.projectAppliance?.totalAcPeakPower || 'N/A'} W</li>
                    <li><strong>{t('final_step.total_dc_peak_power')}:</strong> {configuration?.projectAppliance?.totalDcPeakPower || 'N/A'} W</li>
                    <li><strong>{t('final_step.inverter_id')}:</strong> {configuration?.projectInverter?.inverterId || 'N/A'}</li>
                    <li><strong>{t('final_step.inverter_temperature')}:</strong> {configuration?.projectInverter?.inverterTemperature || 'N/A'} °C</li>
                    <li><strong>{t('final_step.total_adjusted_ac_energy')}:</strong> {configuration?.projectInverter?.totalAdjustedAcEnergy || 'N/A'} Wh</li>
                    <li><strong>{t('final_step.total_daily_energy')}:</strong> {configuration?.projectInverter?.totalDailyEnergy || 'N/A'} Wh</li>
                </ul>
            </div>

            {/* Solar Panel Configuration */}
            <div className="final-step-section">
                <h3>{t('final_step.solar_panel_configuration')}</h3>
                <ul>
                    <li><strong>{t('final_step.solar_panel_id')}:</strong> {configuration?.projectSolarPanel?.solarPanelId || 'N/A'}</li>
                    <li><strong>{t('final_step.number_of_panels')}:</strong> {configuration?.projectSolarPanel?.numberOfPanels || 'N/A'}</li>
                    <li><strong>{t('final_step.total_power_generated')}:</strong> {configuration?.projectSolarPanel?.totalPowerGenerated || 'N/A'} W</li>
                    <li><strong>{t('final_step.efficiency_loss')}:</strong> {configuration?.projectSolarPanel?.efficiencyLoss || 'N/A'}</li>
                    <li><strong>{t('final_step.estimated_daily_energy_production')}:</strong> {configuration?.projectSolarPanel?.estimatedDailyEnergyProduction || 'N/A'} Wh</li>
                    <li><strong>{t('final_step.installation_type')}:</strong> {configuration?.projectSolarPanel?.installationType || 'N/A'}</li>
                </ul>
            </div>

            {/* Battery Configuration */}
            <div className="final-step-section">
                <h3>{t('final_step.battery_configuration')}</h3>
                <ul>
                    <li><strong>{t('final_step.battery_id')}:</strong> {configuration?.projectBattery?.batteryId || 'N/A'}</li>
                    <li><strong>{t('final_step.battery_type')}:</strong> {configuration?.projectBattery?.type || 'N/A'}</li>
                    <li><strong>{t('final_step.temperature')}:</strong> {configuration?.projectBattery?.temperature || 'N/A'} °C</li>
                    <li><strong>{t('final_step.battery_capacity')}:</strong> {configuration?.projectBattery?.batteryCapacityDod || 'N/A'} Wh</li>
                    <li><strong>{t('final_step.parallel_batteries')}:</strong> {configuration?.projectBattery?.parallelBatteries || 'N/A'}</li>
                    <li><strong>{t('final_step.series_batteries')}:</strong> {configuration?.projectBattery?.seriesBatteries || 'N/A'}</li>
                    <li><strong>{t('final_step.total_available_capacity')}:</strong> {configuration?.projectBattery?.totalAvailableCapacity || 'N/A'} Wh</li>
                </ul>
            </div>
        </div>
    );
};

export default FinalStep;
