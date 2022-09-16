import SSHClient from '../../native_modules/react-native-ssh-sftp';
import {moduleConfig} from '../../config';

export function getSSHClient() {
    const {port, username, sshKey, passphrase, internalStaticIP} = moduleConfig;
    const key = {privateKey: sshKey, passphrase};

    return new Promise((resolve, reject) => {
        const sshClient = new SSHClient(internalStaticIP, port, username, key, (err) => {
            if (err) {
                console.warn(err);
                reject(err);
            } else {
                const moduleSSHClient = new ModuleSSHClient(sshClient);
                resolve(moduleSSHClient);
            }
        });
    });
}

class ModuleSSHClient {
    constructor(sshClient) {
        this._sshClient = sshClient;
    }

    async startShell() {
        return new Promise((resolve, reject) => {
            const ptyType = 'vanilla';
            this.onShellEvent((event) => {
                // android seems to not get the root@ message so adding the last line of output to success indicators
                if (
                    event.includes('root@') ||
                    event.includes('in order to prevent unauthorized SSH logins') ||
                    event.includes('Authorized use only. Access is restricted')
                ) {
                    resolve();
                }
            });
            this._sshClient.startShell(ptyType, (err) => {
                if (err) {
                    console.warn(err);
                    reject(err);
                }
            });
        });
    }

    async writeToShell(command) {
        return new Promise((resolve, reject) => {
            this._sshClient.writeToShell(command, (err, response) => {
                if (err) {
                    console.warn(err);
                    reject(err);
                } else {
                    // the response seems to always be undefined but passing through regardless
                    resolve(response);
                }
            });
        });
    }

    async execute(command) {
        return new Promise((resolve, reject) => {
            this._sshClient.execute(command, (error, response) => {
                if (error) {
                    console.warn(error);
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });
    }

    async scpUpload(localPath, remotePath) {
        return new Promise((resolve, reject) => {
            this._sshClient.scpUpload(localPath, remotePath, (err) => {
                if (err) {
                    console.warn(err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    onShellEvent(handler) {
        this._sshClient.on('Shell', handler);
    }

    disconnect = () => this._sshClient.disconnect;
}
