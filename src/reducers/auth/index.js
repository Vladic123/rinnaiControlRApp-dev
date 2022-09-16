import {createSlice} from '@reduxjs/toolkit';
import * as authActions from './actions';

export const slice = createSlice({
    name: 'auth',
    initialState: {
        loggedIn: false,
        account: {},
        register: {},
        verify: {},
        location: {},
        migrated: false,
    },
    reducers: {
        setUser(state, action) {
            state.account = action.payload;
        },
        setUserLocation(state, action) {
            state.location = action.payload;
        },
        setRegister(state, action) {
            state.register = action.payload;
        },
        setVerify(state, action) {
            state.verify = action.payload;
        },
        addVerify(state, action) {
            state.verify.push(action.payload);
        },
        setLogin(state, action) {
            state.loggedIn = action.payload;
        },
        setMigrated(state, action) {
            state.migrated = action.payload;
        },
    },
});

const authReducer = slice.reducer;

export {authActions};
export default authReducer;
