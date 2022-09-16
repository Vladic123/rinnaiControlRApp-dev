import * as RNLocalize from 'react-native-localize';
import moment from 'moment-timezone';

export default {
    getCurrentTimezone,
    getDeviceTimeZone,
    getTimeZoneCoordinatesDescription,
    getDeviceTimeZoneCodeDescription,
};

function getCurrentTimezone() {
    const date = new Date();
    const localTZ = RNLocalize.getTimeZone();
    const zone = moment(date).tz(localTZ).format('z');

    return getDeviceTimeZone(zone);
}

function getDeviceTimeZone(zone) {
    switch (zone) {
        case 'EST':
            return 'EST5EDT,M3.2.0,M11.1.0';
        case 'EDT':
            return 'EST5EDT,M3.2.0,M11.1.0';
        case 'CST':
            return 'CST6CDT,M3.2.0,M11.1.0';
        case 'CDT':
            return 'CST6CDT,M3.2.0,M11.1.0';
        case 'MST':
            return 'MST7MDT,M3.2.0,M11.1.0';
        case 'MDT':
            return 'MST7MDT,M3.2.0,M11.1.0';
        case 'PST':
            return 'PST8PDT,M3.2.0,M11.1.0';
        case 'PDT':
            return 'PST8PDT,M3.2.0,M11.1.0';
        case 'AKST':
            return 'AKST9AKDT,M3.2.0,M11.1.0';
        case 'AKDT':
            return 'AKST9AKDT,M3.2.0,M11.1.0';
        case 'HAW':
            return 'HAW10';
        case 'AST':
            return 'AST4ADT,M4.1.0/00:01:00,M10.5.0/00:01:00';
        case 'ADT':
            return 'AST4ADT,M4.1.0/00:01:00,M10.5.0/00:01:00';
        case 'NST':
            return 'NST+3:30NDT+2:30,M3.2.0/00:01:00,M11.1.0/00:01:00';
        case 'NDT':
            return 'NST+3:30NDT+2:30,M3.2.0/00:01:00,M11.1.0/00:01:00';
        default:
            return 'CST6CDT,M3.2.0,M11.1.0';
    }
}

function getDeviceTimeZoneCodeDescription(zone) {
    switch (zone) {
        case 'EST':
            return 'Eastern';
        case 'EDT':
            return 'Eastern';
        case 'CST':
            return 'Central';
        case 'CDT':
            return 'Central';
        case 'MST':
            return 'Mountain';
        case 'MDT':
            return 'Mountain';
        case 'PST':
            return 'Pacific';
        case 'PDT':
            return 'Pacific';
        case 'AKST':
            return 'Alaska';
        case 'AKDT':
            return 'Alaska';
        case 'HAW':
            return 'Hawaii';
        case 'AST':
            return 'Atlantic';
        case 'ADT':
            return 'Atlantic';
        case 'NST':
            return 'Newfoundland';
        case 'NDT':
            return 'Newfoundland';
        default:
            return 'Central';
    }
}

function getTimeZoneCoordinatesDescription(coordinates) {
    switch (coordinates) {
        case 'EST5EDT,M3.2.0,M11.1.0':
            return 'Eastern';
        case 'CST6CDT,M3.2.0,M11.1.0':
            return 'Central';
        case 'MST7MDT,M3.2.0,M11.1.0':
            return 'Mountain';
        case 'PST8PDT,M3.2.0,M11.1.0':
            return 'Pacific';
        case 'AKST9AKDT,M3.2.0,M11.1.0':
            return 'Alaska';
        case 'HAW10':
            return 'Hawaii';
        case 'AST4ADT,M4.1.0/00:01:00,M10.5.0/00:01:00':
            return 'Atlantic';
        case 'NST+3:30NDT+2:30,M3.2.0/00:01:00,M11.1.0/00:01:00':
            return 'Newfoundland';
        default:
            return 'Central';
    }
}
