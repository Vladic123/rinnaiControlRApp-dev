/* eslint-disable radix */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Alert, Text, Image, View, RefreshControl, Platform} from 'react-native';
import {Button} from 'native-base';
import {G, Path} from 'react-native-svg';
import Amplify, {Auth} from 'aws-amplify';
import * as deviceSubscriptions from '../../graphql/deviceSubscriptions';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import {authActions} from '../../reducers/auth';
import {deviceActions} from '../../reducers/device';
import gql from 'graphql-tag';
import AWSAppSyncClient, {AUTH_TYPE} from 'aws-appsync';
import awsconfig from '../../aws-exports';
import {ScrollView} from 'react-native-gesture-handler';
import CountDown from '../../native_modules/react-native-countdown-component';
import CircularSlider from '../../native_modules/react-native-circular-slider';
import LinearGradient from 'react-native-linear-gradient';
import {useIsFocused} from '@react-navigation/native';
import RinnaiLoader from '../../components/RinnaiLoader';
import API from '../../services/API';

Amplify.configure(awsconfig);

const wifiActive = require('../../assets/images/wifi-connected.png');
const wifiInActive = require('../../assets/images/wifi-disconnected.png');
const recircActive = require('../../assets/images/recirculation-active.png');
const recircInActive = require('../../assets/images/recirculation-inactive.png');
const tankActive = require('../../assets/images/tankless-active.png');
const tankInActive = require('../../assets/images/tankless-inactive.png');
const tankImageActive = require('../../assets/images/tankless-image-active.png');
const tankImageInActive = require('../../assets/images/tankless-image-inactive.png');
const startImage = require('../../assets/images/stop.png');
const stopImage = require('../../assets/images/start.png');
const blankGauge = require('../../assets/images/temp-gauge-blank.png');

const client = new AWSAppSyncClient({
    url: awsconfig.aws_appsync_graphqlEndpoint,
    region: awsconfig.aws_appsync_region,
    auth: {
        type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
        jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken(),
    },
    disableOffline: true,
});

const defaultDeviceShadow = {
    serial_number: false,
    module_firmware_version: '',
    recirculation_enabled: false,
    lock_enabled: false,
    operation_enabled: false,
    priority_status: false,
    schedule: '',
    schedule_enabled: false,
    timezone: '',
    set_domestic_temperature: 120,
    do_maintenance_retrieval: false,
    recirculation_duration: 15,
    set_recirculation_enabled: false,
    set_priority_status: false,
};

const defaultInfo = {
    serial_id: '',
    name: '',
};

