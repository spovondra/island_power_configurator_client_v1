import React, { useReducer, useEffect } from 'react';
import axios from 'axios';
import { componentReducer, initialState } from '../reducers/componentReducer';

const ComponentList = () => {
    const [state, dispatch] = useReducer(componentReducer, initialState);

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

    const addComponent = async () => {
        try {
            const response = await axios.post('/api/components', { name: 'New Component' });
            dispatch({ type: 'ADD_COMPONENT', payload: response.data });
        } catch (error) {
            console.error('Error adding component', error);
        }
    };

    const deleteComponent = async (id) => {
        try {
            await axios.delete(`/api/components/${id}`);
            dispatch({ type: 'DELETE_COMPONENT', payload: id });
        } catch (error) {
            console.error('Error deleting component', error);
        }
    };

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
