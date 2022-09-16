import {createSlice} from '@reduxjs/toolkit';
import * as migrationActions from './actions';

export const slice = createSlice({
    name: 'migration',
    initialState: {
        migrationData: {},
    },
    reducers: {
        setMigrationData(state, action) {
            state.migrationData = action.payload;
        },
        deleteMigrationData(state, action) {
            delete state.migrationData;
        },
    },
});

const migrationReducer = slice.reducer;

export {migrationActions};
export default migrationReducer;
