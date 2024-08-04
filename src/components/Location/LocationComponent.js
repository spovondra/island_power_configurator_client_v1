import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './LocationComponent.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-icon.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
});

const LocationComponent = ({ latitude, longitude, setLatitude, setLongitude, calculatePVGISData, setUseOptimal, revertToOriginalSettings }) => {
    const [position, setPosition] = useState([latitude, longitude]);

    useEffect(() => {
        setPosition([latitude, longitude]);
    }, [latitude, longitude]);

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setLatitude(lat.toFixed(3));
                setLongitude(lng.toFixed(3));
                if (setUseOptimal) {
                    setUseOptimal(false);
                }
                if (revertToOriginalSettings) {
                    revertToOriginalSettings();
                }
                calculatePVGISData(lat, lng); // Call this function on map click
            },
        });

        return position ? <Marker position={position} /> : null;
    };

    return (
        <div className="map-container">
            <MapContainer center={position} zoom={7} className="map">
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors"
                />
                <LocationMarker />
            </MapContainer>
        </div>
    );
};

export default LocationComponent;
