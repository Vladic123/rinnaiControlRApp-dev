/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Image, Text, Alert} from 'react-native';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import Amplify from 'aws-amplify';
import {deviceActions} from '../../reducers/device';
import awsconfig from '../../aws-exports';
import * as Progress from 'react-native-progress';
import {CommonActions} from '@react-navigation/native';
import ModuleService from '../../services/ModuleService';
import API from '../../services/API';
import analytics from '../../services/analytics';

Amplify.configure(awsconfig);

const wifiImage = require('../../assets/images/wifi-connected.png');
const wifiDefault = require('../../assets/images/wifi-default.png');

const CheckNetwork = ({route, navigation}) => {
    const loadingState = {
        CHECKING_DEVICE: 'Checking module information...',
        UPDATING_FIRMWARE: '',
        CONNECTED: 'Connected',
        REBOOTING: '',
    };

    const dispatch = useDispatch();
    const devices = useSelector((state) => state.auth?.account?.devices?.items);
    const pairing = useSelector((state) => state.device?.pairing);
    const [loading, setLoader] = useState(loadingState.CONNECTED);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (error) {
            Alert.alert(
                'Error',
                'There was an issue connecting to your module, please check if your device is connected in the Rinnai network and try again.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            setError(false);
                        },
                    },
                ],
            );
        }
    }, [error]);

    const callRinnaiApi = async () => {
        try {
            //If connected to Rinnai Wifi make a call
            //to get the serial number, fw, ayla dsn, and wifi
            const {deviceSerial, deviceFirmware, deviceAylaDSN} = await ModuleService.getModuleMetadata();

            const setPairing = {
                firmware: deviceFirmware.firmware_version,
                id: deviceSerial.serial,
                dsn: deviceAylaDSN.adsn,
            };
            //store it in redux state
            dispatch(deviceActions.setPairing(setPairing));
            return setPairing;
        } catch (e) {
            if (e.errorName === ModuleService.v1FirmwareErrorName) {
                navigation.navigate('Firmware');
            } else {
                console.log(e);
                setError(true);
            }
        } finally {
            setLoader(false);
        }
    };

    const connectDevice = async () => {
        setLoader(loadingState.CHECKING_DEVICE);
        callRinnaiApi().then((data) => {
            console.log(data);
            const checkDevice = devices.find(({id}) => id === data.id);
            console.log(checkDevice);
            if (!checkDevice) {
                if (!data.firmware || pairing.updateVersion > data.firmware) {
                    analytics.logEvent('firmware_update', {
                        oldFirmware: data.firmware,
                        newFirmware: pairing.updateVersion,
                        serialId: data.id,
                    });
                    navigation.navigate('Firmware', {serialId: data.id});
                } else {
                    dispatch(deviceActions.setPairing(data)).then((res) => {
                        navigation.navigate('UserDevice');
                    });
                }
            } else {
                Alert.alert(
                    'Device is already Provisioned',
                    'To update the device Wi-Fi or Firmware, go to device settings',
                    [
                        {
                            text: 'Update Firmware',
                            onPress: () => updateFirmware(data),
                        },
                        {
                            text: 'Update Wi-Fi',
                            onPress: () => navigation.navigate('UserWifi'),
                        },
                    ],
                    {cancelable: false},
                );
            }
        });
    };

    const isLoading = () => {
        return !(loading === loadingState.CONNECTED);
    };

    const stateDetailsText = () => {
        const connectedText = 'Your phone has successfully been connected to the control•r™ Module';
        switch (loading) {
            case loadingState.CONNECTED:
                return connectedText;
            case loadingState.UPDATING_FIRMWARE:
                return connectedText;
            case loadingState.CHECKING_DEVICE:
                return '';
            case loadingState.REBOOTING:
                return '';
        }
        return '';
    };

    const updateFirmware = async (deviceData) => {
        try {
            setLoader(loadingState.UPDATING_FIRMWARE);
            dispatch(deviceActions.setPairing({}));
            await ModuleService.rebootDevice();
            setLoader(loadingState.REBOOTING);
            setTimeout(() => {
                API.getViewDevice(deviceData.id, 'name')
                    .then((view) => {
                        analytics.logEvent('firmware_update_success', {serialId: deviceData.id});
                        dispatch(deviceActions.setDeviceView(view));
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [
                                    {
                                        name: 'Home',
                                    },
                                ],
                            }),
                        );
                        navigation.navigate('DeviceInfo');
                    })
                    .finally(() => {
                        setLoader(loadingState.CONNECTED);
                    });
            }, 1000 * 40);
        } catch (err) {
            await analytics.logEvent('firmware_update_failure', {serialId: deviceData.id, err});
            setLoader(loadingState.CONNECTED);
        }
    };

    return (
        <View style={styles.loginBox}>
            <TitleBar
                navigation={navigation}
                title={'Connect your phone to the \n Rinnai control•r™ Module'}
                backButton={true}
                backNav="back"
                subTitle={false}
                drawer={false}
                transparent={true}
            />
            <View
                style={{
                    ...styles.formBox,
                    backgroundColor: '#ffffff',
                    flex: 0.9,
                    borderRadius: 10,
                    marginTop: 50,
                    marginBottom: 50,
                    padding: 20,
                }}>
                <Text
                    style={{
                        ...styles.h3,
                        fontSize: 20,
                        fontWeight: '300',
                        marginTop: 30,
                        marginBottom: 30,
                        width: '80%',
                        textAlign: 'center',
                        color: '#697179',
                    }}>
                    {loading}
                </Text>
                <View style={styles.loadingOuter}>
                    <Progress.Circle
                        style={{alignItems: 'center', justifyContent: 'center'}}
                        size={150}
                        color={isLoading() ? '#697179' : '#4EC32D'}
                        thickness={30}
                        borderWidth={5}
                        strokeCap="round"
                        endAngle={0.3}
                        indeterminate={isLoading() ? true : false}>
                        <View style={styles.loadingInner}>
                            <Image
                                style={{
                                    position: 'absolute',
                                    marginBottom: 30,
                                    marginTop: 20,
                                    width: 78,
                                    height: 50,
                                }}
                                source={isLoading() ? wifiDefault : wifiImage}
                            />
                        </View>
                    </Progress.Circle>
                </View>
                <Text
                    style={{
                        ...styles.h3,
                        fontSize: 14,
                        fontWeight: '300',
                        marginTop: 30,
                        marginBottom: 30,
                        width: '80%',
                        textAlign: 'center',
                        color: '#697179',
                    }}>
                    {stateDetailsText()}
                </Text>
            </View>
            <Button
                full
                transparent
                style={[
                    styles.itemWindow,
                    {
                        minHeight: 0,
                        width: '90%',
                        alignSelf: 'center',
                        marginTop: 10,
                        borderWidth: 0,
                        borderColor: '#BFBFBF',
                    },
                ]}
                onPress={() => connectDevice()}>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'right',
                        fontWeight: '500',
                        fontSize: 14,
                    }}>
                    Continue
                </Text>
            </Button>
        </View>
    );
};

export default CheckNetwork;
