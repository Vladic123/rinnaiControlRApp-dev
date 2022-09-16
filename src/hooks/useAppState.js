import {AppState} from 'react-native';
import {useEffect, useState} from 'react';

function useAppState() {
    const [appStateVisible, setAppStateVisible] = useState(AppState.current);

    useEffect(() => {
        AppState.addEventListener('change', setAppStateVisible);

        return () => {
            AppState.removeEventListener('change', setAppStateVisible);
        };
    }, []);

    return appStateVisible;
}
/*
active - The app is running in the foreground

background - The app is running in the background. The user is either:
    in another app
    on the home screen
    [Android] on another Activity (even if it was launched by your app)

inactive [iOS]  - This is a state that occurs when transitioning between foreground & background, and during periods of
inactivity such as entering the Multitasking view or in the event of an incoming call
https://reactnative.dev/docs/appstate
 */
const AppStates = {
    active: 'active',
    background: 'background',
    inactive: 'inactive',
};

export {useAppState, AppStates};
