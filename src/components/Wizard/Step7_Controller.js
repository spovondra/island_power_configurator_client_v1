import React, { useEffect, useState, useContext } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { getSuitableControllers, selectController, getProjectController } from '../../services/ProjectService';
import { useTranslation } from 'react-i18next'; // Import translation hook
import './Step7_Controller.css'; // Import CSS styles

const Step7_Controller = () => {
    const { t } = useTranslation('wizard'); // Use translation for the wizard namespace
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
        adjustedVmp: 0,
        maxModulesInSeries: 0,
        minModulesInSeries: 0,
        panelsInSeries: 0,
        panelsInParallel: 0,
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
                        adjustedVoc: projectController.adjustedOpenCircuitVoltage || 0,
                        adjustedVmp: projectController.adjustedVoltageAtMaxPower || 0,
                        maxModulesInSeries: projectController.maxModulesInSerial || 0,
                        minModulesInSeries: projectController.minModulesInSerial || 0,
                        panelsInSeries: projectController.seriesModules || 0,
                        panelsInParallel: projectController.parallelModules || 0,
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
        <div className="step7-controller-configurator">
            <h2 className="step7-config-title">{t('step7.controller_configurator')}</h2>

            <div className="step7-regulator-type-selection">
                <h3>{t('step7.select_regulator_type')}</h3>
                <label>
                    <input
                        type="radio"
                        name="regulatorType"
                        value="PWM"
                        checked={regulatorType === 'PWM'}
                        onChange={() => handleRegulatorTypeChange('PWM')}
                    />
                    {t('step7.pwm')}
                </label>
                <label>
                    <input
                        type="radio"
                        name="regulatorType"
                        value="MPPT"
                        checked={regulatorType === 'MPPT'}
                        onChange={() => handleRegulatorTypeChange('MPPT')}
                    />
                    {t('step7.mppt')}
                </label>
            </div>

            <div className="step7-controller-selection">
                <h3>{t('step7.select_controller')}</h3>
                <div className="step7-controller-options">
                    {controllers.length === 0 ? (
                        <p>{t('step7.no_suitable_controllers')}</p>
                    ) : (
                        controllers.map((controller) => (
                            <label key={controller.id} className="step7-controller-option">
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

            <div className="step7-calculated-config">
                <h3>{t('step7.selected_regulator_details')}</h3>
                <p>
                    <b>{t('step7.name')}:</b> {selectedController ? controllers.find(ctrl => ctrl.id === selectedController)?.name : 'N/A'}
                </p>
                <p>
                    <b>{t('step7.rated_power')}:</b> {selectedController ? controllers.find(ctrl => ctrl.id === selectedController)?.ratedPower : 'N/A'} W
                </p>
                <p>
                    <b>{t('step7.max_voltage')}:</b> {selectedController ? controllers.find(ctrl => ctrl.id === selectedController)?.maxVoltage : 'N/A'} V
                </p>
                <p>
                    <b>{t('step7.min_voltage')}:</b> {selectedController ? controllers.find(ctrl => ctrl.id === selectedController)?.minVoltage : 'N/A'} V
                </p>
                <p>
                    <b>{t('step7.current_rating')}:</b> {selectedController ? controllers.find(ctrl => ctrl.id === selectedController)?.currentRating : 'N/A'} A
                </p>

                <h3>{t('step7.results')}</h3>
                <p><b>{t('step7.adjusted_voc')}:</b> {controllerConfig.adjustedVoc}</p>
                <p><b>{t('step7.adjusted_vmp')}:</b> {controllerConfig.adjustedVmp}</p>
                <p><b>{t('step7.max_modules_in_series')}:</b> {controllerConfig.maxModulesInSeries}</p>
                <p><b>{t('step7.min_modules_in_series')}:</b> {controllerConfig.minModulesInSeries}</p>
                <p><b>{t('step7.panels_in_series')}:</b> {controllerConfig.panelsInSeries}</p>
                <p><b>{t('step7.panels_in_parallel')}:</b> {controllerConfig.panelsInParallel}</p>
                <p>
                    <b>{t('step7.valid_configuration')}:</b> {controllerConfig.valid ? t('step7.valid') : t('step7.invalid')}
                </p>
            </div>
        </div>
    );
};

export default Step7_Controller;
