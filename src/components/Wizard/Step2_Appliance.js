import React, { useContext, useState, useCallback, useEffect } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { addOrUpdateAppliance, deleteAppliance, getProjectById } from '../../services/ProjectService';
import './Step2_Appliance.css';

const Step2_Appliance = () => {
    const { selectedProject } = useContext(ProjectContext);

    const [appliance, setAppliance] = useState({
        id: '', // ID for editing appliances
        name: '',
        type: 'AC', // Default type; can be AC or DC
        quantity: 0,
        power: 0,
        hours: 0,
        days: 7, // Default to 7 days per week
        peakPower: 0,
        energy: 0,
        cost: 0
    });

    const [appliances, setAppliances] = useState([]);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const fetchAppliances = async () => {
            if (selectedProject) {
                try {
                    const project = await getProjectById(selectedProject);
                    setAppliances(project.applianceConfiguration.appliances || []); // Access the appliances from the configuration
                } catch (error) {
                    console.error('Error fetching project:', error);
                }
            }
        };

        fetchAppliances();
    }, [selectedProject]);

    const handleSave = useCallback(async (e) => {
        e.preventDefault();
        try {
            if (!selectedProject) {
                alert("Please select a project");
                return;
            }

            // Create or update appliance in the configuration
            const updatedAppliances = editMode
                ? appliances.map(appl => (appl.id === appliance.id ? appliance : appl)) // Update existing
                : [...appliances, { ...appliance, id: Date.now().toString() }]; // Add new appliance

            // Prepare the project update with the new appliance configuration
            await addOrUpdateAppliance(selectedProject, {
                ...appliance,
                applianceConfiguration: {
                    appliances: updatedAppliances
                }
            });

            const updatedProject = await getProjectById(selectedProject);
            setAppliances(updatedProject.applianceConfiguration.appliances);
            setAppliance({
                id: '',
                name: '',
                type: 'AC',
                quantity: 0,
                power: 0,
                hours: 0,
                days: 7,
                peakPower: 0,
                energy: 0,
                cost: 0
            });
            setEditMode(false);
            alert('Appliance saved successfully');
        } catch (error) {
            console.error('Error saving appliance:', error);
            alert('Error saving appliance');
        }
    }, [selectedProject, appliance, appliances, editMode]);

    const handleEdit = (appl) => {
        setAppliance(appl);
        setEditMode(true);
    };

    const handleDelete = async (applianceId) => {
        if (!applianceId) {
            alert("Appliance ID is required for deletion");
            return;
        }

        try {
            if (!selectedProject) {
                alert("Please select a project");
                return;
            }
            await deleteAppliance(selectedProject, applianceId);
            setAppliances(appliances.filter(appl => appl.id !== applianceId));
            alert('Appliance deleted successfully');
        } catch (error) {
            console.error('Error deleting appliance:', error);
            alert('Error deleting appliance');
        }
    };

    return (
        <div className="appliance-page-container">
            <div className="form-section">
                <form onSubmit={handleSave} className="appliance-form">
                    <div className="input-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={appliance.name}
                            onChange={(e) => setAppliance({ ...appliance, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="type">Type:</label>
                        <select
                            id="type"
                            value={appliance.type}
                            onChange={(e) => setAppliance({ ...appliance, type: e.target.value })}
                            required
                        >
                            <option value="AC">AC</option>
                            <option value="DC">DC</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label htmlFor="power">Power (W):</label>
                        <input
                            type="number"
                            id="power"
                            value={appliance.power}
                            onChange={(e) => setAppliance({ ...appliance, power: parseFloat(e.target.value) })}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="quantity">Quantity:</label>
                        <input
                            type="number"
                            id="quantity"
                            value={appliance.quantity}
                            onChange={(e) => setAppliance({ ...appliance, quantity: parseInt(e.target.value, 10) })}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="hours">Daily Usage Hours:</label>
                        <input
                            type="number"
                            id="hours"
                            value={appliance.hours}
                            onChange={(e) => setAppliance({ ...appliance, hours: parseFloat(e.target.value) })}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="days">Days per Week:</label>
                        <input
                            type="number"
                            id="days"
                            value={appliance.days}
                            onChange={(e) => setAppliance({ ...appliance, days: parseFloat(e.target.value) })}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="peakPower">Peak Power (W):</label>
                        <input
                            type="number"
                            id="peakPower"
                            value={appliance.peakPower}
                            onChange={(e) => setAppliance({ ...appliance, peakPower: parseFloat(e.target.value) })}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="energy">Energy Consumption:</label>
                        <input
                            type="number"
                            id="energy"
                            value={appliance.energy}
                            onChange={(e) => setAppliance({ ...appliance, energy: parseFloat(e.target.value) })}
                            disabled
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="cost">Cost:</label>
                        <input
                            type="number"
                            id="cost"
                            value={appliance.cost}
                            onChange={(e) => setAppliance({ ...appliance, cost: parseFloat(e.target.value) })}
                        />
                    </div>
                    <button type="submit" className="action-button">
                        {editMode ? 'Update Appliance' : 'Add Appliance'}
                    </button>
                </form>
            </div>
            <div className="appliance-list-section">
                <table className="appliance-table">
                    <thead>
                    <tr>
                        <th style={{ minWidth: '200px' }}>Name</th>
                        <th>Type</th>
                        <th>Power (W)</th>
                        <th>Quantity</th>
                        <th>Daily Usage (hours)</th>
                        <th>Days (per week)</th>
                        <th>Peak Power (W)</th>
                        <th>Energy (kWh)</th>
                        <th>Cost</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {appliances.map((appl) => (
                        <tr key={appl.id}>
                            <td>{appl.name}</td>
                            <td>{appl.type}</td>
                            <td>{appl.power}</td>
                            <td>{appl.quantity}</td>
                            <td>{appl.hours}</td>
                            <td>{appl.days}</td>
                            <td>{appl.peakPower}</td>
                            <td>{appl.energy}</td>
                            <td>{appl.cost}</td>
                            <td className="button-group">
                                <button
                                    className="edit-button"
                                    onClick={() => handleEdit(appl)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(appl.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    )) || (
                        <tr>
                            <td colSpan="10" className="no-data">No appliances added.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Step2_Appliance;
