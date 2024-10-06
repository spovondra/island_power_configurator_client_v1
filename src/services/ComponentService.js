import apiClient from './apiClient';
import { API_COMPONENT_URL } from '../config';

// Fetch all components based on category (e.g., solar-panels, appliances)
export const getAllComponents = async (category) => {
    try {
        const response = await apiClient.get(`${API_COMPONENT_URL}/${category}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Fetch a component by ID and category
export const getComponentById = async (category, componentId) => {
    try {
        const response = await apiClient.get(`${API_COMPONENT_URL}/${category}/${componentId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Create a new component under a specific category
export const createComponent = async (category, component) => {
    try {
        const response = await apiClient.post(`${API_COMPONENT_URL}/${category}`, component);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update an existing component based on category
export const updateComponent = async (category, componentId, component) => {
    try {
        const response = await apiClient.put(`${API_COMPONENT_URL}/${category}/${componentId}`, component);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete a component by category and ID
export const deleteComponent = async (category, componentId) => {
    try {
        await apiClient.delete(`${API_COMPONENT_URL}/${category}/${componentId}`);
    } catch (error) {
        throw error;
    }
};
