import React, { useState } from 'react';
import MapComponent from '../components/MapComponent';
import axios from 'axios';
import './Map.css'; // Importujte vlastní CSS soubor pro Map komponentu

const Map = () => {
    const [latitude, setLatitude] = useState(49.744);
    const [longitude, setLongitude] = useState(15.339);
    const [angle, setAngle] = useState(35);
    const [aspect, setAspect] = useState(0);
    const [pvgisData, setPVGISData] = useState('');

    const calculatePVGISData = async (lat, lng) => {
        try {
            const response = await axios.get(`http://localhost:80/api/map/calculatePVGISData`, {
                params: {
                    latitude: lat,
                    longitude: lng,
                    angle,
                    aspect,
                }
            });
            setPVGISData(JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.error('Error calculating PVGIS data:', error);
            setPVGISData('Error fetching data');
        }
    };

    const useOptimalValues = async () => {
        try {
            const response = await axios.get(`http://localhost:80/api/map/fetchOptimalValues`, {
                params: {
                    latitude,
                    longitude,
                }
            });
            const { optimalAngle, optimalAspect } = response.data;
            setAngle(optimalAngle);
            setAspect(optimalAspect);
            await calculatePVGISData(latitude, longitude);
        } catch (error) {
            console.error('Error fetching optimal values:', error);
        }
    };

    const searchLocation = async () => {
        const locationQuery = document.getElementById('locationSearch').value;
        if (locationQuery.trim() === "") {
            alert("Please enter a location");
            return;
        }

        try {
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: locationQuery,
                    format: 'json',
                    limit: 1
                }
            });
            if (response.data.length > 0) {
                const result = response.data[0];
                setLatitude(parseFloat(result.lat).toFixed(3));
                setLongitude(parseFloat(result.lon).toFixed(3));
                await calculatePVGISData(result.lat, result.lon);
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
                <div>
                    <h1 className="navbar-brand">Map with PVGIS Data</h1>
                </div>
            </header>
            <div className="content">
                <div className="map-wrapper">
                    <MapComponent
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
                </div>
            </div>
            <div className="form-group">
                <textarea id="pvgisData" className="form-control" rows="15" readOnly value={pvgisData}></textarea>
            </div>
        </div>
    );
};

export default Map;
