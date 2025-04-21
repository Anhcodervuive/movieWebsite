import { SET_CATALOG, SHOW_SUB_CATALOG } from '../contant';

const initState = {
    list: [],
};

const catalog = (state = initState, action) => {
    switch (action.type) {
        case SET_CATALOG:
            return {
                ...state,
                list: action.payload,
            };
        case SHOW_SUB_CATALOG:
            const newList = [...state.list];
            const temp = newList[3];
            newList[3] = newList[action.payload];
            newList[action.payload] = temp;
            return {
                ...state,
                list: newList,
            };
        default:
            return state;
    }
};

export default catalog;
