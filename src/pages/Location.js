import React, { useState } from 'react';
import LocationComponent from '../components/Location/LocationComponent';
import LocationService from '../services/LocationService';
import './Location.css'; // Import your custom CSS file for Location component

const Location = () => {
    const [latitude, setLatitude] = useState(49.744);
    const [longitude, setLongitude] = useState(15.339);
    const [angle, setAngle] = useState(35);
    const [aspect, setAspect] = useState(0);
    const [pvgisData, setPVGISData] = useState('');
    const [minMaxTemperatures, setMinMaxTemperatures] = useState({ minTemp: 'N/A', maxTemp: 'N/A' });

    const formatTemperature = (temp) => {
        // Ensure the temp is a number, then format it to a string with 2 decimal places
        return Number(temp).toFixed(2);
    };

    const calculatePVGISData = async (lat, lng) => {
        console.log(`Calculating PVGIS data for lat: ${lat}, lng: ${lng}, angle: ${angle}, aspect: ${aspect}`);
        try {
            const response = await LocationService.calculatePVGISData(lat, lng, angle, aspect);
            console.log('PVGIS data response:', response.data);
            setPVGISData(JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.error('Error calculating PVGIS data:', error);
            setPVGISData('Error fetching data');
        }
    };

    const useOptimalValues = async () => {
        console.log(`Fetching optimal values for lat: ${latitude}, lng: ${longitude}`);
        try {
            const response = await LocationService.fetchOptimalValues(latitude, longitude);
            console.log('Optimal values response:', response.data);
            const { optimalAngle, optimalAspect } = response.data;
            setAngle(optimalAngle);
            setAspect(optimalAspect);
            await calculatePVGISData(latitude, longitude);
        } catch (error) {
            console.error('Error fetching optimal values:', error);
        }
    };

    const fetchMinMaxTemperatures = async (lat, lng) => {
        console.log(`Fetching min/max temperatures for lat: ${lat}, lng: ${lng}`);
        try {
            const response = await LocationService.getMinMaxTemperatures(lat, lng);
            console.log('Min/max temperatures response:', response.data);
            const { minTemp, maxTemp } = response.data;
            setMinMaxTemperatures({
                minTemp: minTemp !== undefined ? formatTemperature(minTemp) : 'Error',
                maxTemp: maxTemp !== undefined ? formatTemperature(maxTemp) : 'Error'
            });
        } catch (error) {
            console.error('Error fetching min-max temperatures:', error);
            setMinMaxTemperatures({ minTemp: 'Error', maxTemp: 'Error' });
        }
    };

    const searchLocation = async () => {
        const locationQuery = document.getElementById('locationSearch').value;
        if (locationQuery.trim() === "") {
            alert("Please enter a location");
            return;
        }

        console.log(`Searching for location: ${locationQuery}`);
        try {
            const response = await LocationService.searchLocation(locationQuery);
            console.log('Location search response:', response.data);
            if (response.data.length > 0) {
                const result = response.data[0];
                setLatitude(parseFloat(result.lat).toFixed(3));
                setLongitude(parseFloat(result.lon).toFixed(3));
                await calculatePVGISData(result.lat, result.lon);
                await fetchMinMaxTemperatures(result.lat, result.lon);
            } else {
                alert("Location not found");
            }
        } catch (error) {
            console.error('Error searching location:', error);
            alert("Error fetching location data");
        }
    };

    return (
        <div className="map-page-container">
            <header>
                <h1 className="navbar-brand">Map with PVGIS Data</h1>
            </header>
            <div className="content">
                <div className="map-wrapper">
                    <LocationComponent
                        latitude={latitude}
                        longitude={longitude}
                        setLatitude={setLatitude}
                        setLongitude={setLongitude}
                        calculatePVGISData={calculatePVGISData}
                    />
                </div>
                <div className="controls">
                    <div className="form-group">
                        <label htmlFor="latitude">Latitude:</label>
                        <input type="text" id="latitude" className="form-control" value={latitude} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="longitude">Longitude:</label>
                        <input type="text" id="longitude" className="form-control" value={longitude} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="angle">Angle:</label>
                        <input type="text" id="angle" className="form-control" value={angle} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="aspect">Aspect:</label>
                        <input type="text" id="aspect" className="form-control" value={aspect} readOnly />
                    </div>
                    <button className="btn" onClick={useOptimalValues}>Use Optimal Values</button>
                    <div className="form-group">
                        <label htmlFor="locationSearch">Location:</label>
                        <input type="text" id="locationSearch" className="form-control" placeholder="Enter location" />
                    </div>
                    <button className="btn" onClick={searchLocation}>Search</button>
                    <button className="btn" onClick={() => fetchMinMaxTemperatures(latitude, longitude)}>Fetch Min/Max Temperatures</button>
                </div>
            </div>
            <div className="form-group">
                <textarea id="pvgisData" className="form-control" rows="15" readOnly value={pvgisData}></textarea>
            </div>
            <div className="form-group location-info">
                <p>Min Temperature: {minMaxTemperatures.minTemp}</p>
                <p>Max Temperature: {minMaxTemperatures.maxTemp}</p>
            </div>
        </div>
    );
};

export default Location;
