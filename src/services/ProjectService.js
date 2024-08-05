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

