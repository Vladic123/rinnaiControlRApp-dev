/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {TouchableOpacity, Text, View} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {Auth} from 'aws-amplify';
import {authActions} from '../reducers/auth';
import {deviceActions} from '../reducers/device';
import drawerStyles from '../styles/Drawer';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import {useIsDrawerOpen} from '@react-navigation/drawer';
import moment from 'moment-timezone';
import styles from '../styles/Style';

function RinnaiDrawer({props, navigation}) {
    const isDrawerOpen = useIsDrawerOpen();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.account);
    const devices = useSelector((state) => state.auth.account.devices);
    const [toggleMenu, setToggleMenu] = useState(false);
    const [monitorNotice, setMonitorNotice] = useState(false);
    const [errorNotice, setErrorNotice] = useState(false);

    useEffect(() => {
        if (isDrawerOpen) {
            setMonitorNotice(false);
            setErrorNotice(false);
            dispatch(authActions.fetchUserByEmail(userData.username));
        }
    }, [isDrawerOpen]);

    const setDeviceView = (device, route) => {
        dispatch(deviceActions.setDeviceView(device)).then((data) => {
            navigation.navigate('DeviceHome', {
                screen: route,
                params: data,
            });
        });
    };

    const getDeviceView = (device, route) => {
        dispatch(deviceActions.setDeviceView(device)).then((data) => {
            navigation.navigate(route, {
                params: data,
            });
        });
    };

    const setMonitoringView = (device, route) => {
        dispatch(deviceActions.setDeviceView(device)).then((data) => {
            navigation.navigate('Monitoring', {
                screen: route,
                params: data,
            });
        });
    };

    const setRegisterView = (device, route) => {
        dispatch(deviceActions.setDeviceView(device)).then((data) => {
            navigation.navigate('Register', {
                screen: route,
                params: data,
            });
        });
    };

    const setErrorView = (device, route) => {
        dispatch(deviceActions.setDeviceView(device)).then((data) => {
            navigation.navigate('Error', {
                screen: route,
                params: data,
            });
        });
    };

    const setStatusView = (device, route) => {
        dispatch(deviceActions.setDeviceView(device)).then((data) => {
            navigation.navigate('Status', {
                screen: route,
                params: data,
            });
        });
    };

    const showSchedules = () => {
        if (devices && devices.items && devices.items.length > 0) {
            const listDevices = devices.items;

            return listDevices.map((device, key) => {
                var label;
                const schedules = device.schedule.items;
                if (Object.keys(schedules).length > 0) {
                    label = 'View Schedules';
                } else {
                    label = 'Create Schedule';
                }
                const data = {
                    device: device,
                    name: device.device_name ? device.device_name.toUpperCase() : `Heater ${key + 1}`,
                };
                return (
                    <TouchableOpacity
                        key={key}
                        style={{
                            backgroundColor: '#4F5B66',
                            padding: 10,
                            width: '90%',
                            borderRadius: 5,
                            marginBottom: 2,
                            flexDirection: 'row',
                        }}
                        onPress={() => setDeviceView(data, 'Schedule')}>
                        <Text numberOfLines={1} style={{color: '#ffffff', flex: 1}}>
                            {data.name}
                        </Text>
                        <Text
                            style={{
                                color: '#ffffff',
                                flex: 1,
                                textAlign: 'right',
                                fontWeight: '300',
                                fontSize: 12,
                            }}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            });
        }
    };

    const showErrors = () => {
        if (devices && devices.items && devices.items.length > 0) {
            const listDevices = devices.items;

            return listDevices.map((device, key) => {
                var label;
                var route;
                var color = '#4F5B66';
                var font = '#ffffff';
                let errors = device.errorLogs.items;
                errors = errors.slice().sort((a, b) => {
                    var dayA = moment(a.createdAt);
                    var dayB = moment(b.createdAt);
                    if (dayA > dayB) {
                        return -1;
                    }
                    if (dayA < dayB) {
                        return 1;
                    }
                });
                if (errors && errors.length > 0) {
                    Object.keys(errors).some((item) => {
                        if (errors[item].active) {
                            errorNotice === false && setErrorNotice(true);
                            label = `Error Code: ${errors[item].error_code}`;
                            color = '#4F5B66';
                            font = '#ffffff';
                            return label;
                        } else {
                            color = '#4F5B66';
                            label = 'No Active Errors';
                            font = '#ffffff';
                            route = 'DeviceErrors';
                        }
                    });
                } else {
                    color = '#4F5B66';
                    label = 'No Active Errors';
                    font = '#ffffff';
                    route = 'DeviceErrors';
                }
                const data = {
                    device: device,
                    name: device.device_name ? device.device_name.toUpperCase() : `Heater ${key + 1}`,
                };
                return (
                    <TouchableOpacity
                        key={key}
                        style={{
                            backgroundColor: color,
                            padding: 10,
                            width: '90%',
                            borderRadius: 5,
                            marginBottom: 2,
                            flexDirection: 'row',
                        }}
                        onPress={() => setErrorView(data, route)}>
                        <Text numberOfLines={1} style={{color: font, flex: 1}}>
                            {data.name}
                        </Text>
                        <Text
                            style={{
                                color: font,
                                flex: 1,
                                textAlign: 'right',
                                fontWeight: '300',
                                fontSize: 12,
                            }}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            });
        }
    };

    const showMonitoring = () => {
        if (devices && devices.items && devices.items.length > 0) {
            const listDevices = devices.items;

            return listDevices.map((device, key) => {
                var label;
                var route;
                var color = '#4F5B66';
                var font = '#ffffff';
                const monitoring = device.monitoring;
                if (monitoring && Object.keys(monitoring).length > 0) {
                    console.log(monitoring.request_state);
                    switch (monitoring.request_state) {
                        case 'DealerAccepted':
                            label = 'Being Monitored';
                            color = '#4F5B66';
                            font = '#ffffff';
                            route = 'Monitoring';
                            break;
                        case 'Accepted':
                            label = 'Being Monitored';
                            color = '#4F5B66';
                            font = '#ffffff';
                            route = 'Monitoring';
                            break;
                        case 'DealerDeclined':
                            label = 'Request Declined';
                            color = '#4F5B66';
                            font = '#ffffff';
                            route = 'MonitoringRequest';
                            monitorNotice === false && setMonitorNotice(true);
                            break;
                        case 'Sent':
                            label = 'Request Pending';
                            color = '#4F5B66';
                            font = '#ffffff';
                            route = 'MonitoringRequest';
                            monitorNotice === false && setMonitorNotice(true);
                            break;
                        case 'DealerSent':
                            label = 'Monitoring Request';
                            color = '#4F5B66';
                            font = '#ffffff';
                            route = 'MonitoringRespond';
                            monitorNotice === false && setMonitorNotice(true);
                            break;
                        default:
                            color = '#4F5B66';
                            label = 'Sign Up for Monitoring';
                            route = 'SignUp';
                            font = '#ffffff';
                            break;
                    }
                } else {
                    color = '#4F5B66';
                    label = 'Sign Up for Monitoring';
                    route = 'SignUp';
                    font = '#ffffff';
                }
                const data = {
                    device: device,
                    name: device.device_name ? device.device_name.toUpperCase() : `Heater ${key + 1}`,
                };
                return (
                    <TouchableOpacity
                        key={key}
                        style={{
                            backgroundColor: color,
                            padding: 10,
                            width: '90%',
                            borderRadius: 5,
                            marginBottom: 2,
                            flexDirection: 'row',
                        }}
                        onPress={() => setMonitoringView(data, route)}>
                        <Text numberOfLines={1} style={{color: font, flex: 1}}>
                            {data.name}
                        </Text>
                        <Text
                            style={{
                                color: font,
                                flex: 1,
                                textAlign: 'right',
                                fontWeight: '300',
                                fontSize: 12,
                            }}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            });
        }
    };

    const showRegistration = () => {
        if (devices && devices.items && devices.items.length > 0) {
            const listDevices = devices.items;

            return listDevices.map((device, key) => {
                var label;
                var route;
                var color;
                var font;
                const registration = device.registration.items[0];
                if (registration && Object.keys(registration).length > 0) {
                    label = 'Device Registered';
                    color = '#CF000E';
                    font = '#000000';
                    route = 'ProductHome';
                } else {
                    color = '#4F5B66';
                    label = 'Register Device';
                    route = 'ProductHome';
                    font = '#ffffff';
                }
                const data = {
                    device: device,
                    name: device.device_name ? device.device_name.toUpperCase() : `Heater ${key + 1}`,
                };
                return (
                    <TouchableOpacity
                        key={key}
                        style={{
                            backgroundColor: color,
                            padding: 10,
                            width: '90%',
                            borderRadius: 5,
                            marginBottom: 2,
                            flexDirection: 'row',
                        }}
                        onPress={() => setRegisterView(data, route)}>
                        <Text numberOfLines={1} style={{color: font, flex: 1}}>
                            {data.name}
                        </Text>
                        <Text
                            style={{
                                color: font,
                                flex: 1,
                                textAlign: 'right',
                                fontWeight: '300',
                                fontSize: 12,
                            }}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            });
        }
    };

    const showDevices = (route) => {
        if (devices && devices.items && devices.items.length > 0) {
            const listDevices = devices.items;

            return listDevices.map((device, key) => {
                const data = {
                    device: device,
                    name: device.device_name ? device.device_name.toUpperCase() : `Heater ${key + 1}`,
                };
                return (
                    <TouchableOpacity
                        key={key}
                        style={{
                            backgroundColor: '#4F5B66',
                            padding: 10,
                            width: '90%',
                            borderRadius: 5,
                            marginBottom: 2,
                        }}
                        onPress={() => setDeviceView(data, route)}>
                        <Text numberOfLines={1} style={{color: '#ffffff'}}>
                            {data.name}
                        </Text>
                    </TouchableOpacity>
                );
            });
        }
    };

    const forgetDevices = () => {
        if (devices && devices.items && devices.items.length > 0) {
            const listDevices = devices.items;

            return listDevices.map((device, key) => {
                const data = {
                    device: device,
                    name: device.device_name ? device.device_name.toUpperCase() : `Heater ${key + 1}`,
                };
                return (
                    <TouchableOpacity
                        key={key}
                        style={{
                            backgroundColor: '#4F5B66',
                            padding: 10,
                            width: '90%',
                            borderRadius: 5,
                            marginBottom: 2,
                        }}
                        onPress={() => getDeviceView(data, 'ForgetDevice')}>
                        <Text numberOfLines={1} style={{color: '#ffffff'}}>
                            {data.name}
                        </Text>
                    </TouchableOpacity>
                );
            });
        }
    };

    const showStatus = (route) => {
        if (devices && devices.items && devices.items.length > 0) {
            const listDevices = devices.items;

            return listDevices.map((device, key) => {
                const data = {
                    device: device,
                    name: device.device_name ? device.device_name.toUpperCase() : `Heater ${key + 1}`,
                };
                return (
                    <TouchableOpacity
                        key={key}
                        style={{
                            backgroundColor: '#4F5B66',
                            padding: 10,
                            width: '90%',
                            borderRadius: 5,
                            marginBottom: 2,
                        }}
                        onPress={() => setStatusView(data, route)}>
                        <Text numberOfLines={1} style={{color: '#ffffff'}}>
                            {data.name}
                        </Text>
                    </TouchableOpacity>
                );
            });
        }
    };

    const drawerMenu = (menu) => {
        if (menu === toggleMenu) {
            setToggleMenu(false);
        } else {
            setToggleMenu(menu);
        }
    };

    const logOutUser = async () => {
        await Auth.signOut({global: true});
        dispatch(authActions.logOutUser());
        navigation.navigate('Logout');
    };

    const toggleIcon = (menu) => {
        if (menu === toggleMenu) {
            return <FontAwesome5Pro name="chevron-up" style={{color: '#ffffff'}} light />;
        } else {
            return <FontAwesome5Pro name="chevron-down" style={{color: '#ffffff'}} light />;
        }
    };

    return (
        <DrawerContentScrollView {...props}>
            <View style={drawerStyles.drawer}>
                <View>
                    <DrawerItem
                        style={drawerStyles.drawerItem}
                        labelStyle={drawerStyles.drawerLabel}
                        label="Home"
                        icon={() => toggleIcon('home')}
                        onPress={() => drawerMenu('home')}
                    />
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            display: toggleMenu === 'home' ? 'flex' : 'none',
                        }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#4F5B66',
                                padding: 10,
                                width: '90%',
                                borderRadius: 5,
                                marginBottom: 2,
                            }}
                            onPress={() => navigation.navigate('Home')}>
                            <Text style={{color: '#ffffff'}}>ALL DEVICES</Text>
                        </TouchableOpacity>
                        {showDevices('Device')}
                    </View>
                </View>
                <View>
                    <DrawerItem
                        style={drawerStyles.drawerItem}
                        labelStyle={drawerStyles.drawerLabel}
                        label="Schedule"
                        icon={() => toggleIcon('schedule')}
                        onPress={() => drawerMenu('schedule')}
                    />
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            display: toggleMenu === 'schedule' ? 'flex' : 'none',
                        }}>
                        {showSchedules()}
                    </View>
                </View>
                <View>
                    <DrawerItem
                        style={drawerStyles.drawerItem}
                        labelStyle={drawerStyles.drawerLabel}
                        label="Rinnai Pro Monitoring"
                        icon={() => toggleIcon('monitoring')}
                        onPress={() => drawerMenu('monitoring')}
                    />
                    {monitorNotice && <View style={styles.alert} />}
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            display: toggleMenu === 'monitoring' ? 'flex' : 'none',
                        }}>
                        {showMonitoring()}
                    </View>
                </View>
                <View>
                    <DrawerItem
                        style={drawerStyles.drawerItem}
                        labelStyle={drawerStyles.drawerLabel}
                        label="Error History"
                        icon={() => toggleIcon('error')}
                        onPress={() => drawerMenu('error')}
                    />
                    {errorNotice && <View style={styles.alert} />}
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            display: toggleMenu === 'error' ? 'flex' : 'none',
                        }}>
                        {showErrors()}
                    </View>
                </View>
                <View>
                    <DrawerItem
                        style={drawerStyles.drawerItem}
                        labelStyle={drawerStyles.drawerLabel}
                        label="System Status"
                        icon={() => toggleIcon('status')}
                        onPress={() => drawerMenu('status')}
                    />
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            display: toggleMenu === 'status' ? 'flex' : 'none',
                        }}>
                        {showDevices('Status')}
                    </View>
                </View>
                <View>
                    <DrawerItem
                        style={drawerStyles.drawerItem}
                        labelStyle={drawerStyles.drawerLabel}
                        label="Product Registration"
                        icon={() => toggleIcon('register')}
                        onPress={() => drawerMenu('register')}
                    />
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            display: toggleMenu === 'register' ? 'flex' : 'none',
                        }}>
                        {showRegistration()}
                    </View>
                </View>
                <View>
                    <DrawerItem
                        style={drawerStyles.drawerItem}
                        labelStyle={drawerStyles.drawerLabel}
                        label="control•r Info"
                        icon={() => toggleIcon('info')}
                        onPress={() => drawerMenu('info')}
                    />
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            display: toggleMenu === 'info' ? 'flex' : 'none',
                        }}>
                        {showStatus('Info')}
                    </View>
                    <View>
                        <DrawerItem
                            style={drawerStyles.drawerItem}
                            labelStyle={drawerStyles.drawerLabel}
                            label="Forget Device"
                            icon={() => toggleIcon('forget')}
                            onPress={() => drawerMenu('forget')}
                        />
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                display: toggleMenu === 'forget' ? 'flex' : 'none',
                            }}>
                            {forgetDevices()}
                        </View>
                    </View>
                </View>
            </View>
            <View style={drawerStyles.drawerButton}>
                <DrawerItem
                    style={drawerStyles.drawerItem}
                    labelStyle={drawerStyles.drawerLabel}
                    label="My Account"
                    icon={() => <FontAwesome5Pro name="user-circle" style={{color: '#ffffff'}} light />}
                    onPress={() => navigation.navigate('MyAccount')}
                />
            </View>
            <View style={drawerStyles.drawerButton}>
                <DrawerItem
                    style={drawerStyles.drawerItem}
                    labelStyle={drawerStyles.drawerLabel}
                    label="Add A Device"
                    icon={() => <FontAwesome5Pro name="plus-circle" style={{color: '#ffffff'}} light />}
                    onPress={() => navigation.navigate('Pairing')}
                />
            </View>
            <View style={drawerStyles.drawerButton}>
                <DrawerItem
                    style={drawerStyles.drawerItem}
                    labelStyle={drawerStyles.drawerLabel}
                    label="Logout"
                    icon={() => <FontAwesome5Pro name="sign-out" style={{color: '#ffffff'}} light />}
                    onPress={() => logOutUser()}
                />
            </View>
        </DrawerContentScrollView>
    );
}

export default RinnaiDrawer;
