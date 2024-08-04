export const initialState = {
    projects: [],
    loading: false,
    error: null
};

export const projectReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, projects: action.payload };
        case 'FETCH_FAILURE':
            return { ...state, loading: false, error: action.payload };
        case 'DELETE_PROJECT':
            return {
                ...state,
                projects: state.projects.filter(project => project.id !== action.payload)
            };
        default:
            return state;
    }
};
