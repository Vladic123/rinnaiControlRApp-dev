import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import Home from '../screens/Home';
import ForgetDevice from '../screens/device/ForgetDevice';
import ForgetSuccess from '../screens/device/ForgetSuccess';
import PairingStack from './PairingStack';
import DeviceStack from './DeviceStack';
import RinnaiDrawer from '../components/RinnaiDrawer';
import {ScheduleStack, ErrorStack, StatusStack, RegistrationStack, DealerMonitoringStack, DeviceInfoStack} from './DeviceStack';
import {LogOutStack, ProfileStack} from './AuthStack';
import styles from '../styles/Drawer';

const Drawer = createDrawerNavigator();

function RinnaiStack() {
    return (
        <Drawer.Navigator
            drawerStyle={styles.drawerStyle}
            drawerContent={(props) => <RinnaiDrawer {...props} />}
            headerMode="none"
            initialRouteName="Home"
            drawerPosition="right"
            drawerType="slide">
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="DeviceHome" component={DeviceStack} />
            <Drawer.Screen name="Pairing" component={PairingStack} />
            <Drawer.Screen name="Status" component={StatusStack} />
            <Drawer.Screen name="Error" component={ErrorStack} />
            <Drawer.Screen name="Monitoring" component={DealerMonitoringStack} />
            <Drawer.Screen name="Register" component={RegistrationStack} />
            <Drawer.Screen name="DeviceInfo" component={DeviceInfoStack} />
            <Drawer.Screen name="Schedule" component={ScheduleStack} />
            <Drawer.Screen name="ForgetDevice" component={ForgetDevice} />
            <Drawer.Screen name="ForgetSuccess" component={ForgetSuccess} />
            <Drawer.Screen name="MyAccount" component={ProfileStack} />
            <Drawer.Screen name="Logout" component={LogOutStack} />
        </Drawer.Navigator>
    );
}

export default RinnaiStack;
