import React, { useEffect, useReducer } from 'react';
import { getAllComponents, createComponent, updateComponent, deleteComponent, getComponentById } from '../../services/ComponentService';
import Modal from '../Modal/Modal';
import './ComponentAdminPanel.css';
import ComponentForm from './ComponentForm';
import { useTranslation } from 'react-i18next'; // Importing the translation hook

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
    const { t } = useTranslation('admin'); // Use the componentAdmin namespace for translations

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
            alert(t('error_message')); // Use translation for error message
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
            alert(t('error_message')); // Use translation for error message
        }
    };

    const handleDeleteComponent = async (componentId) => {
        try {
            await deleteComponent(selectedCategory, componentId);
            dispatch({ type: 'DELETE_SUCCESS', payload: componentId });
        } catch (error) {
            alert(t('error_message')); // Use translation for error message
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
            <h2>{t('component.title')}</h2>

            <div className="category-buttons">
                {['solar-panels', 'controllers', 'batteries', 'inverters'].map(category => (
                    <button
                        key={category}
                        className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => handleCategoryChange(category)}
                    >
                        {t(`component.categories.${category}`)}
                    </button>
                ))}
            </div>

            <button className="component-add-button" onClick={() => handleSelectComponent({})}>{t('component.add_new_component')}</button>

            {isLoading ? (
                <p>{t('component.loading')}</p>
            ) : (
                <table className="component-table">
                    <thead>
                    <tr>
                        <th>{t('component.id')}</th>
                        <th>{t('component.name')}</th>
                        {selectedCategory === 'solar-panels' && (
                            <>
                                <th>{t('component.manufacturer')}</th>
                                <th>{t('component.rated_power')}</th>
                                <th>{t('component.voc')}</th>
                                <th>{t('component.isc')}</th>
                                <th>{t('component.vmp')}</th>
                                <th>{t('component.imp')}</th>
                                <th>{t('component.temp_coefficient')}</th>
                                <th>{t('component.tolerance')}</th>
                                <th>{t('component.degradation_first_year')}</th>
                                <th>{t('component.degradation_years')}</th>
                                <th>{t('component.price')}</th>
                            </>
                        )}
                        {selectedCategory === 'controllers' && (
                            <>
                                <th>{t('component.rated_power')}</th>
                                <th>{t('component.current_rating')}</th>
                                <th>{t('component.max_voltage')}</th>
                                <th>{t('component.min_voltage')}</th>
                                <th>{t('component.type')}</th>
                                <th>{t('component.efficiency')}</th>
                            </>
                        )}
                        {selectedCategory === 'inverters' && (
                            <>
                                <th>{t('component.continuous_power_25C')}</th>
                                <th>{t('component.continuous_power_40C')}</th>
                                <th>{t('component.continuous_power_65C')}</th>
                                <th>{t('component.max_power')}</th>
                                <th>{t('component.efficiency')}</th>
                                <th>{t('component.max_voltage')}</th>
                                <th>{t('component.price')}</th>
                            </>
                        )}
                        {selectedCategory === 'batteries' && (
                            <>
                                <th>{t('component.battery_type')}</th>
                                <th>{t('component.capacity')}</th>
                                <th>{t('component.max_voltage')}</th>
                                <th>{t('component.dod')}</th>
                                <th>{t('component.price')}</th>
                            </>
                        )}
                        <th>{t('component.actions')}</th>
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
                                <button className="component-table-button-edit" onClick={() => handleSelectComponent(component)}>{t('component.edit_button')}</button>
                                <button className="component-table-button-delete" onClick={() => handleDeleteComponent(component.id)}>{t('component.delete_button')}</button>
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
