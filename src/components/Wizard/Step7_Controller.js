import React, { useEffect, useState, useContext } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import { getSuitableControllers, selectController, getProjectController } from '../../services/ProjectService';
import { useTranslation } from 'react-i18next';
import './Step7_Controller.css';

const Step7_Controller = ({ onComplete }) => {
    const { t } = useTranslation('wizard');
    const { selectedProject } = useContext(ProjectContext);
    const [selectedController, setSelectedController] = useState(null);
    const [controllers, setControllers] = useState([]);
    const [regulatorType, setRegulatorType] = useState('MPPT');
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
                        requiredCurrent: projectController.requiredCurrent || 0,
                        requiredPower: projectController.requiredPower || 0,
                        seriesModules: projectController.seriesModules || 0,
                        parallelModules: projectController.parallelModules || 0,
                        valid: projectController.valid || false,
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
            }
        };

        fetchControllers();
        fetchControllerConfig();
    }, [selectedProject, regulatorType]);

    const handleControllerSelect = async (controllerId) => {
        setSelectedController(controllerId);

        try {
            const result = await selectController(selectedProject, controllerId, regulatorType);
            setControllerConfig({
                requiredCurrent: result.requiredCurrent || 0,
                requiredPower: result.requiredPower || 0,
                seriesModules: result.seriesModules || 0,
                parallelModules: result.parallelModules || 0,
                valid: result.valid || false,
                adjustedVoc: result.adjustedOpenCircuitVoltage || 0,
                adjustedVmp: result.adjustedVoltageAtMaxPower || 0,
                maxModulesInSeries: result.maxModulesInSerial || 0,
                minModulesInSeries: result.minModulesInSerial || 0,
                panelsInSeries: result.seriesModules || 0,
                panelsInParallel: result.parallelModules || 0,
            });
            onComplete();
        } catch (error) {
            console.error('Error selecting controller:', error);
        }
    };

    const handleRegulatorTypeChange = (type) => {
        setRegulatorType(type);
    };

    const selectedControllerDetails = controllers.find(ctrl => ctrl.id === selectedController);

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
                            <div
                                key={controller.id}
                                className={`step7-controller-option ${selectedController === controller.id ? 'selected' : ''}`}
                                onClick={() => handleControllerSelect(controller.id)}
                            >
                                <label>
                                    <input
                                        type="radio"
                                        name="controller"
                                        checked={selectedController === controller.id}
                                        onChange={() => handleControllerSelect(controller.id)}
                                    />
                                    {`${controller.name} - Rated Power: ${controller.ratedPower}W`}
                                </label>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="step7-calculated-config">
                <h3>{t('step7.selected_regulator_details')}</h3>
                <p>
                    <b>{t('step7.name')}:</b> {selectedControllerDetails?.name || t('step7.not_calculated')}
                </p>
                <p>
                    <b>{t('step7.rated_power')}:</b> {selectedControllerDetails?.ratedPower || t('step7.not_calculated')} W
                </p>
                <p>
                    <b>{t('step7.max_voltage')}:</b> {selectedControllerDetails?.maxVoltage || t('step7.not_calculated')} V
                </p>
                <p>
                    <b>{t('step7.min_voltage')}:</b> {selectedControllerDetails?.minVoltage || t('step7.not_calculated')} V
                </p>
                <p>
                    <b>{t('step7.current_rating')}:</b> {selectedControllerDetails?.currentRating || t('step7.not_calculated')} A
                </p>

                <h3>{t('step7.results')}</h3>
                <p>
                    <b>{t('step7.adjusted_voc')}:</b> {controllerConfig.adjustedVoc ? `${controllerConfig.adjustedVoc.toFixed(2)} V` : t('step7.not_calculated')}
                </p>
                <p>
                    <b>{t('step7.adjusted_vmp')}:</b> {controllerConfig.adjustedVmp ? `${controllerConfig.adjustedVmp.toFixed(2)} V` : t('step7.not_calculated')}
                </p>
                <p>
                    <b>{t('step7.max_modules_in_series')}:</b> {controllerConfig.maxModulesInSeries || t('step7.not_calculated')}
                </p>
                <p>
                    <b>{t('step7.min_modules_in_series')}:</b> {controllerConfig.minModulesInSeries || t('step7.not_calculated')}
                </p>
                <p>
                    <b>{t('step7.panels_in_series')}:</b> {controllerConfig.panelsInSeries || t('step7.not_calculated')}
                </p>
                <p>
                    <b>{t('step7.panels_in_parallel')}:</b> {controllerConfig.panelsInParallel || t('step7.not_calculated')}
                </p>
                <p>
                    <b>{t('step7.valid_configuration')}:</b> {controllerConfig.valid ? t('step7.valid') : t('step7.invalid')}
                </p>
            </div>
        </div>
    );
};

export default Step7_Controller;
