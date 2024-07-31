import React, { useState } from "react";

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
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Power (W):</label>
                    <input type="number" name="power" value={formData.power} onChange={handleChange} required />
                </div>
                <div>
                    <label>Hours per day:</label>
                    <input type="number" name="hoursPerDay" value={formData.hoursPerDay} onChange={handleChange} required />
                </div>
                <div>
                    <label>Days per week:</label>
                    <input type="number" name="daysPerWeek" value={formData.daysPerWeek} onChange={handleChange} required />
                </div>
                <div>
                    <label>Panel Efficiency (%):</label>
                    <input type="number" name="panelEfficiency" value={formData.panelEfficiency} onChange={handleChange} required />
                </div>
                <div>
                    <label>Battery Capacity (Wh):</label>
                    <input type="number" name="batteryCapacity" value={formData.batteryCapacity} onChange={handleChange} required />
                </div>
                <div>
                    <label>Autonomy Days:</label>
                    <input type="number" name="autonomyDays" value={formData.autonomyDays} onChange={handleChange} required />
                </div>
                <button type="submit">Vypočítat</button>
            </form>
        </div>
    );
};

export default CalculationForm;
