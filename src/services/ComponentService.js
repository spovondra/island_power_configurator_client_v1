import apiClient from './apiClient';
import { API_COMPONENT_URL } from '../config';

/**
 * Service for interacting with components in the application.
 *
 * 
 * @module ComponentService
 */

/**
 * Fetches all components based on the provided category (e.g., solar-panels, appliances).
 *
 * @function getAllComponents
 * @param {string} category - The category of components to fetch.
 * @returns {Promise<object[]>} A promise that resolves to the list of components in the specified category.
 * @throws {Error} If the request fails, an error is thrown.
 */
export const getAllComponents = async (category) => {
    try {
        const response = await apiClient.get(`${API_COMPONENT_URL}/${category}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Fetches a component by its ID within a specific category.
 *
 * @function getComponentById
 * @param {string} category - The category of the component (e.g., solar-panels).
 * @param {string} componentId - The ID of the component to fetch.
 * @returns {Promise<object>} A promise that resolves to the component data.
 * @throws {Error} If the request fails, an error is thrown.
 */
export const getComponentById = async (category, componentId) => {
    try {
        const response = await apiClient.get(`${API_COMPONENT_URL}/${category}/${componentId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Creates a new component under a specific category.
 *
 * @function createComponent
 * @param {string} category - The category under which to create the new component.
 * @param {object} component - The component data to create.
 * @returns {Promise<object>} A promise that resolves to the newly created component data.
 * @throws {Error} If the request fails, an error is thrown.
 */
export const createComponent = async (category, component) => {
    try {
        const response = await apiClient.post(`${API_COMPONENT_URL}/${category}`, component);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Updates an existing component in a specific category.
 *
 * @function updateComponent
 * @param {string} category - The category of the component to update.
 * @param {string} componentId - The ID of the component to update.
 * @param {object} component - The updated component data.
 * @returns {Promise<object>} A promise that resolves to the updated component data.
 * @throws {Error} If the request fails, an error is thrown.
 */
export const updateComponent = async (category, componentId, component) => {
    try {
        const response = await apiClient.put(`${API_COMPONENT_URL}/${category}/${componentId}`, component);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Deletes a component by its ID within a specific category.
 *
 * @function deleteComponent
 * @param {string} category - The category of the component to delete.
 * @param {string} componentId - The ID of the component to delete.
 * @returns {Promise<void>} A promise that resolves when the component is successfully deleted.
 * @throws {Error} If the request fails, an error is thrown.
 */
export const deleteComponent = async (category, componentId) => {
    try {
        await apiClient.delete(`${API_COMPONENT_URL}/${category}/${componentId}`);
    } catch (error) {
        throw error;
    }
};
