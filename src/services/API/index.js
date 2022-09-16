import GraphQLService from './GraphQLService';
import RestAPI from './RestAPI';
import PortalService from './PortalService';
import MiddlewareService from './MiddlewareService';

export default {
    ...GraphQLService,
    ...RestAPI,
    ...PortalService,
    ...MiddlewareService,
    createSchedule,
    updateSchedule,
};

async function createSchedule(thingName, serial, scheduleName, startTime, endTime, days, timezone) {
    try {
        if (!timezone) {
            await MiddlewareService.updateTimezoneWithDeviceTimezone(thingName);
        }
        await MiddlewareService.enableSchedule(thingName);
        return GraphQLService.createSchedule(serial, scheduleName, startTime, endTime, days);
    } catch (error) {
        console.warn(error);
        throw error;
    }
}

async function updateSchedule(thingName, serial, scheduleId, scheduleName, startTime, endTime, days, timezone) {
    try {
        if (!timezone) {
            await MiddlewareService.updateTimezoneWithDeviceTimezone(thingName);
        }

        await MiddlewareService.enableSchedule(thingName);

        return GraphQLService.updateSchedule(serial, scheduleId, scheduleName, startTime, endTime, days);
    } catch (error) {
        console.warn(error);
        throw error;
    }
}
