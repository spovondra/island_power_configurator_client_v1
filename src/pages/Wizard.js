import React, { useEffect, useState, useContext } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import './Wizard.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProjectById, completeStep } from '../services/ProjectService';
import { useTranslation } from 'react-i18next';

import Step1Introduction from '../components/Wizard/Step1_Introduction';
import Step2Appliance from '../components/Wizard/Step2_Appliance';
import Step3Location from '../components/Wizard/Step3_Location';
import Step4TestCalc from '../components/Wizard/Step4_Inverter';
import Step6_SolarPanels from '../components/Wizard/Step6_SolarPanels';
import Step5_Batteries from '../components/Wizard/Step5_Batteries';
import Step7_Controller from '../components/Wizard/Step7_Controller';
import FinalStep from '../components/Wizard/FinalStep';

/**
 * Wizard component that guides users through a step-by-step project configuration process.
 *
 * @component
 * @returns {JSX.Element} The rendered Wizard component with a dynamic step navigation.
 */
const Wizard = () => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [lastCompletedStep, setLastCompletedStep] = useState(0);
    const [projectLoaded, setProjectLoaded] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [projectName, setProjectName] = useState('');
    const { selectedProject, setSelectedProject } = useContext(ProjectContext);
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    /**
     * Loads the selected project or initializes a new project if indicated.
     */
    useEffect(() => {
        const isNewProject = location.state?.isNewProject;

        if (selectedProject) {
            loadProject(selectedProject);
        } else if (isNewProject) {
            setProjectLoaded(true);
            setProjectName('');
        } else {
            navigate('/projects'); //redirect if no project is selected
        }
    }, [selectedProject, navigate, location]);

    /**
     * Fetches project data and sets up the wizard.
     *
     * @param {string} projectId - The ID of the project to load.
     */
    const loadProject = async (projectId) => {
        try {
            const project = await getProjectById(projectId);
            const completedStep = project.lastCompletedStep || 0;

            setLastCompletedStep(completedStep);
            setProjectName(project.name);
            setCurrentStepIndex(completedStep > 1 ? completedStep : 0);
            setProjectLoaded(true);
        } catch (error) {
            console.error('Error loading project:', error);
            navigate('/projects');
        }
    };

    /**
     * Marks the current step as complete and updates the backend.
     *
     * @param {number} stepIndex - The index of the step to mark as complete.
     */
    const handleStepComplete = async (stepIndex) => {
        try {
            await completeStep(selectedProject, stepIndex);
            setLastCompletedStep(stepIndex);
        } catch (error) {
            console.error('Error completing step:', error);
        }
    };

    /**
     * Advances to the next step in the wizard.
     */
    const handleNext = () => {
        if (currentStepIndex === steps.length - 1) {
            navigate('/projects'); //go back to project list from the final step
        } else if (currentStepIndex === 0) {
            if (selectedProject || projectName.length > 0) {
                setCurrentStepIndex((prevIndex) => prevIndex + 1);
            }
        } else if (editMode) {
            if (currentStepIndex <= lastCompletedStep) {
                setCurrentStepIndex((prevIndex) => prevIndex + 1);
            }
        } else if (currentStepIndex < lastCompletedStep) {
            setCurrentStepIndex((prevIndex) => prevIndex + 1);
        }
    };

    /**
     * Returns to the previous step in the wizard.
     */
    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex((prevIndex) => prevIndex - 1);
        }
    };

    /**
     * Navigates to the specified step if it is accessible.
     *
     * @param {number} index - The index of the step to navigate to.
     */
    const handleStepClick = (index) => {
        if (index <= lastCompletedStep || (index === 1 && (selectedProject || projectName.length > 0))) {
            setCurrentStepIndex(index);
        }
    };

    /**
     * Enables edit mode for the wizard.
     */
    const enableEditMode = () => {
        setEditMode(true);
    };

    const steps = [
        { key: 'step1', label: t('wizard.introduction'), component: Step1Introduction, onComplete: () => handleStepComplete(1) },
        { key: 'step2', label: t('wizard.appliance'), component: Step2Appliance, onComplete: () => handleStepComplete(2), enableEditMode },
        { key: 'step3', label: t('wizard.location'), component: Step3Location, onComplete: () => handleStepComplete(3), enableEditMode },
        { key: 'step4', label: t('wizard.inverter'), component: Step4TestCalc, onComplete: () => handleStepComplete(4), enableEditMode },
        { key: 'step5', label: t('wizard.batteries'), component: Step5_Batteries, onComplete: () => handleStepComplete(5), enableEditMode },
        { key: 'step6', label: t('wizard.solar_panels'), component: Step6_SolarPanels, onComplete: () => handleStepComplete(6), enableEditMode },
        { key: 'step7', label: t('wizard.controller'), component: Step7_Controller, onComplete: () => handleStepComplete(7), enableEditMode },
        { key: 'finalStep', label: t('wizard.final_step'), component: FinalStep },
    ];

    const CurrentStepComponent = steps[currentStepIndex].component;

    return (
        <div className="wizard-container">
            {projectLoaded || currentStepIndex === 0 ? (
                <>
                    <div className="wizard-steps">
                        <div className="wizard-steps-container">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className={`wizard-step 
                                        ${currentStepIndex === index
                                        ? 'active'
                                        : index < currentStepIndex
                                            ? 'done'
                                            : (index === 1 && (selectedProject || projectName.length > 0)) || index <= lastCompletedStep
                                                ? 'enabled'
                                                : 'disabled'
                                    }`}
                                    onClick={() => handleStepClick(index)}
                                >
                                    {step.label}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="wizard-content">
                        <CurrentStepComponent onComplete={steps[currentStepIndex].onComplete} enableEditMode={enableEditMode} />
                    </div>
                    <div className="wizard-buttons">
                        <button className="previous" onClick={handleBack} disabled={currentStepIndex === 0}>
                            {t('wizard.back')}
                        </button>
                        <button
                            className="next"
                            onClick={handleNext}
                            disabled={!(
                                (currentStepIndex === 0 && (selectedProject || projectName.length > 0)) ||
                                (currentStepIndex > 0 && currentStepIndex < lastCompletedStep) ||
                                (currentStepIndex === steps.length - 1)
                            )}
                        >
                            {currentStepIndex === steps.length - 1 ? t('wizard.finish') : t('wizard.next')}
                        </button>
                    </div>
                </>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default Wizard;
