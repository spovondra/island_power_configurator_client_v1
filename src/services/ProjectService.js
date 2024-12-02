import apiClient from './apiClient';
import { API_PROJECT_URL } from '../config';

/**
 * project service module
 *
 * @module ProjectService
 */

/**
 * fetches all projects
 *
 * @async
 * @function getAllProjects
 * @memberof module:ProjectService
 * @returns {Promise<object[]>} list of all projects
 * @throws {Error} if the API request fails
 */
export const getAllProjects = async () => {
    try {
        const response = await apiClient.get(API_PROJECT_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * fetches a specific project by its ID
 *
 * @async
 * @function getProjectById
 * @memberof module:ProjectService
 * @param {string} projectId - unique identifier of the project
 * @returns {Promise<object>} details of the requested project
 * @throws {Error} if the API request fails
 */
export const getProjectById = async (projectId) => {
    try {
        const response = await apiClient.get(`${API_PROJECT_URL}/${projectId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * marks a step as completed for the given project
 *
 * @async
 * @function completeStep
 * @memberof module:ProjectService
 * @param {string} projectId - unique identifier of the project
 * @param {number} step - step number to mark as completed
 * @returns {Promise<void>}
 * @throws {Error} if the API request fails
 */
export const completeStep = async (projectId, step) => {
    try {
        await apiClient.post(`${API_PROJECT_URL}/${projectId}/complete-step`, null, {
            params: { step }
        });
    } catch (error) {
        throw error;
    }
};

/**
 * creates a new project
 *
 * @async
 * @function createProject
 * @memberof module:ProjectService
 * @param {object} project - details of the new project
 * @returns {Promise<object>} the newly created project
 * @throws {Error} if the API request fails
 */
export const createProject = async (project) => {
    try {
        const response = await apiClient.post(API_PROJECT_URL, project);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * updates an existing project
 *
 * @async
 * @function updateProject
 * @memberof module:ProjectService
 * @param {string} projectId - unique identifier of the project
 * @param {object} project - updated project details
 * @returns {Promise<object>} the updated project
 * @throws {Error} if the API request fails
 */
export const updateProject = async (projectId, project) => {
    try {
        const response = await apiClient.put(`${API_PROJECT_URL}/${projectId}`, project);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * deletes a project by its ID
 *
 * @async
 * @function deleteProject
 * @memberof module:ProjectService
 * @param {string} projectId - unique identifier of the project to delete
 * @returns {Promise<void>}
 * @throws {Error} if the API request fails
 */
export const deleteProject = async (projectId) => {
    try {
        await apiClient.delete(`${API_PROJECT_URL}/${projectId}`);
    } catch (error) {
        throw error;
    }
};

/**
 * fetches all projects belonging to the logged-in user
 *
 * @async
 * @function getUserProjects
 * @memberof module:ProjectService
 * @returns {Promise<object[]>} list of the user's projects
 * @throws {Error} if the API request fails
 */
export const getUserProjects = async () => {
    try {
        const response = await apiClient.get(`${API_PROJECT_URL}/user-projects`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * adds or updates an appliance in a project
 *
 * @async
 * @function addOrUpdateAppliance
 * @memberof module:ProjectService
 * @param {string} projectId - unique identifier of the project
 * @param {object} appliance - details of the appliance to add or update
 * @returns {Promise<object>} updated project with the appliance changes
 * @throws {Error} if the API request fails
 */
export const addOrUpdateAppliance = async (projectId, appliance) => {
    if (!projectId) {
        throw new Error('Project ID is required');
    }
    try {
        const response = await apiClient.post(`${API_PROJECT_URL}/${projectId}/appliances`, appliance);
        return response.data;
    } catch (error) {
        console.error('Error adding/updating appliance:', error);
        throw error;
    }
};

/**
 * deletes an appliance from a project
 *
 * @async
 * @function deleteAppliance
 * @memberof module:ProjectService
 * @param {string} projectId - unique identifier of the project
 * @param {string} applianceId - unique identifier of the appliance to delete
 * @returns {Promise<void>}
 * @throws {Error} if the API request fails
 */
export const deleteAppliance = async (projectId, applianceId) => {
    try {
        await apiClient.delete(`${API_PROJECT_URL}/${projectId}/appliances/${applianceId}`);
    } catch (error) {
        throw error;
    }
};

/**
 * fetches the system and recommended voltage for the given project
 *
 * @async
 * @function getVoltage
 * @memberof module:ProjectService
 * @param {string} projectId - unique identifier of the project
 * @returns {Promise<object>} voltage details
 * @throws {Error} if the API request fails
 */
export const getVoltage = async (projectId) => {
    try {
        const response = await apiClient.get(`${API_PROJECT_URL}/${projectId}/inverters/voltage`);
        return response.data;
    } catch (error) {
        console.error('Error fetching voltages:', error);
        throw error;
    }
};

/**
 * fetches suitable inverters for a project
 *
 * @async
 * @function getSuitableInverters
 * @memberof module:ProjectService
 * @param {string} projectId - unique identifier of the project
 * @param {number} systemVoltage - the system voltage
 * @param {number} temperature - the installation temperature
 * @returns {Promise<object[]>} list of suitable inverters
 * @throws {Error} if the API request fails
 */
export const getSuitableInverters = async (projectId, systemVoltage, temperature) => {
    try {
        const response = await apiClient.get(`${API_PROJECT_URL}/${projectId}/inverters/suitable`, {
            params: {
                systemVoltage,
                temperature
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching suitable inverters:', error);
        throw error;
    }
};

/**
 * selects an inverter for the project
 *
 * @async
 * @function selectInverter
 * @memberof module:ProjectService
 * @param {string} projectId - unique identifier of the project
 * @param {string} inverterId - unique identifier of the inverter to select
 * @returns {Promise<object>} updated project configuration
 * @throws {Error} if the API request fails
 */
export const selectInverter = async (projectId, inverterId) => {
    try {
        const response = await apiClient.post(`${API_PROJECT_URL}/${projectId}/inverters/select-inverter/${inverterId}`);
        return response.data;
    } catch (error) {
        console.error('Error selecting inverter:', error);
        throw error;
    }
};

/**
 * fetches the details of the currently configured inverter for a project
 *
 * @async
 * @function getProjectInverter
 * @memberof module:ProjectService
 * @param {string} projectId - unique identifier of the project
 * @returns {Promise<object>} details of the configured inverter
 * @throws {Error} if the API request fails
 */
export const getProjectInverter = async (projectId) => {
    try {
        const response = await apiClient.get(`${API_PROJECT_URL}/${projectId}/inverters`);
        return response.data;
    } catch (error) {
        console.error('Error fetching project inverter:', error);
        throw error;
    }
};

/**
 * processes location data and stores it in the project
 *
 * @async
 * @function processLocationData
 * @memberof module:ProjectService
 * @param {string} projectId - unique identifier of the project
 * @param {number} latitude - geographic latitude of the location
 * @param {number} longitude - geographic longitude of the location
 * @param {number} angle - tilt angle of the solar panels
 * @param {number} aspect - azimuth angle of the solar panels
 * @param {boolean} useOptimalValues - whether to use optimal values for calculations
 * @returns {Promise<object>} processed location data
 * @throws {Error} if the API request fails
 */
export const processLocationData = async (projectId, latitude, longitude, angle, aspect, useOptimalValues) => {
    try {
        const url = `${API_PROJECT_URL}/${projectId}/location/process?latitude=${latitude}&longitude=${longitude}&angle=${angle}&aspect=${aspect}&useOptimalValues=${useOptimalValues}`;
        const response = await apiClient.post(url);
        return response.data;
    } catch (error) {
        console.error('Error processing location data:', error);
        throw error;
    }
};

/**
 * loads processed site data for the project
 *
 * @async
 * @function loadSiteData
 * @memberof module:ProjectService
 * @param {string} projectId - unique identifier of the project
 * @returns {Promise<object>} site data
 * @throws {Error} if the API request fails
 */
export const loadSiteData = async (projectId) => {
    try {
        const response = await apiClient.get(`${API_PROJECT_URL}/${projectId}/location/sites`);
        return response.data;
    } catch (error) {
        console.error('Error loading site data:', error);
        throw error;
    }
};

/**
 * fetches all batteries for the project based on technology
 *
 * @async
 * @function getBatteries
 * @memberof module:ProjectService
 * @param {string} projectId - unique identifier of the project
 * @param {string} technology - type of battery technology (e.g., Li-ion, Lead Acid)
 * @returns {Promise<object[]>} list of suitable batteries
 * @throws {Error} if the API request fails
 */
export const getBatteries = async (projectId, technology) => {
    try {
        const response = await apiClient.get(`${API_PROJECT_URL}/${projectId}/batteries/suitable?technology=${technology}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching batteries:', error);
        throw error;
    }
};

/**
 * selects a battery for the project and configures it
 *
 * @async
 * @function selectBattery
 * @memberof module:ProjectService
 * @param {string} projectId - unique identifier of the project
 * @param {object} params - configuration parameters
 * @param {string} params.batteryId - unique identifier of the selected battery
 * @param {number} params.temperature - operating temperature
 * @param {number} params.autonomyDays - number of autonomy days
 * @returns {Promise<object>} configuration results
 * @throws {Error} if the API request fails
 */
export const selectBattery = async (projectId, params) => {
    try {
        const { batteryId, temperature, autonomyDays } = params;
        const response = await apiClient.post(
            `${API_PROJECT_URL}/${projectId}/batteries/select-battery/${batteryId}?temperature=${temperature}&autonomyDays=${autonomyDays}`,
            {}
        );
        return response.data;
    } catch (error) {
        console.error('Error calculating battery configuration:', error);
        throw error;
    }
};

/**
 * fetches the currently configured battery for the project
 *
 * @async
 * @function getProjectBattery
 * @memberof module:ProjectService
 * @param {string} projectId - unique identifier of the project
 * @returns {Promise<object>} battery configuration details
 * @throws {Error} if the API request fails
 */
export const getProjectBattery = async (projectId) => {
    try {
        const response = await apiClient.get(`${API_PROJECT_URL}/${projectId}/batteries/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching project battery:', error);
        throw error;
    }
};

/**
 * fetches suitable solar panels for the project
 *
 * @async
 * @function getSolarPanels
 * @memberof module:ProjectService
 * @param {string} projectId - unique identifier of the project
 * @returns {Promise<object[]>} list of suitable solar panels
 * @throws {Error} if the API request fails
 */
export const getSolarPanels = async (projectId) => {
    try {
        const response = await apiClient.get(`${API_PROJECT_URL}/${projectId}/solar-panels/suitable`);
        return response.data;
    } catch (error) {
        console.error('Error fetching solar panels:', error);
        throw error;
    }
};

/**
 * selects a solar panel for the project
 *
 * @async
 * @function selectSolarPanel
 * @memberof module:ProjectService
 * @param {string} projectId - unique identifier of the project
 * @param {object} requestBody - configuration data for the solar panel
 * @returns {Promise<object>} solar panel configuration results
 * @throws {Error} if the API request fails
 */
export const selectSolarPanel = async (projectId, requestBody) => {
    try {
        const response = await apiClient.post(`${API_PROJECT_URL}/${projectId}/solar-panels/select`, requestBody);
        return response.data;
    } catch (error) {
        console.error('Error selecting solar panel:', error);
        throw error;
    }
};

/**
 * fetches the currently configured solar panel for the project
 *
 * @async
 * @function getProjectSolarPanel
 * @memberof module:ProjectService
 * @param {string} projectId - unique identifier of the project
 * @returns {Promise<object>} solar panel configuration details
 * @throws {Error} if the API request fails
 */
export const getProjectSolarPanel = async (projectId) => {
    try {
        const response = await apiClient.get(`${API_PROJECT_URL}/${projectId}/solar-panels`);
        return response.data;
    } catch (error) {
        console.error('Error fetching project solar panel configuration:', error);
        throw error;
    }
};

/**
 * fetches suitable controllers based on regulator type
 *
 * @async
 * @function getSuitableControllers
 * @memberof module:ProjectService
 * @param {string} projectId - unique identifier of the project
 * @param {string} regulatorType - type of regulator (PWM or MPPT)
 * @returns {Promise<object[]>} list of suitable controllers
 * @throws {Error} if the API request fails
 */
export const getSuitableControllers = async (projectId, regulatorType) => {
    try {
        const response = await apiClient.get(`${API_PROJECT_URL}/${projectId}/controller/suitable`, {
            params: { regulatorType },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching suitable controllers:', error);
        throw error;
    }
};

/**
 * selects a controller for the project
 *
 * @async
 * @function selectController
 * @memberof module:ProjectService
 * @param {string} projectId - unique identifier of the project
 * @param {string} controllerId - unique identifier of the controller
 * @param {string} regulatorType - type of regulator (PWM or MPPT)
 * @returns {Promise<object>} controller configuration results
 * @throws {Error} if the API request fails
 */
export const selectController = async (projectId, controllerId, regulatorType) => {
    try {
        const response = await apiClient.post(`${API_PROJECT_URL}/${projectId}/controller/select`, null, {
            params: { controllerId, regulatorType },
        });
        return response.data;
    } catch (error) {
        console.error('Error selecting controller:', error);
        throw error;
    }
};

/**
 * fetches the currently configured controller for the project
 *
 * @async
 * @function getProjectController
 * @memberof module:ProjectService
 * @param {string} projectId - unique identifier of the project
 * @returns {Promise<object>} controller configuration details
 * @throws {Error} if the API request fails
 */
export const getProjectController = async (projectId) => {
    try {
        const response = await apiClient.get(`${API_PROJECT_URL}/${projectId}/controller`);
        return response.data;
    } catch (error) {
        console.error('Error fetching project controller configuration:', error);
        throw error;
    }
};

/**
 * fetches the summary of the project configuration
 *
 * @async
 * @function getProjectSummary
 * @memberof module:ProjectService
 * @param {string} projectId - unique identifier of the project
 * @returns {Promise<object>} project summary
 * @throws {Error} if the API request fails
 */
export const getProjectSummary = async (projectId) => {
    try {
        const response = await apiClient.get(`${API_PROJECT_URL}/${projectId}/summary`);
        return response.data;
    } catch (error) {
        console.error('Error fetching project summary:', error);
        throw error;
    }
};
