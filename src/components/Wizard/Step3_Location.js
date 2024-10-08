import React, { useContext, useState, useCallback, useEffect } from 'react';
import LocationComponent from '../Location/LocationComponent';
import LocationService from '../../services/LocationService';
import { ProjectContext } from '../../context/ProjectContext';
import { getProjectById, updateProject } from '../../services/ProjectService';
import './Step3_Location.css';
import {Bar, BarChart, CartesianGrid, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

const Step3_Location = () => {
    const { selectedProject } = useContext(ProjectContext);

    const [location, setLocation] = useState({ latitude: 49.744, longitude: 15.339 });
    const [angle, setAngle] = useState(35);
    const [aspect, setAspect] = useState(0);
    const [pvgisData, setPVGISData] = useState([]); // Changed to an empty array
    const [temperatures, setTemperatures] = useState({ min: 'N/A', max: 'N/A' });
    const [dataFetched, setDataFetched] = useState(false);
    const [useOptimal, setUseOptimal] = useState(false);
    const [shouldSave, setShouldSave] = useState(false);

    // Fetch data if selectedProject is present
    useEffect(() => {
        const loadProjectData = async () => {
            if (selectedProject) {
                try {
                    const project = await getProjectById(selectedProject);
                    const { site } = project;
                    setLocation({
                        latitude: site.latitude || 49.744,
                        longitude: site.longitude || 15.339
                    });
                    setAngle(site.panelAngle || 35);
                    setAspect(site.panelAspect || 0);
                    setTemperatures({
                        min: site.minTemperature || 'N/A',
                        max: site.maxTemperature || 'N/A'
                    });
                    setUseOptimal(site.usedOptimalValues || false);
                    setPVGISData(site.monthlyIrradianceList || []); // Ensure this is set as an array
                    setDataFetched(true);
                } catch (error) {
                    console.error('Error loading project data:', error);
                }
            }
        };

        loadProjectData();
    }, [selectedProject]);

    const fetchData = useCallback(async (lat, lng) => {
        try {
            const [pvgisResponse, tempResponse] = await Promise.all([
                LocationService.calculatePVGISData(lat, lng, angle, aspect),
                LocationService.getMinMaxTemperatures(lat, lng)
            ]);

            setPVGISData(pvgisResponse.data); // Ensure this is set as an array
            setTemperatures({
                min: tempResponse.data.minTemp ? Number(tempResponse.data.minTemp).toFixed(2) : 'Error',
                max: tempResponse.data.maxTemp ? Number(tempResponse.data.maxTemp).toFixed(2) : 'Error'
            });

            setDataFetched(true);
            setShouldSave(true);
        } catch (error) {
            console.error('Error fetching data:', error);
            setTemperatures({ min: 'Error', max: 'Error' });
            setDataFetched(false);
            setShouldSave(false);
        }
    }, [angle, aspect]);

    const saveLocationToProject = useCallback(async () => {
        if (!selectedProject) {
            alert("Please select a project");
            return;
        }

        try {
            const project = await getProjectById(selectedProject);
            const updatedProjectData = {
                ...project,
                site: {
                    ...project.site,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    minTemperature: temperatures.min,
                    maxTemperature: temperatures.max,
                    panelAngle: angle,
                    panelAspect: aspect,
                    usedOptimalValues: useOptimal,
                    monthlyIrradianceList: pvgisData.map(item => ({
                        month: item.month,
                        irradiance: item.HI_d
                    })) || []
                }
            };
            await updateProject(selectedProject, updatedProjectData);
            alert('Location data saved successfully');
            setShouldSave(false);
        } catch (error) {
            console.error('Error saving location data to project:', error);
            alert('Error saving location data');
        }
    }, [selectedProject, location, temperatures, angle, aspect, useOptimal, pvgisData]);

    const fetchOptimalValues = useCallback(async () => {
        try {
            const response = await LocationService.fetchOptimalValues(location.latitude, location.longitude);
            const { optimalAngle, optimalAspect } = response.data;
            setAngle(optimalAngle);
            setAspect(optimalAspect);
            await fetchData(location.latitude, location.longitude);
            setUseOptimal(true);
        } catch (error) {
            console.error('Error fetching optimal values:', error);
        }
    }, [location.latitude, location.longitude, fetchData]);

    const searchLocation = async () => {
        const locationQuery = document.getElementById('locationSearch').value;
        if (!locationQuery.trim()) {
            alert("Please enter a location");
            return;
        }

        try {
            const response = await LocationService.searchLocation(locationQuery);
            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                const formattedLat = parseFloat(lat).toFixed(3);
                const formattedLon = parseFloat(lon).toFixed(3);
                setLocation({ latitude: formattedLat, longitude: formattedLon });
                setAngle(35); // Reset angle to default when location changes
                setAspect(0); // Reset aspect to default when location changes
                setUseOptimal(false); // Reset useOptimal
                await fetchData(formattedLat, formattedLon);
            } else {
                alert("Location not found");
            }
        } catch (error) {
            console.error('Error searching location:', error);
            alert("Error fetching location data");
        }
    };

    useEffect(() => {
        if (shouldSave && dataFetched && temperatures.min !== 'N/A' && temperatures.max !== 'N/A') {
            saveLocationToProject();
        }
    }, [shouldSave, dataFetched, temperatures, saveLocationToProject]);

    const handleLatitudeChange = (event) => {
        const newLat = parseFloat(event.target.value);
        if (!isNaN(newLat)) {
            setLocation(loc => ({ ...loc, latitude: newLat }));
            fetchData(newLat, location.longitude);
        }
    };

    const handleLongitudeChange = (event) => {
        const newLon = parseFloat(event.target.value);
        if (!isNaN(newLon)) {
            setLocation(loc => ({ ...loc, longitude: newLon }));
            fetchData(location.latitude, newLon);
        }
    };

    const handleAngleChange = (event) => {
        const newAngle = parseFloat(event.target.value);
        if (!isNaN(newAngle)) {
            setAngle(newAngle);
            fetchData(location.latitude, location.longitude);
        }
    };

    const handleAspectChange = (event) => {
        const newAspect = parseFloat(event.target.value);
        if (!isNaN(newAspect)) {
            setAspect(newAspect);
            fetchData(location.latitude, location.longitude);
        }
    };

    const chartData = pvgisData.map(item => ({
        month: item.month,
        irradiance: item.HI_d // assuming irradiance data has a "HI_d" field
    }));

    return (
        <div className="map-page-container">
            <div className="content">
                <div className="left-column">
                    <div className="search-block">
                        <div className="search-bar">
                            <input type="text" id="locationSearch" className="form-control"
                                   placeholder="Enter location"/>
                            <button className="search-button" onClick={searchLocation}>Search</button>
                        </div>
                    </div>
                    <div className="map-wrapper">
                        <LocationComponent
                            latitude={location.latitude}
                            longitude={location.longitude}
                            setLatitude={lat => setLocation(loc => ({...loc, latitude: lat}))}
                            setLongitude={lon => setLocation(loc => ({...loc, longitude: lon}))}
                            calculatePVGISData={fetchData}
                            setUseOptimal={setUseOptimal}
                            // No revertToOriginalSettings needed
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
                        />
                    </div>
                    <div className="form-group">
                        <button className="optimal-button" onClick={fetchOptimalValues}>Get Optimal Values</button>
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
                    <ResponsiveContainer width={1200} height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="irradiance" fill="#8884d8" />
                            <LabelList dataKey="irradiance" position="top" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default Step3_Location;
