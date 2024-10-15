import { useState, useContext, useEffect } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import Step1Introduction from '../components/Wizard/Step1_Introduction';
import Step2Appliance from '../components/Wizard/Step2_Appliance';
import Step3Location from '../components/Wizard/Step3_Location';
import FinalStep from '../components/Wizard/FinalStep';
import './Wizard.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProjectById } from '../services/ProjectService';
import Step4TestCalc from "../components/Wizard/Step4_Inverter";
import Step6_SolarPanels from "../components/Wizard/Step6_SolarPanels";
import Step5_Batteries from "../components/Wizard/Step5_Batteries";
import Step7_Controller from "../components/Wizard/Step7_Controller";
import { useTranslation } from 'react-i18next';  // Import useTranslation

const Wizard = () => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [projectName, setProjectName] = useState('');
    const { selectedProject } = useContext(ProjectContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isNewProject, setIsNewProject] = useState(false);
    const { t } = useTranslation();  // Initialize translation hook

    const steps = [
        { key: 'step1', label: t('wizard.introduction'), component: Step1Introduction },
        { key: 'step2', label: t('wizard.appliance'), component: Step2Appliance },
        { key: 'step3', label: t('wizard.location'), component: Step3Location },
        { key: 'step4', label: t('wizard.inverter'), component: Step4TestCalc },
        { key: 'step5', label: t('wizard.batteries'), component: Step5_Batteries },
        { key: 'step6', label: t('wizard.solar_panels'), component: Step6_SolarPanels },
        { key: 'step7', label: t('wizard.controller'), component: Step7_Controller },
        { key: 'finalStep', label: t('wizard.final_step'), component: FinalStep },
    ];

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
                <CurrentStepComponent />
            </div>
            <div className="wizard-buttons">
                <button className="previous" onClick={handleBack} disabled={currentStepIndex === 0}>
                    {t('wizard.back')}
                </button>
                <button className="next" onClick={handleNext}>
                    {currentStepIndex === steps.length - 1 ? t('wizard.finish') : t('wizard.next')}
                </button>
            </div>
        </div>
    );
};

export default Wizard;
