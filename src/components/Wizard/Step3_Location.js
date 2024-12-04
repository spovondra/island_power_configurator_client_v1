import React, { useContext, useState, useCallback, useEffect } from 'react';
import LocationComponent from '../Location/LocationComponent';
import { ProjectContext } from '../../context/ProjectContext';
import LocationService from '../../services/LocationService';
import { processLocationData, loadSiteData } from '../../services/ProjectService';
import './Step3_Location.css';
import { Bar, BarChart, CartesianGrid, LabelList, Tooltip, XAxis, YAxis } from 'recharts';
import { useTranslation } from 'react-i18next';

/**
 * Step3_Location component handles the location in the wizard.
 * Users can set the location, panel angle, aspect, and view irradiance and temperature data
 *
 * @module Step3_Location
 */

/**
 * Step3_Location component.
 *
 * @component
 * @param {object} props - The component properties.
 * @param {function} props.onComplete - Callback function invoked when the step is completed.
 * @returns {JSX.Element} Renders the Step3_Location component.
 */
const Step3_Location = ({ onComplete }) => {
    const { selectedProject } = useContext(ProjectContext);
    const { t } = useTranslation('wizard');
    const [location, setLocation] = useState({ latitude: 49.744, longitude: 15.339 });
    const [angle, setAngle] = useState(35);
    const [aspect, setAspect] = useState(0);
    const [pvgisData, setPVGISData] = useState([]);
    const [temperatures, setTemperatures] = useState({ min: 'N/A', max: 'N/A' });
    const [dataFetched, setDataFetched] = useState(false);
    const [useOptimal, setUseOptimal] = useState(false);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [isStepComplete, setIsStepComplete] = useState(false);

    /**
     * Loads site data from the backend when a project is selected.
     *
     * @async
     * @function loadProjectSiteData
     */
    useEffect(() => {
        const loadProjectSiteData = async () => {
            if (selectedProject) {
                try {
                    const siteData = await loadSiteData(selectedProject);

                    setLocation({
                        latitude: siteData.latitude || 49.744,
                        longitude: siteData.longitude || 15.339,
                    });
                    setAngle(siteData.panelAngle || 35);
                    setAspect(siteData.panelAspect || 0);
                    setTemperatures({
                        min: siteData.minTemperature ? Number(siteData.minTemperature).toFixed(2) : 'N/A',
                        max: siteData.maxTemperature ? Number(siteData.maxTemperature).toFixed(2) : 'N/A',
                    });
                    setPVGISData(siteData.monthlyDataList || []);
                    setDataFetched(true);
                } catch (error) {
                    console.error('Error loading site data:', error);
                }
            }
        };

        loadProjectSiteData();
    }, [selectedProject]);

    /**
     * Processes location data to retrieve calculated values (e.g., irradiance, temperatures).
     *
     * @async
     * @function handleProcessLocationData
     */
    const handleProcessLocationData = useCallback(async () => {
        if (!selectedProject) {
            alert(t('step3.select_project_alert'));
            return;
        }

        try {
            const processedData = await processLocationData(selectedProject, location.latitude, location.longitude, angle, aspect, useOptimal);

            setTemperatures({
                min: processedData.minTemperature ? Number(processedData.minTemperature).toFixed(2) : 'Error',
                max: processedData.maxTemperature ? Number(processedData.maxTemperature).toFixed(2) : 'Error',
            });
            setPVGISData(processedData.monthlyDataList || []);
            setAngle(processedData.panelAngle || angle);
            setAspect(processedData.panelAspect || aspect);
            setDataFetched(true);
            setIsStepComplete(true);
            onComplete();
        } catch (error) {
            console.error('Error processing location data:', error);
            setTemperatures({ min: 'Error', max: 'Error' });
            setDataFetched(false);
        }
    }, [selectedProject, location, angle, aspect, useOptimal, t, onComplete]);

    /**
     * Searches for a location based on a user query and updates latitude and longitude.
     *
     * @async
     * @function searchLocation
     */
    const searchLocation = async () => {
        const locationQuery = document.getElementById('locationSearch').value;
        if (!locationQuery.trim()) {
            alert(t('step3.empty_query_alert'));
            return;
        }

        try {
            const response = await LocationService.searchLocation(locationQuery);
            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                setLocation({ latitude: parseFloat(lat).toFixed(3), longitude: parseFloat(lon).toFixed(3) });
                setHasUserInteracted(true);
            } else {
                alert(t('step3.location_not_found'));
            }
        } catch (error) {
            console.error('Error searching location:', error);
            alert(t('step3.fetch_error_alert'));
        }
    };

    /**
     * Toggles the use of optimal values for angle and aspect.
     *
     * @function handleOptimalValuesToggle
     */
    const handleOptimalValuesToggle = () => {
        setUseOptimal((prev) => !prev);
        if (useOptimal) {
            setAngle(35);
            setAspect(0);
        }
        setHasUserInteracted(true);
    };

    /**
     * Handles changes to the latitude input field.
     * Updates the latitude in the location state and sets the interaction flag.
     *
     * @param {Object} event - The event object from the input field.
     */
    const handleLatitudeChange = (event) => {
        const newLat = parseFloat(event.target.value);
        if (!isNaN(newLat)) {
            setLocation(loc => ({ ...loc, latitude: newLat }));
            setHasUserInteracted(true);
        }
    };

    /**
     * Handles changes to the longitude input field.
     * Updates the longitude in the location state and sets the interaction flag.
     *
     * @param {Object} event - The event object from the input field.
     */
    const handleLongitudeChange = (event) => {
        const newLon = parseFloat(event.target.value);
        if (!isNaN(newLon)) {
            setLocation(loc => ({ ...loc, longitude: newLon }));
            setHasUserInteracted(true);
        }
    };

    /**
     * Handles changes to the panel angle input field.
     * Updates the panel angle state and sets the interaction flag.
     *
     * @param {Object} event - The event object from the input field.
     */
    const handleAngleChange = (event) => {
        const newAngle = parseFloat(event.target.value);
        if (!isNaN(newAngle)) {
            setAngle(newAngle);
            setHasUserInteracted(true);
        }
    };

    /**
     * Handles changes to the panel aspect input field.
     * Updates the panel aspect state and sets the interaction flag.
     *
     * @param {Object} event - The event object from the input field.
     */
    const handleAspectChange = (event) => {
        const newAspect = parseFloat(event.target.value);
        if (!isNaN(newAspect)) {
            setAspect(newAspect);
            setHasUserInteracted(true);
        }
    };

    /*trigger data processing when user interact in the map */
    useEffect(() => {
        if (hasUserInteracted) {
            handleProcessLocationData();
        }
    }, [location, angle, aspect, useOptimal, hasUserInteracted, handleProcessLocationData]);

    /* chart data for irradiance and temperature */
    const chartData = pvgisData.map((item) => ({
        month: item.month,
        irradiance: item.irradiance,
        ambientTemperature: item.ambientTemperature,
    }));

    return (
        <div className="step3-map-page-container">
            <div className="step3-content">
                <div className="step3-left-column">
                    <div className="step3-search-block">
                        <div className="step3-search-bar">
                            <input type="text" id="locationSearch" placeholder={t('step3.location_placeholder')} />
                            <button className="step3-button" onClick={searchLocation}>{t('step3.search_button')}</button>
                        </div>
                    </div>
                    <div className="step3-map-wrapper">
                        <LocationComponent
                            latitude={location.latitude}
                            longitude={location.longitude}
                            setLatitude={lat => {
                                setLocation(loc => ({ ...loc, latitude: lat }));
                                setHasUserInteracted(true);
                            }}
                            setLongitude={lon => {
                                setLocation(loc => ({ ...loc, longitude: lon }));
                                setHasUserInteracted(true);
                            }}
                        />
                    </div>
                </div>
                <div className="step3-controls">
                    <div className="step3-form-group">
                        <label htmlFor="latitude">{t('step3.latitude_label')}</label>
                        <input
                            type="text"
                            id="latitude"
                            className="step3-form-control"
                            value={location.latitude}
                            onChange={handleLatitudeChange}
                            onBlur={handleProcessLocationData}
                        />
                    </div>
                    <div className="step3-form-group">
                        <label htmlFor="longitude">{t('step3.longitude_label')}</label>
                        <input
                            type="text"
                            id="longitude"
                            className="step3-form-control"
                            value={location.longitude}
                            onChange={handleLongitudeChange}
                            onBlur={handleProcessLocationData}
                        />
                    </div>
                    <div className="step3-form-group">
                        <label htmlFor="angle">{t('step3.angle_label')}</label>
                        <input
                            type="text"
                            id="angle"
                            className="step3-form-control"
                            value={angle}
                            onChange={handleAngleChange}
                            onBlur={handleProcessLocationData}
                        />
                    </div>
                    <div className="step3-form-group">
                        <label htmlFor="aspect">{t('step3.aspect_label')}</label>
                        <input
                            type="text"
                            id="aspect"
                            className="step3-form-control"
                            value={aspect}
                            onChange={handleAspectChange}
                            onBlur={handleProcessLocationData}
                        />
                    </div>
                    <div className="step3-form-group">
                        <label htmlFor="useOptimal">{t('step3.use_optimal_label')}</label>
                        <input
                            type="checkbox"
                            id="useOptimal"
                            checked={useOptimal}
                            onChange={handleOptimalValuesToggle}
                        />
                    </div>
                    <div className="step3-form-group">
                        <h3>{t('step3.temperature_range_label')}</h3>
                        <p>{t('step3.min_temperature_label')}: {temperatures.min} °C</p>
                        <p>{t('step3.max_temperature_label')}: {temperatures.max} °C</p>
                    </div>

                    <button className="step3-button" onClick={handleProcessLocationData}>
                        {t('step3.apply_current_config_button')}
                    </button>
                    
                </div>
            </div>
            <div className="step3-chart-flex-container">
                <div className="step3-chart-container">
                    <h3>{t('step3.monthly_irradiance_label')}</h3>
                    <BarChart width={600} height={300} data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" label={{ value: t('step3.month_label'), position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: t('step3.irradiance_label'), angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Bar dataKey="irradiance" fill="#82ca9d">
                            <LabelList dataKey="irradiance" position="top" />
                        </Bar>
                    </BarChart>
                </div>
                <div className="step3-chart-container">
                    <h3>{t('step3.avg_ambient_temp_label')}</h3>
                    <BarChart width={600} height={300} data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" label={{ value: t('step3.month_label'), position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: t('step3.temperature_label'), angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Bar dataKey="ambientTemperature" fill="#8884d8">
                            <LabelList dataKey="ambientTemperature" position="top" />
                        </Bar>
                    </BarChart>
                </div>
            </div>
        </div>
    );
};

export default Step3_Location;
