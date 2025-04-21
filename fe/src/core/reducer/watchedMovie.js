import {
    FETCH_DATA_FAILURE,
    FETCH_DATA_REQUEST,
    FETCH_DATA_SUCCESS,
    REMOVE_ALL_WATCHED_MOVIES,
} from '../contant';

const initState = {
    list: [],
    loading: false,
    error: null,
};

const watchedMovies = (state = initState, action) => {
    switch (action.type) {
        case FETCH_DATA_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                list: action.payload,
            };
        case FETCH_DATA_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case REMOVE_ALL_WATCHED_MOVIES:
            console.log('remove all watched movies');

            return {
                ...state,
                list: [],
            };
        default:
            return state;
    }
};

export default watchedMovies;
