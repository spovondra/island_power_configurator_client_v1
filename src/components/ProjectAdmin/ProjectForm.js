import { useState, useEffect } from 'react';
import './ProjectForm.css';
import { useTranslation } from 'react-i18next';

/**
 * Project form module
 *
 * @module ProjectForm
 */

/**
 * Initializes solar components with default empty arrays.
 *
 * @function initializeComponents
 * @memberof ProjectForm
 * @returns {object} An object containing default empty arrays for solar components.
 */
const initializeComponents = () => ({
    appliances: [],
    solarPanels: [],
    controllers: [],
    batteries: [],
    inverters: []
});

/**
 * ProjectForm component for creating or editing project details.
 *
 * @component
 * @memberof module:ProjectForm
 * @param {object} props - The component properties.
 * @param {object} props.formData - The initial project data.
 * @param {function} props.handleSubmit - Callback to handle form submission.
 * @param {function} props.onClose - Callback to handle form cancellation.
 * @returns {JSX.Element} The rendered project form component.
 */
const ProjectForm = ({ formData, handleSubmit, onClose }) => {
    const { t } = useTranslation('admin');

    /**
     * Local state for managing form data.
     *
     * @type {object}
     * @memberof ProjectForm
     */
    const [localFormData, setLocalFormData] = useState({
        name: '',
        site: {
            latitude: '',
            longitude: '',
            minTemperature: '',
            maxTemperature: '',
            panelAngle: '',
            panelAspect: '',
            usedOptimalValues: false,
            monthlyIrradianceList: []
        },
        solarComponents: initializeComponents()
    });

    /**
     * Updates local form data when `formData` prop changes.
     */
    useEffect(() => {
        if (formData) {
            setLocalFormData({
                name: formData.name || '',
                site: {
                    latitude: formData.site?.latitude || '',
                    longitude: formData.site?.longitude || '',
                    minTemperature: formData.site?.minTemperature || '',
                    maxTemperature: formData.site?.maxTemperature || '',
                    panelAngle: formData.site?.panelAngle || '',
                    panelAspect: formData.site?.panelAspect || '',
                    usedOptimalValues: formData.site?.usedOptimalValues || false,
                    monthlyIrradianceList: formData.site?.monthlyIrradianceList || []
                },
                solarComponents: {
                    appliances: formData.solarComponents?.appliances || [],
                    solarPanels: formData.solarComponents?.solarPanels || [],
                    controllers: formData.solarComponents?.controllers || [],
                    batteries: formData.solarComponents?.batteries || [],
                    inverters: formData.solarComponents?.inverters || []
                }
            });
        }
    }, [formData]);

    /**
     * Handles changes to text inputs and updates local form data.
     *
     * @function handleChange
     * @memberof ProjectForm
     * @param {object} e - The input change event.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    /**
     * Handles changes to the site information section of the form.
     *
     * @function handleSiteChange
     * @memberof ProjectForm
     * @param {object} e - The input change event.
     */
    const handleSiteChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLocalFormData(prevData => ({
            ...prevData,
            site: {
                ...prevData.site,
                [name]: type === 'checkbox' ? checked : value
            }
        }));
    };

    /**
     * Submits the form data by invoking the `handleSubmit` prop.
     *
     * @function handleSubmitClick
     * @memberof ProjectForm
     * @param {object} e - The form submission event.
     */
    const handleSubmitClick = (e) => {
        e.preventDefault();
        handleSubmit(localFormData);
    };

    return (
        <div className="project-form-container">
            <form onSubmit={handleSubmitClick} className="project-form">
                <div>
                    <label htmlFor="name">{t('projectForm.name')}:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={localFormData.name || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <h3>{t('projectForm.site_information')}</h3>
                    <label htmlFor="latitude">{t('projectForm.latitude')}:</label>
                    <input
                        type="number"
                        id="latitude"
                        name="latitude"
                        value={localFormData.site?.latitude || ''}
                        onChange={handleSiteChange}
                        required
                    />
                    <label htmlFor="longitude">{t('projectForm.longitude')}:</label>
                    <input
                        type="number"
                        id="longitude"
                        name="longitude"
                        value={localFormData.site?.longitude || ''}
                        onChange={handleSiteChange}
                        required
                    />
                    <label htmlFor="minTemperature">{t('projectForm.min_temperature')}:</label>
                    <input
                        type="number"
                        id="minTemperature"
                        name="minTemperature"
                        value={localFormData.site?.minTemperature || ''}
                        onChange={handleSiteChange}
                    />
                    <label htmlFor="maxTemperature">{t('projectForm.max_temperature')}:</label>
                    <input
                        type="number"
                        id="maxTemperature"
                        name="maxTemperature"
                        value={localFormData.site?.maxTemperature || ''}
                        onChange={handleSiteChange}
                    />
                    <label htmlFor="panelAngle">{t('projectForm.panel_angle')}:</label>
                    <input
                        type="number"
                        id="panelAngle"
                        name="panelAngle"
                        value={localFormData.site?.panelAngle || ''}
                        onChange={handleSiteChange}
                    />
                    <label htmlFor="panelAspect">{t('projectForm.panel_aspect')}:</label>
                    <input
                        type="number"
                        id="panelAspect"
                        name="panelAspect"
                        value={localFormData.site?.panelAspect || ''}
                        onChange={handleSiteChange}
                    />
                    <label htmlFor="usedOptimalValues">{t('projectForm.used_optimal_values')}:</label>
                    <input
                        type="checkbox"
                        id="usedOptimalValues"
                        name="usedOptimalValues"
                        checked={localFormData.site?.usedOptimalValues || false}
                        onChange={handleSiteChange}
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-submit">{t('projectForm.save')}</button>
                    <button type="button" onClick={onClose} className="btn-cancel">{t('projectForm.cancel')}</button>
                </div>
            </form>
        </div>
    );
};

export default ProjectForm;
