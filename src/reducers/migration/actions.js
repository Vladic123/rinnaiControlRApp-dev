import {slice} from './index';

export function setMigrationData(data) {
    return async (dispatch) => {
        dispatch(slice.actions.setMigrationData(data));
        return data;
    };
}

export function deleteMigrationData() {
    return async (dispatch) => {
        dispatch(slice.actions.setMigrationData(null));
    };
}
