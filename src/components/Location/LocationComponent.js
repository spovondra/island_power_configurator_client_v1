import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './LocationComponent.css';

/**
 * LocationComponent module
 *
 * @module LocationComponent
 */


/**
 * Defines global map bounds to restrict user interaction.
 *
 * @constant {L.LatLngBounds}
 * @memberof module:LocationComponent
 */
const bounds = L.latLngBounds(
    L.latLng(-85, -180),
    L.latLng(85, 180)
);

/**
 * Custom Leaflet marker icon configuration.
 *
 * @constant {L.Icon}
 * @memberof module:LocationComponent
 */
const customIcon = L.icon({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-icon.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
});

/**
 * LocationMarker component for handling user map interactions and updating coordinates.
 *
 * @component
 * @memberof module:LocationComponent
 * @param {object} props - Properties passed to the component.
 * @param {Array<number>} props.position - Current position of the marker [latitude, longitude].
 * @param {function} props.setLatitude - Function to update the latitude.
 * @param {function} props.setLongitude - Function to update the longitude.
 * @param {function} [props.setUseOptimal] - Optional function to disable optimal value usage.
 * @returns {JSX.Element} The marker component for Leaflet map.
 */
const LocationMarker = ({ position, setLatitude, setLongitude, setUseOptimal }) => {
    const map = useMap(); // Access map instance here

    useEffect(() => {
        /* Fly to the new position when load or update */
        map.flyTo(position, map.getZoom());
    }, [position, map]);

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;

            /* check if clicked position is within bounds */
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

/**
 * LocationComponent main component for displaying and interacting with the map.
 *
 * @component
 * @memberof module:LocationComponent
 * @param {object} props - Properties passed to the component.
 * @param {number} props.latitude - Initial latitude value.
 * @param {number} props.longitude - Initial longitude value.
 * @param {function} props.setLatitude - Function to update the latitude.
 * @param {function} props.setLongitude - Function to update the longitude.
 * @param {function} props.setUseOptimal - Function to toggle optimal location usage.
 * @param {function} [props.moveMapToLocation] - Optional function to move the map to a specific location.
 * @returns {JSX.Element} The map interface for selecting and interacting with locations.
 */
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
                maxBounds={bounds} //set global map bounds
                maxBoundsViscosity={1.0} //prevent panning outside of bounds
                minZoom={2} // prevent too much zoom out
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
