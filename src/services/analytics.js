import firebase from '@react-native-firebase/app';
import analytics from '@react-native-firebase/analytics'; // this import line must come after firebase import

// we expect this not to be initialized with debug builds
const isInitialized = () => firebase.apps.length > 0;

async function logScreenView({screen_name, screen_class}) {
    if (!isInitialized()) {
        console.info(`intercepted analytics call logScreenView ${screen_name} ${screen_class}`);
        return;
    }
    return await analytics().logScreenView({screen_name, screen_class});
}

async function logEvent(name, params) {
    if (!isInitialized()) {
        console.info(`intercepted analytics call logEvent ${name}`);
        return;
    }
    return await analytics().logEvent(name, params);
}

export default {
    logScreenView,
    logEvent,
};
