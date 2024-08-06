import React, { useContext, useState, useCallback, useEffect } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { addOrUpdateAppliance, deleteAppliance, getProjectById } from '../../services/ProjectService';
import './Step2_Appliance.css';

const Step2_Appliance = () => {
    const { selectedProject } = useContext(ProjectContext);

    const [appliance, setAppliance] = useState({
        id: '', // ID for editing appliances
        name: '',
        power: 0,
        quantity: 0,
        dailyUsageHours: 0
    });

    const [appliances, setAppliances] = useState([]);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const fetchAppliances = async () => {
            if (selectedProject) {
                try {
                    const project = await getProjectById(selectedProject);
                    setAppliances(project.appliances || []);
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
            await addOrUpdateAppliance(selectedProject, appliance);
            const updatedProject = await getProjectById(selectedProject);
            setAppliances(updatedProject.appliances);
            setAppliance({
                id: '',
                name: '',
                power: 0,
                quantity: 0,
                dailyUsageHours: 0
            });
            setEditMode(false);
            alert('Appliance saved successfully');
        } catch (error) {
            console.error('Error saving appliance:', error);
            alert('Error saving appliance');
        }
    }, [selectedProject, appliance]);

    const handleEdit = (appliance) => {
        setAppliance(appliance);
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
                        <label htmlFor="dailyUsageHours">Daily Usage Hours:</label>
                        <input
                            type="number"
                            id="dailyUsageHours"
                            value={appliance.dailyUsageHours}
                            onChange={(e) => setAppliance({ ...appliance, dailyUsageHours: parseFloat(e.target.value) })}
                            required
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
                        <th>Power (W)</th>
                        <th>Quantity</th>
                        <th>Daily Usage (hours)</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {appliances.map((appl) => (
                        <tr key={appl.id}>
                            <td>{appl.name}</td>
                            <td>{appl.power}</td>
                            <td>{appl.quantity}</td>
                            <td>{appl.dailyUsageHours}</td>
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
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Step2_Appliance;
