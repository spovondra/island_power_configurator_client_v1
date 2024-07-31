// services/ProjectService.js
import apiClient from './apiClient';

const API_URL = '/projects';
const USER_PROJECTS_URL = '/projects/user-projects'; // Adjust this endpoint based on your backend setup

// Fetch all projects
export const getAllProjects = async () => {
    try {
        const response = await apiClient.get(API_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Fetch a project by ID
export const getProjectById = async (projectId) => {
    try {
        const response = await apiClient.get(`${API_URL}/${projectId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Create a new project
export const createProject = async (project) => {
    try {
        const response = await apiClient.post(API_URL, project);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update an existing project
export const updateProject = async (projectId, project) => {
    try {
        const response = await apiClient.put(`${API_URL}/${projectId}`, project);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete a project
export const deleteProject = async (projectId) => {
    try {
        await apiClient.delete(`${API_URL}/${projectId}`);
    } catch (error) {
        throw error;
    }
};

// Fetch projects specific to the logged-in user
export const getUserProjects = async () => {
    try {
        const response = await apiClient.get(USER_PROJECTS_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};
