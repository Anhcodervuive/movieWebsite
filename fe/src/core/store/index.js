import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import expireReducer from 'redux-persist-expire';
import { thunk } from 'redux-thunk';

import { authReducer, catalog, watchedMovies } from '../reducer';
import { configureStore } from '@reduxjs/toolkit';

const persistConfig = {
    key: 'root',
    storage,
    transforms: [
        expireReducer('catalog', {
            expireSeconds: 300, // Hết hạn sau 1 giờ (3600 giây)
            expiredState: null, // Reset state khi hết hạn
            autoExpire: true, // Tự động kiểm tra khi lấy state
        }),
        expireReducer('auth', {
            persistedAtKey: '__persisted_at',
            expireSeconds: 51 * 60, // Hết hạn sau 1 giờ (3600 giây)
            expiredState: null, // Reset state khi hết hạn
            autoExpire: true, // Tự động kiểm tra khi lấy state
        }),
    ],
};

const rootReducer = combineReducers({
    auth: authReducer,
    catalog: catalog,
    watchedMovies: watchedMovies,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Bỏ kiểm tra serialize của redux-persist
        }).concat(thunk),
});

const persistor = persistStore(store);

export { store, persistor };
