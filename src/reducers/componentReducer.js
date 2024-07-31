export const initialState = {
    components: [],
    loading: false,
    error: null
};

export const componentReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, loading: true, error: null };
        case 'FETCH_SUCCESS':
            return { ...state, components: action.payload, loading: false };
        case 'FETCH_FAILURE':
            return { ...state, loading: false, error: action.payload };
        case 'ADD_COMPONENT':
            return { ...state, components: [...state.components, action.payload] };
        case 'DELETE_COMPONENT':
            return { ...state, components: state.components.filter(c => c.id !== action.payload) };
        case 'UPDATE_COMPONENT':
            return {
                ...state,
                components: state.components.map(c => c.id === action.payload.id ? action.payload : c)
            };
        default:
            return state;
    }
};
