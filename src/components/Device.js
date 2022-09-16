/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Text, Image, View, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Amplify from 'aws-amplify';
import styles from '../styles/Style';
import {deviceActions} from '../reducers/device';
import awsconfig from '../aws-exports.js';
import {useIsFocused} from '@react-navigation/native';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import API from '../services/API';

Amplify.configure(awsconfig);

const active = require('../assets/images/alert-active.png');
const wifiActive = require('../assets/images/wifi-connected.png');
const wifiInActive = require('../assets/images/wifi-disconnected.png');
const recircActive = require('../assets/images/recirculation-active.png');
const recircInActive = require('../assets/images/recirculation-inactive.png');
const tankActive = require('../assets/images/tankless-active.png');
const tankInActive = require('../assets/images/tankless-inactive.png');

const Device = ({device, refresh, item, deviceList, navigation}) => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.account.userData);
    const isFocused = useIsFocused();
    const [deviceInfo, setDeviceInfo] = useState(device?.info);
    const [deviceShadow, setDeviceShadow] = useState(device.shadow ? device.shadow : {});
    const [connection, setConnection] = useState(false);
    const [issue, setIssue] = useState(false);
    const deviceName = device.device_name;

    //Refresh Device Data
    useEffect(() => {
        if (refresh) {
            checkConnection(device.id);
        }
    }, [refresh]);

    //Initial load of data
    useEffect(() => {
        if (device.id) {
            checkConnection(device.id);
        }
        if (device.shadow) {
            setDeviceShadow(device.shadow);
        }
    }, [isFocused]);

    const setDeviceView = () => {
        const viewDevice = {
            device: device,
            name: device.device_name,
        };
        dispatch(deviceActions.setDeviceView(viewDevice)).then(() => {
            navigation.navigate('DeviceHome', {
                screen: 'Device',
                params: device,
            });
        });
    };

    const goToWifiSetup = () => {
        const viewDevice = {
            device: device,
            name: device.device_name,
        };
        dispatch(deviceActions.setDeviceView(viewDevice)).then(() => {
            navigation.navigate('Pairing', {
                screen: 'WifiHome',
                params: device,
            });
        });
    };

    const getAnalyticsLog = () => {
        return {
            userId: userData?.id,
            dsn: device?.dsn,
            serial: deviceInfo?.serial_id,
            screen: 'Device',
        };
    };

    const checkConnection = (id) => {
        API.getDeviceData(id, getAnalyticsLog())
            .then((res) => {
                if (res) {
                    const shadow = JSON.parse(res.shadow);
                    const reported = shadow.reported;
                    setDeviceShadow(reported);
                    setConnection(res.connectivity.connected);
                    setIssue(false);
                    API.getDeviceInformation(id)
                        .then((infoData) => {
                            const info = infoData.data.getDeviceInfo;
                            setDeviceInfo(info);
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                } else {
                    setConnection(false);
                    if (device.dsn) {
                        if (deviceList) {
                            const findIssue = deviceList.includes(device.dsn);
                            setIssue(findIssue);
                        }
                    }
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const connectWIFI = () => {
        return (
            <View>
                <View style={styles.itemStatus}>
                    <View style={styles.itemIcon}>
                        <Image style={{height: 30, width: 30}} source={active} />
                    </View>
                    <View style={styles.itemDescription}>
                        <Text
                            style={{
                                ...styles.h3,
                                marginLeft: 10,
                                fontSize: 16,
                                fontWeight: '600',
                                color: '#000000',
                            }}>
                            Wi-Fi Connectivity Issue Detected
                        </Text>
                    </View>
                </View>
                <View style={styles.itemStatus}>
                    <View style={styles.itemDescription}>
                        <Text
                            style={{
                                marginTop: 10,
                                fontSize: 13,
                                fontWeight: '300',
                                color: '#000000',
                            }}>
                            {`Wi-Fi setup for ${device.device_name} Needs to be updated. \nSelecting this tankless will guide you through updating your Wi-Fi.`}
                        </Text>
                    </View>
                </View>
                <View style={styles.itemStatus}>
                    <View style={styles.itemDescription}>
                        <Text
                            style={{
                                marginTop: 10,
                                fontSize: 14,
                                fontWeight: '700',
                                color: '#000000',
                            }}>
                            Update
                        </Text>
                    </View>
                    <View style={styles.itemIcon}>
                        <FontAwesome5Pro
                            name={'chevron-right'}
                            color="red"
                            border
                            style={{fontSize: 10, marginLeft: 5, fontWeight: 700, marginTop: 10}}
                        />
                    </View>
                </View>
            </View>
        );
    };

    const recirculation = () => {
        return (
            <View style={styles.itemStatus}>
                <View style={styles.itemIcon}>
                    <Image style={{height: 50, width: 50}} source={deviceShadow.recirculation_enabled ? recircActive : recircInActive} />
                </View>
                <View style={styles.itemDescription}>
                    <Text
                        style={{
                            ...styles.h3,
                            marginLeft: 10,
                            fontSize: 16,
                            fontWeight: '600',
                            color: '#000000',
                        }}>
                        {deviceShadow.recirculation_enabled ? 'Recirculation Active' : 'Recirculation Inactive'}
                    </Text>
                </View>
            </View>
        );
    };

    const tankLess = () => {
        return (
            <View style={styles.itemStatus}>
                <View style={styles.itemIcon}>
                    <Image
                        style={{height: 50, width: 50}}
                        source={deviceInfo && deviceInfo.domestic_combustion === 'true' ? tankActive : tankInActive}
                    />
                </View>
                <View style={styles.itemDescription}>
                    <Text
                        style={{
                            ...styles.h3,
                            marginLeft: 10,
                            fontSize: 16,
                            fontWeight: '600',
                            color: '#000000',
                        }}>
                        {deviceInfo && deviceInfo.domestic_combustion === 'true' ? 'Tankless In Use' : 'Tankless Not In Use'}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <TouchableOpacity style={{backgroundColor: 'transparent'}} onPress={() => (!issue ? setDeviceView() : goToWifiSetup())}>
            <View style={{...styles.itemWindow, marginBottom: 10}}>
                <View style={styles.deviceHeader}>
                    <View style={styles.deviceName}>
                        <Text
                            style={{
                                ...styles.h1,
                                fontSize: 14,
                                fontWeight: '300',
                                color: '#000000',
                            }}>
                            {deviceName ? deviceName.toUpperCase() : `Heater ${item + 1}`}
                        </Text>
                    </View>
                    <View style={styles.deviceWifi}>
                        <Image style={{height: 14, width: 19}} source={connection ? wifiActive : wifiInActive} />
                        <Text
                            style={{
                                ...styles.h3,
                                marginLeft: 10,
                                fontSize: 14,
                                fontWeight: '300',
                            }}>
                            {connection ? 'Wifi Connected' : 'Disconnected'}
                        </Text>
                    </View>
                </View>
                {!issue && tankLess()}
                {!issue && recirculation()}
                {issue && !connection && connectWIFI()}
            </View>
        </TouchableOpacity>
    );
};

export default Device;
