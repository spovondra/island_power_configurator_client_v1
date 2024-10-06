import React, { useEffect, useReducer } from 'react';
import { getAllComponents, createComponent, updateComponent, deleteComponent, getComponentById } from '../../services/ComponentService';
import Modal from '../Modal/Modal';
import './ComponentAdminPanel.css';
import ComponentForm from "./ComponentForm";

const initialState = {
    components: [],
    selectedCategory: 'solar-panels', // Default category
    error: '',
    isLoading: true,
    isModalOpen: false,
    selectedComponent: null,
    modalContent: null,
};

const componentReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            return { ...state, components: action.payload, isLoading: false };
        case 'FETCH_ERROR':
            return { ...state, error: action.payload, isLoading: false, isModalOpen: true, modalContent: 'error' };
        case 'SET_SELECTED_COMPONENT':
            return { ...state, selectedComponent: action.payload, isModalOpen: true, modalContent: 'form' };
        case 'ADD_COMPONENT':
            return { ...state, components: [...state.components, action.payload], selectedComponent: null, isModalOpen: false };
        case 'UPDATE_COMPONENT':
            return {
                ...state,
                components: state.components.map(component =>
                    component.id === action.payload.id ? action.payload : component
                ),
                selectedComponent: null,
                isModalOpen: false,
            };
        case 'DELETE_SUCCESS':
            return { ...state, components: state.components.filter(component => component.id !== action.payload) };
        case 'CLOSE_MODAL':
            return { ...state, isModalOpen: false };
        case 'SET_CATEGORY':
            return { ...state, selectedCategory: action.payload };
        default:
            return state;
    }
};

