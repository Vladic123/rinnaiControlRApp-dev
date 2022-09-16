import {createSlice} from '@reduxjs/toolkit';
import * as deviceActions from './actions';

export const slice = createSlice({
    name: 'device',
    initialState: {
        registration: {},
        pairing: {},
        connection: {},
        schedule: {},
        firmware: {},
        networks: {},
        logs: [],
        view: {},
        list: [],
        transientShadow: [],
    },
    reducers: {
        setConnection(state, action) {
            state.connection = action.payload;
        },
        setSchedule(state, action) {
            state.schedule = action.payload;
        },
        setList(state, action) {
            state.list = action.payload;
        },
        setPairing(state, action) {
            state.pairing = action.payload;
        },
        setRegistration(state, action) {
            state.registration = action.payload;
        },
        setFirmware(state, action) {
            state.firmware = action.payload;
        },
        setNetworks(state, action) {
            state.networks = action.payload;
        },
        setView(state, action) {
            state.view = action.payload;
        },
        setLogs(state, action) {
            state.logs.push(action.payload);
        },
        updateRegistration(state, action) {
            state.registration.push(action.payload);
        },
        setTransientShadow(state, action) {
            const transientShadow = state.transientShadow.slice();
            const deviceIndex = transientShadow.findIndex((transient) => transient.id === action.payload?.id);
            if (deviceIndex >= 0) {
                transientShadow[deviceIndex] = {...transientShadow[deviceIndex], ...action.payload};
            } else {
                transientShadow.push(action.payload);
            }
            state.transientShadow = transientShadow;
        },
    },
});

const deviceReducer = slice.reducer;

export {deviceActions};
export default deviceReducer;
