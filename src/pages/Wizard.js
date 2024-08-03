import React, { useState } from 'react';
import Step1Introduction from '../components/wizard/Step1_Introduction';
import Step2Appliance from '../components/wizard/Step2_Appliance';
import Step3Location from '../components/wizard/Step3_Location';
import FinalStep from '../components/wizard/FinalStep';
import './Wizard.css';

const steps = [
    { key: 'step1', label: 'Introduction', component: <Step1Introduction /> },
    { key: 'step2', label: 'Appliance', component: <Step2Appliance /> },
    { key: 'step3', label: 'Location', component: <Step3Location /> },
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

    const handleStepClick = (index) => {
        setCurrentStepIndex(index);
    };

    return (
        <div className="wizard-container">
            <div className="wizard-steps">
                <div className="wizard-steps-container">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`wizard-step ${currentStepIndex === index ? 'active' : index < currentStepIndex ? 'done' : ''}`}
                            onClick={() => handleStepClick(index)}
                        >
                            {step.label}
                        </div>
                    ))}
                </div>
            </div>
            <div className="wizard-content">
                {steps[currentStepIndex].component}
            </div>
            <div className="wizard-buttons">
                <button className="previous" onClick={handleBack} disabled={currentStepIndex === 0}>Back</button>
                <button className="next" onClick={handleNext}>{currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}</button>
            </div>
        </div>
    );
};

export default Wizard;
