import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './LocationComponent.css';

const bounds = L.latLngBounds(
    L.latLng(-85, -180),
    L.latLng(85, 180)
);

const customIcon = L.icon({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-icon.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
});

const LocationComponent = ({ latitude, longitude, setLatitude, setLongitude, setUseOptimal }) => {
    const [position, setPosition] = useState([latitude, longitude]);

    useEffect(() => {
        setPosition([latitude, longitude]);
    }, [latitude, longitude]);

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;

                // Check if clicked position is within bounds
                if (!bounds.contains([lat, lng])) {
                    alert('Click is outside the valid map bounds!');
                    return;
                }

                setLatitude(lat.toFixed(6));
                setLongitude(lng.toFixed(6));
                setPosition([lat, lng]);

                if (setUseOptimal) {
                    setUseOptimal(false);
                }
            },
        });

        return position ? <Marker position={position} icon={customIcon} /> : null;
    };

    return (
        <div className="map-container">
            <MapContainer
                center={position}
                zoom={3} // Zoom out a bit to cover more area initially
                className="map"
                maxBounds={bounds} // Set global map bounds
                maxBoundsViscosity={1.0} // Prevent panning outside of bounds
                minZoom={2} // Prevent too much zoom out
            >
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
