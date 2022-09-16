/* eslint-disable no-restricted-imports */
import {API as Amplify} from 'aws-amplify';
import * as queries from '../../graphql/queries';
import {GRAPHQL_AUTH_MODE} from '@aws-amplify/api';
import * as deviceMutations from '../../graphql/deviceMutations';
import * as mutations from '../../graphql/mutations';
import * as deviceQueries from '../../graphql/deviceQueries';
import {v4 as uuidv4} from 'uuid';
import moment from 'moment-timezone';
import * as userQueries from '../../graphql/userQueries';
import * as userMutations from '../../graphql/userMutations';

export default {
    getDeviceErrors,
    listErrors,
    getDeviceInformation,
    updateDeviceDealer,
    updateUserDevice,
    removeUserDevice,
    checkDevice,
    getViewDevice,
    createUserDevice,
    createProductRegistration,
    removeDeviceSchedule,
    createSchedule,
    updateSchedule,
    activateSchedule,
    deactivateSchedule,
    getUserByEmail,
    searchUserByEmail,
    searchUserByCompany,
    createUser,
    updateUser,
    updateTerms,
    confirmUser,
    createDealerCustomer,
    sendMonitoringRequest,
    updateMonitoringRequest,
};

async function updateMonitoringRequest(input) {
    try {
        return Amplify.graphql({
            query: mutations.updateDealerMonitoring,
            variables: {input: input},
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

async function sendMonitoringRequest(input) {
    try {
        return Amplify.graphql({
            query: mutations.createDealerMonitoring,
            variables: {input: input},
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

async function createDealerCustomer(input) {
    try {
        return Amplify.graphql({
            query: mutations.createDealerCustomers,
            variables: {input: input},
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

async function confirmUser(input) {
    try {
        return Amplify.graphql({
            query: userMutations.updateRinnaiUserAWS,
            variables: {input: input},
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

async function updateTerms(input) {
    try {
        return Amplify.graphql({
            query: userMutations.updateUserTerms,
            variables: {input: input},
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

async function updateUser(user) {
    try {
        return Amplify.graphql({
            query: mutations.updateRinnaiUser,
            variables: {input: user},
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

async function createUser(user) {
    try {
        return Amplify.graphql({
            query: mutations.createRinnaiUser,
            variables: {input: user},
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

async function searchUserByCompany(company) {
    try {
        if (!company) {
            return;
        }
        const user = await Amplify.graphql({
            query: queries.listRinnaiUsers,
            variables: {company: company},
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });

        return user.data.userByCompany.items;
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

async function searchUserByEmail(email, token) {
    try {
        if (!email) {
            return;
        }
        const user = await Amplify.graphql({
            query: queries.listRinnaiUsers,
            variables: {
                // filter: [{email: {beginsWith: email}}],
                filter: {
                    or: [{email: {eq: email}}, {email: {contains: email}}],
                },
                limit: 100000,
                nextToken: token,
            },
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
        const data = user.data.listRinnaiUsers.items;
        const next = user.data.listRinnaiUsers.nextToken;
        let users;

        if (data.length < 1 && next) {
            console.log(data.length);
            await searchUserByEmail(email, next).then((list) => {
                if (list) {
                    users = list;
                }
            });
        } else {
            if (data) {
                users = data;
            }
        }

        return users;
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

async function getUserByEmail(email) {
    try {
        const user = await Amplify.graphql({
            query: userQueries.getUserByEmail,
            variables: {email: email},
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });

        return user.data.getUserByEmail.items[0];
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

async function getDeviceErrors(id, now, to) {
    try {
        const device = await Amplify.graphql({
            query: queries.errorByDate,
            variables: {
                serial_id: id,
                createdAt: {between: [to, now]},
                sortDirection: 'DESC',
            },
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
        const data = device.data.errorByDate.items;
        return data;
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

async function listErrors() {
    try {
        const device = await Amplify.graphql({
            query: queries.listErrorCodess,
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
        const data = device.data.listErrorCodess.items;
        return data;
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

async function getDeviceInformation(id) {
    try {
        const info = await Amplify.graphql({
            query: queries.getDeviceInfo,
            variables: {serial_id: id},
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });

        return info;
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

async function updateDeviceDealer(input) {
    try {
        const info = await Amplify.graphql({
            query: deviceMutations.updateDeviceDealer,
            variables: {input: input},
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });

        return info;
    } catch (error) {
        console.warn(error.errors);
        console.warn(input);
        throw error;
    }
}

async function updateUserDevice(input) {
    try {
        return await Amplify.graphql({
            query: deviceMutations.updateDevice,
            variables: {input: input},
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
    } catch (error) {
        console.warn(error.errors);
        console.warn(input);
        throw error;
    }
}

async function removeUserDevice(id) {
    try {
        const device = await Amplify.graphql({
            query: mutations.deleteDevice,
            variables: {input: id},
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
        return device;
    } catch (error) {
        console.warn(error.errors);
        console.warn(id);
        throw error;
    }
}

async function checkDevice(id) {
    try {
        const check = await Amplify.graphql({
            query: queries.getDevice,
            variables: {id: id},
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });

        return check;
    } catch (error) {
        console.warn(error.errors);
        console.warn(id);
        throw error;
    }
}

async function getViewDevice(id, device_name) {
    try {
        const device = await Amplify.graphql({
            query: deviceQueries.getDevice,
            variables: {id: id},
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
        const data = device.data.getDevice;
        const view = {
            device: data,
            name: data.device_name ? data.device_name : device_name,
        };
        return view;
    } catch (err) {
        console.warn(err);
        throw err;
    }
}

async function createUserDevice(input) {
    try {
        const device = await Amplify.graphql({
            query: mutations.createDevice,
            variables: {input: input},
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
        return device;
    } catch (error) {
        console.warn(error.errors);
        console.warn(input);
        throw error;
    }
}

async function createProductRegistration(input) {
    try {
        const device = await Amplify.graphql({
            query: mutations.createDeviceRegistration,
            variables: {input: input},
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
        return device;
    } catch (error) {
        console.warn(error.errors);
        console.warn(input);
        throw error;
    }
}

async function removeDeviceSchedule(id) {
    try {
        const device = await Amplify.graphql({
            query: mutations.deleteDeviceSchedule,
            variables: {input: {id}},
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
        return device;
    } catch (error) {
        console.warn(error.errors);
        console.warn(id);
        throw error;
    }
}

async function createSchedule(serial, scheduleName, startTime, endTime, days) {
    try {
        const times = {
            start: startTime,
            end: endTime,
        };

        const input = {
            id: uuidv4(),
            serial_id: serial,
            name: scheduleName,
            days: [days],
            times: [times],
            schedule_date: `${moment().format()}`,
            active: true,
        };

        return await Amplify.graphql({
            query: mutations.createDeviceSchedule,
            variables: {input: input},
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

async function activateSchedule(scheduleId) {
    try {
        return Amplify.graphql({
            query: mutations.updateDeviceSchedule,
            variables: {
                input: {
                    id: scheduleId,
                    active: true,
                },
            },
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

async function deactivateSchedule(scheduleId) {
    try {
        return Amplify.graphql({
            query: mutations.updateDeviceSchedule,
            variables: {
                input: {
                    id: scheduleId,
                    active: false,
                },
            },
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

async function updateSchedule(serial, scheduleId, scheduleName, startTime, endTime, days) {
    try {
        const times = {
            start: startTime,
            end: endTime,
        };

        const input = {
            id: scheduleId,
            serial_id: serial,
            name: scheduleName,
            days: [days],
            times: [times],
            schedule_date: `${moment().format()}`,
            active: true,
        };

        return await Amplify.graphql({
            query: mutations.updateDeviceSchedule,
            variables: {input: input},
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
    } catch (error) {
        console.warn(error);
        throw error;
    }
}
