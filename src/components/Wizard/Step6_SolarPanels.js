import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import './Step6_SolarPanels.css'; // Import the CSS file for styling

const DEFAULT_PANEL_OVERSIZE_COEFFICIENT = 1.2;
const DEFAULT_BATTERY_EFFICIENCY = 0.95;
const DEFAULT_CABLE_EFFICIENCY = 0.98;
const DEFAULT_PANEL_TEMP = 25; // Standard Test Condition

function Step6SolarPanels({ energyData, systemVoltage, onSelect, onNext }) {
    const [selectedPanel, setSelectedPanel] = useState('panel1');
    const [panelData, setPanelData] = useState(null);
    const [calculations, setCalculations] = useState([]);
    const [numPanelsData, setNumPanelsData] = useState([]);
    const [selectedMonths, setSelectedMonths] = useState([]);
    const [installationType, setInstallationType] = useState('ground');

    // User-defined constants
    const [panelOversizeCoefficient, setPanelOversizeCoefficient] = useState(DEFAULT_PANEL_OVERSIZE_COEFFICIENT);
    const [batteryEfficiency, setBatteryEfficiency] = useState(DEFAULT_BATTERY_EFFICIENCY);
    const [cableEfficiency, setCableEfficiency] = useState(DEFAULT_CABLE_EFFICIENCY);
    const [panelTemp, setPanelTemp] = useState(DEFAULT_PANEL_TEMP);

    useEffect(() => {
        // Fetch panels data (assumed to be coming from an API or local JSON)
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/panels'); // Update with your actual API endpoint
                setPanelData(response.data);
            } catch (error) {
                console.error('Error fetching panel data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (energyData && systemVoltage && panelData) {
            calculatePanelRequirements();
        } else {
            console.error('Missing energy data or system voltage');
        }
    }, [energyData, systemVoltage, panelData, selectedMonths, installationType, panelOversizeCoefficient, batteryEfficiency, cableEfficiency]);

    const calculatePanelRequirements = () => {
        // Ensure energy data and system voltage are correctly available
        const totalDailyEnergy = (energyData?.totalDailyEnergyAC || 0) + (energyData?.totalDailyEnergyDC || 0);
        const systemVoltageNum = parseFloat(systemVoltage);

        if (isNaN(systemVoltageNum)) {
            console.error('Invalid system voltage:', systemVoltage);
            return;
        }

        // Example logic to calculate panel requirements
        const calculationsArray = selectedMonths.map(month => {
            const psh = panelData.peakSunHours[month];
            const E_required = totalDailyEnergy / (batteryEfficiency * cableEfficiency);
            const P_required = (E_required / psh) * panelOversizeCoefficient;

            const η_efficiency = calculateEfficiency(panelData, installationType, month);
            const P_derated = panelData.pRated * η_efficiency;
            const numPanels = Math.ceil(P_required / P_derated);

            return {
                month,
                psh,
                E_required,
                P_required,
                η_efficiency,
                P_derated,
                numPanels
            };
        });

        setCalculations(calculationsArray);
        setNumPanelsData(calculationsArray.map(calc => calc.numPanels));
    };

    const calculateEfficiency = (panelData, installationType, month) => {
        const tempCoefficient = panelData.tempCoefficientPMax;
        const ambientTemp = panelData.ambientTemperatures[month] || 25; // Default to 25°C
        const installTempOffset = installationType === 'ground' ? 0 : 5; // Example logic

        return (100 + (ambientTemp + installTempOffset - panelTemp) * tempCoefficient) / 100;
    };

    const handleConfirm = () => {
        onSelect('panelData', panelData);
        onSelect('numPanels', Math.max(...numPanelsData));
        onNext();
    };

    return (
        <div className="step6-solar-panels">
            <h2>Step 6: Solar Panels Selection</h2>

            {/* Panel Selection */}
            <div>
                <h3>Select Panel</h3>
                {panelData && Object.keys(panelData.panels).map((panelKey) => (
                    <label key={panelKey}>
                        <input
                            type="radio"
                            name="panel"
                            value={panelKey}
                            checked={selectedPanel === panelKey}
                            onChange={() => setSelectedPanel(panelKey)}
                        />
                        {` ${panelKey.charAt(0).toUpperCase() + panelKey.slice(1)} - Pmax: ${panelData.panels[panelKey].pRated}W`}
                    </label>
                ))}
            </div>

            {/* Month Selection */}
            <div>
                <h3>Select Months</h3>
                {panelData && Object.keys(panelData.peakSunHours).map(month => (
                    <label key={month}>
                        <input
                            type="checkbox"
                            checked={selectedMonths.includes(month)}
                            onChange={() => setSelectedMonths(
                                prev => prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month]
                            )}
                        />
                        {` ${month.charAt(0).toUpperCase() + month.slice(1)}`}
                    </label>
                ))}
            </div>

            {/* Installation Type Selection */}
            <div>
                <h3>Installation Type</h3>
                <select value={installationType} onChange={e => setInstallationType(e.target.value)}>
                    <option value="ground">Ground Installation</option>
                    <option value="roof">Roof Installation</option>
                    <option value="angle">Angle Installation</option>
                </select>
            </div>

            {/* Constants Setup */}
            <div className="constants-setup">
                <h3>Set Constants</h3>
                <div>
                    <label>Panel Oversize Coefficient:
                        <input type="number" value={panelOversizeCoefficient} onChange={e => setPanelOversizeCoefficient(parseFloat(e.target.value))} />
                    </label>
                </div>
                <div>
                    <label>Battery Efficiency:
                        <input type="number" value={batteryEfficiency} onChange={e => setBatteryEfficiency(parseFloat(e.target.value))} />
                    </label>
                </div>
                <div>
                    <label>Cable Efficiency:
                        <input type="number" value={cableEfficiency} onChange={e => setCableEfficiency(parseFloat(e.target.value))} />
                    </label>
                </div>
                <div>
                    <label>Panel Temperature (°C):
                        <input type="number" value={panelTemp} onChange={e => setPanelTemp(parseFloat(e.target.value))} />
                    </label>
                </div>
            </div>

            {/* Display calculations */}
            <h3>Calculations</h3>
            <table>
                <thead>
                <tr>
                    <th>Month</th>
                    <th>PSH</th>
                    <th>Energy Required</th>
                    <th>Power Required</th>
                    <th>Efficiency</th>
                    <th>Derated Power</th>
                    <th>Num Panels</th>
                </tr>
                </thead>
                <tbody>
                {calculations.map((calc, index) => (
                    <tr key={index}>
                        <td>{calc.month}</td>
                        <td>{calc.psh}</td>
                        <td>{calc.E_required}</td>
                        <td>{calc.P_required}</td>
                        <td>{calc.η_efficiency}</td>
                        <td>{calc.P_derated}</td>
                        <td>{calc.numPanels}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Graphs */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, marginRight: '10px' }}>
                    <h3>PSH Graph</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={calculations} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="psh" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ flex: 1, marginLeft: '10px' }}>
                    <h3>Daily Solar Energy Graph</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={calculations} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="P_required" stroke="#ff7300" />
                            <Line type="monotone" dataKey="P_derated" stroke="#387908" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <button onClick={handleConfirm}>Confirm and Continue</button>
        </div>
    );
}

export default Step6SolarPanels;
