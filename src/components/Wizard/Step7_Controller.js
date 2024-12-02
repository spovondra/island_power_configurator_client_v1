import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectContext } from '../../context/ProjectContext';
import { getSuitableControllers, selectController, getProjectController } from '../../services/ProjectService';
import './Step7_Controller.css';

const Step7_Controller = ({ onComplete }) => {
    const { t } = useTranslation('wizard');
    const { selectedProject } = useContext(ProjectContext);
    const [regulatorType, setRegulatorType] = useState('MPPT');
    const [selectedController, setSelectedController] = useState(null);
    const [controllers, setControllers] = useState([]);
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

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchControllers = async () => {
            if (!selectedProject) return;

            try {
                setIsLoading(true);
                const controllersData = await getSuitableControllers(selectedProject, regulatorType);
                setControllers(controllersData);
            } catch (error) {
                console.error('Error fetching controllers:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchControllers();
    }, [selectedProject, regulatorType]);

    useEffect(() => {
        const fetchControllerConfig = async () => {
            if (!selectedProject) return;

            try {
                const projectController = await getProjectController(selectedProject);
                if (projectController) {
                    setSelectedController(projectController.controllerId);
                    setRegulatorType(projectController.type || 'MPPT');
                    setControllerConfig({
                        requiredCurrent: projectController.requiredCurrent,
                        requiredPower: projectController.requiredPower,
                        valid: projectController.valid,
                        statusMessage: projectController.statusMessage,
                        adjustedVoc: projectController.adjustedOpenCircuitVoltage,
                        adjustedVmp: projectController.adjustedVoltageAtMaxPower,
                        maxModulesInSeries: projectController.maxModulesInSerial,
                        minModulesInSeries: projectController.minModulesInSerial,
                        seriesModules: projectController.seriesModules,
                        parallelModules: projectController.parallelModules,
                    });
                }
            } catch (error) {
                console.error('Error fetching controller configuration:', error);
            }
        };

        fetchControllerConfig();
    }, [selectedProject]);

    const handleControllerSelect = async (controllerId) => {
        try {
            const result = await selectController(selectedProject, controllerId, regulatorType);

            setSelectedController(controllerId);

            setControllerConfig({
                requiredCurrent: result.requiredCurrent || 0,
                requiredPower: result.requiredPower || 0,
                minModulesInSeries: result.minModulesInSerial || 0,
                maxModulesInSeries: result.maxModulesInSerial || 0,
                seriesModules: result.seriesModules || 0,
                parallelModules: result.parallelModules || 0,
                valid: result.valid || false,
                statusMessage: result.statusMessage || t('step7.error_generic'),
                adjustedVoc: result.adjustedOpenCircuitVoltage || 0,
                adjustedVmp: result.adjustedVoltageAtMaxPower || 0,
            });

            if (result.valid) {
                onComplete();
            }
        } catch (error) {
            console.error('Error selecting controller:', error);
        }
    };

    const handleRegulatorTypeChange = (type) => {
        setRegulatorType(type);
        setSelectedController(null);
        setControllerConfig(null);
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
                                        readOnly
                                    />
                                    <strong>{controller.name}</strong><br/>
                                    {t('step7.rated_power')}: {controller.ratedPower}W,{' '}
                                    {t('step7.max_voltage')}: {controller.maxVoltage}V,{' '}
                                    {t('step7.min_voltage')}: {controller.minVoltage}V,{' '}
                                    {t('step7.current_rating')}: {controller.currentRating}A
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
                    <b>{t('step7.adjusted_voc')}:</b> {controllerConfig?.adjustedVoc ? `${controllerConfig.adjustedVoc.toFixed(2)} V` : t('step7.not_calculated')}
                </p>
                <p>
                    <b>{t('step7.adjusted_vmp')}:</b> {controllerConfig?.adjustedVmp ? `${controllerConfig.adjustedVmp.toFixed(2)} V` : t('step7.not_calculated')}
                </p>
                <p>
                    <b>{t('step7.max_modules_in_series')}:</b> {controllerConfig?.maxModulesInSeries || t('step7.not_calculated')}
                </p>
                <p>
                    <b>{t('step7.min_modules_in_series')}:</b> {controllerConfig?.minModulesInSeries || t('step7.not_calculated')}
                </p>
                <p>
                    <b>{t('step7.panels_in_series')}:</b> {controllerConfig?.seriesModules || t('step7.not_calculated')}
                </p>
                <p>
                    <b>{t('step7.panels_in_parallel')}:</b> {controllerConfig?.parallelModules || t('step7.not_calculated')}
                </p>
                <p>
                    <b>{t('step7.required_current')}:</b> {controllerConfig?.requiredCurrent.toFixed(2)} A
                </p>
                <p>
                    <b>{t('step7.valid_configuration')}:</b> {controllerConfig?.valid ? t('step7.valid') : t('step7.invalid')}
                </p>
                <p>
                    <b>{t('step7.status_message')}:</b> {controllerConfig?.statusMessage || t('step7.not_calculated')}
                </p>
            </div>
        </div>
    );
};

export default Step7_Controller;
