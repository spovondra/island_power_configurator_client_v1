import React, { useEffect, useState, useContext } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { getSolarPanels, selectSolarPanel, getProjectSolarPanel } from '../../services/ProjectService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Legend } from 'recharts';
import './Step6_SolarPanels.css';

const Step6_SolarPanels = () => {
    const { selectedProject } = useContext(ProjectContext);
    const [selectedPanel, setSelectedPanel] = useState(null);
    const [solarPanels, setSolarPanels] = useState([]);
    const [numberOfPanels, setNumberOfPanels] = useState(0);
    const [panelOversizeCoefficient, setPanelOversizeCoefficient] = useState(1.2);
    const [batteryEfficiency, setBatteryEfficiency] = useState(0.95);
    const [cableEfficiency, setCableEfficiency] = useState(0.98);
    const [selectedMonths, setSelectedMonths] = useState([]);
    const [installationType, setInstallationType] = useState('ground');
    const [manufacturerTolerance, setManufacturerTolerance] = useState(0.98);
    const [agingLoss, setAgingLoss] = useState(0.95);
    const [dirtLoss, setDirtLoss] = useState(0.97);
    const [config, setConfig] = useState({
        totalPowerGenerated: 0,
        efficiencyLoss: 0,
        estimatedDailyEnergyProduction: 0,
        monthlyData: []
    });

    const [initialLoad, setInitialLoad] = useState(true); // To track if the component is being loaded initially
    const [hasChanged, setHasChanged] = useState(false); // To track if the user has made changes

    // Fetch solar panels and current configuration when component is mounted
    useEffect(() => {
        if (!selectedProject) return;

        const fetchSolarPanels = async () => {
            try {
                const panelData = await getSolarPanels(selectedProject);
                setSolarPanels(panelData);
            } catch (error) {
                console.error('Error fetching solar panels:', error);
            }
        };

        const fetchPanelConfig = async () => {
            try {
                const projectPanel = await getProjectSolarPanel(selectedProject);
                if (projectPanel) {
                    // Set all fetched configuration values into state
                    setSelectedPanel(projectPanel.solarPanelId);
                    setNumberOfPanels(projectPanel.numberOfPanels);
                    setPanelOversizeCoefficient(projectPanel.panelOversizeCoefficient || 1.2);
                    setBatteryEfficiency(projectPanel.batteryEfficiency || 0.95);
                    setCableEfficiency(projectPanel.cableEfficiency || 0.98);
                    setInstallationType(projectPanel.installationType || 'ground');

                    // Set the selected months from monthlyData
                    const months = projectPanel.monthlyData.map((data) => data.month);
                    setSelectedMonths(months);

                    setManufacturerTolerance(projectPanel.manufacturerTolerance || 0.98);
                    setAgingLoss(projectPanel.agingLoss || 0.95);
                    setDirtLoss(projectPanel.dirtLoss || 0.97);
                    setConfig(projectPanel);
                }
            } catch (error) {
                console.error('Error fetching project solar panel configuration:', error);
            } finally {
                setInitialLoad(false); // Mark the initial load as complete
            }
        };

        fetchSolarPanels();
        fetchPanelConfig();
    }, [selectedProject]);

    // Only trigger POST request after the initial load
    useEffect(() => {
        if (!initialLoad && hasChanged) {
            sendUpdatedConfiguration();
        }
    }, [
        selectedPanel,
        panelOversizeCoefficient,
        batteryEfficiency,
        cableEfficiency,
        selectedMonths,
        installationType,
        manufacturerTolerance,
        agingLoss,
        dirtLoss
    ]);

    // Trigger POST request when user changes the configuration
    const sendUpdatedConfiguration = async () => {
        const postData = {
            solarPanelId: selectedPanel,
            panelOversizeCoefficient,
            batteryEfficiency,
            cableEfficiency,
            selectedMonths,
            installationType,
            manufacturerTolerance,
            agingLoss,
            dirtLoss
        };

        // Log the data that will be sent to the server for debugging
        console.log("Sending POST with data:", postData);

        try {
            const result = await selectSolarPanel(selectedProject, postData);
            setConfig(result); // Immediately set the config to the result from POST
        } catch (error) {
            console.error('Error selecting solar panel:', error);
        }
    };

    // Handle user selecting a panel
    const handlePanelSelect = (panelId) => {
        setHasChanged(true);
        setSelectedPanel(panelId);
    };

    // Handle month selection change
    const handleMonthChange = (month) => {
        setHasChanged(true);
        setSelectedMonths((prev) => prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]);
    };

    // Handle installation type change
    const handleInstallationTypeChange = (e) => {
        setHasChanged(true);
        setInstallationType(e.target.value);
    };

    // Update efficiency settings and prevent negative values, step in increments of 0.1
    const handleEfficiencyChange = (setter, value) => {
        setHasChanged(true);
        const newValue = Math.max(0, parseFloat(value)); // Prevent negative values
        setter(parseFloat(newValue.toFixed(1))); // Ensure value is updated in steps of 0.1
    };

    const formatValue = (value, decimals = 2) => (value !== undefined && value !== null ? value.toFixed(decimals) : 'N/A');

    const chartData = config.monthlyData.map((data) => ({
        month: data.month,
        psh: data.psh,
        E_daily_solar: data.estimatedDailySolarEnergy
    }));

    return (
        <div className="solar-panel-configurator">
            <h2 className="config-title">Solar Panel Configurator</h2>

            <div className="solar-panel-selection">
                <h3>Select Solar Panel</h3>
                <div className="solar-panel-options">
                    {solarPanels.length === 0 ? (
                        <p>No suitable solar panels available</p>
                    ) : (
                        solarPanels.map((panel) => (
                            <label key={panel.id} className="panel-option">
                                <input
                                    type="radio"
                                    name="solarPanel"
                                    checked={selectedPanel === panel.id}
                                    onChange={() => handlePanelSelect(panel.id)}
                                />
                                {`${panel.name} - Pmax: ${panel.pRated}W`}
                            </label>
                        ))
                    )}
                </div>
            </div>

            <div className="month-selection">
                <h3>Select Months</h3>
                <div className="month-checkboxes">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <label key={month} className="month-checkbox">
                            <input
                                type="checkbox"
                                checked={selectedMonths.includes(month)}
                                onChange={() => handleMonthChange(month)}
                            />
                            {month}
                        </label>
                    ))}
                </div>
            </div>

            <div className="installation-type">
                <h3>Installation Type</h3>
                <select value={installationType} onChange={handleInstallationTypeChange}>
                    <option value="ground">Ground Mounted</option>
                    <option value="roof_angle">Roof Mounted (Angle >20°)</option>
                    <option value="parallel_greater_150mm">Parallel Mounted (Gap >150mm)</option>
                    <option value="parallel_less_150mm">Parallel Mounted (Gap 150mm)</option>
                </select>
            </div>

            <div className="constants-input">
                <h3>Set Constants</h3>
                <label>
                    Panel Oversize Coefficient:
                    <input
                        type="number"
                        step="0.1"
                        value={panelOversizeCoefficient}
                        onChange={(e) => handleEfficiencyChange(setPanelOversizeCoefficient, e.target.value)}
                    />
                </label>
                <label>
                    Battery Efficiency:
                    <input
                        type="number"
                        step="0.1"
                        value={batteryEfficiency}
                        onChange={(e) => handleEfficiencyChange(setBatteryEfficiency, e.target.value)}
                    />
                </label>
                <label>
                    Cable Efficiency:
                    <input
                        type="number"
                        step="0.1"
                        value={cableEfficiency}
                        onChange={(e) => handleEfficiencyChange(setCableEfficiency, e.target.value)}
                    />
                </label>
                <label>
                    Manufacturer Tolerance:
                    <input
                        type="number"
                        step="0.1"
                        value={manufacturerTolerance}
                        onChange={(e) => handleEfficiencyChange(setManufacturerTolerance, e.target.value)}
                    />
                </label>
                <label>
                    Aging Loss:
                    <input
                        type="number"
                        step="0.1"
                        value={agingLoss}
                        onChange={(e) => handleEfficiencyChange(setAgingLoss, e.target.value)}
                    />
                </label>
                <label>
                    Dirt Loss:
                    <input
                        type="number"
                        step="0.1"
                        value={dirtLoss}
                        onChange={(e) => handleEfficiencyChange(setDirtLoss, e.target.value)}
                    />
                </label>
            </div>

            <div className="calculated-config">
                <h3>Calculated Configuration</h3>
                <p>Total Power Generated: {formatValue(config.totalPowerGenerated)} W</p>
                <p>Efficiency Loss: {formatValue(config.efficiencyLoss * 100)}%</p>
                <p>Estimated Daily Energy Production: {formatValue(config.estimatedDailyEnergyProduction)} Wh</p>
            </div>

            <div className="charts-container">
                <div>
                    <h3>PSH Graph</h3>
                    <BarChart data={chartData} width={600} height={300}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="psh" fill="#82ca9d" />
                    </BarChart>
                </div>
                <div>
                    <h3>E_daily_solar Graph</h3>
                    <LineChart data={chartData} width={600} height={300}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="E_daily_solar" stroke="#ff7300" dot={{ r: 4 }} />
                    </LineChart>
                </div>
            </div>

            <h3>Monthly Data</h3>
            {config.monthlyData.length > 0 ? (
                <table className="monthly-data-table">
                    <thead>
                    <tr>
                        <th>Month</th>
                        <th>PSH</th>
                        <th>Ambient Temperature (°C)</th>
                        <th>Required Energy (Wh)</th>
                        <th>Required Power (W)</th>
                        <th>Efficiency</th>
                        <th>Derated Power (W)</th>
                        <th>Num Panels</th>
                        <th>Estimated Daily Solar Energy (Wh)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {config.monthlyData.map((data) => (
                        <tr key={data.month}>
                            <td>{data.month}</td>
                            <td>{formatValue(data.psh)}</td>
                            <td>{formatValue(data.ambientTemperature)}</td>
                            <td>{formatValue(data.requiredEnergy)}</td>
                            <td>{formatValue(data.requiredPower)}</td>
                            <td>{formatValue(data.efficiency)}</td>
                            <td>{formatValue(data.deratedPower)}</td>
                            <td>{data.numPanels}</td>
                            <td>{formatValue(data.estimatedDailySolarEnergy)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No monthly data available.</p>
            )}
        </div>
    );
};

export default Step6_SolarPanels;
