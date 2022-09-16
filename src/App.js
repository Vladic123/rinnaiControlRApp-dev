import React, {useState, useRef} from 'react';
import {Text} from 'react-native';
import AuthStack from './routers/AuthStack';
import RinnaiStack from './routers/RinnaiStack';
import {Provider} from 'react-redux';
import store from './reducers';
import {NavigationContainer} from '@react-navigation/native';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import {Auth} from 'aws-amplify';
import SplashScreen from 'react-native-splash-screen';
import analytics from './services/analytics';

Amplify.configure(awsconfig);
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

const App = () => {
    const [auth, setAuth] = useState(false);

    const navigationRef = useRef();
    const routeNameRef = useRef();

    Auth.currentAuthenticatedUser()
        .then((data) => {
            setAuth(true);
            SplashScreen.hide();
        })
        .catch((err) => {
            console.log(err);
            setAuth(false);
            SplashScreen.hide();
        });

    return (
        <Provider store={store}>
            {auth ? (
                <NavigationContainer
                    ref={navigationRef}
                    onReady={() => (routeNameRef.current = navigationRef.current.getCurrentRoute().name)}
                    onStateChange={async () => {
                        const previousRouteName = routeNameRef.current;
                        const currentRouteName = navigationRef.current.getCurrentRoute().name;

                        if (currentRouteName && currentRouteName.length > 0 && previousRouteName !== currentRouteName) {
                            await analytics.logScreenView({
                                screen_name: currentRouteName,
                                screen_class: currentRouteName,
                            });
                        }

                        // Save the current route name for later comparison
                        routeNameRef.current = currentRouteName;
                    }}>
                    <RinnaiStack />
                </NavigationContainer>
            ) : (
                <AuthStack />
            )}
        </Provider>
    );
};

export default App;
