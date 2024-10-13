import React, { useEffect, useState, useContext } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { getSuitableControllers, selectController, getProjectController } from '../../services/ProjectService';
import './Step7_Controller.css';

const Step7_Controller = () => {
    const { selectedProject } = useContext(ProjectContext);
    const [selectedController, setSelectedController] = useState(null);
    const [controllers, setControllers] = useState([]);
    const [regulatorType, setRegulatorType] = useState('MPPT'); // Default to MPPT
    const [controllerConfig, setControllerConfig] = useState({
        requiredCurrent: 0,
        requiredPower: 0,
        seriesModules: 0,
        parallelModules: 0,
        valid: false,
        adjustedVoc: 0,
        adjustedVmp: 0
    });
    const [initialLoad, setInitialLoad] = useState(true);
    const [hasChanged, setHasChanged] = useState(false);

    useEffect(() => {
        if (!selectedProject) return;

        const fetchControllers = async () => {
            try {
                const controllersData = await getSuitableControllers(selectedProject, regulatorType);
                setControllers(controllersData);
            } catch (error) {
                console.error('Error fetching suitable controllers:', error);
            }
        };

        const fetchControllerConfig = async () => {
            try {
                const projectController = await getProjectController(selectedProject);
                if (projectController) {
                    setSelectedController(projectController.controllerId);
                    setControllerConfig({
                        requiredCurrent: projectController.requiredCurrent,
                        requiredPower: projectController.requiredPower,
                        seriesModules: projectController.seriesModules,
                        parallelModules: projectController.parallelModules,
                        valid: projectController.valid,
                        adjustedVoc: projectController.adjustedVoc || 0,
                        adjustedVmp: projectController.adjustedVmp || 0,
                    });
                }
            } catch (error) {
                console.error('Error fetching project controller configuration:', error);
            } finally {
                setInitialLoad(false);
            }
        };

        fetchControllers();
        fetchControllerConfig();
    }, [selectedProject, regulatorType]);

    useEffect(() => {
        if (!initialLoad && hasChanged) {
            sendUpdatedControllerConfig();
        }
    }, [selectedController]);

    const sendUpdatedControllerConfig = async () => {
        try {
            const result = await selectController(selectedProject, selectedController);
            setControllerConfig(result);
        } catch (error) {
            console.error('Error selecting controller:', error);
        }
    };

    const handleControllerSelect = (controllerId) => {
        setHasChanged(true);
        setSelectedController(controllerId);
    };

    const handleRegulatorTypeChange = (type) => {
        setHasChanged(true);
        setRegulatorType(type);
    };

    return (
        <div className="controller-configurator">
            <h2 className="config-title">Controller Configurator</h2>

            <div className="regulator-type-selection">
                <h3>Select Regulator Type</h3>
                <label>
                    <input
                        type="radio"
                        name="regulatorType"
                        value="PWM"
                        checked={regulatorType === 'PWM'}
                        onChange={() => handleRegulatorTypeChange('PWM')}
                    />
                    PWM
                </label>
                <label>
                    <input
                        type="radio"
                        name="regulatorType"
                        value="MPPT"
                        checked={regulatorType === 'MPPT'}
                        onChange={() => handleRegulatorTypeChange('MPPT')}
                    />
                    MPPT
                </label>
            </div>

            <div className="controller-selection">
                <h3>Select Controller</h3>
                <div className="controller-options">
                    {controllers.length === 0 ? (
                        <p>No suitable controllers available</p>
                    ) : (
                        controllers.map((controller) => (
                            <label key={controller.id} className="controller-option">
                                <input
                                    type="radio"
                                    name="controller"
                                    checked={selectedController === controller.id}
                                    onChange={() => handleControllerSelect(controller.id)}
                                />
                                {`${controller.name} - Rated Power: ${controller.ratedPower}W`}
                            </label>
                        ))
                    )}
                </div>
            </div>

            <div className="calculated-config">
                <h3>Selected Regulator Details</h3>
                <p><b>Name:</b> {selectedController ? controllers.find(ctrl => ctrl.id === selectedController)?.name : 'N/A'}</p>
                <p><b>Rated Power:</b> {selectedController ? controllers.find(ctrl => ctrl.id === selectedController)?.ratedPower : 'N/A'} W</p>
                <p><b>Max Voltage:</b> {selectedController ? controllers.find(ctrl => ctrl.id === selectedController)?.maxVoltage : 'N/A'} V</p>
                <p><b>Min Voltage:</b> {selectedController ? controllers.find(ctrl => ctrl.id === selectedController)?.minVoltage : 'N/A'} V</p>
                <p><b>Current Rating:</b> {selectedController ? controllers.find(ctrl => ctrl.id === selectedController)?.currentRating : 'N/A'} A</p>

                <h3>Results</h3>
                <p><b>Adjusted Open-Circuit Voltage (Voc adjusted) [V]:</b> {controllerConfig.adjustedVoc ? controllerConfig.adjustedVoc.toFixed(2) : 'N/A'}</p>
                <p><b>Adjusted Voltage at Maximum Power (Vmp adjusted) [V]:</b> {controllerConfig.adjustedVmp ? controllerConfig.adjustedVmp.toFixed(2) : 'N/A'}</p>
                <p><b>Series Modules:</b> {controllerConfig.seriesModules}</p>
                <p><b>Parallel Modules:</b> {controllerConfig.parallelModules}</p>
                <p><b>Valid Configuration:</b> {controllerConfig.valid ? 'Yes' : 'No'}</p>
            </div>
        </div>
    );
};

export default Step7_Controller;
