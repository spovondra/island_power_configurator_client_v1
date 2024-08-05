import React, { useState } from 'react';
import CalculationForm from '../../components/Calculation/CalculationForm';
import { calculateLoad } from '../../services/CalculationService';

const Calculation = () => {
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
        <div>
            <h1>Výpočet fotovoltaického systému</h1>
            <CalculationForm onSubmit={handleFormSubmit} />
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {results && (
                <div>
                    <h2>Výsledky</h2>
                    <p>Denní energie: {results.dailyEnergy} Wh</p>
                    <p>Týdenní energie: {results.weeklyEnergy} Wh</p>
                    <p>Doporučený výkon panelu: {results.recommendedPanelPower} W</p>
                    <p>Počet baterií: {results.numberOfBatteries}</p>
                </div>
            )}
        </div>
    );
};

export default Calculation;
