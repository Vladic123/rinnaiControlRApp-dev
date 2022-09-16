/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import Device from '../screens/device/DeviceHome';
import Schedule from '../screens/device/Schedule';
import NewSchedule from '../screens/device/NewSchedule';
import VacationSchedule from '../screens/device/VacationSchedule';
import DeviceStatus from '../screens/device/DeviceStatus';
import DeviceInfo from '../screens/device/DeviceInfo';
import EditHeater from '../screens/device/EditHeater';
import EditLocation from '../screens/device/EditLocation';
import ProductHome from '../screens/registration/ProductHome';
import ProductInfo from '../screens/registration/ProductInfo';
import ProductLocation from '../screens/registration/ProductLocation';
import ProductType from '../screens/registration/ProductType';
import RegistrationSuccess from '../screens/registration/RegistrationSuccess';
import styles from '../styles/Style';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import EditSchedule from '../screens/device/EditSchedule';
import DeviceErrors from '../screens/device/DeviceErrors';
import SignUp from '../screens/monitoring/SignUp';
import Confirm from '../screens/monitoring/Confirm';
import Request from '../screens/monitoring/Request';
import Monitoring from '../screens/monitoring/Monitoring';
import MonitoringRequest from '../screens/monitoring/MonitoringRequest';
import MonitoringRespond from '../screens/monitoring/MonitoringRespond';
import Success from '../screens/monitoring/Success';
import RequestSent from '../screens/monitoring/RequestSent';
import Timezones from '../screens/device/Timezones';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function DeviceTabBar({state, descriptors, navigation}) {
    const focusedOptions = descriptors[state.routes[state.index].key].options;

    if (focusedOptions.tabBarVisible === false) {
        return null;
    }

    return (
        <View style={{flexDirection: 'row'}}>
            {state.routes.map((route, index) => {
                const {options} = descriptors[route.key];
                const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                const tabIcon = (item) => {
                    var icon;

                    if (item === 'Device') {
                        icon = 'home-lg-alt';
                    } else if (item === 'Schedule') {
                        icon = 'calendar-alt';
                    } else if (item === 'Status') {
                        icon = 'info-square';
                    }

                    return icon;
                };
                if (label !== 'Monitor') {
                    return (
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityState={isFocused ? {selected: true} : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={styles.tabBar}
                            key={label}>
                            <FontAwesome5Pro
                                name={tabIcon(label)}
                                type={isFocused ? 'duotone' : 'light'}
                                color={isFocused ? '#000000' : '#b9b9c3'}
                                style={{marginRight: 5}}
                            />
                            <Text
                                style={{
                                    color: isFocused ? '#000000' : '#b9b9c3',
                                }}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                }
            })}
        </View>
    );
}

export function ScheduleStack() {
    return (
        <Stack.Navigator headerMode="none" initialRouteName="Schedule">
            <Stack.Screen name="Schedule" component={Schedule} />
            <Stack.Screen name="NewSchedule" component={NewSchedule} />
            <Stack.Screen name="VacationSchedule" component={VacationSchedule} />
            <Stack.Screen name="EditSchedule" component={EditSchedule} />
            <Stack.Screen name="EditTimezone" component={Timezones} />
        </Stack.Navigator>
    );
}

export function ErrorStack() {
    return (
        <Stack.Navigator headerMode="none" initialRouteName="DeviceErrors">
            <Stack.Screen name="DeviceErrors" component={DeviceErrors} />
        </Stack.Navigator>
    );
}

export function StatusStack() {
    return (
        <Stack.Navigator headerMode="none" initialRouteName="Schedule">
            <Stack.Screen name="Status" component={DeviceStatus} />
            <Stack.Screen name="Info" component={DeviceInfo} />
            <Stack.Screen name="EditHeater" component={EditHeater} />
            <Stack.Screen name="EditLocation" component={EditLocation} />
            <Stack.Screen name="EditTimezone" component={Timezones} />
        </Stack.Navigator>
    );
}

export function RegistrationStack() {
    return (
        <Stack.Navigator headerMode="none" initialRouteName="ProductHome">
            <Stack.Screen name="ProductHome" component={ProductHome} />
            <Stack.Screen name="ProductInfo" component={ProductInfo} />
            <Stack.Screen name="ProductLocation" component={ProductLocation} />
            <Stack.Screen name="ProductType" component={ProductType} />
            <Stack.Screen name="RegistrationSuccess" component={RegistrationSuccess} />
        </Stack.Navigator>
    );
}

export function DealerMonitoringStack() {
    return (
        <Stack.Navigator headerMode="none" initialRouteName="SignUp">
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Confirm" component={Confirm} />
            <Stack.Screen name="Request" component={Request} />
            <Stack.Screen name="RequestSent" component={RequestSent} />
            <Stack.Screen name="Monitoring" component={Monitoring} />
            <Stack.Screen name="MonitoringRequest" component={MonitoringRequest} />
            <Stack.Screen name="MonitoringRespond" component={MonitoringRespond} />
            <Stack.Screen name="Success" component={Success} />
        </Stack.Navigator>
    );
}

function DeviceStack() {
    return (
        <Tab.Navigator tabBar={(props) => <DeviceTabBar {...props} />} headerMode="none" initialRouteName="Device">
            <Tab.Screen name="Device" component={Device} />
            <Tab.Screen name="Schedule" component={ScheduleStack} />
            <Tab.Screen name="Status" component={StatusStack} />
            <Tab.Screen name="Monitor" component={DealerMonitoringStack} />
        </Tab.Navigator>
    );
}

export function DeviceInfoStack() {
    return (
        <Stack.Navigator headerMode="none" initialRouteName="info">
            <Stack.Screen name="info" component={DeviceInfo} />
        </Stack.Navigator>
    );
}

export default DeviceStack;
