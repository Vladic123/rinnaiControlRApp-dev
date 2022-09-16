/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import 'react-native-get-random-values';
import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Switch, Text, View, TouchableOpacity, Alert, Platform} from 'react-native';
import gql from 'graphql-tag';
import {useIsFocused} from '@react-navigation/native';
import Amplify, {Auth} from 'aws-amplify';
import AWSAppSyncClient, {AUTH_TYPE} from 'aws-appsync';
import * as deviceSubscriptions from '../../graphql/deviceSubscriptions';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import awsconfig from '../../aws-exports';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import {deviceActions} from '../../reducers/device';
import {ScrollView} from 'react-native-gesture-handler';
import RinnaiLoader from '../../components/RinnaiLoader';
import utils from '../../utils';
import API from '../../services/API';

Amplify.configure(awsconfig);
const client = new AWSAppSyncClient({
    url: awsconfig.aws_appsync_graphqlEndpoint,
    region: awsconfig.aws_appsync_region,
    auth: {
        type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
        jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken(),
    },
    disableOffline: true,
});

const Schedule = ({navigation}) => {
    let shadowSubscriptionRef = useRef(null);
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const data = useSelector((state) => state.device.view);
    const device = useSelector((state) => state.device.view.device);
    const [time, setTime] = useState('');
    const [vacationMode, setVacationMode] = useState('');
    const [loading, setLoader] = useState(false);

    const changeTimezone = (timezone) => {
        setTime(utils.getTimeZoneCoordinatesDescription(timezone));
    };

    useEffect(() => {
        if (!isFocused) {
            return;
        }
        API.getViewDevice(device.id, device.device_name).then((view) => {
            setLoader(false);
            dispatch(deviceActions.setDeviceView(view));
        });
        shadowSubscription();
    }, [isFocused]);

    useEffect(() => {
        changeTimezone(device?.shadow?.timezone);
        if (device?.shadow) {
            setVacationMode(device?.shadow.schedule_holiday);
        }
    }, [device]);

    useEffect(() => {
        return () => {
            if (shadowSubscriptionRef?.unsubscribe === 'function') {
                shadowSubscriptionRef.unsubscribe();
            }
        };
    }, []);

    const shadowSubscription = () => {
        shadowSubscriptionRef = client
            .subscribe({
                query: gql(deviceSubscriptions.onUpdateDeviceShadow),
                variables: {heater_serial_number: device.id},
            })
            .subscribe({
                next: (shadowData) => {
                    const subData = shadowData.data.onUpdateDeviceShadow;
                    if (subData.heater_serial_number === device.id) {
                        setLoader(false);
                        setVacationMode(subData.schedule_holiday);
                    }
                },
            });
    };

    const editSchedule = (schedule) => {
        navigation.navigate('EditSchedule', {device_schedule: schedule});
    };

    const toggleScheduleState = async (update) => {
        if (update.active) {
            await API.activateSchedule(update.id);
        } else {
            await API.deactivateSchedule(update.id);
        }

        const view = await API.getViewDevice(device.id, device.device_name);
        dispatch(deviceActions.setDeviceView(view));
    };

    const parseJsonString = (value) => {
        //This is probably the worse setup. Change DB storage to array to avoid this
        const parseOne = value.replace(/[=]/g, '":"');
        const parseTwo = parseOne.replace(/[,]/g, '","');
        const parseThree = parseTwo.replace(/[ ]/g, '');
        const parseFour = parseThree.replace(/[{]/g, '{"');
        const parse = parseFour.replace(/[}]/g, '"}');

        return JSON.parse(parse);
    };

    const removeSchedule = (item) => {
        Alert.alert(
            'Are you sure you want to delete "' + item.name + '"?',
            '',
            [
                {
                    text: 'Delete Schedule',
                    onPress: () => deleteSchedule(item),
                },
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ],
            {cancelable: false},
        );
    };

    const deleteSchedule = async (item) => {
        try {
            await API.removeDeviceSchedule(item.id);
            const view = await API.getViewDevice(device.id, device.device_name);
            dispatch(deviceActions.setDeviceView(view));
        } catch (e) {
            Alert.alert('Schedule Error', 'Error trying to delete the schedule.', [{text: 'OK'}], {cancelable: false});
        }
    };

    const listSchedules = () => {
        const schedules = data.device.schedule;
        if (Object.values(schedules.items).length > 0) {
            return Object.values(schedules.items).map((schedule, key) => {
                let days = {};
                if (schedule.days.length > 1) {
                    schedule.days.map((sched) => {
                        const setSched = parseJsonString(sched);
                        days = {
                            ...setSched,
                            ...days,
                        };
                    });
                } else {
                    days = parseJsonString(schedule.days[0]);
                }

                const times = parseJsonString(schedule.times[0]);
                const active = schedule.active;
                const updateSchedule = {
                    ...schedule,
                    active: !active,
                };
                delete updateSchedule.createdAt;
                delete updateSchedule.updatedAt;

                const newSchedule = {
                    ...schedule,
                    days: days,
                    times: times,
                };

                return (
                    <View style={styles.timeSchedule} key={key}>
                        <TouchableOpacity style={styles.timeSelector} onPress={() => editSchedule(newSchedule)}>
                            <View style={styles.time}>
                                <Text style={{fontWeight: '400', fontSize: 14}}>{schedule.name}</Text>
                                <View
                                    style={{
                                        ...styles.scheduleDays,
                                        justifyContent: 'flex-start',
                                        marginTop: 5,
                                    }}>
                                    <Text style={styles.scheduleTime}>
                                        {times.start}-{times.end}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        ...styles.scheduleDays,
                                        justifyContent: 'flex-start',
                                        marginTop: 5,
                                    }}>
                                    {Object.values(days).map((day, dayKey) => {
                                        return (
                                            <Text style={styles.scheduleDay} key={dayKey}>
                                                {day}
                                            </Text>
                                        );
                                    })}
                                </View>
                            </View>
                            <View
                                style={{
                                    ...styles.selectTime,
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    justifyContent: 'space-evenly',
                                }}>
                                <Switch
                                    trackColor={{
                                        false: '#767577',
                                        true: '#94CB2B',
                                    }}
                                    thumbColor={active ? '#f4f3f4' : '#f4f3f4'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => toggleScheduleState(updateSchedule)}
                                    value={active}
                                />
                                <TouchableOpacity onPress={() => removeSchedule(schedule)}>
                                    <FontAwesome5Pro name="trash-alt" style={{fontSize: 18, marginTop: 10}} light />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                );
            });
        }
    };

    const validThingName = () => {
        if (device.thing_name !== 'none') {
            return true;
        }
        Alert.alert('Error', 'The thing is not available in the device.', [{text: 'OK', onPress: () => console.log('OK Pressed')}], {
            cancelable: false,
        });
        return false;
    };

    const toggleVacationMode = async () => {
        if (!validThingName()) {
            return;
        }

        setLoader(true);
        try {
            if (vacationMode) {
                setVacationMode(false);
                await API.disableVacationMode(device.thing_name);
            } else {
                setVacationMode(true);
                await API.enableVacationMode(device.thing_name);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoader(false);
        }
    };

    return (
        <View style={styles.appContainer}>
            <RinnaiLoader modal={loading} />
            <TitleBar backButton={false} navigation={navigation} title={device?.device_name?.toUpperCase()} subTitle={false} drawer={true} />
            <View
                style={{
                    ...styles.formBox,
                    backgroundColor: 'transparent',
                    flex: 1,
                    flexDirection: 'column',
                    borderRadius: 10,
                    marginTop: 0,
                    marginBottom: 10,
                    paddingBottom: 0,
                }}>
                <Text
                    style={{
                        ...styles.h3,
                        fontWeight: '300',
                        fontSize: 22,
                        marginBottom: 5,
                    }}>
                    Recirculation Schedules
                </Text>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Text
                        style={{
                            ...styles.h3,
                            textAlign: 'center',
                            fontWeight: '500',
                            marginBottom: 0,
                        }}>
                        Time Zone: {time}
                    </Text>
                    <Button
                        full
                        transparent
                        style={{
                            minHeight: 0,
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: 5,
                        }}
                        onPress={() => navigation.navigate('EditTimezone')}>
                        <Text
                            style={{
                                color: '#A5A5A5',
                                textAlign: 'center',
                                fontWeight: '500',
                                fontSize: 14,
                            }}>
                            edit
                        </Text>
                    </Button>
                </View>
                <View style={{flexDirection: 'column', width: '90%', flex: 0.3}}>
                    <Button
                        full
                        transparent
                        style={[
                            styles.itemWindow,
                            {
                                minHeight: 50,
                                flex: 1,
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: 5,
                            },
                        ]}
                        onPress={() => navigation.navigate('NewSchedule')}>
                        <Text
                            style={{
                                color: '#000000',
                                textAlign: 'center',
                                fontWeight: '500',
                                fontSize: 14,
                            }}>
                            Add Schedule
                        </Text>
                    </Button>
                    <Button
                        full
                        transparent={true}
                        style={{
                            ...styles.itemWindow,
                            flex: 1,
                            minHeight: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 10,
                            margin: 5,
                            borderColor: '#ffffff',
                            borderWidth: 5,
                            backgroundColor: vacationMode ? '#2E353C' : 'transparent',
                            elevation: Platform.OS === 'android' ? 0 : 1,
                        }}
                        onPress={() => toggleVacationMode()}>
                        <Text
                            style={{
                                color: vacationMode ? '#ffffff' : '#000000',
                                textAlign: 'center',
                                fontWeight: '500',
                                fontSize: 14,
                            }}>
                            Turn Vacation Mode {vacationMode ? 'Off' : 'On'}
                        </Text>
                    </Button>
                </View>
                <ScrollView style={{width: '100%', flex: 1}}>
                    <View
                        style={{
                            width: '100%',
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: 300,
                        }}>
                        {listSchedules()}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default Schedule;