const ComponentAdminPanel = () => {
    const [state, dispatch] = useReducer(componentReducer, initialState);
    const { components, selectedCategory, isLoading, isModalOpen, selectedComponent, modalContent, error } = state;

    const fetchComponents = async (category) => {
        try {
            const data = await getAllComponents(category);
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR', payload: error.message });
        }
    };

    useEffect(() => {
        fetchComponents(selectedCategory);
    }, [selectedCategory]);

    const handleAddComponent = async (formData) => {
        try {
            const newComponent = await createComponent(selectedCategory, formData);
            dispatch({ type: 'ADD_COMPONENT', payload: newComponent });
        } catch (error) {
            alert('Failed to add component');
        }
    };

    const handleUpdateComponent = async (formData) => {
        if (!selectedComponent || !selectedComponent.id) {
            console.error("No selected component or ID for update.");
            return;
        }
        try {
            const updatedComponent = await updateComponent(selectedCategory, selectedComponent.id, formData);
            dispatch({ type: 'UPDATE_COMPONENT', payload: updatedComponent });
        } catch (error) {
            alert('Failed to update component');
        }
    };

    const handleDeleteComponent = async (componentId) => {
        try {
            await deleteComponent(selectedCategory, componentId);
            dispatch({ type: 'DELETE_SUCCESS', payload: componentId });
        } catch (error) {
            alert('Failed to delete component');
        }
    };

    const handleCategoryChange = (category) => {
        dispatch({ type: 'SET_CATEGORY', payload: category });
    };

    const handleSelectComponent = (component) => {
        if (component && component.id) {
            getComponentById(selectedCategory, component.id).then(fetchedComponent => {
                dispatch({ type: 'SET_SELECTED_COMPONENT', payload: fetchedComponent });
            });
        } else {
            dispatch({ type: 'SET_SELECTED_COMPONENT', payload: {}}); // New component
        }
    };

    return (
        <div className="component-admin-panel-container">
            <h2>Component Management</h2>

            <div className="category-buttons">
                {['appliances', 'solar-panels', 'controllers', 'batteries', 'inverters'].map(category => (
                    <button
                        key={category}
                        className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => handleCategoryChange(category)}
                    >
                        {category.replace('-', ' ').toUpperCase()}
                    </button>
                ))}
            </div>

            <button className="component-add-button" onClick={() => handleSelectComponent({})}>Add New Component</button>

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <table className="component-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        {selectedCategory === 'solar-panels' && (
                            <>
                                <th>Manufacturer</th>
                                <th>Rated Power (W)</th>
                                <th>Voc (V)</th>
                                <th>IsC (A)</th>
                                <th>Vmp (V)</th>
                                <th>Imp (A)</th>
                                <th>Temp Coefficient (PMax)</th>
                                <th>Tolerance (%)</th>
                                <th>Degradation (1st Year)</th>
                                <th>Degradation (Years)</th>
                                <th>Price ($)</th>
                            </>
                        )}
                        {selectedCategory === 'controllers' && (
                            <>
                                <th>Rated Power (W)</th>
                                <th>Current Rating (A)</th>
                                <th>Max Voltage (V)</th>
                                <th>Min Voltage (V)</th>
                                <th>Type</th>
                                <th>Efficiency (%)</th>
                            </>
                        )}
                        {selectedCategory === 'inverters' && (
                            <>
                                <th>Continuous Power (25°C)</th>
                                <th>Continuous Power (40°C)</th>
                                <th>Continuous Power (65°C)</th>
                                <th>Max Power (W)</th>
                                <th>Efficiency (%)</th>
                                <th>Voltage (V)</th>
                                <th>Price ($)</th>
                            </>
                        )}
                        {selectedCategory === 'batteries' && (
                            <>
                                <th>Type</th>
                                <th>Capacity (Ah)</th>
                                <th>Voltage (V)</th>
                                <th>DOD (%)</th>
                                <th>Price ($)</th>
                            </>
                        )}
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {components.map(component => (
                        <tr key={component.id}>
                            <td>{component.id}</td>
                            <td>{component.name}</td>
                            {selectedCategory === 'solar-panels' && (
                                <>
                                    <td>{component.manufacturer}</td>
                                    <td>{component.pRated}</td>
                                    <td>{component.voc}</td>
                                    <td>{component.isc}</td>
                                    <td>{component.vmp}</td>
                                    <td>{component.imp}</td>
                                    <td>{component.tempCoefficientPMax}</td>
                                    <td>{component.tolerance}</td>
                                    <td>{component.degradationFirstYear}</td>
                                    <td>{component.degradationYears}</td>
                                    <td>{component.price}</td>
                                </>
                            )}
                            {selectedCategory === 'controllers' && (
                                <>
                                    <td>{component.ratedPower}</td>
                                    <td>{component.currentRating}</td>
                                    <td>{component.maxVoltage}</td>
                                    <td>{component.minVoltage}</td>
                                    <td>{component.type}</td>
                                    <td>{component.efficiency}</td>
                                </>
                            )}
                            {selectedCategory === 'inverters' && (
                                <>
                                    <td>{component.continuousPower25C}</td>
                                    <td>{component.continuousPower40C}</td>
                                    <td>{component.continuousPower65C}</td>
                                    <td>{component.maxPower}</td>
                                    <td>{component.efficiency}</td>
                                    <td>{component.voltage}</td>
                                    <td>{component.price}</td>
                                </>
                            )}
                            {selectedCategory === 'batteries' && (
                                <>
                                    <td>{component.type}</td>
                                    <td>{component.capacity}</td>
                                    <td>{component.voltage}</td>
                                    <td>{component.dod}</td>
                                    <td>{component.price}</td>
                                </>
                            )}
                            <td>
                                <button className="component-table-button-edit" onClick={() => handleSelectComponent(component)}>Edit</button>
                                <button className="component-table-button-delete" onClick={() => handleDeleteComponent(component.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <Modal isOpen={isModalOpen} onClose={() => dispatch({ type: 'CLOSE_MODAL' })}>
                {modalContent === 'form' && (
                    <ComponentForm
                        componentData={selectedComponent}
                        handleSubmit={selectedComponent?.id ? handleUpdateComponent : handleAddComponent}
                        onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
                        selectedCategory={selectedCategory} // Pass selected category here
                    />
                )}
                {modalContent === 'error' && <p>{error}</p>}
            </Modal>
        </div>
    );
};

export default ComponentAdminPanel;