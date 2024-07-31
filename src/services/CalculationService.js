import apiClient from "./apiClient";

export const calculateLoad = async (data) => {
    try {
        const response = await apiClient.post('/calculations/load', data);
        return response.data;
    } catch (error) {
        console.error('API request error:', error);
        throw new Error('Error fetching data from API');
    }
};
