import React, { useContext, useState, useCallback, useEffect } from 'react';
import LocationComponent from '../Location/LocationComponent';
import LocationService from '../../services/LocationService';
import { ProjectContext } from '../../context/ProjectContext';
import { getProjectById, updateProject } from '../../services/ProjectService';
import './Step3_Location.css';

const Step3_Location = () => {
    const { selectedProject } = useContext(ProjectContext);

    const [location, setLocation] = useState({ latitude: 49.744, longitude: 15.339 });
    const [angle, setAngle] = useState(35);
    const [aspect, setAspect] = useState(0);
    const [originalSettings, setOriginalSettings] = useState({ angle: 35, aspect: 0 });
    const [temperatures, setTemperatures] = useState({ min: 'N/A', max: 'N/A' });
    const [dataFetched, setDataFetched] = useState(false);
    const [useOptimal, setUseOptimal] = useState(false);
    const [shouldSave, setShouldSave] = useState(false); // Control save action

    const fetchData = useCallback(async (lat, lng) => {
        try {
            const [pvgisResponse, tempResponse] = await Promise.all([
                LocationService.calculatePVGISData(lat, lng, angle, aspect),
                LocationService.getMinMaxTemperatures(lat, lng)
            ]);

            setTemperatures({
                min: tempResponse.data.minTemp !== undefined ? Number(tempResponse.data.minTemp).toFixed(2) : 'Error',
                max: tempResponse.data.maxTemp !== undefined ? Number(tempResponse.data.maxTemp).toFixed(2) : 'Error'
            });
            setDataFetched(true);
            setShouldSave(true); // Set flag to true when data is fetched
        } catch (error) {
            console.error('Error fetching data:', error);
            setTemperatures({ min: 'Error', max: 'Error' });
            setDataFetched(false);
            setShouldSave(false); // Reset flag on error
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
                    usedOptimalValues: useOptimal
                }
            };
            await updateProject(selectedProject, updatedProjectData);
            alert('Location data saved successfully');
            setShouldSave(false); // Reset save flag after successful save
        } catch (error) {
            console.error('Error saving location data to project:', error);
            alert('Error saving location data');
        }
    }, [selectedProject, location, temperatures, angle, aspect, useOptimal]);

    const fetchOptimalValues = useCallback(async () => {
        try {
            const response = await LocationService.fetchOptimalValues(location.latitude, location.longitude);
            const { optimalAngle, optimalAspect } = response.data;
            setOriginalSettings({ angle, aspect });
            setAngle(optimalAngle);
            setAspect(optimalAspect);
            await fetchData(location.latitude, location.longitude);
            setUseOptimal(true);
        } catch (error) {
            console.error('Error fetching optimal values:', error);
        }
    }, [location.latitude, location.longitude, angle, aspect, fetchData]);

    const revertToOriginalSettings = () => {
        setAngle(originalSettings.angle);
        setAspect(originalSettings.aspect);
    };

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
                await fetchData(formattedLat, formattedLon);
                setUseOptimal(false);
                revertToOriginalSettings();
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

    return (
        <div className="map-page-container">
            <div className="content">
                <div className="map-wrapper">
                    <LocationComponent
                        latitude={location.latitude}
                        longitude={location.longitude}
                        setLatitude={lat => setLocation(loc => ({ ...loc, latitude: lat }))}
                        setLongitude={lon => setLocation(loc => ({ ...loc, longitude: lon }))}
                        calculatePVGISData={fetchData}
                        setUseOptimal={setUseOptimal}
                        revertToOriginalSettings={revertToOriginalSettings}
                    />
                    <div className="search-block">
                        <div className="form-group">
                            <input type="text" id="locationSearch" className="form-control" placeholder="Enter location" />
                        </div>
                        <button className="btn" onClick={searchLocation}>Search</button>
                    </div>
                </div>
                <div className="controls">
                    <div className="form-group">
                        <label htmlFor="latitude">Latitude:</label>
                        <input type="text" id="latitude" className="form-control" value={location.latitude} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="longitude">Longitude:</label>
                        <input type="text" id="longitude" className="form-control" value={location.longitude} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="angle">Angle:</label>
                        <input type="text" id="angle" className="form-control" value={angle} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="aspect">Aspect:</label>
                        <input type="text" id="aspect" className="form-control" value={aspect} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Min Temperature:</label>
                        <p>{temperatures.min}</p>
                    </div>
                    <div className="form-group">
                        <label>Max Temperature:</label>
                        <p>{temperatures.max}</p>
                    </div>
                    <div className="form-group">
                        <button className="btn" onClick={fetchOptimalValues}>Fetch Optimal Values</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step3_Location;
