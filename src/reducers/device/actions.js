import {slice} from './index';

export function setDeviceView(device) {
    const data = JSON.parse(JSON.stringify(device || {}));
    return async (dispatch, getState) => {
        const transientShadow = getState().device.transientShadow;
        const transientRecord = transientShadow.find((transient) => transient.id === data?.device.id);
        if (data.device && data.device.activity?.eventType !== 'connected' && transientRecord) {
            if (!data.device.shadow) {
                data.device.shadow = {};
            }
            data.device.shadow.timezone = transientRecord.timezone;
        }
        dispatch(slice.actions.setView(data));
        return data;
    };
}

export function setConnection(connection) {
    return async (dispatch) => {
        dispatch(slice.actions.setConnection(connection));
        return connection;
    };
}

export function setPairing(pairing) {
    return async (dispatch) => {
        dispatch(slice.actions.setPairing(pairing));
        return pairing;
    };
}

export function setRegistration(params) {
    return async (dispatch) => {
        dispatch(slice.actions.setRegistration(params));
        return params;
    };
}

export function setTransientShadow(transientShadow) {
    return async (dispatch) => {
        dispatch(slice.actions.setTransientShadow(transientShadow));
        return transientShadow;
    };
}
