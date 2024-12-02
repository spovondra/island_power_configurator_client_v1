/**
 * Component form module for creating or editing components.
 *
 * @module ComponentForm
 */

import React, { useState, useEffect } from 'react';
import './ComponentForm.css';
import { useTranslation } from 'react-i18next';

/**
 * Component form for creating or editing components.
 *
 * @component
 * @memberof module:ComponentForm
 * @param {object} props - Properties passed to the component.
 * @param {object} props.componentData - Data of the component being edited.
 * @param {function} props.handleSubmit - Function to handle form submission.
 * @param {function} props.onClose - Function to handle form cancellation.
 * @param {string} props.selectedCategory - Currently selected category of components.
 * @returns {JSX.Element} Form interface for managing component data.
 */
const ComponentForm = ({ componentData, handleSubmit, onClose, selectedCategory }) => {
    const { t } = useTranslation('admin');

    /**
     * State for managing form data.
     *
     * @type {object}
     * @memberof module:ComponentForm
     */
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

    /**
     * Updates form data state on input change.
     *
     * @function
     * @memberof module:ComponentForm
     * @param {object} e - Input change event.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    /**
     * Submits the form data.
     *
     * @function
     * @memberof module:ComponentForm
     * @param {object} e - Form submit event.
     */
    const handleSubmitForm = (e) => {
        e.preventDefault();
        handleSubmit(formData);
    };

    /**
     * Renders category-specific form fields.
     *
     * @function
     * @memberof module:ComponentForm
     * @returns {JSX.Element|null} Rendered input fields.
     */
    const renderFields = () => {
        switch (selectedCategory) {
            case 'solar-panels':
                return (
                    <>
                        <label>
                            {t('component.manufacturer')}:
                            <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.rated_power')} (W):
                            <input type="number" name="pRated" value={formData.pRated} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.voc')} (V):
                            <input type="number" name="voc" value={formData.voc} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.isc')} (A):
                            <input type="number" name="isc" value={formData.isc} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.vmp')} (V):
                            <input type="number" name="vmp" value={formData.vmp} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.imp')} (A):
                            <input type="number" name="imp" value={formData.imp} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.temp_coefficient')}:
                            <input type="number" name="tempCoefficientPMax" value={formData.tempCoefficientPMax} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.tolerance')} (%):
                            <input type="number" name="tolerance" value={formData.tolerance} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.degradation_first_year')} (%):
                            <input type="number" name="degradationFirstYear" value={formData.degradationFirstYear} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.degradation_years')} (%):
                            <input type="number" name="degradationYears" value={formData.degradationYears} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.price')} ($):
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                        </label>
                    </>
                );

            case 'controllers':
                return (
                    <>
                        <label>
                            {t('component.name')}:
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.rated_power')} (W):
                            <input type="number" name="ratedPower" value={formData.ratedPower} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.current_rating')} (A):
                            <input type="number" name="currentRating" value={formData.currentRating} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.max_voltage')} (V):
                            <input type="number" name="maxVoltage" value={formData.maxVoltage} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.min_voltage')} (V):
                            <input type="number" name="minVoltage" value={formData.minVoltage} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.type')}:
                            <input type="text" name="type" value={formData.type} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.efficiency')} (%):
                            <input type="number" name="efficiency" value={formData.efficiency} onChange={handleChange} required />
                        </label>
                    </>
                );

            case 'inverters':
                return (
                    <>
                        <label>
                            {t('component.name')}:
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.continuous_power_25C')}:
                            <input type="number" name="continuousPower25C" value={formData.continuousPower25C} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.continuous_power_40C')}:
                            <input type="number" name="continuousPower40C" value={formData.continuousPower40C} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.continuous_power_65C')}:
                            <input type="number" name="continuousPower65C" value={formData.continuousPower65C} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.max_power')}:
                            <input type="number" name="maxPower" value={formData.maxPower} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.efficiency')} (%):
                            <input type="number" name="efficiency" value={formData.efficiency} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.voltage')}:
                            <input type="number" name="voltage" value={formData.voltage} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.price')} ($):
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                        </label>
                    </>
                );

            case 'batteries':
                return (
                    <>
                        <label>
                            {t('component.name')}:
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.type')}:
                            <input type="text" name="type" value={formData.type} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.capacity')} (Ah):
                            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.voltage')} (V):
                            <input type="number" name="voltage" value={formData.voltage} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.dod')} (%):
                            <input type="number" name="dod" value={formData.dod} onChange={handleChange} required />
                        </label>
                        <label>
                            {t('component.price')} ($):
                            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                        </label>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="component-form-container">
            <form onSubmit={handleSubmitForm} className="component-form">
                <h3>{componentData.id ? t('component.edit_component') : t('component.add_new_component')}</h3>
                {renderFields()}
                <div className="form-actions">
                    <button type="submit">{componentData.id ? t('component.update_component') : t('component.add_new_component')}</button>
                    <button type="button" onClick={onClose}>{t('component.cancel')}</button>
                </div>
            </form>
        </div>
    );
};

export default ComponentForm;
