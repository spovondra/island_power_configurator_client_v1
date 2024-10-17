import React, { useEffect, useState, useContext } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import Step1Introduction from '../components/Wizard/Step1_Introduction';
import Step2Appliance from '../components/Wizard/Step2_Appliance';
import Step3Location from '../components/Wizard/Step3_Location';
import FinalStep from '../components/Wizard/FinalStep';
import './Wizard.css';
import { useNavigate } from 'react-router-dom';
import { getProjectById, completeStep } from '../services/ProjectService';
import Step4TestCalc from '../components/Wizard/Step4_Inverter';
import Step6_SolarPanels from '../components/Wizard/Step6_SolarPanels';
import Step5_Batteries from '../components/Wizard/Step5_Batteries';
import Step7_Controller from '../components/Wizard/Step7_Controller';
import { useTranslation } from 'react-i18next';

const Wizard = () => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);  // Current step
    const [lastCompletedStep, setLastCompletedStep] = useState(0);  // Last completed step
    const [projectLoaded, setProjectLoaded] = useState(true);  // Flag for loading project data (not required for step 1)
    const [editMode, setEditMode] = useState(false);  // Whether in edit mode or view mode
    const { selectedProject } = useContext(ProjectContext);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (selectedProject) {  // Load project data
            loadProject(selectedProject);
        }
    }, [selectedProject]);

    const loadProject = async (projectId) => {
        try {
            const project = await getProjectById(projectId);
            const completedStep = project.lastCompletedStep || 0;

            setLastCompletedStep(completedStep);  // Set last completed step
            console.log("Loaded lastCompletedStep:", completedStep);  // Log lastCompletedStep

            // If the lastCompletedStep is 0 or 1, start from step 1
            setCurrentStepIndex(completedStep > 1 ? completedStep : 0);
            setProjectLoaded(true);
        } catch (error) {
            console.error('Error loading project:', error);
        }
    };

    // When a step is completed, we only update the last completed step and don't move forward
    const handleStepComplete = async (stepIndex) => {
        try {
            await completeStep(selectedProject, stepIndex);  // Send POST to backend
            setLastCompletedStep(stepIndex);  // Update the last completed step
            console.log("Step completed. Updated lastCompletedStep:", stepIndex);  // Log step completion
        } catch (error) {
            console.error('Error completing step:', error);
        }
    };

    // Move to the next step, only if the step is completed or we're in view mode
    const handleNext = () => {
        if (currentStepIndex === steps.length - 1) {
            // On final step, navigate back to the projects list
            navigate('/projects');  // Adjust the route as necessary
        } else if (currentStepIndex === 0) {
            // Step 1: only proceed to step 2 without POST
            setCurrentStepIndex((prevIndex) => prevIndex + 1);
        } else if (editMode) {
            if (currentStepIndex <= lastCompletedStep) {
                setCurrentStepIndex((prevIndex) => prevIndex + 1);
            }
        } else if (currentStepIndex < lastCompletedStep) {
            setCurrentStepIndex((prevIndex) => prevIndex + 1);
        }
    };

    // Allow going back, but we can't go back to an unsaved step (in edit mode)
    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex((prevIndex) => prevIndex - 1);
        }
    };

    // Clicking a step: disable click unless the step is completed or we're in view mode
    const handleStepClick = (index) => {
        if (index <= lastCompletedStep) {
            setCurrentStepIndex(index);
        }
    };

    const enableEditMode = () => {
        setEditMode(true);  // Enable edit mode when any change is made in the project
    };

    const steps = [
        { key: 'step1', label: t('wizard.introduction'), component: Step1Introduction, onComplete: () => handleStepComplete(1) },  // Step 1 now properly calls handleStepComplete
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
            {projectLoaded || currentStepIndex === 0 ? (  // Allow navigating step 1 without "Loading" state
                <>
                    <div className="wizard-steps">
                        <div className="wizard-steps-container">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className={`wizard-step 
                                        ${currentStepIndex === index
                                        ? 'active'  // If the step is currently selected
                                        : index < currentStepIndex
                                            ? 'done'  // If the step is before the current one and was completed
                                            : index <= lastCompletedStep
                                                ? 'enabled'  // If the step is after the current but available
                                                : 'disabled'  // If the step is unavailable
                                    }`}
                                    onClick={() => handleStepClick(index)}  // Disable click if step is unavailable
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
                        <button className="next" onClick={handleNext}
                                disabled={currentStepIndex >= lastCompletedStep || currentStepIndex === steps.length - 1}>
                            {currentStepIndex === steps.length - 1 ? t('wizard.finish') : t('wizard.next')}
                        </button>
                    </div>
                </>
            ) : (
                <div>Loading...</div>  // "Loading" only displayed for steps after 1
            )}
        </div>
    );
};

export default Wizard;
