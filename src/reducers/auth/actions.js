import API from '../../services/API';
import {slice} from './index';

export function fetchUserByEmail(email) {
    return async (dispatch) => {
        const user = await API.getUserByEmail(email);
        dispatch(slice.actions.setUser(user));
        return user;
    };
}

export function createUser(input) {
    return async (dispatch) => {
        const user = await API.createUser(input);
        dispatch(slice.actions.setUser(user.data.createRinnaiUser));
        return user;
    };
}

export function updateUser(input) {
    return async (dispatch) => {
        const user = await API.updateUser(input);
        dispatch(slice.actions.setUser(user));
        return user;
    };
}

export function setVerifyData(data) {
    data.email = data.email.trim().toLowerCase();
    return async (dispatch) => {
        dispatch(slice.actions.setVerify(data));
        return data;
    };
}

export function setUserLocation(location) {
    return async (dispatch) => {
        dispatch(slice.actions.setUserLocation(location));
    };
}

export function loginUser() {
    return async (dispatch) => {
        dispatch(slice.actions.setLogin(true));
    };
}

export function logOutUser() {
    return async (dispatch) => {
        dispatch(slice.actions.setLogin(false));
        dispatch(slice.actions.setUser({}));
    };
}

export function updateMigrated(migrated) {
    return async (dispatch) => {
        dispatch(slice.actions.setMigrated(migrated));
    };
}
