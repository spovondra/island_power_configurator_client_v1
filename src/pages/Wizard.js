import React, { useState, useContext, useEffect } from 'react';
import { ProjectContext } from '../context/ProjectContext'; // Adjust path if needed
import Step1Introduction from '../components/Wizard/Step1_Introduction';
import Step2Appliance from '../components/Wizard/Step2_Appliance';
import Step3Location from '../components/Wizard/Step3_Location';
import FinalStep from '../components/Wizard/FinalStep';
import './Wizard.css';
import { useNavigate } from 'react-router-dom';

const steps = [
    { key: 'step1', label: 'Introduction', component: <Step1Introduction /> },
    { key: 'step2', label: 'Appliance', component: <Step2Appliance /> },
    { key: 'step3', label: 'Location', component: <Step3Location /> },
    { key: 'finalStep', label: 'Final Step', component: <FinalStep /> },
];

const Wizard = () => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const { selectedProject } = useContext(ProjectContext); // Using context
    const navigate = useNavigate();

    useEffect(() => {
        if (!selectedProject) {
            navigate('/projects'); // Redirect if no project is selected
        }
    }, [selectedProject, navigate]);

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
