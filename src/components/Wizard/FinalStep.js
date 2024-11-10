import React, { useContext, useState, useEffect } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { getProjectById } from '../../services/ProjectService';
import LocationComponent from '../Location/LocationComponent'; // Adjust the path if needed

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
    LineChart,
    Line,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import './FinalStep.css';

const FinalStep = () => {
    const { t } = useTranslation('wizard');
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
                    if (data?.site?.monthlyDataList) {
                        setPVGISData(data.site.monthlyDataList);
                    }
                } catch (err) {
                    setError(t('final_step.fetch_error'));
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchProject();
    }, [selectedProject, t]);

    if (loading) return <p>{t('final_step.loading')}</p>;
    if (error) return <p>{error}</p>;

    const site = project?.site || {};
    const appliances = project?.appliances || [];
    const configuration = project?.configurationModel || {};
    const totalEnergyData = [
        { name: t('final_step.total_ac_energy'), value: configuration?.projectAppliance?.totalAcEnergy || 0 },
        { name: t('final_step.total_dc_energy'), value: configuration?.projectAppliance?.totalDcEnergy || 0 },
    ];
    
    const solarPanelData = configuration?.projectSolarPanel?.monthlyData || [];

    const chartData = solarPanelData.map(item => ({
        month: item.month,
        psh: item.psh,
        ambientTemperature: item.ambientTemperature,
        requiredEnergy: item.requiredEnergy,
        powerRequired: item.requiredPower,
        efficiency: item.efficiency,
        reducedPower: item.deratedPower,
        panelCount: item.numPanels,
        estimatedEnergyProduction: item.estimatedDailySolarEnergy,
    }));

    return (
        <div className="final-step-container">
            <h2>{t('final_step.final_system_overview')}</h2>

            {/* Project Information */}
            <div className="final-step-section project-info">
                <h3>{t('final_step.project_information')}</h3>
                <ul>
                    <li><strong>{t('final_step.project_name')}:</strong> {project?.name || 'N/A'}</li>
                    <li><strong>{t('final_step.project_id')}:</strong> {project?.id || 'N/A'}</li>
                    <li><strong>{t('final_step.user_name')}:</strong> {project?.userName || 'N/A'}</li>
                    <li><strong>{t('final_step.user_id')}:</strong> {project?.userId || 'N/A'}</li>
                </ul>
            </div>

            {/* Energy Consumption Section */}
            <div className="final-step-section energy-consumption-section">
                <h3>{t('final_step.appliances')}</h3>
                <div className="final-step-flex-container">
                    {/* Appliance Table */}
                    <div className="final-step-table-container">
                        <table className="final-step-table">
                            <thead>
                            <tr>
                                <th>{t('final_step.name')}</th>
                                <th>{t('final_step.type')}</th>
                                <th>{t('final_step.power')}</th>
                                <th>{t('final_step.peak_power')}</th>
                                <th>{t('final_step.quantity')}</th>
                                <th>{t('final_step.hours_per_day')}</th>
                                <th>{t('final_step.days_per_week')}</th>
                                <th>{t('final_step.cost')}</th>
                                <th>{t('final_step.energy')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {appliances.map(appliance => (
                                <tr key={appliance.id}>
                                    <td>{appliance.name}</td>
                                    <td>{appliance.type}</td>
                                    <td>{appliance.power} W</td>
                                    <td>{appliance.peakPower} W</td>
                                    <td>{appliance.quantity}</td>
                                    <td>{appliance.hours}</td>
                                    <td>{appliance.days}</td>
                                    <td>{appliance.cost} CZK</td>
                                    <td>{appliance.energy} Wh</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <ul>
                            <li><strong>{t('final_step.total_ac_energy')}:</strong> {configuration?.projectAppliance?.totalAcEnergy || 'N/A'} Wh</li>
                            <li><strong>{t('final_step.total_dc_energy')}:</strong> {configuration?.projectAppliance?.totalDcEnergy || 'N/A'} Wh</li>
                            <li><strong>{t('final_step.total_ac_peak_power')}:</strong> {configuration?.projectAppliance?.totalAcPeakPower || 'N/A'} W</li>
                            <li><strong>{t('final_step.total_dc_peak_power')}:</strong> {configuration?.projectAppliance?.totalDcPeakPower || 'N/A'} W</li>
                        </ul>
                    </div>

                    {/* Pie Charts */}
                    <div className="final-step-chart-container">
                        {/* Total Energy Pie Chart */}
                        <PieChart width={200} height={200}>
                            <Pie
                                data={totalEnergyData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                                dataKey="value"
                            >
                                <Cell key="cell-0" fill="#ff7300" />
                                <Cell key="cell-1" fill="#0088FE" />
                            </Pie>
                            <Tooltip />
                        </PieChart>

                        {/* Peak Power Pie Chart */}
                        <PieChart width={200} height={200}>
                            <Pie
                                data={[
                                    { name: t('final_step.peak_ac'), value: configuration?.projectAppliance?.totalAcPeakPower || 0 },
                                    { name: t('final_step.peak_dc'), value: configuration?.projectAppliance?.totalDcPeakPower || 0 },
                                ]}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                                dataKey="value"
                            >
                                <Cell key="cell-0" fill="#FFBB28" />
                                <Cell key="cell-1" fill="#00C49F" />
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </div>
                </div>
            </div>

            {/* Site Information Section */}
            <div className="final-step-section site-details-section">
                <h3>{t('final_step.site_details')}</h3>
                <div className="final-step-site-flex-container">
                    {/* Site Information List */}
                    <div className="final-step-site-details">
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

                    {/* Static Map Container */}
                    <div className="final-step-map-container">
                        <LocationComponent
                            latitude={site.latitude || 0}
                            longitude={site.longitude || 0}
                            setLatitude={() => {}} // Disable interactivity by passing empty functions
                            setLongitude={() => {}}
                            setUseOptimal={() => {}}
                        />
                    </div>
                </div>
            </div>

            {/* Monthly Charts Section */}
            <div className="final-step-section final-step-chart-container">
                <div className="final-step-chart-row">
                    <div className="final-step-chart-item">
                        <h3>{t('final_step.monthly_psh')}</h3>
                        <BarChart width={400} height={250} data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" label={{ value: t('final_step.month'), position: 'insideBottom', offset: -5 }} />
                            <YAxis label={{ value: t('final_step.irradiance_kwh_m2'), angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Bar dataKey="psh" fill="#8884d8">
                                <LabelList dataKey="psh" position="top" />
                            </Bar>
                        </BarChart>
                    </div>
                    <div className="final-step-chart-item">
                        <h3>{t('final_step.monthly_avg_temperature')}</h3>
                        <BarChart width={400} height={250} data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" label={{ value: t('final_step.month'), position: 'insideBottom', offset: -5 }} />
                            <YAxis label={{ value: t('final_step.temperature_c'), angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Bar dataKey="ambientTemperature" fill="#82ca9d">
                                <LabelList dataKey="ambientTemperature" position="top" />
                            </Bar>
                        </BarChart>
                    </div>
                </div>
            </div>

            {/* System Voltage Configuration */}
            <div className="final-step-section system-voltage-info">
                <h3>{t('final_step.system_voltage_configuration')}</h3>
                <ul>
                    <li><strong>{t('final_step.system_voltage')}:</strong> {configuration.systemVoltage || 'N/A'} V</li>
                    <li><strong>{t('final_step.recommended_system_voltage')}:</strong> {configuration.recommendedSystemVoltage || 'N/A'} V</li>
                </ul>
            </div>

            {/* Inverter Configuration */}
            <div className="final-step-section inverter-info">
                <h3>{t('final_step.inverter_configuration')}</h3>
                <ul>
                    <li><strong>{t('final_step.inverter_id')}:</strong> {configuration?.projectInverter?.inverterId || 'N/A'}</li>
                    <li><strong>{t('final_step.inverter_temperature')}:</strong> {configuration?.projectInverter?.inverterTemperature || 'N/A'} °C</li>
                    <li><strong>{t('final_step.total_adjusted_ac_energy')}:</strong> {configuration?.projectInverter?.totalAdjustedAcEnergy || 'N/A'} Wh</li>
                    <li><strong>{t('final_step.total_daily_energy')}:</strong> {configuration?.projectInverter?.totalDailyEnergy || 'N/A'} Wh</li>
                </ul>
                <table className="final-step-table">
                    <thead>
                    <tr>
                        <th>{t('final_step.inverter_name')}</th>
                        <th>{t('final_step.voltage')}</th>
                        <th>{t('final_step.continuous_power_25')}</th>
                        <th>{t('final_step.max_power')}</th>
                        <th>{t('final_step.efficiency')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{configuration?.projectInverter?.inverterName || 'N/A'}</td>
                        <td>{configuration?.projectInverter?.voltage || 'N/A'} V</td>
                        <td>{configuration?.projectInverter?.continuousPower25 || 'N/A'} W</td>
                        <td>{configuration?.projectInverter?.maxPower || 'N/A'} W</td>
                        <td>{configuration?.projectInverter?.efficiency || 'N/A'} %</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {/* Battery Configuration Section */}
            <div className="final-step-section final-step-battery-info">
                <h3>{t('final_step.battery_configuration')}</h3>
                <ul className="final-step-list">
                    <li><strong>{t('final_step.battery_id')}:</strong> {configuration?.projectBattery?.batteryId || 'N/A'}</li>
                    <li><strong>{t('final_step.temperature')}:</strong> {configuration?.projectBattery?.temperature || 'N/A'} °C</li>
                    <li><strong>{t('final_step.parallel_batteries')}:</strong> {configuration?.projectBattery?.parallelBatteries || 'N/A'}</li>
                    <li><strong>{t('final_step.series_batteries')}:</strong> {configuration?.projectBattery?.seriesBatteries || 'N/A'}</li>
                    <li><strong>{t('final_step.total_available_capacity')}:</strong> {configuration?.projectBattery?.totalAvailableCapacity || 'N/A'} Wh</li>
                </ul>

                {/* Battery Parameters Table */}
                <table className="final-step-table final-step-battery-table">
                    <thead>
                    <tr>
                        <th>{t('final_step.battery_name')}</th>
                        <th>{t('final_step.technology')}</th>
                        <th>{t('final_step.voltage')}</th>
                        <th>{t('final_step.capacity')}</th>
                        <th>{t('final_step.dod')}</th>
                        <th>{t('final_step.capacity_including_dod')}</th>
                        <th>{t('final_step.estimated_autonomy_days')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{configuration?.projectBattery?.batteryName || 'N/A'}</td>
                        <td>{configuration?.projectBattery?.type || 'N/A'}</td>
                        <td>{configuration?.projectBattery?.voltage || 'N/A'} V</td>
                        <td>{configuration?.projectBattery?.capacity || 'N/A'} Ah</td>
                        <td>{configuration?.projectBattery?.dod || 'N/A'}</td>
                        <td>{configuration?.projectBattery?.capacityWithDod || 'N/A'} Ah</td>
                        <td>{configuration?.projectBattery?.estimatedDaysOfAutonomy || 'N/A'} {t('final_step.days')}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {/* Solar Panel Configuration */}
            <div className="final-step-section solar-panel-info">
                <h3>{t('final_step.solar_panel_configuration')}</h3>
                <ul>
                    <li><strong>{t('final_step.solar_panel_id')}:</strong> {configuration?.projectSolarPanel?.solarPanelId || 'N/A'}</li>
                    <li><strong>{t('final_step.number_of_panels')}:</strong> {configuration?.projectSolarPanel?.numberOfPanels || 'N/A'}</li>
                    <li><strong>{t('final_step.total_power_generated')}:</strong> {configuration?.projectSolarPanel?.totalPowerGenerated || 'N/A'} W</li>
                    <li><strong>{t('final_step.efficiency_loss')}:</strong> {configuration?.projectSolarPanel?.efficiencyLoss || 'N/A'}</li>
                    <li><strong>{t('final_step.estimated_daily_energy_production')}:</strong> {configuration?.projectSolarPanel?.estimatedDailyEnergyProduction || 'N/A'} Wh</li>
                    <li><strong>{t('final_step.installation_type')}:</strong> {configuration?.projectSolarPanel?.installationType || 'N/A'}</li>
                </ul>
                <table className="final-step-table">
                    <thead>
                    <tr>
                        <th>{t('final_step.panel_name')}</th>
                        <th>{t('final_step.nominal_power')}</th>
                        <th>{t('final_step.voc')}</th>
                        <th>{t('final_step.isc')}</th>
                        <th>{t('final_step.vmp')}</th>
                        <th>{t('final_step.imp')}</th>
                        <th>{t('final_step.temp_coefficient_power')}</th>
                        <th>{t('final_step.tolerance')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{configuration?.projectSolarPanel?.panelName || 'N/A'}</td>
                        <td>{configuration?.projectSolarPanel?.nominalPower || 'N/A'} W</td>
                        <td>{configuration?.projectSolarPanel?.voc || 'N/A'} V</td>
                        <td>{configuration?.projectSolarPanel?.isc || 'N/A'} A</td>
                        <td>{configuration?.projectSolarPanel?.vmp || 'N/A'} V</td>
                        <td>{configuration?.projectSolarPanel?.imp || 'N/A'} A</td>
                        <td>{configuration?.projectSolarPanel?.tempCoefficientPower || 'N/A'} %/°C</td>
                        <td>{configuration?.projectSolarPanel?.tolerance || 'N/A'} %</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {/* Solar Panel Configuration Section */}
            <div className="final-step-section final-step-solar-panel-info">
                <h3>{t('final_step.solar_panel_configuration')}</h3>
                <ul className="final-step-list">
                    <li><strong>{t('final_step.solar_panel_id')}:</strong> {configuration?.projectSolarPanel?.solarPanelId || 'N/A'}</li>
                    <li><strong>{t('final_step.number_of_panels')}:</strong> {configuration?.projectSolarPanel?.numberOfPanels || 'N/A'}</li>
                    <li><strong>{t('final_step.total_power_generated')}:</strong> {configuration?.projectSolarPanel?.totalPowerGenerated || 'N/A'} W</li>
                    <li><strong>{t('final_step.efficiency_loss')}:</strong> {configuration?.projectSolarPanel?.efficiencyLoss || 'N/A'}</li>
                    <li><strong>{t('final_step.estimated_daily_energy_production')}:</strong> {configuration?.projectSolarPanel?.estimatedDailyEnergyProduction || 'N/A'} Wh</li>
                    <li><strong>{t('final_step.installation_type')}:</strong> {configuration?.projectSolarPanel?.installationType || 'N/A'}</li>
                </ul>

                {/* Solar Panel Parameters Table */}
                <table className="final-step-table final-step-solar-panel-table">
                    <thead>
                    <tr>
                        <th>{t('final_step.panel_name')}</th>
                        <th>{t('final_step.nominal_power')}</th>
                        <th>{t('final_step.voc')}</th>
                        <th>{t('final_step.isc')}</th>
                        <th>{t('final_step.vmp')}</th>
                        <th>{t('final_step.imp')}</th>
                        <th>{t('final_step.temp_coefficient_power')}</th>
                        <th>{t('final_step.temp_coefficient_voltage')}</th>
                        <th>{t('final_step.tolerance')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{configuration?.projectSolarPanel?.panelName || 'N/A'}</td>
                        <td>{configuration?.projectSolarPanel?.nominalPower || 'N/A'} W</td>
                        <td>{configuration?.projectSolarPanel?.voc || 'N/A'} V</td>
                        <td>{configuration?.projectSolarPanel?.isc || 'N/A'} A</td>
                        <td>{configuration?.projectSolarPanel?.vmp || 'N/A'} V</td>
                        <td>{configuration?.projectSolarPanel?.imp || 'N/A'} A</td>
                        <td>{configuration?.projectSolarPanel?.tempCoefficientPower || 'N/A'} %/°C</td>
                        <td>{configuration?.projectSolarPanel?.tempCoefficientVoltage || 'N/A'} %/°C</td>
                        <td>{configuration?.projectSolarPanel?.tolerance || 'N/A'} %</td>
                    </tr>
                    </tbody>
                </table>

                {/* Constants for Calculation Section */}
                <div className="final-step-constants-section">
                    <h4>{t('final_step.calculation_constants')}</h4>
                    <ul className="final-step-list">
                        <li><strong>{t('final_step.oversizing_factor')}:</strong> 1.2</li>
                        <li><strong>{t('final_step.battery_efficiency')}:</strong> 0.95</li>
                        <li><strong>{t('final_step.cable_tolerance')}:</strong> 0.98</li>
                        <li><strong>{t('final_step.loss_due_to_shading')}:</strong> 0.95</li>
                        <li><strong>{t('final_step.pollution_loss')}:</strong> 0.98</li>
                    </ul>
                </div>

                {/* Monthly Charts Section */}
                <div className="final-step-section final-step-chart-container">
                    <div className="final-step-chart-row">
                        <div className="final-step-chart-item">
                            <h3>{t('final_step.psh_graph')}</h3>
                            <BarChart data={chartData} width={600} height={300}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="psh" fill="#82ca9d" />
                            </BarChart>
                        </div>
                        <div className="final-step-chart-item">
                            <h3>{t('final_step.estimatedEnergyProduction_solar_graph')}</h3>
                            <LineChart data={chartData} width={600} height={300}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="estimatedEnergyProduction" stroke="#ff7300" dot={{ r: 4 }} />
                            </LineChart>
                        </div>
                    </div>
                </div>

                {/* Calculated Values Table */}
                <table className="final-step-table final-step-monthly-values-table">
                    <thead>
                    <tr>
                        <th>{t('final_step.month')}</th>
                        <th>{t('final_step.psh')}</th>
                        <th>{t('final_step.ambient_temperature')}</th>
                        <th>{t('final_step.required_energy')}</th>
                        <th>{t('final_step.power_required')}</th>
                        <th>{t('final_step.efficiency')}</th>
                        <th>{t('final_step.reduced_power')}</th>
                        <th>{t('final_step.panel_count')}</th>
                        <th>{t('final_step.estimated_energy_production')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {chartData.map((data, index) => (
                        <tr key={index}>
                            <td>{data.month}</td>
                            <td>{data.psh || 'N/A'}</td>
                            <td>{data.ambientTemperature || 'N/A'} °C</td>
                            <td>{data.requiredEnergy || 'N/A'} Wh</td>
                            <td>{data.powerRequired || 'N/A'} W</td>
                            <td>{data.efficiency || 'N/A'}</td>
                            <td>{data.reducedPower || 'N/A'} W</td>
                            <td>{data.panelCount || 'N/A'}</td>
                            <td>{data.estimatedEnergyProduction || 'N/A'} Wh</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FinalStep;
