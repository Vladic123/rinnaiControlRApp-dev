import {API as Amplify} from 'aws-amplify';
import axios from 'axios';
import {migrationApiBaseUrl, migrationApiKey} from '../../config';
import analytics from '../../services/analytics';

export default {
    getDeviceData,
    findStuck,
    migrateAylaUser,
    validateAylaUser,
};

async function migrateAylaUser(email, password) {
    const url = `${migrationApiBaseUrl}/ayla/auth`;

    const body = {email, password, shouldPushOta: true};

    const res = await axios({
        method: 'POST',
        url: url,
        data: body,
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': migrationApiKey,
        },
    });

    return res.data;
}

async function getDeviceData(serial, analyticsLogParams) {
    if (!serial) {
        await analytics.logEvent('awsDeviceLookup', analyticsLogParams);
        throw new Error('Serial is undefined in the awsDeviceLookup call');
    }

    try {
        const thing = await Amplify.get('awsDeviceLookup', '/device', {
            queryStringParameters: {
                serial: serial,
            },
        });

        return thing;
    } catch (error) {
        console.log(error);
    }
}

async function findStuck() {
    try {
        const res = await axios.get('https://ayla-stuck-devices.s3.amazonaws.com/devices.json');
        return res.data;
    } catch (error) {
        console.log(`error finding stuck devices: ${error}`);
    }
}

async function validateAylaUser(email) {
    const url = `${migrationApiBaseUrl}/ayla/user`;

    const body = {
        email: email,
    };

    const res = await axios({
        method: 'POST',
        url: url,
        data: body,
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': migrationApiKey,
        },
    });
    return res.data;
}
