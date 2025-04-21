import { LOGIN_USER, LOGOUT_USER, REMMEBER_USER } from '../contant';

const initState = {
    currentUser: null,
    isRememberUser: false,
};

const auth = (state = initState, action) => {
    switch (action.type) {
        case LOGIN_USER:
            return {
                ...state,
                currentUser: action.payload.user,
                isRememberUser: action.payload.isRemember,
            };

        case REMMEBER_USER:
            return {
                ...state,
                __persisted_at: Date.now() + 7 * 24 * 60 * 60 * 1000,
            };

        case LOGOUT_USER:
            return initState;
        default:
            return state;
    }
};

export default auth;
