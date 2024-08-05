import React, { useContext, useState, useCallback, useEffect } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { getProjectById, updateProject } from '../../services/ProjectService';
import './Step2_Appliance.css';

const Step2_Appliance = ({ onUpdate }) => {
    const { selectedProject } = useContext(ProjectContext);

    const [appliances, setAppliances] = useState([]);
    const [newAppliance, setNewAppliance] = useState({
        name: '',
        power: '',
        hoursPerDay: '',
        daysPerWeek: ''
    });
    const [error, setError] = useState('');
    const [shouldSave, setShouldSave] = useState(false);

    // Fetch project data and appliances when selectedProject changes
    useEffect(() => {
        const fetchProjectData = async () => {
            if (selectedProject) {
                try {
                    const project = await getProjectById(selectedProject);
                    const existingAppliances = project.solarComponents?.appliances || [];
                    setAppliances(existingAppliances);
                } catch (error) {
                    console.error('Error fetching project data:', error);
                    setError('Error fetching project data');
                }
            }
        };

        fetchProjectData();
    }, [selectedProject]);

    // Add appliance to the list and set flag for saving
    const addAppliance = async () => {
        if (!newAppliance.name || !newAppliance.power || !newAppliance.hoursPerDay || !newAppliance.daysPerWeek) {
            setError('All fields are required');
            return;
        }

        try {
            const project = await getProjectById(selectedProject);
            const existingAppliances = project.solarComponents?.appliances || [];
            const updatedApplianceList = [...existingAppliances, newAppliance];

            const updatedProjectData = {
                ...project,
                solarComponents: {
                    ...project.solarComponents,
                    appliances: updatedApplianceList
                }
            };

            await updateProject(selectedProject, updatedProjectData);
            setAppliances(updatedApplianceList);
            setNewAppliance({ name: '', power: '', hoursPerDay: '', daysPerWeek: '' });
            setError('');
            setShouldSave(true);
        } catch (error) {
            console.error('Error updating project:', error);
            setError('Error updating project');
        }
    };

    // Handle input changes for new appliance
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAppliance(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Save changes and trigger onUpdate callback if applicable
    useEffect(() => {
        if (shouldSave && onUpdate) {
            onUpdate();
            setShouldSave(false);
        }
    }, [shouldSave, onUpdate]);

    return (
        <div className="appliance-container">
            <h2>Manage Appliances</h2>
            <div className="appliance-form">
                <h3>Add New Appliance</h3>
                <input
                    type="text"
                    name="name"
                    placeholder="Appliance Name"
                    value={newAppliance.name}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="power"
                    placeholder="Power (W)"
                    value={newAppliance.power}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="hoursPerDay"
                    placeholder="Hours per Day"
                    value={newAppliance.hoursPerDay}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="daysPerWeek"
                    placeholder="Days per Week"
                    value={newAppliance.daysPerWeek}
                    onChange={handleInputChange}
                />
                <button onClick={addAppliance}>Add Appliance</button>
                {error && <p className="error-message">{error}</p>}
            </div>
            <div className="appliance-list">
                <h3>Existing Appliances</h3>
                <ul>
                    {appliances.map((appliance, index) => (
                        <li key={index}>
                            {appliance.name} - {appliance.power}W, {appliance.hoursPerDay} hours/day, {appliance.daysPerWeek} days/week
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Step2_Appliance;
