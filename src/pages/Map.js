import React, { useState } from 'react';
import MapComponent from './components/MapComponent';
import PVGISForm from './components/PVGISForm';
import PVGISData from './components/PVGISData';

const Map = () => {
    const [latitude, setLatitude] = useState(49.744);
    const [longitude, setLongitude] = useState(15.339);
    const [pvgisData, setPVGISData] = useState('');

    const handleMapClick = (lat, lng) => {
        setLatitude(lat.toFixed(3));
        setLongitude(lng.toFixed(3));
    };

    const handleUpdateData = (data) => {
        setPVGISData(data);
    };

    return (
        <div>
            <header>
                <h1>Map with PVGIS Data</h1>
            </header>
            <MapComponent latitude={latitude} longitude={longitude} onMapClick={handleMapClick} />
            <PVGISForm onUpdateData={handleUpdateData} />
            <PVGISData data={pvgisData} />
        </div>
    );
};

export default Map;
