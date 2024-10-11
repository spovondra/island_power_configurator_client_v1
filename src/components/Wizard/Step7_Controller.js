import React, { useState, useEffect } from 'react';
import './Step7_Controller.css'; // Import the CSS file

const Step7_Controller = ({ onSelect, onNext }) => {
    const [regulatorType, setRegulatorType] = useState('mppt');
    const [regulators, setRegulators] = useState([]);
    const [selectedRegulator, setSelectedRegulator] = useState(null);
    const [results, setResults] = useState({});

    useEffect(() => {
        fetchRegulators();
    }, [regulatorType]);

    const fetchRegulators = async () => {
        try {
            const response = await fetch(`/api/regulators/${regulatorType}`); // Adjust the endpoint as needed
            const data = await response.json();
            setRegulators(data);
        } catch (error) {
            console.error("Error fetching regulators:", error);
        }
    };

    const handleRegulatorTypeChange = (event) => {
        setRegulatorType(event.target.value);
        setSelectedRegulator(null); // Reset the selected regulator when type changes
    };

    const handleRegulatorChange = (event) => {
        const regulator = regulators.find((reg) => reg.name === event.target.value);
        setSelectedRegulator(regulator);
    };

    const handleConfirm = async () => {
        try {
            const response = await fetch('/api/results', { // Adjust the endpoint as needed
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ regulator: selectedRegulator, results }), // Add any necessary data
            });
            if (response.ok) {
                const data = await response.json();
                onSelect('results', data); // Assuming data includes the results
                onNext();
            } else {
                console.error("Failed to submit results:", response.statusText);
            }
        } catch (error) {
            console.error("Error submitting results:", error);
        }
    };

    return (
        <div className="step7-page-container"> {/* Apply main container class */}
            <h2>Step 7: Select Controller</h2>
            <div className="step7-content"> {/* Apply content class */}
                <div className="step7-left-column"> {/* Left column */}
                    <div className="regulator-type-selection">
                        <label className="regulator-type-radio">
                            <input
                                type="radio"
                                value="mppt"
                                checked={regulatorType === 'mppt'}
                                onChange={handleRegulatorTypeChange}
                            />
                            MPPT
                        </label>
                        <label className="regulator-type-radio">
                            <input
                                type="radio"
                                value="pwm"
                                checked={regulatorType === 'pwm'}
                                onChange={handleRegulatorTypeChange}
                            />
                            PWM
                        </label>
                    </div>

                    <select className="regulator-dropdown" onChange={handleRegulatorChange} value={selectedRegulator?.name || ''}>
                        <option value="" disabled>Select a regulator</option>
                        {regulators.map((regulator) => (
                            <option key={regulator.name} value={regulator.name}>
                                {regulator.name}
                            </option>
                        ))}
                    </select>

                    {selectedRegulator && (
                        <div className="selected-regulator-info">
                            <h3>Selected Regulator: {selectedRegulator.name}</h3>
                            {/* You can add additional information about the selected regulator here */}
                        </div>
                    )}

                    <button className="confirm-button" onClick={handleConfirm} disabled={!selectedRegulator}>
                        Confirm and Next
                    </button>
                </div>

                <div className="step7-right-column"> {/* Right column for additional info if needed */}
                    <div className="additional-info">
                        {/* Add any additional information or graphics here */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step7_Controller;
