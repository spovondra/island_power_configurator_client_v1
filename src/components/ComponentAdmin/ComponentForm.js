import React, { useState, useEffect } from 'react';
import './ComponentForm.css';

const ComponentForm = ({ componentData, handleSubmit, onClose, selectedCategory }) => {
    const [formData, setFormData] = useState({
        name: '',
        manufacturer: '',
        pRated: '',
        voc: '',
        isc: '',
        vmp: '',
        imp: '',
        tempCoefficientPMax: '',
        tolerance: '',
        degradationFirstYear: '',
        degradationYears: '',
        price: '',
        ratedPower: '',
        currentRating: '',
        maxVoltage: '',
        minVoltage: '',
        type: '',
        efficiency: '',
        continuousPower25C: '',
        continuousPower40C: '',
        continuousPower65C: '',
        maxPower: '',
        voltage: '',
        dod: '',
        capacity: '',
    });

    useEffect(() => {
        if (componentData) {
            setFormData({ ...componentData });
        }
    }, [componentData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        handleSubmit(formData);
    };

    const renderFields = () => {
        switch (selectedCategory) {
            case 'solar-panels':
                return (
                    <>
                        <label>
                            Manufacturer:
                            <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleChange} required />
                        </label>
                        <label>
                            Rated Power (W):
                            <input type="number" name="pRated" value={formData.pRated} onChange={handleChange} required />
                        </label>
                        <label>
                            Open-Circuit Voltage (V):
                            <input type="number" name="voc" value={formData.voc} onChange={handleChange} required />
                        </label>
                        <label>
                            Short-Circuit Current (A):
                            <input type="number" name="isc" value={formData.isc} onChange={handleChange} required />
                        </label>
                        <label>
                            Voltage at Maximum Power (V):
                            <input type="number" name="vmp" value={formData.vmp} onChange={handleChange} required />
                        </label>
                        <label>
                            Current at Maximum Power (A):
                            <input type="number" name="imp" value={formData.imp} onChange={handleChange} required />
                        </label>
                        <label>
                            Temperature Coefficient for Maximum Power:
                            <input type="number" name="tempCoefficientPMax" value={formData.tempCoefficientPMax} onChange={handleChange} required />
                        </label>
                        <label>
                            Tolerance (%):
                            <input type="number" name="tolerance" value={formData.tolerance} onChange={handleChange} required />
                        </label>
                        <label>
                            Degradation First Year (%):
                            <input type="number" name="degradationFirstYear" value={formData.degradationFirstYear} onChange={handleChange} required />
                        </label>
                        <label>
                            Degradation Years (%):
                            <input type="number" name="degradationYears" value={formData.degradationYears} onChange={handleChange} required />
                        </label>
                        <label>
                            Price ($):
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                        </label>
                    </>
                );

            case 'controllers':
                return (
                    <>
                        <label>
                            Name:
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </label>
                        <label>
                            Rated Power (W):
                            <input type="number" name="ratedPower" value={formData.ratedPower} onChange={handleChange} required />
                        </label>
                        <label>
                            Current Rating (A):
                            <input type="number" name="currentRating" value={formData.currentRating} onChange={handleChange} required />
                        </label>
                        <label>
                            Max Voltage (V):
                            <input type="number" name="maxVoltage" value={formData.maxVoltage} onChange={handleChange} required />
                        </label>
                        <label>
                            Min Voltage (V):
                            <input type="number" name="minVoltage" value={formData.minVoltage} onChange={handleChange} required />
                        </label>
                        <label>
                            Type:
                            <input type="text" name="type" value={formData.type} onChange={handleChange} required />
                        </label>
                        <label>
                            Efficiency (%):
                            <input type="number" name="efficiency" value={formData.efficiency} onChange={handleChange} required />
                        </label>
                    </>
                );

            case 'inverters':
                return (
                    <>
                        <label>
                            Name:
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </label>
                        <label>
                            Continuous Power (25°C):
                            <input type="number" name="continuousPower25C" value={formData.continuousPower25C} onChange={handleChange} required />
                        </label>
                        <label>
                            Continuous Power (40°C):
                            <input type="number" name="continuousPower40C" value={formData.continuousPower40C} onChange={handleChange} required />
                        </label>
                        <label>
                            Continuous Power (65°C):
                            <input type="number" name="continuousPower65C" value={formData.continuousPower65C} onChange={handleChange} required />
                        </label>
                        <label>
                            Max Power:
                            <input type="number" name="maxPower" value={formData.maxPower} onChange={handleChange} required />
                        </label>
                        <label>
                            Efficiency (%):
                            <input type="number" name="efficiency" value={formData.efficiency} onChange={handleChange} required />
                        </label>
                        <label>
                            Voltage:
                            <input type="number" name="voltage" value={formData.voltage} onChange={handleChange} required />
                        </label>
                        <label>
                            Price ($):
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                        </label>
                    </>
                );

            case 'batteries':
                return (
                    <>
                        <label>
                            Name:
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </label>
                        <label>
                            Type:
                            <input type="text" name="type" value={formData.type} onChange={handleChange} required />
                        </label>
                        <label>
                            Capacity (Ah):
                            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required />
                        </label>
                        <label>
                            Voltage (V):
                            <input type="number" name="voltage" value={formData.voltage} onChange={handleChange} required />
                        </label>
                        <label>
                            Depth of Discharge (%):
                            <input type="number" name="dod" value={formData.dod} onChange={handleChange} required />
                        </label>
                        <label>
                            Price ($):
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                        </label>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="component-form-container"> {/* Scrollable container */}
            <form onSubmit={handleSubmitForm} className="component-form">
                <h3>{componentData.id ? 'Edit Component' : 'Add New Component'}</h3>
                {renderFields()}
                <div className="form-actions">
                    <button type="submit">{componentData.id ? 'Update Component' : 'Add Component'}</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default ComponentForm;
