import React, { useState, useContext, useEffect } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import Step1Introduction from '../components/Wizard/Step1_Introduction';
import Step2Appliance from '../components/Wizard/Step2_Appliance';
import Step3Location from '../components/Wizard/Step3_Location';
import FinalStep from '../components/Wizard/FinalStep';
import './Wizard.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProjectById } from '../services/ProjectService';
import Step4_TestCalc from "../components/Wizard/Step4_TestCalc";

const steps = [
    { key: 'step1', label: 'Introduction', component: Step1Introduction },
    { key: 'step2', label: 'Appliance', component: Step2Appliance },
    { key: 'step3', label: 'Location', component: Step3Location },
    { key: 'step4', label: 'Calculation Test', component: Step4_TestCalc },
    { key: 'finalStep', label: 'Final Step', component: FinalStep },
];

const Wizard = () => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [projectName, setProjectName] = useState('');
    const [formData, setFormData] = useState({});
    const { selectedProject, setSelectedProject } = useContext(ProjectContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isNewProject, setIsNewProject] = useState(false);

    useEffect(() => {
        if (location.state && location.state.isNewProject) {
            setIsNewProject(true);
        } else if (!selectedProject && !isNewProject) {
            navigate('/projects'); // Redirect if no project is selected and not creating a new one
        } else if (selectedProject) {
            // Load the existing project data
            const fetchProjectData = async () => {
                try {
                    const data = await getProjectById(selectedProject);
                    setFormData(data);
                    setProjectName(data.name || '');
                } catch (error) {
                    console.error('Error fetching project data:', error);
                }
            };
            fetchProjectData();
        }
    }, [location.state, selectedProject, isNewProject, navigate]);

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        } else {
            navigate('/projects');
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

    const handleFormDataChange = (newFormData) => {
        setFormData(prevData => ({ ...prevData, ...newFormData }));
    };

    const CurrentStepComponent = steps[currentStepIndex].component;

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
                <CurrentStepComponent
                    projectName={projectName}
                    onFormDataChange={handleFormDataChange}
                />
            </div>
            <div className="wizard-buttons">
                <button className="previous" onClick={handleBack} disabled={currentStepIndex === 0}>Back</button>
                <button className="next" onClick={handleNext}>
                    {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
                </button>
            </div>
        </div>
    );
};

export default Wizard;
