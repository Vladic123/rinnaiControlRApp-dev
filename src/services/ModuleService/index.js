import RNFetchBlob from 'rn-fetch-blob';
import API from './HttpAPI';
import {getSSHClient} from './ModuleSSHClient';
import {Platform} from 'react-native';
import BackgroundService from 'react-native-background-actions';
import wait from '../../utils/wait';

const v1FirmwareErrorName = 'AYLA_FIRMWARE_SKIP_TO_FIRMWARE_UPDATE';
export default {
    v1FirmwareErrorName,
    getModuleMetadata,
    getWifiNetworks,
    sendWifiCreds,
    rebootDevice,
    uploadFirmware,
    installFirmware,
};

async function _checkAylaFallback() {
    // Use case: module metadata check has failed for a device.
    // For V2: could be internet issues. For V1: it will always fail.
    // Check for V1 firmware and throw a contextual error for the UI to move on past the metadata check
    await API.checkAyla();
    throw {
        errorName: v1FirmwareErrorName,
    };
}

async function getModuleMetadata() {
    try {
        const deviceSerial = await API.getV2Resource('serial');
        const deviceFirmware = await API.getV2Resource('firmware-version');
        const deviceAylaDSN = await API.getV2Resource('adsn');
        return {deviceSerial, deviceFirmware, deviceAylaDSN};
    } catch (err) {
        await _checkAylaFallback();
    }
}

async function sendWifiCreds(network, password) {
    return await API.postResource('join_network.py', {network, password});
}

async function getWifiNetworks() {
    const data = await API.getV2Resource('wifi-networks').then((resp) => resp['wifi-networks']);
    return Object.values(data);
}

async function rebootDevice() {
    const sshClient = await getSSHClient();

    await sshClient.startShell();

    try {
        console.info('sending reboot command');
        await _rebootDevice(sshClient);
    } finally {
        sshClient.disconnect();
    }
}

async function installFirmware() {
    if (Platform.OS === 'android') {
        return new Promise((resolve, reject) =>
            BackgroundService.start(
                () =>
                    _installUpdate()
                        .then(() => resolve())
                        .catch((e) => reject(e)),
                {
                    taskName: 'Download Software',
                    taskTitle: 'Downloading Rinnai Update',
                    taskDesc: 'Software update for CR',
                    taskIcon: {
                        name: 'ic_launcher',
                        type: 'mipmap',
                    },
                    color: '#ff00ff',
                },
            ),
        );
    } else {
        return _installUpdate();
    }
}

async function uploadFirmware() {
    const localPath = RNFetchBlob.fs.dirs.DocumentDir + '/otaUpdate.tgz';
    const remotePath = '/tmp/';
    const sshClient = await getSSHClient();
    console.info('removing any existing firmware');
    await sshClient.execute('rm -f /tmp/otaUpdate.tgz');
    console.info('starting firmware upload');

    if (Platform.OS.toLowerCase() === 'ios') {
        await sshClient.scpUpload(localPath, remotePath);
    } else {
        /*
        Android seems to never return on scpUpload although the upload completes. Instead we will keep checking the size
        and return once the size on the module equals the local size of the file
         */
        const fileStats = await RNFetchBlob.fs.stat(localPath);
        const fileSize = fileStats.size;

        sshClient.scpUpload(localPath, remotePath);

        let shouldContinue = true;

        while (shouldContinue) {
            const res = await sshClient.execute('ls -al /tmp/otaUpdate.tgz');
            console.log('size check: ' + res);
            if (res.includes(fileSize)) {
                shouldContinue = false;
            }
            await wait(2000);
        }
    }

    console.info('finished firmware upload');
}

async function _installUpdate() {
    let sshClient;
    try {
        sshClient = await getSSHClient();
        await sshClient.startShell();
        console.info('sending install command');
        await _installUpdateCommand(sshClient);
        console.info('sending reboot command');
        await _rebootDevice(sshClient);
    } catch (err) {
        console.warn(`failed _installUpdate\n${JSON.stringify(err)}`);
        throw err;
    } finally {
        sshClient && sshClient.disconnect();
    }
}

// ssh client must have an active shell
async function _rebootDevice(sshClient) {
    return new Promise((resolve, reject) => {
        console.info('rebooting...');
        const successMessage = 'reboot in progress';

        const timer = setTimeout(() => {
            reject('timeout');
        }, 10000);
        sshClient.onShellEvent((event) => {
            console.info(event);
            if (event.includes(successMessage)) {
                clearTimeout(timer);
                resolve();
            }
        });
        sshClient.writeToShell(`(sleep 2 ; reboot) && echo "${successMessage}"\n`);
    });
}

// ssh client must have an active shell
async function _installUpdateCommand(sshClient) {
    return new Promise((resolve, reject) => {
        const command = '/root/applyOta.sh \n';
        const timeoutInMs = 300000;
        const isSuccessEvent = (event) => event.includes('#? install-ota: exit') || event.includes('Update has been flashed');
        const isErrorEvent = (event) => event.startsWith('#*ER');

        const timer = setTimeout(() => {
            reject('timeout');
        }, timeoutInMs);

        sshClient.onShellEvent((event) => {
            console.info(event);
            if (isSuccessEvent(event)) {
                clearTimeout(timer);
                resolve();
            } else if (isErrorEvent(event)) {
                clearTimeout(timer);
                reject(event);
            }
        });
        sshClient.writeToShell(command);
    });
}
