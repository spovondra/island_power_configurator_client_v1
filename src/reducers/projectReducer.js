/**
 * The initial state for the project reducer.
 *
 * @constant
 * @type {object}
 * @property {Array} projects - The list of projects.
 * @property {boolean} loading - Indicates whether data is being loaded.
 * @property {string|null} error - Error message if there was a problem.
 */
export const initialState = {
    projects: [],
    loading: false,
    error: null
};

/**
 * Reducer function to manage the state of projects.
 *
 * @function projectReducer
 * @memberof module:ProjectService
 * @param {object} state - The current state of the reducer.
 * @param {object} action - The action dispatched to update the state.
 * @param {string} action.type - The type of action being dispatched.
 * @param {object|Array|null} action.payload - The data or error to update the state with.
 * @returns {object} The updated state.
 *
 * @throws {Error} If the action type is unrecognized.
 */
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
