import axios from 'axios';
import {apiBaseUrl} from '../../config';
import * as qs from 'qs';
import utils from '../../utils';
import {Auth} from 'aws-amplify';

export default {
    doMaintenanceRetrieval,
    disableVacationMode,
    enableVacationMode,
    turnHeaterOn,
    turnHeaterOff,
    startRecirculation,
    stopRecirculation,
    setTemperature,
    setTimezone,
    otaUpdate,
    updateTimezoneWithDeviceTimezone,
    enableSchedule,
};

async function getAuthHeader() {
    const session = await Auth.currentSession();
    const token = session.getIdToken().getJwtToken();
    return {Authorization: `Bearer ${token}`};
}

async function otaUpdate(thingName) {
    try {
        const path = `/thing/${thingName}/ota-update/latest`;

        const data = qs.stringify({
            thing: thingName,
            version: 'latest',
        });

        const authHeader = await getAuthHeader();

        return axios({
            method: 'post',
            url: apiBaseUrl + path,
            headers: authHeader,
            data,
        });
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

async function doMaintenanceRetrieval(thingName) {
    return _updateDeviceShadow(thingName, {
        do_maintenance_retrieval: true,
    });
}

async function enableVacationMode(thingName) {
    return _updateDeviceShadow(thingName, {
        schedule_holiday: true,
    });
}

async function disableVacationMode(thingName) {
    await _updateDeviceShadow(thingName, {
        schedule_holiday: false,
        schedule_enabled: true,
    });
}

async function enableSchedule(thingName) {
    return _updateDeviceShadow(thingName, {
        schedule_enabled: true,
    });
}

async function updateTimezoneWithDeviceTimezone(thingName) {
    const timezone = utils.getCurrentTimezone();
    return _updateDeviceShadow(thingName, {timezone});
}

async function turnHeaterOn(thingName) {
    return _updateDeviceShadow(thingName, {
        set_operation_enabled: true,
    });
}

async function turnHeaterOff(thingName) {
    return _updateDeviceShadow(thingName, {
        set_operation_enabled: false,
    });
}

async function startRecirculation(thingName, duration) {
    await _updateDeviceShadow(thingName, {
        recirculation_duration: duration,
        set_recirculation_enabled: true,
    });
    //double check string true to boolean
}

async function stopRecirculation(thingName) {
    await _updateDeviceShadow(thingName, {
        set_recirculation_enabled: false,
    });
    //double check string true to boolean
}

async function setTemperature(thingName, temperature) {
    return _updateDeviceShadow(thingName, {
        set_priority_status: true,
        set_domestic_temperature: temperature,
    });
}

async function setTimezone(thingName, timezone) {
    return _updateDeviceShadow(thingName, {
        timezone,
    });
}

async function _updateDeviceShadow(thing, shadow) {
    try {
        const path = `/thing/${thing}/shadow`;

        const authHeader = await getAuthHeader();
        return axios({
            method: 'patch',
            url: apiBaseUrl + path,
            headers: authHeader,
            data: JSON.stringify(shadow),
        });
    } catch (error) {
        console.warn(error);
        throw error;
    }
}
