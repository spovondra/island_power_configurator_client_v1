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
                console.log('Fetching appliances for project:', selectedProject);
                try {
                    const project = await getProjectById(selectedProject);
                    console.log('Fetched project data:', project);
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
        console.log('Handling save for appliance:', appliance);
        try {
            if (!selectedProject) {
                alert("Please select a project");
                console.warn('No project selected');
                return;
            }
            console.log('Saving appliance to project:', selectedProject);
            await addOrUpdateAppliance(selectedProject, appliance);
            console.log('Appliance saved successfully');
            const updatedProject = await getProjectById(selectedProject);
            console.log('Updated project data:', updatedProject);
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
        console.log('Editing appliance:', appliance);
        setAppliance(appliance); // Set appliance details including ID
        setEditMode(true);
    };

    const handleDelete = async (applianceId) => {
        console.log('Attempting to delete appliance with ID:', applianceId);
        if (!applianceId) {
            alert("Appliance ID is required for deletion");
            console.warn('No appliance ID provided for deletion');
            return;
        }

        try {
            if (!selectedProject) {
                alert("Please select a project");
                console.warn('No project selected');
                return;
            }
            console.log('Deleting appliance from project:', selectedProject);
            console.log('Appliance id', applianceId);
            await deleteAppliance(selectedProject, applianceId);
            console.log('Appliance deleted successfully');
            setAppliances(appliances.filter(appl => appl.id !== applianceId));
            alert('Appliance deleted successfully');
        } catch (error) {
            console.error('Error deleting appliance:', error);
            alert('Error deleting appliance');
        }
    };

    return (
        <div className="appliance-container">
            <div className="appliance-form-container">
                <form onSubmit={handleSave} className="appliance-form">
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={appliance.name}
                            onChange={(e) => setAppliance({ ...appliance, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="power">Power (W):</label>
                        <input
                            type="number"
                            id="power"
                            value={appliance.power}
                            onChange={(e) => setAppliance({ ...appliance, power: parseFloat(e.target.value) })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity:</label>
                        <input
                            type="number"
                            id="quantity"
                            value={appliance.quantity}
                            onChange={(e) => setAppliance({ ...appliance, quantity: parseInt(e.target.value, 10) })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dailyUsageHours">Daily Usage Hours:</label>
                        <input
                            type="number"
                            id="dailyUsageHours"
                            value={appliance.dailyUsageHours}
                            onChange={(e) => setAppliance({ ...appliance, dailyUsageHours: parseFloat(e.target.value) })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn">
                        {editMode ? 'Update Appliance' : 'Add Appliance'}
                    </button>
                </form>
            </div>
            <div className="appliance-list-container">
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
                            <td className="actions">
                                <button
                                    className="btn edit-btn"
                                    onClick={() => handleEdit(appl)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn delete-btn"
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
