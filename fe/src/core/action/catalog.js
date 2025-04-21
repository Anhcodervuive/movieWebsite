import { SET_CATALOG, SHOW_SUB_CATALOG } from '../contant';

const setCatalog = (payload) => ({
    type: SET_CATALOG,
    payload,
});

const showSubCatalog = (payload) => ({
    type: SHOW_SUB_CATALOG,
    payload,
});

export { setCatalog, showSubCatalog };
