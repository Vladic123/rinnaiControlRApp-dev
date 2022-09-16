import {configureStore} from '@reduxjs/toolkit';
import authReducer from './auth';
import deviceReducer from './device';
import migrationReducer from './migration';

const store = configureStore({
    reducer: {
        auth: authReducer,
        device: deviceReducer,
        migration: migrationReducer,
    },
    devTools: true,
});

export default store;
