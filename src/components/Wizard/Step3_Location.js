import React, { useContext, useState, useCallback, useEffect } from 'react';
import LocationComponent from '../Location/LocationComponent';
import { ProjectContext } from '../../context/ProjectContext';
import LocationService from '../../services/LocationService';
import { processLocationData, loadSiteData } from '../../services/ProjectService';
import './Step3_Location.css';
import { Bar, BarChart, CartesianGrid, LabelList, Tooltip, XAxis, YAxis } from 'recharts';
import { useTranslation } from 'react-i18next'; // Import translation hook

const Step3_Location = ({ onComplete }) => {
    const { selectedProject } = useContext(ProjectContext);
    const { t } = useTranslation('wizard'); // Use translation hook for 'wizard' namespace

    const [location, setLocation] = useState({ latitude: 49.744, longitude: 15.339 });
    const [angle, setAngle] = useState(35);
    const [aspect, setAspect] = useState(0);
    const [pvgisData, setPVGISData] = useState([]);
    const [temperatures, setTemperatures] = useState({ min: 'N/A', max: 'N/A' });
    const [dataFetched, setDataFetched] = useState(false);
    const [useOptimal, setUseOptimal] = useState(false);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [isStepComplete, setIsStepComplete] = useState(false); // Track if the step is complete

    // Load site data when the project is selected
    useEffect(() => {
        const loadProjectSiteData = async () => {
            if (selectedProject) {
                try {
                    const siteData = await loadSiteData(selectedProject);
                    console.log('Loaded Site Data:', siteData);

                    if (!siteData || !siteData.latitude || !siteData.longitude) {
                        setLocation({ latitude: 49.744, longitude: 15.339 });
                    } else {
                        setLocation({
                            latitude: siteData.latitude,
                            longitude: siteData.longitude,
                        });
                    }
                    setAngle(siteData.panelAngle || 35);
                    setAspect(siteData.panelAspect || 0);
                    setTemperatures({
                        min: siteData.minTemperature ? Number(siteData.minTemperature).toFixed(2) : 'N/A',
                        max: siteData.maxTemperature ? Number(siteData.maxTemperature).toFixed(2) : 'N/A',
                    });
                    setPVGISData(siteData.monthlyDataList || []); // Set irradiance data
                    setDataFetched(true); // Set fetched data to true after loading site data
                } catch (error) {
                    console.error('Error loading site data:', error);
                }
            }
        };

        loadProjectSiteData();
    }, [selectedProject]);

    const handleProcessLocationData = useCallback(async () => {
        if (!selectedProject) {
            alert(t('step3.select_project_alert')); // Translated alert message
            return;
        }

        try {
            const processedData = await processLocationData(selectedProject, location.latitude, location.longitude, angle, aspect, useOptimal);
            console.log('Processed Data:', processedData);

            const { minTemperature, maxTemperature, monthlyDataList, panelAngle: newAngle, panelAspect: newAspect } = processedData;

            // Set temperatures
            setTemperatures({
                min: minTemperature ? Number(minTemperature).toFixed(2) : 'Error',
                max: maxTemperature ? Number(maxTemperature).toFixed(2) : 'Error',
            });

            // Update monthly irradiance data
            setPVGISData(monthlyDataList || []);
            setDataFetched(true);

            // Update angle and aspect from processed data
            if (newAngle !== undefined) {
                setAngle(newAngle); // Update angle from processed data
            }
            if (newAspect !== undefined) {
                setAspect(newAspect); // Update aspect from processed data
            }

            // Mark step as complete
            setIsStepComplete(true);
            onComplete();  // Notify Wizard that the step is complete

        } catch (error) {
            console.error('Error processing location data:', error);
            setTemperatures({ min: 'Error', max: 'Error' });
            setDataFetched(false);
        }
    }, [selectedProject, location.latitude, location.longitude, angle, aspect, useOptimal, t, onComplete]);

    const searchLocation = async () => {
        const locationQuery = document.getElementById('locationSearch').value;
        if (!locationQuery.trim()) {
            alert(t('step3.empty_query_alert')); // Translated alert message
            return;
        }

        try {
            const response = await LocationService.searchLocation(locationQuery);
            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                const formattedLat = parseFloat(lat).toFixed(3);
                const formattedLon = parseFloat(lon).toFixed(3);

                // Set new coordinates
                setLocation({ latitude: formattedLat, longitude: formattedLon });
                setHasUserInteracted(true); // Flag for calling handleProcessLocationData

            } else {
                alert(t('step3.location_not_found')); // Translated alert message
            }
        } catch (error) {
            console.error('Error searching location:', error);
            alert(t('step3.fetch_error_alert')); // Translated alert message
        }
    };

    const handleOptimalValuesToggle = () => {
        setUseOptimal(prev => !prev); // Toggle checkbox state
        setHasUserInteracted(true); // Set interaction flag

        if (useOptimal) {
            setAngle(35);
            setAspect(0);
        }
    };

    const handleLatitudeChange = (event) => {
        const newLat = parseFloat(event.target.value);
        if (!isNaN(newLat)) {
            setLocation(loc => ({ ...loc, latitude: newLat }));
            setHasUserInteracted(true); // Set interaction flag
        }
    };

    const handleLongitudeChange = (event) => {
        const newLon = parseFloat(event.target.value);
        if (!isNaN(newLon)) {
            setLocation(loc => ({ ...loc, longitude: newLon }));
            setHasUserInteracted(true); // Set interaction flag
        }
    };

    const handleAngleChange = (event) => {
        const newAngle = parseFloat(event.target.value);
        if (!isNaN(newAngle)) {
            setAngle(newAngle);
            setHasUserInteracted(true);
        }
    };

    const handleAspectChange = (event) => {
        const newAspect = parseFloat(event.target.value);
        if (!isNaN(newAspect)) {
            setAspect(newAspect);
            setHasUserInteracted(true);
        }
    };

    // Call data processing when user interacts with inputs or map
    useEffect(() => {
        if (hasUserInteracted) {
            handleProcessLocationData();
        }
    }, [location, angle, aspect, useOptimal, hasUserInteracted]);

    const chartData = pvgisData.map(item => ({
        month: item.month,
        irradiance: item.irradiance,
        ambientTemperature: item.ambientTemperature
    }));

    return (
        <div className="step3-map-page-container">
            <div className="step3-content">
                <div className="step3-left-column">
                    <div className="step3-search-block">
                        <div className="step3-search-bar">
                            <input type="text" id="locationSearch" className="form-control" placeholder={t('step3.location_placeholder')} />
                            <button className="step3-search-button" onClick={searchLocation}>{t('step3.search_button')}</button>
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
                            className="form-control"
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
                            className="form-control"
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
                            className="form-control"
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
                            className="form-control"
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
                        <Bar dataKey="irradiance" fill="#8884d8">
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
