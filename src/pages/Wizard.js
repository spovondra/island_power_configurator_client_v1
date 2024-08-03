// src/pages/Wizard.js
import React, { useState } from 'react';
import Step1 from '../components/wizard/Step1';
import Step2 from '../components/wizard/Step2';
import Step3 from '../components/wizard/Step3';
import FinalStep from '../components/wizard/FinalStep';
import './Wizard.css';

const steps = [
    { key: 'step1', label: 'Step 1', component: <Step1 /> },
    { key: 'step2', label: 'Step 2', component: <Step2 /> },
    { key: 'step3', label: 'Step 3', component: <Step3 /> },
    { key: 'finalStep', label: 'Final Step', component: <FinalStep /> },
];

const Wizard = () => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        } else {
            alert('You have completed all steps.');
        }
    };

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        }
    };

    return (
        <div className="wizard-container">
            <div className="wizard-steps">
                <ul className="wizard-steps-list">
                    {steps.map((step, index) => (
                        <li key={index} className={currentStepIndex === index ? 'active' : index < currentStepIndex ? 'done' : ''}>
                            <div>{step.label}</div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="wizard-content">
                {steps[currentStepIndex].component}
            </div>
            <div className="wizard-buttons">
                <button onClick={handleBack} disabled={currentStepIndex === 0}>Back</button>
                <button onClick={handleNext}>{currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}</button>
            </div>
        </div>
    );
};

export default Wizard;
