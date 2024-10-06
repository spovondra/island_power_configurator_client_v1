import React, { useState, useEffect } from 'react';
import './Step4_Inverter.css'; // Import the CSS file

// Updated inverters list
const availableInverters = [
    { id: 1, name: 'Inverter 12/1600', continuousPower25C: 1300, continuousPower40C: 1100, continuousPower65C: 800, maxPower: 2800, efficiency: 93, voltage: 12 },
    { id: 2, name: 'Inverter 24/1600', continuousPower25C: 1300, continuousPower40C: 1100, continuousPower65C: 800, maxPower: 2800, efficiency: 94, voltage: 24 },
    { id: 3, name: 'Inverter 48/1600', continuousPower25C: 1300, continuousPower40C: 1100, continuousPower65C: 800, maxPower: 2800, efficiency: 95, voltage: 48 },
    { id: 4, name: 'Inverter 12/3000', continuousPower25C: 3000, continuousPower40C: 2700, continuousPower65C: 2000, maxPower: 6000, efficiency: 92, voltage: 12 },
    { id: 5, name: 'Inverter 24/3000', continuousPower25C: 3000, continuousPower40C: 2700, continuousPower65C: 2000, maxPower: 6000, efficiency: 94, voltage: 24 },
    { id: 6, name: 'Inverter 48/3000', continuousPower25C: 3000, continuousPower40C: 2700, continuousPower65C: 2000, maxPower: 6000, efficiency: 95, voltage: 48 },
    { id: 7, name: 'Inverter 12/5000', continuousPower25C: 5000, continuousPower40C: 4500, continuousPower65C: 3500, maxPower: 10000, efficiency: 90, voltage: 12 },
    { id: 8, name: 'Inverter 24/5000', continuousPower25C: 5000, continuousPower40C: 4500, continuousPower65C: 3500, maxPower: 10000, efficiency: 92, voltage: 24 },
    { id: 9, name: 'Inverter 48/5000', continuousPower25C: 5000, continuousPower40C: 4500, continuousPower65C: 3500, maxPower: 10000, efficiency: 93, voltage: 48 },
];

function Step4({ energyData, onSelect, onNext }) {
    const [systemVoltage, setSystemVoltage] = useState('');
    const [selectedInverterId, setSelectedInverterId] = useState(null);
    const [validInverters, setValidInverters] = useState([]);
    const [temperature, setTemperature] = useState('25C');

    useEffect(() => {
        if (energyData) calculateRequirements();
    }, [energyData, temperature, systemVoltage]);

    const calculateRequirements = () => {
        const { totalDailyEnergyAC = 0 } = energyData || {};
        const voltageDecision = totalDailyEnergyAC > 3500 ? '48V' : totalDailyEnergyAC > 1000 ? '24V' : '12V';

        if (!systemVoltage) {
            setSystemVoltage(voltageDecision);
        }

        const filteredInverters = availableInverters.filter(inv => inv.voltage === parseInt((systemVoltage || voltageDecision).replace('V', '')));
        setValidInverters(filteredInverters);
    };

    const handleVoltageChange = (voltage) => {
        setSystemVoltage(voltage);
        const filteredInverters = availableInverters.filter(inv => inv.voltage === parseInt(voltage.replace('V', '')));
        setValidInverters(filteredInverters);
        setSelectedInverterId(null);
    };

    const handleConfirm = () => {
        const selected = availableInverters.find(inv => inv.id === selectedInverterId);
        if (!selected) return alert('Please select a valid inverter.');

        const adjustedACLoad = calculateAdjustedACLoad();
        const totalDailyEnergy = calculateTotalDailyEnergy();

        onSelect('systemVoltage', systemVoltage);
        onSelect('inverter', selected);
        onSelect('adjustedACLoad', adjustedACLoad);
        onSelect('totalDailyEnergy', totalDailyEnergy);
        onNext();
    };

    const calculateAdjustedACLoad = () => {
        if (!energyData || !selectedInverterId) return 'N/A';

        const selectedInverter = availableInverters.find(inv => inv.id === selectedInverterId);
        const { totalDailyEnergyAC = 0 } = energyData;
        const efficiency = selectedInverter ? selectedInverter.efficiency / 100 : 0.9;

        if (totalDailyEnergyAC === 0 || isNaN(efficiency)) return 'N/A';

        return (totalDailyEnergyAC / efficiency).toFixed(2);
    };

    const calculateTotalDailyEnergy = () => {
        const adjustedACLoad = parseFloat(calculateAdjustedACLoad());
        if (isNaN(adjustedACLoad)) return 'N/A';

        const { totalDailyEnergyDC = 0 } = energyData;
        return (adjustedACLoad + totalDailyEnergyDC).toFixed(2);
    };

    return (
        <div className="step2-inverter-container">
            <h2>Step 2: Select System Voltage and Inverter</h2>

            <div className="voltage-selection">
                <h3>System Voltage</h3>
                {['12V', '24V', '48V'].map(voltage => (
                    <label key={voltage}>
                        <input
                            type="radio"
                            name="voltage"
                            value={voltage}
                            checked={systemVoltage === voltage}
                            onChange={() => handleVoltageChange(voltage)}
                        />
                        {voltage}
                    </label>
                ))}
            </div>

            <div className="temperature-selection">
                <h3>Select Temperature</h3>
                {['25C', '40C', '65C'].map(temp => (
                    <label key={temp}>
                        <input
                            type="radio"
                            name="temperature"
                            value={temp}
                            checked={temperature === temp}
                            onChange={() => setTemperature(temp)}
                        />
                        {temp}
                    </label>
                ))}
            </div>

            <div className="inverter-selection">
                <h3>Select Inverter</h3>
                {validInverters.length > 0 ? (
                    validInverters.map(inv => (
                        <label key={inv.id}>
                            <input
                                type="radio"
                                name="inverter"
                                value={inv.id}
                                checked={selectedInverterId === inv.id}
                                onChange={() => setSelectedInverterId(inv.id)}
                            />
                            {inv.name} - Continuous Power {temperature}: {inv[`continuousPower${temperature}`]}W, Max Power: {inv.maxPower}W, Efficiency: {inv.efficiency}%, Voltage: {inv.voltage}V
                        </label>
                    ))
                ) : (
                    <p>No valid inverters available for this voltage.</p>
                )}
            </div>

            {selectedInverterId && (
                <div className="inverter-calculations">
                    <h3>Inverter Energy Calculations</h3>
                    <p><strong>Adjusted AC Load:</strong> {calculateAdjustedACLoad()} Wh</p>
                    <p><strong>Total Daily Energy:</strong> {calculateTotalDailyEnergy()} Wh</p>
                </div>
            )}

            <button type="button" className="confirm-button" onClick={handleConfirm}>Confirm Selection</button>
        </div>
    );
}

export default Step4;
