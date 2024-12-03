import React, { useReducer, useEffect } from 'react';
import axios from 'axios';
import { componentReducer, initialState } from '../reducers/componentReducer';

/**
 * ComponentList component for displaying and managing a list of components.
 *
 * @component
 * @returns {JSX.Element} The rendered component list with add, update, and delete functionality.
 */
const ComponentList = () => {
    const [state, dispatch] = useReducer(componentReducer, initialState);

    /**
     * Fetches components from the API and updates the state.
     *
     * @async
     * @function fetchComponents
     * @returns {Promise<void>}
     */
    useEffect(() => {
        const fetchComponents = async () => {
            dispatch({ type: 'FETCH_START' });
            try {
                const response = await axios.get('/api/components');
                dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
            } catch (error) {
                dispatch({ type: 'FETCH_FAILURE', payload: error });
            }
        };

        fetchComponents();
    }, []);

    /**
     * Adds a new component by sending a POST request to the API.
     *
     * @async
     * @function addComponent
     * @returns {Promise<void>}
     */
    const addComponent = async () => {
        try {
            const response = await axios.post('/api/components', { name: 'New Component' });
            dispatch({ type: 'ADD_COMPONENT', payload: response.data });
        } catch (error) {
            console.error('Error adding component', error);
        }
    };

    /**
     * Deletes a component by ID by sending a DELETE request to the API.
     *
     * @async
     * @function deleteComponent
     * @param {string} id - The ID of the component to delete.
     * @returns {Promise<void>}
     */
    const deleteComponent = async (id) => {
        try {
            await axios.delete(`/api/components/${id}`);
            dispatch({ type: 'DELETE_COMPONENT', payload: id });
        } catch (error) {
            console.error('Error deleting component', error);
        }
    };

    /**
     * Updates a component by ID by sending a PUT request to the API.
     *
     * @async
     * @function updateComponent
     * @param {string} id - The ID of the component to update.
     * @param {object} updatedData - The updated data for the component.
     * @returns {Promise<void>}
     */
    const updateComponent = async (id, updatedData) => {
        try {
            const response = await axios.put(`/api/components/${id}`, updatedData);
            dispatch({ type: 'UPDATE_COMPONENT', payload: response.data });
        } catch (error) {
            console.error('Error updating component', error);
        }
    };

    if (state.loading) return <p>Loading...</p>;
    if (state.error) return <p>Error: {state.error.message}</p>;

    return (
        <div>
            <h2>Component List</h2>
            <button onClick={addComponent}>Add Component</button>
            <ul>
                {state.components.map(component => (
                    <li key={component.id}>
                        {component.name}
                        <button onClick={() => updateComponent(component.id, { name: 'Updated Name' })}>Update</button>
                        <button onClick={() => deleteComponent(component.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ComponentList;
