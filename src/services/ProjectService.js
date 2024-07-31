// services/ProjectService.js
import apiClient from './apiClient';

const API_URL = '/projects';

// Named exports
export const getAllProjects = async () => {
    try {
        const response = await apiClient.get(API_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getProjectById = async (projectId) => {
    try {
        const response = await apiClient.get(`${API_URL}/${projectId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createProject = async (project) => {
    try {
        const response = await apiClient.post(API_URL, project);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateProject = async (projectId, project) => {
    try {
        const response = await apiClient.put(`${API_URL}/${projectId}`, project);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteProject = async (projectId) => {
    try {
        await apiClient.delete(`${API_URL}/${projectId}`);
    } catch (error) {
        throw error;
    }
};