const DeviceHome = ({navigation}) => {
    let infoSubscriptionRef = useRef(null);
    let activitySubscriptionRef = useRef(null);
    let shadowSubscriptionRef = useRef(null);
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.account);
    const data = useSelector((state) => state.device.view);
    const device = useSelector((state) => state.device.view.device);

    const [deviceInfo, setDeviceInfo] = useState(device?.info || defaultInfo);
    const [deviceShadow, setDeviceShadow] = useState(device?.shadow ? device.shadow : defaultDeviceShadow);
    const [recirc, setRecirc] = useState({});
    const [start, setStart] = useState({});

    const [angleLength, setAngleLength] = useState(Math.PI * 2);
    const [minTemp, setMinTemp] = useState(90);
    const [maxTemp, setMaxTemp] = useState(140);
    const [connection, setConnection] = useState('');
    const [combustion, setCombustion] = useState(device?.info && device?.info?.domestic_combustion);
    const [recirculation, setRecirculation] = useState(device?.shadow && device.shadow.recirculation_enabled);

    const [temp, setTemp] = useState(device?.shadow ? device.shadow.set_domestic_temperature : 120);
    const [timer, setTimer] = useState(undefined);
    const [scroll, setScroll] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [toolTipX, setToolTipX] = useState(0);
    const [toolTipY, setToolTipY] = useState(0);
    const [showTip, setShowTip] = useState(false);
    const [power, setPower] = useState(device?.shadow && device.shadow.operation_enabled);
    const [vacationMode, setVacationMode] = useState(device?.shadow && device.shadow.schedule_holiday);
    const [loading, setLoader] = useState(false);
    const name = device?.device_name ? device.device_name : data.name;
    const times = {
        0: '0m',
        5: '5m',
        15: '15m',
        30: '30m',
        45: '45m',
        60: '1h',
        75: '1h 15m',
        90: '1.5h',
        105: '1h 45m',
        120: '2h',
        135: '2h 15m',
        150: '2.5h',
        165: '2h 45m',
        180: '3h',
        195: '3h 15m',
        210: '3.5h',
        225: '3h 45m',
        240: '4h',
        255: '4h 15m',
        270: '4.5h',
        285: '4h 45m',
        300: '5h',
    };

    useEffect(() => {
        dispatch(authActions.fetchUserByEmail(userData.username));
        const newActivity = device?.activity;
        if (newActivity) {
            setConnection(newActivity.eventType);
        }
        if (device?.shadow) {
            setDeviceShadow(device.shadow ? device.shadow : defaultDeviceShadow);
            setRecirculation(device.shadow.recirculation_enabled);
            setPower(device.shadow.operation_enabled);
            setVacationMode(device.shadow.schedule_holiday);
            setTemp(device.shadow.set_domestic_temperature);
            setTempDial(device.shadow.set_domestic_temperature);
        }
        if (device?.info) {
            setDeviceInfo(device.info);
            setCombustion(device.info.domestic_combustion);
            setTemp(device.info.domestic_temperature ? device.info.domestic_temperature : 120);
            setTempDial(device.info.domestic_temperature);
        }
        setMinTemp(98);
        setMaxTemp(140);
    }, [data]);

    useEffect(() => {
        API.getViewDevice(device?.id, name).then((view) => {
            dispatch(deviceActions.setDeviceView(view));
        });
    }, [isFocused]);

    //Subscription to Info Data
    useEffect(() => {
        if (!isFocused) {
            return;
        }
        if (device?.info) {
            infoSubscription();
        }
        if (device?.shadow) {
            shadowSubscription();
        }
        if (device?.activity) {
            activitySubscription();
        }
    }, [isFocused]);

    // Unsubscriptions
    useEffect(() => {
        return () => {
            [infoSubscriptionRef, shadowSubscriptionRef, activitySubscriptionRef].forEach((reference) => {
                if (reference?.unsubscribe === 'function') {
                    reference.unsubscribe();
                }
            });
        };
    }, []);

    //check the deviceShadow State
    useEffect(() => {
        if (!device?.shadow) {
            if (device?.info) {
                API.getDeviceShadow('thingName', device?.info?.name).then((shadow) => {
                    setDeviceShadow(shadow);

                    if (shadow.minimum_domestic_temperature) {
                        setMinTemp(shadow.minimum_domestic_temperature);
                    }
                    if (shadow.maximum_domestic_temperature) {
                        setMaxTemp(shadow.maximum_domestic_temperature);
                    }
                    if (shadow.set_domestic_temperature) {
                        setTemp(shadow.set_domestic_temperature);
                        setTempDial(shadow.set_domestic_temperature);
                    }
                });
            }
        }
    }, [deviceShadow]);

    const infoSubscription = () => {
        infoSubscriptionRef = client
            .subscribe({
                query: gql(deviceSubscriptions.onUpdateDeviceInfo),
                variables: {
                    serial_id: device?.info.serial_id,
                },
            })
            .subscribe({
                next: (infoData) => {
                    if (infoData) {
                        const info = infoData.data.onUpdateDeviceInfo;
                        if (info.name === deviceInfo.name) {
                            if (info.domestic_temperature) {
                                setTemp(info.domestic_temperature);
                                setTempDial(info.domestic_temperature);
                            }
                            setCombustion(info.domestic_combustion);
                            setDeviceInfo(info);
                        }
                    }
                },
                error: (error) => {
                    console.warn(error);
                },
            });
    };

    const shadowSubscription = () => {
        shadowSubscriptionRef = client
            .subscribe({
                query: gql(deviceSubscriptions.onUpdateDeviceShadow),
                variables: {heater_serial_number: device?.info?.serial_id},
            })
            .subscribe({
                next: (shadowData) => {
                    const subData = shadowData.data.onUpdateDeviceShadow;
                    if (subData.heater_serial_number === deviceShadow.heater_serial_number) {
                        setRecirculation(subData.recirculation_enabled);
                    }
                    if (subData?.set_domestic_temperature) {
                        setTemp(subData.set_domestic_temperature);
                        setTempDial(subData.set_domestic_temperature);
                    }
                    setDeviceShadow(subData);
                },
                error: (error) => {
                    console.warn(error);
                },
            });
    };

    const activitySubscription = () => {
        const serial = `${device?.info?.name}`;
        activitySubscriptionRef = client
            .subscribe({
                query: gql(deviceSubscriptions.onUpdateDeviceActivity),
                variables: {
                    clientId: serial,
                },
            })
            .subscribe({
                next: (connectData) => {
                    const connect = connectData.data.onUpdateDeviceActivity;
                    if (connect.clientId === device?.info.name) {
                        setConnection(connect.eventType);
                    }
                },
                error: (error) => {
                    console.warn(error);
                },
            });
    };

    const recirculationPanel = () => {
        return (
            <View style={styles.itemStatus}>
                <View style={styles.itemIcon}>
                    <Image style={{height: 70, width: 70}} source={recirculation ? recircActive : recircInActive} />
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
                        {recirculation ? 'Recirculation Active' : 'Recirculation Inactive'}
                    </Text>
                </View>
            </View>
        );
    };

    const tankLess = () => {
        return (
            <View
                style={{
                    ...styles.itemStatus,
                    marginBottom: 0,
                    paddingTop: 10,
                    paddingLeft: 10,
                    paddingRight: 10,
                }}>
                <View style={styles.itemIcon}>
                    <Image style={{height: 70, width: 70}} source={combustion === 'true' ? tankActive : tankInActive} />
                </View>
                <View style={styles.itemDescription}>
                    <Text
                        style={{
                            ...styles.h3,
                            marginLeft: 10,
                            fontSize: 18,
                            fontWeight: '600',
                            color: '#000000',
                        }}>
                        Tankless
                    </Text>
                    <Text
                        style={{
                            ...styles.h3,
                            marginLeft: 10,
                            fontSize: 18,
                            fontWeight: '300',
                            color: '#000000',
                        }}>
                        {combustion === 'true' ? 'Delivering hot water' : 'Not In Use'}
                    </Text>
                </View>
                <View
                    style={{
                        ...styles.tankItemIcon,
                        alignItems: 'center',
                    }}>
                    <Image style={{height: 70, width: 50}} source={combustion === 'true' ? tankImageActive : tankImageInActive} />
                </View>
            </View>
        );
    };

    const toggleVacationMode = async () => {
        Alert.alert(
            'Are you sure you want to disable vacation mode',
            'All active schedules will resume.',
            [
                {
                    text: 'End Vacation Mode',
                    onPress: () => disableVacationMode(),
                },
            ],
            {cancelable: false},
        );
    };

    const disableVacationMode = async () => {
        setLoader(true);
        setVacationMode(false);

        await API.disableVacationMode(deviceInfo.name);

        setTimeout(() => {
            API.getViewDevice(device.id, name).then((view) => {
                setLoader(false);
                dispatch(deviceActions.setDeviceView(view));
            });
        }, 1000);
    };

    const vacationModePanel = () => {
        return (
            <View
                style={{
                    ...styles.itemWindow,
                    flex: 1,
                    minHeight: 0,
                    alignItems: 'center',
                    width: '90%',
                    justifyContent: 'center',
                    borderRadius: 10,
                    margin: 5,
                    marginBottom: 20,
                    backgroundColor: vacationMode ? '#2E353C' : 'transparent',
                }}>
                <Text
                    style={{
                        color: vacationMode ? '#ffffff' : '#000000',
                        textAlign: 'center',
                        fontWeight: '700',
                        fontSize: 16,
                        marginBottom: 15,
                    }}>
                    Vacation Mode {vacationMode ? 'Active' : 'Off'}
                </Text>
                <Button
                    style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 30,
                        padding: 5,
                        width: 200,
                        flexDirection: 'row',
                        alignSelf: 'center',
                        justifyContent: 'space-evenly',
                    }}
                    onPress={() => toggleVacationMode()}>
                    <Text
                        style={{
                            color: '#000000',
                            textAlign: 'center',
                            fontWeight: '700',
                            fontSize: 14,
                        }}>
                        End Vacation Mode
                    </Text>
                </Button>
            </View>
        );
    };

    const powerHeater = async () => {
        const newPowerState = !power;

        if (newPowerState) {
            API.turnHeaterOn(deviceInfo.name);
        } else {
            API.turnHeaterOff(deviceInfo.name);
        }

        const view = await API.getViewDevice(device.id, name);

        dispatch(deviceActions.setDeviceView(view));
        setPower(newPowerState);
    };

    const powerPanel = () => {
        return (
            <View
                style={{
                    ...styles.itemWindow,
                    flex: 1,
                    minHeight: 0,
                    alignItems: 'center',
                    width: '90%',
                    justifyContent: 'center',
                    borderRadius: 10,
                    padding: 20,
                    margin: 5,
                    marginBottom: 20,
                    backgroundColor: '#2E353C',
                }}>
                <Text
                    style={{
                        color: '#ffffff',
                        textAlign: 'center',
                        fontWeight: '700',
                        fontSize: 18,
                        marginBottom: 10,
                    }}>
                    Tankless is Powered Off
                </Text>
                <Text
                    style={{
                        color: '#ffffff',
                        textAlign: 'center',
                        fontWeight: '300',
                        fontSize: 16,
                        marginBottom: 10,
                    }}>
                    {'Turn Heater on to recirculate \n and change the temperature'}
                </Text>
                <Button
                    style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 30,
                        padding: 5,
                        width: 100,
                        flexDirection: 'row',
                        alignSelf: 'center',
                        justifyContent: 'space-evenly',
                    }}
                    onPress={() => powerHeater()}>
                    <View
                        style={{
                            height: 10,
                            width: 10,
                            borderRadius: 5,
                            backgroundColor: '#94CB2A',
                        }}
                    />
                    <Text
                        style={{
                            color: '#000000',
                            textAlign: 'center',
                            fontWeight: '700',
                            fontSize: 14,
                        }}>
                        Turn On
                    </Text>
                </Button>
            </View>
        );
    };

    const recircTimes = () => {
        return Object.keys(times).map((time, key) => {
            return (
                <Button
                    style={{
                        ...styles.recircButton,
                        width: 70,
                        height: 25,
                        alignItems: 'center',
                        margin: 2,
                        marginLeft: key === 0 ? 10 : 3,
                        backgroundColor: recirc[deviceInfo.name] === time ? '#ffffff' : '#E5E9ED',
                    }}
                    onPress={() => selectDuration(time)}
                    key={key}>
                    {recirc[deviceInfo.name] === time && start[deviceInfo.name] ? (
                        startCountDown(time)
                    ) : (
                        <Text
                            style={{
                                color: '#000000',
                                textAlign: 'center',
                                fontWeight: '500',
                                fontSize: 14,
                                width: '100%',
                            }}>
                            {recirc[deviceInfo.name] === time && start[deviceInfo.name] ? startCountDown(time) : times[time]}
                        </Text>
                    )}
                </Button>
            );
        });
    };

    const selectDuration = (duration) => {
        if (start[deviceInfo.name]) {
            startRecirculation();
        }
        if (power) {
            const setting = {
                [deviceInfo.name]: duration,
            };
            setRecirc({...recirc, ...setting});
        }
    };

    const startRecirculation = async () => {
        const thingName = deviceInfo.name;
        const duration = recirc[deviceInfo.name];

        if (!start[deviceInfo.name]) {
            API.startRecirculation(thingName, duration);
            const deviceRecirc = {
                [deviceInfo.name]: true,
            };
            setStart({...start, ...deviceRecirc});
        } else {
            const deviceRecirc = {
                [deviceInfo.name]: false,
            };
            setStart({...start, ...deviceRecirc});
            await API.stopRecirculation(thingName);
        }
        console.log(start);
    };

    const finishRecirc = () => {
        const deviceRecirc = {
            [deviceInfo.name]: false,
        };
        setStart({...start, ...deviceRecirc});
        Alert.alert(
            'Recirculation Finished!',
            '',
            [
                {
                    text: 'OK',
                    onPress: () => console.log('OK Pressed'),
                },
            ],
            {cancelable: false},
        );
    };

    const startCountDown = (time) => {
        return (
            <CountDown
                until={parseInt(time) * 60}
                size={15}
                onFinish={() => finishRecirc()}
                style={{
                    padding: 0,
                    margin: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                }}
                digitStyle={{
                    backgroundColor: 'transparent',
                    margin: 'auto',
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                digitTxtStyle={{
                    padding: 0,
                    margin: 0,
                    justifyContent: 'center',
                }}
                timeToShow={['H', 'M']}
                timeLabels={{m: null, s: null}}
            />
        );
    };

    const setTempDial = (deviceTemp) => {
        const percent = Number(deviceTemp) * 0.01;
        const circle = Math.PI * 2;
        const spanAngle = circle * percent + 0.4;
        setAngleLength(spanAngle);
    };

    const tempGauge = (length) => {
        const span = maxTemp - minTemp;
        const spanAngle = (span * length.angleLength) / 3;
        const temperature = parseInt(spanAngle + minTemp);
        if (temperature <= maxTemp && temperature >= minTemp) {
            if ((temperature <= 110 && temperature % 2 === 0) || (temperature > 110 && temperature % 5 === 0)) {
                if (timer) {
                    clearTimeout(timer);
                }
                setTemp(temperature);
                setAngleLength(length.angleLength);
                setTimer(
                    setTimeout(() => {
                        setDeviceTemp(temperature);
                    }, 2000),
                );
            }
        }
    };

    const setDeviceTemp = async (temperature) => {
        if (temp > 98) {
            await API.setTemperature(deviceInfo.name, temperature);
            setScroll(true);
            setShowTip(false);
            Alert.alert(
                'Temperature Set!',
                `Temperature ${temperature}`,
                [
                    {
                        text: 'OK',
                        onPress: () => console.log('OK Pressed'),
                    },
                ],
                {cancelable: false},
            );
        } else {
            Alert.alert(
                'Invalid Temperature',
                `Temperature ${temperature} not set`,
                [
                    {
                        text: 'OK',
                        onPress: () => setTemp(120),
                    },
                ],
                {cancelable: false},
            );
        }
    };

    const stopIcon = () => {
        return (
            <G>
                <Path
                    d="M 0 10 A 15 15 1 1 1 5 10 z"
                    fill="white"
                    delayPressOut={3000}
                    onPressIn={() => {
                        setScroll(false);
                        setShowTip(true);
                    }}
                    onLayout={(event) => {
                        const layout = event.nativeEvent.layout;
                        setToolTipX(layout.x);
                        setToolTipY(layout.y);
                    }}
                />
            </G>
        );
    };

    const refreshAccount = async () => {
        setRefreshing(true);
        API.getViewDevice(device?.id, name).then((refreshData) => {
            const deviceData = refreshData.device;
            const newActivity = deviceData.activity;
            if (deviceData.shadow) {
                setDeviceShadow(deviceData.shadow);
                setTemp(deviceData.shadow.set_domestic_temperature);
                setTempDial(deviceData.shadow.set_domestic_temperature);
            }
            if (deviceData.info) {
                setDeviceInfo(deviceData.info);
                setCombustion(deviceData.info.domestic_combustion);
                setTemp(deviceData.info.domestic_temperature);
                setTempDial(deviceData.info.domestic_temperature);
            }
            if (newActivity) {
                setConnection(newActivity.eventType);
            }
        });

        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    return (
        <View style={styles.appContainer}>
            <RinnaiLoader modal={loading} />
            <TitleBar backButton={true} backNav="Home" navigation={navigation} title={name?.toUpperCase()} subTitle={false} drawer={true} />
            <View style={styles.wifiHeader}>
                <View style={styles.deviceWifi}>
                    <Image
                        style={{height: 14, width: 19}}
                        source={connection === 'connected' || connection === 'subscribed' ? wifiActive : wifiInActive}
                    />
                    <Text
                        style={{
                            ...styles.h3,
                            marginLeft: 10,
                            fontSize: 14,
                            fontWeight: '300',
                        }}>
                        {connection === 'connected' || connection === 'subscribed' ? 'Wifi Connected' : 'Disconnected'}
                    </Text>
                </View>
            </View>
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshAccount} />}
                scrollEnabled={scroll}
                style={{
                    flex: 1,
                    width: '100%',
                    padding: 0,
                }}>
                <View style={{width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                    {power === false && powerPanel()}
                    {vacationMode && vacationModePanel()}
                    <View
                        style={{
                            ...styles.itemWindow,
                            justifyContent: 'center',
                            marginBottom: 10,
                            width: '90%',
                            padding: 0,
                        }}>
                        {tankLess()}
                    </View>
                    <View
                        style={{
                            ...styles.itemWindow,
                            height: 80,
                            justifyContent: 'center',
                            marginBottom: 10,
                            width: '90%',
                        }}>
                        {recirculationPanel()}
                    </View>
                    <Text
                        style={{
                            ...styles.h3,
                            marginTop: 10,
                            fontSize: 20,
                            fontWeight: '300',
                            color: '#697179',
                        }}>
                        Recirculate Now
                    </Text>
                    <LinearGradient
                        locations={[0, 0.05]}
                        colors={['rgba(200, 200, 218, 0.25)', '#EFF2F5']}
                        style={{
                            ...styles.recircWindow,
                            backgroundColor: '#EFF2F5',
                            justifyContent: 'center',
                            marginTop: 10,
                            marginBottom: 10,
                            width: '90%',
                        }}>
                        <ScrollView
                            style={{width: '100%', paddingTop: 3, paddingBottom: 3}}
                            horizontal={true}
                            decelerationRate={0}
                            snapToInterval={200}
                            snapToAlignment={'center'}>
                            {recircTimes()}
                        </ScrollView>
                        <Button
                            style={{
                                ...styles.recircButton,
                                width: 70,
                                height: 30,
                                alignItems: 'center',
                                margin: 3,
                                backgroundColor: '#ffffff',
                                position: Platform.OS === 'android' ? (recirc[deviceInfo.name] > 0 ? 'absolute' : 'relative') : 'absolute',
                                right: 0,
                                padding: 8,
                                display: recirc[deviceInfo.name] > 0 ? 'flex' : 'none',
                            }}
                            onPress={() => startRecirculation()}>
                            <Image style={{height: 15, width: 15}} source={start[deviceInfo.name] ? startImage : stopImage} />
                            <Text
                                style={{
                                    color: '#000000',
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    fontSize: 14,
                                }}>
                                {recirc[deviceInfo.name] > 0 && !start[deviceInfo.name] ? 'Start' : 'Stop'}
                            </Text>
                        </Button>
                    </LinearGradient>

                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'visible',
                            width: '100%',
                            flex: 1,
                            marginBottom: 50,
                        }}>
                        <Image
                            style={{
                                height: 190,
                                width: 190,
                                position: 'absolute',
                            }}
                            source={blankGauge}
                        />
                        <View
                            style={{
                                marginTop: 0,
                                width: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flex: 1,
                            }}>
                            {power && combustion === 'false' && (
                                <LinearGradient
                                    start={{x: -0.1, y: 0.5}}
                                    end={{x: 0.2, y: -0.1}}
                                    colors={['#F3F5F7', '#306F99', '#CF000E']}
                                    style={styles.deviceTempGradient}
                                />
                            )}
                            <LinearGradient
                                start={{x: 0, y: 0.5}}
                                end={{x: 0, y: 0.2}}
                                colors={['rgba(243,245,247,1)', 'rgba(243,245,247,0)']}
                                style={{
                                    ...styles.deviceTempGradient,
                                    backgroundColor: 'transparent',
                                }}
                            />
                            <View
                                style={{
                                    ...styles.deviceTempMask,
                                    backgroundColor: '#F3F5F7',
                                }}
                            />
                            <View style={styles.deviceTempContainer}>
                                <Text style={styles.deviceTemp}>{temp}</Text>
                                <Text style={{fontSize: 16}}>&#176;F</Text>
                            </View>
                            <View
                                style={{
                                    height: 30,
                                    width: 55,
                                    backgroundColor: '#ffffff',
                                    borderRadius: 5,
                                    position: showTip ? 'absolute' : 'relative',
                                    left: toolTipX + 85,
                                    top: toolTipY - 35,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    display: showTip ? 'flex' : 'none',
                                }}>
                                <Text style={{fontSize: 12, fontWeight: '600'}}>{temp}&#176;F</Text>
                            </View>
                            {power && combustion === 'false' ? (
                                <CircularSlider
                                    style={{width: '100%'}}
                                    startAngle={(2 * Math.PI) / -4}
                                    angleLength={angleLength}
                                    onUpdate={(length) => tempGauge(length)}
                                    segments={50}
                                    strokeWidth={40}
                                    radius={90}
                                    gradientColorFrom="transparent"
                                    bgCircleColor="transparent"
                                    gradientColorTo="transparent"
                                    clockFaceColor="#9d9d9d"
                                    stopIcon={
                                        <G scale="1" transform={{translate: '-2, 10'}}>
                                            {stopIcon()}
                                        </G>
                                    }
                                />
                            ) : (
                                <View style={{height: 200, width: 200}} />
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default DeviceHome;
