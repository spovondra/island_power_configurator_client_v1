import apiClient from './apiClient';
import { API_PROJECT_URL } from '../config';

// Fetch all projects
export const getAllProjects = async () => {
    try {
        const response = await apiClient.get(API_PROJECT_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Fetch a project by ID
export const getProjectById = async (projectId) => {
    try {
        const response = await apiClient.get(`${API_PROJECT_URL}/${projectId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Create a new project
export const createProject = async (project) => {
    try {
        const response = await apiClient.post(API_PROJECT_URL, project);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update an existing project
export const updateProject = async (projectId, project) => {
    try {
        const response = await apiClient.put(`${API_PROJECT_URL}/${projectId}`, project);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete a project
export const deleteProject = async (projectId) => {
    try {
        await apiClient.delete(`${API_PROJECT_URL}/${projectId}`);
    } catch (error) {
        throw error;
    }
};

// Fetch projects specific to the logged-in user
export const getUserProjects = async () => {
    try {
        const response = await apiClient.get(`${API_PROJECT_URL}/user-projects`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Add or update an appliance in a project
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

export const deleteAppliance = async (projectId, applianceId) => {
    try {
        await apiClient.delete(`${API_PROJECT_URL}/${projectId}/appliances/${applianceId}`);
    } catch (error) {
        throw error;
    }
};

export const getSuitableInverters = async (projectId, systemVoltage, temperature) => {
    try {
        const response = await apiClient.get(`${API_PROJECT_URL}/${projectId}/inverters/suitable`, {
            params: {
                systemVoltage: systemVoltage,
                temperature: temperature
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching suitable inverters:', error);
        throw error;
    }
};

// Update the selectInverter function in services/ProjectService.js
export const selectInverter = async (projectId, inverterId) => {
    try {
        // Send the inverter ID in the URL of the request
        const response = await apiClient.post(`${API_PROJECT_URL}/${projectId}/inverters/select-inverter/${inverterId}`);
        console.log('select-inverter:', inverterId);
        return response.data; // Assumes response includes adjusted AC load and total daily energy

    } catch (error) {
        console.error('Error selecting inverter:', error);
        throw error;
    }
};

// Fetch the ProjectInverter details
export const getProjectInverter = async (projectId) => {
    try {
        const response = await apiClient.get(`${API_PROJECT_URL}/${projectId}/inverters/`);
        return response.data; // Return the inverter details
    } catch (error) {
        console.error('Error fetching project inverter:', error);
        throw error;
    }
};

// Process location data and store it in the project
export const processLocationData = async (projectId, latitude, longitude, angle, aspect, useOptimalValues) => {
    try {
        const url = `${API_PROJECT_URL}/${projectId}/location/process?latitude=${latitude}&longitude=${longitude}&angle=${angle}&aspect=${aspect}&useOptimalValues=${useOptimalValues}`;
        const response = await apiClient.post(url);
        return response.data; // Returns processed site data
    } catch (error) {
        console.error('Error processing location data:', error);
        throw error;
    }
};

// Load processed site data for the project
export const loadSiteData = async (projectId) => {
    try {
        const response = await apiClient.get(`${API_PROJECT_URL}/${projectId}/location/sites`);
        return response.data; // Returns the site data
    } catch (error) {
        console.error('Error loading site data:', error);
        throw error;
    }
};

// Fetch all batteries for a project
export const getBatteries = async (projectId, technology) => {
    try {
        const response = await apiClient.get(`${API_PROJECT_URL}/${projectId}/batteries/suitable?technology=${technology}`);
        return response.data; // Return battery data
    } catch (error) {
        console.error('Error fetching batteries:', error);
        throw error;
    }
};

// Send battery configuration request to the backend
export const selectBattery = async (projectId, params) => {
    try {
        // Include temperature and autonomyDays in the request params
        const { batteryId, temperature, autonomyDays } = params;
        const response = await apiClient.post(
            `${API_PROJECT_URL}/${projectId}/batteries/select-battery/${batteryId}?temperature=${temperature}&autonomyDays=${autonomyDays}`,
            {}
        );
        return response.data; // Return configuration results
    } catch (error) {
        console.error('Error calculating battery configuration:', error);
        throw error;
    }
};

export const getProjectBattery = async (projectId) => {
    try {
        const response = await apiClient.get(`${API_PROJECT_URL}/${projectId}/batteries/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching project battery:', error);
        throw error;
    }
};

