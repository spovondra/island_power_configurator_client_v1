import React, { useContext, useState, useCallback, useEffect } from 'react';
import LocationComponent from '../Location/LocationComponent';
import { ProjectContext } from '../../context/ProjectContext';
import { processLocationData, loadSiteData } from '../../services/ProjectService';
import './Step3_Location.css';
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const Step3_Location = () => {
    const { selectedProject } = useContext(ProjectContext);

    const [location, setLocation] = useState({ latitude: 49.744, longitude: 15.339 });
    const [angle, setAngle] = useState(35);
    const [aspect, setAspect] = useState(0);
    const [pvgisData, setPVGISData] = useState([]);
    const [temperatures, setTemperatures] = useState({ min: 'N/A', max: 'N/A' });
    const [dataFetched, setDataFetched] = useState(false);
    const [useOptimal, setUseOptimal] = useState(false);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);

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
                    setPVGISData(siteData.monthlyIrradianceList || []); // Set irradiance data
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
            alert('Please select a project');
            return;
        }

        try {
            const processedData = await processLocationData(selectedProject, location.latitude, location.longitude, angle, aspect, useOptimal);
            console.log('Processed Data:', processedData);

            const { minTemperature, maxTemperature, monthlyIrradianceList } = processedData;

            setTemperatures({
                min: minTemperature ? Number(minTemperature).toFixed(2) : 'Error',
                max: maxTemperature ? Number(maxTemperature).toFixed(2) : 'Error',
            });
            setPVGISData(monthlyIrradianceList || []); // Update monthly irradiance data
            setDataFetched(true);
        } catch (error) {
            console.error('Error processing location data:', error);
            setTemperatures({ min: 'Error', max: 'Error' });
            setDataFetched(false);
        }
    }, [selectedProject, location, angle, aspect, useOptimal]);

    const handleOptimalValuesToggle = () => {
        setUseOptimal(prev => !prev); // Toggle checkbox state
        setHasUserInteracted(true); // Set interaction flag
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
            setHasUserInteracted(true); // Set interaction flag
        }
    };

    const handleAspectChange = (event) => {
        const newAspect = parseFloat(event.target.value);
        if (!isNaN(newAspect)) {
            setAspect(newAspect);
            setHasUserInteracted(true); // Set interaction flag
        }
    };

    // Trigger data processing when user interacts with the inputs or the map
    useEffect(() => {
        if (hasUserInteracted) {
            handleProcessLocationData();
        }
    }, [location, angle, aspect, useOptimal, hasUserInteracted]);

    // Data for the chart using the structure of monthlyIrradianceList
    const chartData = pvgisData.map(item => ({
        month: item.month,         // Month number (1-12)
        irradiance: item.irradiance // Corresponding irradiance value
    }));

    return (
        <div className="map-page-container">
            <div className="content">
                <div className="left-column">
                    <div className="search-block">
                        <div className="search-bar">
                            <input type="text" id="locationSearch" className="form-control" placeholder="Enter location" />
                            <button className="search-button" onClick={handleProcessLocationData}>Search</button>
                        </div>
                    </div>
                    <div className="map-wrapper">
                        <LocationComponent
                            latitude={location.latitude}
                            longitude={location.longitude}
                            setLatitude={lat => {
                                setLocation(loc => ({ ...loc, latitude: lat }));
                                setHasUserInteracted(true); // Set interaction flag
                            }}
                            setLongitude={lon => {
                                setLocation(loc => ({ ...loc, longitude: lon }));
                                setHasUserInteracted(true); // Set interaction flag
                            }}
                        />
                    </div>
                </div>
                <div className="controls">
                    <div className="form-group">
                        <label htmlFor="latitude">Latitude:</label>
                        <input
                            type="text"
                            id="latitude"
                            className="form-control"
                            value={location.latitude}
                            onChange={handleLatitudeChange}
                            onBlur={handleProcessLocationData} // Trigger on blur
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="longitude">Longitude:</label>
                        <input
                            type="text"
                            id="longitude"
                            className="form-control"
                            value={location.longitude}
                            onChange={handleLongitudeChange}
                            onBlur={handleProcessLocationData} // Trigger on blur
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="angle">Angle:</label>
                        <input
                            type="text"
                            id="angle"
                            className="form-control"
                            value={angle}
                            onChange={handleAngleChange}
                            onBlur={handleProcessLocationData} // Trigger on blur
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="aspect">Aspect:</label>
                        <input
                            type="text"
                            id="aspect"
                            className="form-control"
                            value={aspect}
                            onChange={handleAspectChange}
                            onBlur={handleProcessLocationData} // Trigger on blur
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={useOptimal}
                                onChange={handleOptimalValuesToggle}
                            />
                            Use Optimal Values
                        </label>
                    </div>
                    <div className="temperature-data">
                        <h4>Temperature Data:</h4>
                        <p>Min Temperature: {temperatures.min}°C</p>
                        <p>Max Temperature: {temperatures.max}°C</p>
                    </div>
                </div>
            </div>
            {dataFetched && (
                <div className="chart-container">
                    <h4>Monthly Irradiance</h4>
                    <ResponsiveContainer width={600} height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" label={{ value: 'Month', position: 'bottom' }} />
                            <YAxis label={{ value: 'Irradiance (kWh/m²)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Bar dataKey="irradiance" fill="#8884d8">
                                <LabelList dataKey="irradiance" position="top" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default Step3_Location;
