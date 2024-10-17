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
    const [currentStepIndex, setCurrentStepIndex] = useState(0);  // Aktuální krok
    const [lastCompletedStep, setLastCompletedStep] = useState(0);  // Poslední dokončený krok
    const [projectLoaded, setProjectLoaded] = useState(true);  // Stav pro načtení projektu (pro krok 1 není potřeba načítat)
    const [editMode, setEditMode] = useState(false);  // Zda je mód úprav nebo prohlížení
    const { selectedProject } = useContext(ProjectContext);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        if (selectedProject && currentStepIndex > 0) {  // Načíst data projektu od kroku 2 dále
            loadProject(selectedProject);
        }
    }, [selectedProject]);

    const loadProject = async (projectId) => {
        try {
            const project = await getProjectById(projectId);
            setLastCompletedStep(project.lastCompletedStep || 0);  // Nastavit poslední dokončený krok
            setCurrentStepIndex(project.lastCompletedStep || 1);  // Nastavit aktuální krok (začíná od kroku 2)
            setProjectLoaded(true);
        } catch (error) {
            console.error('Error loading project:', error);
        }
    };

    // Když je krok dokončen (provádí POST)
    const handleStepComplete = async (stepIndex) => {
        try {
            await completeStep(selectedProject, stepIndex);  // Odeslat POST na backend
            setLastCompletedStep(stepIndex);  // Aktualizovat stav dokončeného kroku
            setCurrentStepIndex(stepIndex + 1);  // Posunout se na další krok
        } catch (error) {
            console.error('Error completing step:', error);
        }
    };

    // Přejít na další krok, jen pokud je krok dokončen nebo jsme v módu prohlížení
    const handleNext = () => {
        if (currentStepIndex === 0) {
            // Krok 1: pouze přechod na krok 2 bez POST
            setCurrentStepIndex((prevIndex) => prevIndex + 1);
        } else if (editMode) {
            if (currentStepIndex <= lastCompletedStep) {
                setCurrentStepIndex((prevIndex) => prevIndex + 1);
            }
        } else {
            setCurrentStepIndex((prevIndex) => prevIndex + 1);
        }
    };

    // Umožní se vrátit zpět, ale nemůžeme jít zpět do neuloženého kroku (v módu úprav)
    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex((prevIndex) => prevIndex - 1);
        }
    };

    // Kliknutí na krok: pokud upravujeme, musíme se držet jen kroků, které byly dokončeny
    const handleStepClick = (index) => {
        if (index === 0 || !editMode || index <= lastCompletedStep) {
            setCurrentStepIndex(index);
        }
    };

    const enableEditMode = () => {
        setEditMode(true);  // Zapneme mód úprav, když se provede jakákoli změna v projektu
    };

    const steps = [
        { key: 'step1', label: t('wizard.introduction'), component: Step1Introduction },  // Krok 1 je vždy dostupný
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
            {projectLoaded || currentStepIndex === 0 ? (  // Umožňuje procházet krok 1 bez "Loading"
                <>
                    <div className="wizard-steps">
                        <div className="wizard-steps-container">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className={`wizard-step ${currentStepIndex === index ? 'active' : index <= lastCompletedStep || index === 0 ? 'done' : 'disabled'}`}
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
                        <button className="next" onClick={handleNext} disabled={currentStepIndex > lastCompletedStep && editMode}>
                            {currentStepIndex === steps.length - 1 ? t('wizard.finish') : t('wizard.next')}
                        </button>
                    </div>
                </>
            ) : (
                <div>Loading...</div>  // Načítání se zobrazí jen pro kroky 2 a dále
            )}
        </div>
    );
};

export default Wizard;
