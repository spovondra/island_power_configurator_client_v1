import React, { useState } from "react";
import './CalculationForm.css'; // Import the CSS

const CalculationForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        power: '',
        hoursPerDay: '',
        daysPerWeek: '',
        panelEfficiency: '',
        batteryCapacity: '',
        autonomyDays: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validatedData = {
            power: parseFloat(formData.power),
            hoursPerDay: parseFloat(formData.hoursPerDay),
            daysPerWeek: parseFloat(formData.daysPerWeek),
            panelEfficiency: parseFloat(formData.panelEfficiency),
            batteryCapacity: parseFloat(formData.batteryCapacity),
            autonomyDays: parseFloat(formData.autonomyDays)
        };

        console.log('Validated data:', validatedData); // Debug log

        try {
            await onSubmit(validatedData);
        } catch (error) {
            console.error('Error calculating load', error);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="power">Power (W):</label>
                    <input
                        id="power"
                        type="number"
                        name="power"
                        value={formData.power}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="hoursPerDay">Hours per day:</label>
                    <input
                        id="hoursPerDay"
                        type="number"
                        name="hoursPerDay"
                        value={formData.hoursPerDay}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="daysPerWeek">Days per week:</label>
                    <input
                        id="daysPerWeek"
                        type="number"
                        name="daysPerWeek"
                        value={formData.daysPerWeek}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="panelEfficiency">Panel Efficiency (%):</label>
                    <input
                        id="panelEfficiency"
                        type="number"
                        name="panelEfficiency"
                        value={formData.panelEfficiency}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="batteryCapacity">Battery Capacity (Wh):</label>
                    <input
                        id="batteryCapacity"
                        type="number"
                        name="batteryCapacity"
                        value={formData.batteryCapacity}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="autonomyDays">Autonomy Days:</label>
                    <input
                        id="autonomyDays"
                        type="number"
                        name="autonomyDays"
                        value={formData.autonomyDays}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="form-submit-button">Vypočítat</button>
            </form>
        </div>
    );
};

export default CalculationForm;
