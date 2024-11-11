import React, { useContext, useState, useEffect } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { getProjectSummary } from '../../services/ProjectService';
import { getUserById } from '../../services/authService';
import LocationComponent from '../Location/LocationComponent';
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
    Legend
} from 'recharts';
import { useTranslation } from 'react-i18next';
import './FinalStep.css';

const FinalStep = () => {
    const { t } = useTranslation('wizard');
    const { selectedProject } = useContext(ProjectContext);
    const [summaryData, setSummaryData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSummaryData = async () => {
            if (selectedProject) {
                try {
                    const data = await getProjectSummary(selectedProject);
                    setSummaryData(data);

                    if (data?.project?.userId) {
                        const user = await getUserById(data.project.userId);
                        setUserData(user);
                    }
                } catch (err) {
                    setError(t('final_step.fetch_error'));
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchSummaryData();
    }, [selectedProject, t]);

    if (loading) return <p>{t('final_step.loading')}</p>;
    if (error) return <p>{error}</p>;

    const project = summaryData?.project || {};
    const site = project?.site || {};
    const appliances = project?.appliances || [];
    const configuration = project?.configurationModel || {};

    const inverter = summaryData?.inverter || {};
    const projectInverter= configuration?.projectInverter || [];
    const battery = summaryData?.battery || {};
    const projectBattery = configuration?.projectBattery || [];
    const solarPanel = summaryData?.solarPanel || {};
    const projectSolarPanel = configuration?.projectSolarPanel || [];
    const controller = summaryData?.controller || {};
    const projectController = configuration?.projectController || {};

    // Data for new pie charts
    const powerChartData = [
        { name: t('final_step.total_ac_power'), value: configuration?.projectAppliance?.totalAcPower || 0 },
        { name: t('final_step.total_dc_power'), value: configuration?.projectAppliance?.totalDcPower || 0 },
    ];

    const peakPowerChartData = [
        { name: t('final_step.total_ac_peak_power'), value: configuration?.projectAppliance?.totalAcPeakPower || 0 },
        { name: t('final_step.total_dc_peak_power'), value: configuration?.projectAppliance?.totalDcPeakPower || 0 },
    ];

    const energyChartData = [
        { name: t('final_step.total_ac_energy'), value: configuration?.projectAppliance?.totalAcEnergy || 0 },
        { name: t('final_step.total_dc_energy'), value: configuration?.projectAppliance?.totalDcEnergy || 0 },
    ];

    // Colors for pie charts
    const powerChartColors = ['#005B96', '#33A1FD'];
    const peakPowerChartColors = ['#228B22', '#32CD32'];
    const energyChartColors = ['#B22222', '#FF4500'];
    
    const chartData = projectSolarPanel?.monthlyData.map(item => ({
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
                <ul className="final-step-list">
                    <li><strong>{t('final_step.project_name')}:</strong> {project?.name || 'N/A'}</li>
                    <li><strong>{t('final_step.project_id')}:</strong> {project?.id || 'N/A'}</li>
                    <li><strong>{t('final_step.user_name')}:</strong> {userData?.username || 'N/A'}</li>
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
                                    <td>{appliance.energy} Wh</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <ul className="final-step-list">
                            <li>
                                <strong>{t('final_step.total_ac_energy')}:</strong> {configuration?.projectAppliance?.totalAcEnergy || 'N/A'} Wh
                            </li>
                            <li>
                                <strong>{t('final_step.total_dc_energy')}:</strong> {configuration?.projectAppliance?.totalDcEnergy || 'N/A'} Wh
                            </li>
                            <li>
                                <strong>{t('final_step.total_ac_peak_power')}:</strong> {configuration?.projectAppliance?.totalAcPeakPower || 'N/A'} W
                            </li>
                            <li>
                                <strong>{t('final_step.total_dc_peak_power')}:</strong> {configuration?.projectAppliance?.totalDcPeakPower || 'N/A'} W
                            </li>
                        </ul>
                    </div>

                    {/* Pie Charts */}
                    <div>
                        <div className="final-step-chart-row ">
                            <div className="chart-item">
                                <h3>{t('step2.power_chart_title')}</h3>
                                <PieChart width={250} height={250}>
                                    <Pie data={powerChartData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                                         outerRadius={80} label>
                                        {powerChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`}
                                                  fill={powerChartColors[index % powerChartColors.length]}/>
                                        ))}
                                    </Pie>
                                    <Tooltip/>
                                    <Legend/>
                                </PieChart>
                            </div>
                            <div className="chart-item">
                                <h3>{t('step2.peak_power_chart_title')}</h3>
                                <PieChart width={250} height={250}>
                                    <Pie data={peakPowerChartData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                                         outerRadius={80} label>
                                        {peakPowerChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`}
                                                  fill={peakPowerChartColors[index % peakPowerChartColors.length]}/>
                                        ))}
                                    </Pie>
                                    <Tooltip/>
                                    <Legend/>
                                </PieChart>
                            </div>
                            <div className="chart-item">
                                <h3>{t('step2.energy_chart_title')}</h3>
                                <PieChart width={250} height={250}>
                                    <Pie data={energyChartData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                                         outerRadius={80} label>
                                        {energyChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`}
                                                  fill={energyChartColors[index % energyChartColors.length]}/>
                                        ))}
                                    </Pie>
                                    <Tooltip/>
                                    <Legend/>
                                </PieChart>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Site Information Section */}
            <div className="final-step-section site-details-section">
                <h3>{t('final_step.site_details')}</h3>
                <div className="final-step-site-flex-container">
                    {/* Site Information List */}
                    <div className="final-step-site-details">
                        <ul className="final-step-list">
                            <li><strong>{t('final_step.latitude')}:</strong> {site.latitude || 'N/A'}</li>
                            <li><strong>{t('final_step.longitude')}:</strong> {site.longitude || 'N/A'}</li>
                            <li><strong>{t('final_step.min_temperature')}:</strong> {site.minTemperature || 'N/A'} °C
                            </li>
                            <li><strong>{t('final_step.max_temperature')}:</strong> {site.maxTemperature || 'N/A'} °C
                            </li>
                            <li><strong>{t('final_step.panel_angle')}:</strong> {site.panelAngle || '0'}°</li>
                            <li><strong>{t('final_step.panel_aspect')}:</strong> {site.panelAspect || '0'}°</li>
                            <li>
                                <strong>{t('final_step.used_optimal_values')}:</strong> {site.usedOptimalValues ? t('final_step.yes') : t('final_step.no')}
                            </li>
                        </ul>
                    </div>

                    {/* Static Map Container */}
                    <div className="final-step-map-container">
                        <LocationComponent
                            latitude={site.latitude || 0}
                            longitude={site.longitude || 0}
                            setLatitude={() => {
                            }} // Disable interactivity by passing empty functions
                            setLongitude={() => {
                            }}
                            setUseOptimal={() => {
                            }}
                        />
                    </div>
                </div>
                <div className="final-step-chart-row ">
                    <div className="chart-item">
                        <h3>{t('final_step.monthly_psh')}</h3>
                        <BarChart width={500} height={300} data={chartData}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="month"
                                   label={{value: t('final_step.month'), position: 'insideBottom', offset: -5}}/>
                            <YAxis
                                label={{value: t('final_step.irradiance_kwh_m2'), angle: -90, position: 'insideLeft'}}/>
                            <Tooltip/>
                            <Bar dataKey="psh" fill="#8884d8">
                                <LabelList dataKey="psh" position="top"/>
                            </Bar>
                        </BarChart>
                    </div>
                    <div className="chart-item">
                        <h3>{t('final_step.monthly_avg_temperature')}</h3>
                        <BarChart width={500} height={300} data={chartData}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="month"
                                   label={{value: t('final_step.month'), position: 'insideBottom', offset: -5}}/>
                            <YAxis label={{value: t('final_step.temperature_c'), angle: -90, position: 'insideLeft'}}/>
                            <Tooltip/>
                            <Bar dataKey="ambientTemperature" fill="#82ca9d">
                                <LabelList dataKey="ambientTemperature" position="top"/>
                            </Bar>
                        </BarChart>
                    </div>
                </div>
            </div>

            {/* System Voltage Configuration */}
            <div className="final-step-section">
                <h3>{t('final_step.system_voltage_configuration')}</h3>
                <ul className="final-step-list">
                    <li><strong>{t('final_step.system_voltage')}:</strong> {configuration.systemVoltage || 'N/A'} V</li>
                    <li>
                        <strong>{t('final_step.recommended_system_voltage')}:</strong> {configuration.recommendedSystemVoltage || 'N/A'} V
                    </li>
                </ul>
            </div>

            {/* Inverter Configuration */}
            <div className="final-step-section inverter-info">
                <h3>{t('final_step.inverter_configuration')}</h3>
                <ul className="final-step-list">
                    <li>
                        <strong>{t('final_step.inverter_id')}:</strong> {projectInverter?.inverterId || 'N/A'}
                    </li>
                    <li>
                        <strong>{t('final_step.inverter_temperature')}:</strong> {projectInverter?.inverterTemperature || 'N/A'} °C
                    </li>
                    <li>
                        <strong>{t('final_step.total_adjusted_ac_energy')}:</strong> {projectInverter?.totalAdjustedAcEnergy.toFixed(2) || 'N/A'} Wh
                    </li>
                    <li>
                        <strong>{t('final_step.total_daily_energy')}:</strong> {projectInverter?.totalDailyEnergy.toFixed(2) || 'N/A'} Wh
                    </li>
                </ul>
                <table className="final-step-table">
                    <thead>
                    <tr>
                        <th>{t('final_step.inverter_name')}</th>
                        <th>{t('final_step.voltage')}</th>
                        <th>{t('final_step.continuous_power_25C')}</th>
                        <th>{t('final_step.continuous_power_40C')}</th>
                        <th>{t('final_step.continuous_power_65C')}</th>
                        <th>{t('final_step.max_power')}</th>
                        <th>{t('final_step.efficiency')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{inverter?.name || 'N/A'}</td>
                        <td>{inverter?.voltage || 'N/A'} V</td>
                        <td>{inverter?.continuousPower25C || 'N/A'} W</td>
                        <td>{inverter?.continuousPower40C || 'N/A'} W</td>
                        <td>{inverter?.continuousPower65C || 'N/A'} W</td>
                        <td>{inverter?.maxPower || 'N/A'} W</td>
                        <td>{inverter?.efficiency || 'N/A'} %</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {/* Battery Configuration Section */}
            <div className="final-step-section final-step-battery-info">
                <h3>{t('final_step.battery_configuration')}</h3>
                <ul className="final-step-list">
                    <li>
                        <strong>{t('final_step.battery_id')}:</strong> {projectBattery?.batteryId || 'N/A'}
                    </li>
                    <li>
                        <strong>{t('final_step.temperature')}:</strong> {projectBattery?.temperature || 'N/A'} °C
                    </li>
                    <li>
                        <strong>{t('final_step.parallel_batteries')}:</strong> {projectBattery?.parallelBatteries || 'N/A'}
                    </li>
                    <li>
                        <strong>{t('final_step.series_batteries')}:</strong> {projectBattery?.seriesBatteries || 'N/A'}
                    </li>
                    <li>
                        <strong>{t('final_step.total_available_capacity')}:</strong> {projectBattery?.totalAvailableCapacity || 'N/A'} Wh
                    </li>
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
                        <th>{t('final_step.operationalDays')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{battery?.name || 'N/A'}</td>
                        <td>{battery?.type || 'N/A'}</td>
                        <td>{battery?.voltage || 'N/A'} V</td>
                        <td>{battery?.capacity || 'N/A'} Ah</td>
                        <td>{battery?.dod || 'N/A'}</td>
                        <td>{projectBattery?.batteryCapacityDod || 'N/A'} Ah</td>
                        <td>{projectBattery?.operationalDays.toFixed(2) || 'N/A'} {t('final_step.days')}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {/* Solar Panel Configuration Section */}
            <div className="final-step-section final-step-solar-panel-info">
                <h3>{t('final_step.solar_panel_configuration')}</h3>
                <ul className="final-step-list">
                    <li>
                        <strong>{t('final_step.solar_panel_id')}:</strong> {projectSolarPanel?.solarPanelId || 'N/A'}
                    </li>
                    <li>
                        <strong>{t('final_step.number_of_panels')}:</strong> {projectSolarPanel?.numberOfPanels || 'N/A'}
                    </li>
                    <li>
                        <strong>{t('final_step.total_power_generated')}:</strong> {projectSolarPanel?.totalPowerGenerated || 'N/A'} W
                    </li>
                    <li>
                        <strong>{t('final_step.efficiency_loss')}:</strong> {projectSolarPanel?.efficiencyLoss.toFixed(2) || 'N/A'}
                    </li>
                    <li>
                        <strong>{t('final_step.estimated_daily_energy_production')}:</strong> {projectSolarPanel?.estimatedDailyEnergyProduction.toFixed(2) || 'N/A'} Wh
                    </li>
                    <li>
                        <strong>{t('final_step.installation_type')}:</strong> {projectSolarPanel?.installationType || 'N/A'}
                    </li>
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
                        <td>{solarPanel?.name || 'N/A'}</td>
                        <td>{solarPanel?.pRated || 'N/A'} W</td>
                        <td>{solarPanel?.voc || 'N/A'} V</td>
                        <td>{solarPanel?.isc || 'N/A'} A</td>
                        <td>{solarPanel?.vmp || 'N/A'} V</td>
                        <td>{solarPanel?.imp || 'N/A'} A</td>
                        <td>{solarPanel?.tempCoefficientPMax || 'N/A'} %/°C</td>
                        <td>{solarPanel?.tempCoefficientVoc || 'N/A'} %/°C</td>
                        <td>{solarPanel?.tolerance || 'N/A'} %</td>
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
                <div>
                    <div className="final-step-chart-row ">
                        <div className="chart-item">
                            <h3>{t('final_step.psh_graph')}</h3>
                            <BarChart data={chartData} width={500} height={300}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="month"/>
                                <YAxis/>
                                <Tooltip/>
                                <Bar dataKey="psh" fill="#82ca9d"/>
                            </BarChart>
                        </div>
                        <div className="chart-item">
                            <h3>{t('final_step.estimatedEnergyProduction_solar_graph')}</h3>
                            <LineChart data={chartData} width={500} height={300}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="month"/>
                                <YAxis/>
                                <Tooltip/>
                                <Line type="monotone" dataKey="estimatedEnergyProduction" stroke="#ff7300"
                                      dot={{r: 4}}/>
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
                            <td>{data.psh.toFixed(2) || 'N/A'}</td>
                            <td>{data.ambientTemperature.toFixed(1) || 'N/A'} °C</td>
                            <td>{data.requiredEnergy.toFixed(2) || 'N/A'} Wh</td>
                            <td>{data.powerRequired.toFixed(2) || 'N/A'} W</td>
                            <td>{data.efficiency.toFixed(2) || 'N/A'}</td>
                            <td>{data.reducedPower.toFixed(2) || 'N/A'} W</td>
                            <td>{data.panelCount || 'N/A'}</td>
                            <td>{data.estimatedEnergyProduction.toFixed(2) || 'N/A'} Wh</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="final-step-section final-step-controller-info">
                <h3>{t('final_step.controller_configuration')}</h3>
                <ul className="final-step-list">
                    <li><strong>{t('final_step.controller_id')}:</strong> {projectController.controllerId || 'N/A'}</li>
                    <li><strong>{t('final_step.type')}:</strong> {projectController.type || 'N/A'}</li>
                    <li>
                        <strong>{t('final_step.required_current')}:</strong> {projectController.requiredCurrent?.toFixed(2) || 'N/A'} A
                    </li>
                    <li>
                        <strong>{t('final_step.required_power')}:</strong> {projectController.requiredPower?.toFixed(2) || 'N/A'} W
                    </li>
                    <li>
                        <strong>{t('final_step.max_modules_in_series')}:</strong> {projectController.maxModulesInSerial || 'N/A'}
                    </li>
                    <li>
                        <strong>{t('final_step.min_modules_in_series')}:</strong> {projectController.minModulesInSerial || 'N/A'}
                    </li>
                    <li>
                        <strong>{t('final_step.series_modules')}:</strong> {projectController.seriesModules || 'N/A'}
                    </li>
                    <li>
                        <strong>{t('final_step.parallel_modules')}:</strong> {projectController.parallelModules || 'N/A'}
                    </li>
                    <li>
                        <strong>{t('final_step.adjusted_voc')}:</strong> {projectController.adjustedOpenCircuitVoltage?.toFixed(2) || 'N/A'} V
                    </li>
                    <li>
                        <strong>{t('final_step.adjusted_vmp')}:</strong> {projectController.adjustedVoltageAtMaxPower?.toFixed(2) || 'N/A'} V
                    </li>
                    <li>
                        <strong>{t('final_step.total_efficiency')}:</strong> {projectController.totalControllerEfficiency?.toFixed(2) || 'N/A'} %
                    </li>
                    <li>
                        <strong>{t('final_step.valid_configuration')}:</strong> {projectController.valid ? t('final_step.yes') : t('final_step.no')}
                    </li>
                </ul>

                <table className="final-step-table final-step-controller-table">
                    <thead>
                    <tr>
                        <th>{t('final_step.name')}</th>
                        <th>{t('final_step.rated_power')}</th>
                        <th>{t('final_step.current_rating')}</th>
                        <th>{t('final_step.max_voltage')}</th>
                        <th>{t('final_step.min_voltage')}</th>
                        <th>{t('final_step.type')}</th>
                        <th>{t('final_step.efficiency')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{controller.name || 'N/A'}</td>
                        <td>{controller.ratedPower ? `${controller.ratedPower} W` : 'N/A'}</td>
                        <td>{controller.currentRating ? `${controller.currentRating} A` : 'N/A'}</td>
                        <td>{controller.maxVoltage ? `${controller.maxVoltage} V` : 'N/A'}</td>
                        <td>{controller.minVoltage ? `${controller.minVoltage} V` : 'N/A'}</td>
                        <td>{controller.type || 'N/A'}</td>
                        <td>{controller.efficiency ? `${(controller.efficiency * 100).toFixed(2)} %` : 'N/A'}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FinalStep;
