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
    const [projectLoaded, setProjectLoaded] = useState(false);  // Flag for loading project data
    const [editMode, setEditMode] = useState(false);  // Whether in edit mode or view mode
    const [projectName, setProjectName] = useState('');  // Track project name for validation
    const { selectedProject } = useContext(ProjectContext);  // Get the selected project from context
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (selectedProject) {  // Load project data
            loadProject(selectedProject);
        } else {
            // Redirect to project list if no project is selected
            navigate('/projects');
        }
    }, [selectedProject, navigate]);

    const loadProject = async (projectId) => {
        try {
            const project = await getProjectById(projectId);
            const completedStep = project.lastCompletedStep || 0;
            setLastCompletedStep(completedStep);  // Set last completed step
            setProjectName(project.name);  // Set the project name for validation
            console.log("Loaded lastCompletedStep:", completedStep);

            // Set current step based on last completed step
            setCurrentStepIndex(completedStep > 1 ? completedStep : 0);
            setProjectLoaded(true);
        } catch (error) {
            console.error('Error loading project:', error);
            // Handle error (e.g., redirect to project list if project loading fails)
            navigate('/projects');
        }
    };

    // Handle step completion
    const handleStepComplete = async (stepIndex) => {
        try {
            await completeStep(selectedProject, stepIndex);  // Send POST to backend
            setLastCompletedStep(stepIndex);  // Update the last completed step
        } catch (error) {
            console.error('Error completing step:', error);
        }
    };

    // Navigate to the next step
    const handleNext = () => {
        if (currentStepIndex === steps.length - 1) {
            navigate('/projects');  // On the final step, go back to project list
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

    // Navigate back to the previous step
    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex((prevIndex) => prevIndex - 1);
        }
    };

    // Handle clicking on a step
    const handleStepClick = (index) => {
        if (index <= lastCompletedStep || (index === 1 && (selectedProject || projectName.length > 0))) {
            setCurrentStepIndex(index);
        }
    };

    const enableEditMode = () => {
        setEditMode(true);  // Enable edit mode
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
                                (currentStepIndex > 0 && currentStepIndex < lastCompletedStep)  ||
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
