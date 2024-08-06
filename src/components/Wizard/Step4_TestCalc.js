import React, { useState } from 'react';
import CalculationForm from '../../components/Calculation/CalculationForm';
import { calculateLoad } from '../../services/CalculationService';
import './Step4_TestCalc.css'; // Correctly referencing the updated CSS file

const Step4TestCalc = () => {
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = async (data) => {
        setLoading(true);
        setError(null);

        try {
            console.log('Sending data to API:', data); // Debug log
            const result = await calculateLoad(data);
            console.log('API response:', result); // Debug log
            setResults(result);
        } catch (error) {
            console.error('Error calculating load:', error);
            setError('There was an error processing your request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="step4-calc-container">
            <CalculationForm onSubmit={handleFormSubmit} />
            {loading && <p className="step4-calc-loading-message">Loading...</p>}
            {error && <p className="step4-calc-error-message">{error}</p>}
            {results && (
                <div className="step4-calc-results-container">
                    <h2 className="step4-calc-results-title">Výsledky</h2>
                    <div className="step4-calc-result-item">
                        <span className="step4-calc-result-label">Denní energie:</span>
                        <span className="step4-calc-result-value">{results.dailyEnergy} Wh</span>
                    </div>
                    <div className="step4-calc-result-item">
                        <span className="step4-calc-result-label">Týdenní energie:</span>
                        <span className="step4-calc-result-value">{results.weeklyEnergy} Wh</span>
                    </div>
                    <div className="step4-calc-result-item">
                        <span className="step4-calc-result-label">Doporučený výkon panelu:</span>
                        <span className="step4-calc-result-value">{results.recommendedPanelPower} W</span>
                    </div>
                    <div className="step4-calc-result-item">
                        <span className="step4-calc-result-label">Počet baterií:</span>
                        <span className="step4-calc-result-value">{results.numberOfBatteries}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Step4TestCalc;
