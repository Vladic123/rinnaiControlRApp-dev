/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {ScrollView, Text, Switch, View, Alert, StyleSheet} from 'react-native';
import {appVersion} from '../../config';

import {Storage} from 'aws-amplify';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import moment from 'moment-timezone';
import {TouchableOpacity} from 'react-native-gesture-handler';
import RinnaiLoader from '../../components/RinnaiLoader';
import API from '../../services/API';
import utils from '../../utils';

const defaultActivity = {
    clientId: '',
    eventType: 'disconnected',
};

const defaultShadow = {
    module_firmware_version: false,
    operation_enabled: false,
};

const defaultInfo = {
    name: '',
    public_ip: '',
    local_ip: '',
    serial_id: '',
    wifi_ssid: '',
};

const DeviceInfo = ({navigation}) => {
    const data = useSelector((state) => state.device.view);
    const device = useSelector((state) => state.device.view.device);
    const registration = data.device?.registration?.items[0];
    const [deviceData, setDeviceData] = useState(device);
    const [power, setPower] = useState(device);
    const [deviceInfo, setDeviceInfo] = useState(device?.info || defaultInfo);
    const [deviceShadow, setDeviceShadow] = useState(device?.shadow ? device.shadow : defaultShadow);
    const [loading, setLoading] = useState(false);
    const [latestOTA, setLatestOTA] = useState({});
    const [timezone, setTimezone] = useState('');
    const name = device?.device_name ? device.device_name : data.name;

    useEffect(() => {
        setDeviceInfo(device?.info || defaultInfo);
        setDeviceShadow(device?.shadow ? device.shadow : defaultShadow);
        setDeviceData(device);
        setTimezone(utils.getTimeZoneCoordinatesDescription(device?.shadow?.timezone));
        setPower(device?.shadow?.operation_enabled);
    }, [device]);

    useEffect(() => {
        latestFirmware();
    }, []);

    const switchPower = async () => {
        const newPowerState = !power;
        let resp;
        setLoading(true);
        setPower(newPowerState);
        try {
            if (newPowerState) {
                resp = await API.turnHeaterOn(deviceInfo.name);
            } else {
                resp = await API.turnHeaterOff(deviceInfo.name);
            }
            if (resp && resp.data !== 'success') {
                setPower(!newPowerState);
            }
        } catch (error) {
            console.log(error);
            setPower(!newPowerState);
            Alert.alert('Error', 'Error setting tankless power. Please contact support.');
        } finally {
            setLoading(false);
        }
    };

    const latestFirmware = async () => {
        setLoading(true);
        try {
            let otaUpdates = {};
            await Storage.list('', {level: 'public'})
                .then((result) => {
                    result.map((item, key) => {
                        const otaItem = item.key;
                        const otaCheck = otaItem.split('.');
                        if (otaCheck[1] === 'tgz') {
                            const otaName = otaItem.split('_');
                            const version = otaName[0].split('-');
                            const ota = {
                                [version[1]]: otaItem,
                            };
                            otaUpdates = {...otaUpdates, ...ota};
                        }
                    });

                    const latestName = Object.values(otaUpdates).reverse();
                    const latestNumber = Object.keys(otaUpdates).reverse();

                    const update = {
                        updateVersion: latestNumber[0],
                        updateName: latestName[0],
                    };

                    setLatestOTA(update);
                    setLoading(false);
                })
                .catch((err) => console.log(err));
        } finally {
            setLoading(false);
        }
    };

    const updateFirmware = async () => {
        try {
            setLoading(true);
            await API.otaUpdate(deviceInfo.name);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.appContainer}>
            <RinnaiLoader modal={loading} />
            <TitleBar backButton={true} backNav="menu" navigation={navigation} title={name?.toUpperCase()} subTitle={false} drawer={false} />
            <View
                style={{
                    ...styles.formBox,
                    backgroundColor: 'transparent',
                    flex: 1,
                    borderRadius: 10,
                    marginTop: 0,
                    marginBottom: 20,
                    paddingBottom: 0,
                }}>
                <Text
                    style={{
                        ...styles.h3,
                        fontWeight: '300',
                        fontSize: 22,
                        marginBottom: 20,
                    }}>
                    Unit & Product Info
                </Text>
                <ScrollView style={{flex: 1, width: '100%'}}>
                    <View
                        style={{
                            ...styles.itemWindow,
                            padding: 0,
                            marginBottom: 10,
                        }}>
                        <Text style={{...styles.h3, fontSize: 18, padding: 10}}>control•r™ Information</Text>
                        <View style={{...styles.deviceStatus, borderBottomWidth: 0}}>
                            <View />
                            <View style={styles.statusTitle}>
                                <Text style={{...styles.h3, fontSize: 12}}>Wifi</Text>
                            </View>
                            <View style={styles.statusValue}>
                                <Text style={{...styles.statusText, fontWeight: '300'}}>{deviceInfo.wifi_ssid}</Text>
                            </View>
                        </View>
                        <View style={buttonStyle.buttonContainer}>
                            <TouchableOpacity
                                style={buttonStyle.button}
                                onPress={() =>
                                    navigation.navigate('Pairing', {
                                        screen: 'APMode',
                                    })
                                }>
                                <Text style={buttonStyle.buttonText}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.deviceStatus}>
                            <View />
                            <View style={styles.statusTitle}>
                                <Text style={{...styles.h3, fontSize: 12}}>App Version</Text>
                            </View>
                            <View style={styles.statusValue}>
                                <Text style={{...styles.statusText, fontWeight: '300'}}>{appVersion}</Text>
                            </View>
                        </View>
                        <View style={{...styles.deviceStatus, borderBottomWidth: 0}}>
                            <View />
                            <View style={styles.statusTitle}>
                                <Text style={{...styles.h3, fontSize: 12}}>Firmware Version</Text>
                            </View>
                            <View style={styles.statusValue}>
                                <Text style={{...styles.statusText, fontWeight: '300'}}>
                                    {deviceShadow.module_firmware_version ? deviceShadow.module_firmware_version : 'N/A'}
                                </Text>
                            </View>
                        </View>
                        <View style={buttonStyle.buttonContainer}>
                            {latestOTA && latestOTA.updateVersion > deviceShadow.module_firmware_version ? (
                                <TouchableOpacity style={buttonStyle.button} onPress={() => updateFirmware()}>
                                    <Text style={buttonStyle.buttonText}>{`Update Avilable (v.${latestOTA.updateVersion})`}</Text>
                                </TouchableOpacity>
                            ) : (
                                <View style={buttonStyle.button}>
                                    <Text style={buttonStyle.buttonText}>Latest Build</Text>
                                </View>
                            )}
                        </View>
                        <View style={styles.deviceStatus}>
                            <View />
                            <View style={styles.statusTitle}>
                                <Text style={{...styles.h3, fontSize: 12}}>Serial Number</Text>
                            </View>
                            <View style={styles.statusValue}>
                                <Text style={{...styles.statusText, fontWeight: '300'}}>{deviceInfo.serial_id}</Text>
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            ...styles.itemWindow,
                            padding: 0,
                            marginBottom: 10,
                        }}>
                        <Text style={{...styles.h3, fontSize: 18, padding: 10}}>Tankless Information</Text>
                        <View style={{...styles.deviceStatus, borderBottomWidth: 0}}>
                            <View />
                            <View style={styles.statusTitle}>
                                <Text style={{...styles.h3, fontSize: 12}}>Name</Text>
                            </View>
                            <View style={styles.statusValue}>
                                <Text style={{...styles.statusText, fontWeight: '300'}}>{deviceData?.device_name}</Text>
                            </View>
                        </View>
                        <View style={buttonStyle.buttonContainer}>
                            <TouchableOpacity style={buttonStyle.button} onPress={() => navigation.navigate('EditHeater')}>
                                <Text style={buttonStyle.buttonText}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{...styles.deviceStatus, borderBottomWidth: 0}}>
                            <View />
                            <View style={styles.statusTitle}>
                                <Text style={{...styles.h3, fontSize: 12}}>Time Zone</Text>
                            </View>
                            <View style={styles.statusValue}>
                                <Text style={{...styles.statusText, fontWeight: '300'}}>{timezone}</Text>
                            </View>
                        </View>
                        <View style={buttonStyle.buttonContainer}>
                            <TouchableOpacity style={buttonStyle.button} onPress={() => navigation.navigate('EditTimezone')}>
                                <Text style={buttonStyle.buttonText}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.deviceStatus}>
                            <View />
                            <View style={styles.statusTitle}>
                                <Text style={{...styles.h3, fontSize: 12}}>Tankless Power</Text>
                            </View>
                            <View style={{...styles.statusValue, paddingRight: 20}}>
                                <Text style={{...styles.statusText, fontWeight: '300'}}>{power ? 'On' : 'Off'}</Text>
                            </View>
                            <View style={styles.statusEdit}>
                                <Switch
                                    trackColor={{
                                        false: '#767577',
                                        true: '#94CB2B',
                                    }}
                                    thumbColor="#f4f3f4"
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => switchPower()}
                                    value={power}
                                />
                            </View>
                        </View>
                        <View style={{...styles.deviceStatus, borderBottomWidth: 0}}>
                            <View />
                            <View style={styles.statusTitle}>
                                <Text style={{...styles.h3, fontSize: 14}}>Location</Text>
                            </View>
                            <View style={styles.statusValue}>
                                <Text style={{...styles.statusText, fontWeight: '300'}}>{deviceData?.address}</Text>
                                <Text style={{...styles.statusText, fontWeight: '300'}}>
                                    {deviceData?.city}, {deviceData?.state}
                                </Text>
                            </View>
                        </View>
                        <View style={buttonStyle.buttonContainer}>
                            <TouchableOpacity style={buttonStyle.button} onPress={() => navigation.navigate('EditLocation')}>
                                <Text style={buttonStyle.buttonText}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={{
                            ...styles.itemWindow,
                            padding: 0,
                            marginBottom: 10,
                        }}>
                        <Text style={{...styles.h3, fontSize: 16, padding: 10}}>Product Registration</Text>
                        <View style={styles.deviceStatus}>
                            <View />
                            <View style={styles.statusTitle}>
                                <Text style={{...styles.h3, fontSize: 14}}>Serial Number</Text>
                            </View>
                            <View style={styles.statusValue}>
                                <Text style={{...styles.statusText, fontWeight: '300'}}>{registration && registration.serial}</Text>
                            </View>
                        </View>
                        <View style={styles.deviceStatus}>
                            <View />
                            <View style={styles.statusTitle}>
                                <Text style={{...styles.h3, fontSize: 14}}>Model Name</Text>
                            </View>
                            <View style={styles.statusValue}>
                                <Text style={{...styles.statusText, fontWeight: '300'}}>{registration && registration.model}</Text>
                            </View>
                        </View>
                        <View style={styles.deviceStatus}>
                            <View />
                            <View style={styles.statusTitle}>
                                <Text style={{...styles.h3, fontSize: 14}}>Purchase Date</Text>
                            </View>
                            <View style={styles.statusValue}>
                                <Text style={{...styles.statusText, fontWeight: '300'}}>
                                    {registration && moment(registration.install_datetime).format('LL')}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.deviceStatus}>
                            <View />
                            <View style={styles.statusTitle}>
                                <Text style={{...styles.h3, fontSize: 14}}>Application Type</Text>
                            </View>
                            <View style={styles.statusValue}>
                                <Text style={{...styles.statusText, fontWeight: '300'}}>{registration && registration.application_type}</Text>
                            </View>
                        </View>
                        <View style={styles.deviceStatus}>
                            <View />
                            <View style={styles.statusTitle}>
                                <Text style={{...styles.h3, fontSize: 14}}>Recirculation Type</Text>
                            </View>
                            <View style={styles.statusValue}>
                                <Text style={{...styles.statusText, fontWeight: '300'}}>{registration && registration.recirculation_type}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

const buttonStyle = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderBottomWidth: 1,
        borderBottomColor: '#D8D8D8',
        paddingRight: 10,
        paddingBottom: 10,
    },
    button: {
        backgroundColor: '#E5E9ED',
        borderRadius: 30,
        padding: 8,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontWeight: '700',
        color: '#2E353C',
        textAlign: 'center',
    },
});
export default DeviceInfo;
