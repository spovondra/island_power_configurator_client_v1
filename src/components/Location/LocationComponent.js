import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
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

const LocationMarker = ({ position, setLatitude, setLongitude, setUseOptimal }) => {
    const map = useMap(); // Access map instance here

    useEffect(() => {
        // Fly to the new position on load or update
        map.flyTo(position, map.getZoom());
    }, [position, map]);

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
            if (setUseOptimal) {
                setUseOptimal(false);
            }
        },
    });

    return <Marker position={position} icon={customIcon} />;
};

const LocationComponent = ({ latitude, longitude, setLatitude, setLongitude, setUseOptimal, moveMapToLocation }) => {
    const [position, setPosition] = useState([latitude, longitude]);

    useEffect(() => {
        setPosition([latitude, longitude]);
    }, [latitude, longitude]);

    return (
        <div className="map-container">
            <MapContainer
                center={position}
                zoom={7}
                className="map"
                maxBounds={bounds} // Set global map bounds
                maxBoundsViscosity={1.0} // Prevent panning outside of bounds
                minZoom={2} // Prevent too much zoom out
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors"
                />
                <LocationMarker
                    position={position}
                    setLatitude={setLatitude}
                    setLongitude={setLongitude}
                    setUseOptimal={setUseOptimal}
                />
            </MapContainer>
        </div>
    );
};

export default LocationComponent;
