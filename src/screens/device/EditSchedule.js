/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {KeyboardAvoidingView, TextInput, Text, View, TouchableOpacity, Alert} from 'react-native';
import {Button} from 'native-base';
import Amplify from 'aws-amplify';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import awsconfig from '../../aws-exports';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment-timezone';
import API from '../../services/API';

Amplify.configure(awsconfig);

const EditSchedule = ({route, navigation}) => {
    useIsFocused();
    const {device_schedule} = route.params;
    const device = useSelector((state) => state.device.view.device);
    const [startTime, setStartTime] = useState(device_schedule.times.start);
    const [endTime, setEndTime] = useState(device_schedule.times.end);
    const [toggleStart, setToggleStart] = useState(false);
    const [toggleEnd, setToggleEnd] = useState(false);
    const [timezone, setTimezone] = useState('');
    const [time, setTime] = useState(moment(device_schedule.times.start, 'h:mma').format('YYYY-MM-DDTHH:mm:ss.sssZ'));
    const [durationTime, setDurationTime] = useState(moment(device_schedule.times.end, 'h:mma').format('YYYY-MM-DDTHH:mm:ss.sssZ'));
    const [days, setDays] = useState(device_schedule.days);
    const [scheduleName, setScheduleName] = useState(device_schedule.name);

    const week = {
        0: 'Su',
        1: 'M',
        2: 'T',
        3: 'W',
        4: 'Th',
        5: 'F',
        6: 'S',
    };

    useEffect(() => {
        if (device.shadow) {
            setTimezone(device.shadow.timezone);
        }
    }, [device]);

    useEffect(() => {
        scheduleSettings();
    }, [device_schedule]);

    const scheduleSettings = () => {
        const s = moment(device_schedule.times.start, 'h:mma').format('YYYY-MM-DDTHH:mm:ss.sssZ');
        const d = moment(device_schedule.times.end, 'h:mma').format('YYYY-MM-DDTHH:mm:ss.sssZ');

        selectStartTime('start', s);
        selectEndTime('end', d);
    };

    const showTimeSelector = (selector) => {
        if (selector === 'start') {
            setToggleEnd(false);
            setToggleStart(!toggleStart);
        } else {
            setToggleStart(false);
            setToggleEnd(!toggleEnd);
        }
    };

    const updateSchedule = async () => {
        if (Object.keys(days).length > 0 && scheduleName && startTime !== 'START TIME' && endTime !== 'END TIME') {
            await API.updateSchedule(device.thing_name, device.id, device_schedule.id, scheduleName, startTime, endTime, days, timezone);
            navigation.navigate('Schedule');
        } else {
            Alert.alert(
                'Schedule Error',
                'Please Make sure you have a start time, an end time, and a schedule label',
                [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                {cancelable: false},
            );
        }
    };

    const selectStartTime = (event, selectedDate) => {
        const date = new Date(selectedDate);
        var formatHour = moment(date).format('h:mm a');
        setToggleStart(false);
        setStartTime(formatHour);
        setTime(date);
    };

    const selectEndTime = (event, selectedDate) => {
        const dateTime = new Date(time);
        const selectedDateTime = new Date(selectedDate);
        if (dateTime < selectedDateTime) {
            selectedDateTime.getHours();
            selectedDateTime.getMinutes();
            var diff = Math.abs(selectedDateTime - dateTime);
            var durationMS = Math.floor(diff / 1000 / 60);

            var formatHour = moment(selectedDateTime).format('h:mm a');

            setToggleEnd(false);
            setEndTime(formatHour);
            setDurationTime(selectedDateTime);
            console.log(durationMS);
        } else {
            Alert.alert('Schedule Error', 'Time must be in the future', [{text: 'OK', onPress: () => console.log('OK Pressed')}], {
                cancelable: false,
            });
        }
    };

    const selectDay = (day) => {
        const newDays = days;
        const index = Object.values(newDays).find((item) => item === week[day]);
        if (index) {
            delete newDays[day];
            setDays({...newDays});
            console.log(days);
        } else {
            setDays({
                ...days,
                [day]: week[day],
            });
        }
    };

    const showDays = () => {
        return Object.keys(week).map((day, key) => {
            return (
                <View key={key}>
                    <Button
                        onPress={() => selectDay(day)}
                        style={Object.keys(days).find((item) => item === day) ? styles.dayButtonActive : styles.dayButton}>
                        <Text>{week[day]}</Text>
                    </Button>
                </View>
            );
        });
    };

    return (
        <View style={styles.appContainer}>
            <TitleBar
                backButton={true}
                backNav="Schedule"
                navigation={navigation}
                title={device?.device_name?.toUpperCase()}
                subTitle={false}
                drawer={false}
            />
            <View
                style={{
                    ...styles.formBox,
                    backgroundColor: 'transparent',
                    flex: 1,
                    borderRadius: 10,
                    marginTop: 0,
                    marginBottom: 50,
                }}>
                <Text
                    style={{
                        ...styles.h3,
                        fontWeight: '300',
                        fontSize: 22,
                        marginBottom: 20,
                    }}>
                    Recirculation Schedules
                </Text>
                <KeyboardAvoidingView
                    style={{
                        width: '100%',
                        margin: 'auto',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    behavior="padding">
                    <View style={{...styles.formField, borderWidth: 1}}>
                        <Text style={styles.loginLabel}>Label:</Text>
                        <TextInput
                            onChangeText={(device_name) => setScheduleName(device_name)}
                            style={styles.loginInput}
                            autoCapitalize="none"
                            placeholder="Ex. 'Weekday Mornings'"
                            placeholderTextColor="#697179"
                            underlineColorAndroid="transparent"
                            keyboardAppearance="dark"
                            value={scheduleName}
                        />
                    </View>
                </KeyboardAvoidingView>
                <Text
                    style={{
                        ...styles.h3,
                        width: '100%',
                        fontWeight: '500',
                        fontSize: 16,
                        marginTop: 20,
                    }}>
                    Start and End Time
                </Text>
                <View style={styles.timeSchedule}>
                    <TouchableOpacity style={styles.timeSelector} onPress={() => showTimeSelector('start')}>
                        <View style={styles.time}>
                            <Text style={{fontWeight: '400', fontSize: 12}}>{startTime}</Text>
                        </View>
                        <View style={styles.selectTime}>
                            <Text
                                style={{
                                    fontWeight: '300',
                                    fontSize: 16,
                                    marginRight: 10,
                                }}>
                                Select Start Time
                            </Text>
                            <Text>
                                <FontAwesome5Pro name={toggleStart ? 'chevron-up' : 'chevron-down'} />
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.datePicker}>
                        {toggleStart && (
                            <DateTimePicker
                                value={time}
                                mode={'time'}
                                is24Hour={false}
                                minuteInterval={15}
                                display="spinner"
                                textColor="#000000"
                                onChange={(event, selectedDate) => selectStartTime(event, selectedDate)}
                            />
                        )}
                    </View>
                </View>
                <View style={styles.timeSchedule}>
                    <TouchableOpacity style={styles.timeSelector} onPress={() => showTimeSelector('end')}>
                        <View style={styles.time}>
                            <Text style={{fontWeight: '400', fontSize: 12}}>{endTime}</Text>
                        </View>
                        <View style={styles.selectTime}>
                            <Text
                                style={{
                                    fontWeight: '300',
                                    fontSize: 16,
                                    marginRight: 10,
                                }}>
                                Select End Time
                            </Text>
                            <Text>
                                <FontAwesome5Pro name={toggleEnd ? 'chevron-up' : 'chevron-down'} />
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.datePicker}>
                        {toggleEnd && (
                            <DateTimePicker
                                value={durationTime}
                                mode={'time'}
                                is24Hour={false}
                                minuteInterval={15}
                                display="spinner"
                                textColor="#000000"
                                onChange={(event, selectedDate) => selectEndTime(event, selectedDate)}
                            />
                        )}
                    </View>
                </View>
                <View style={styles.scheduleDays}>{showDays()}</View>
            </View>
            <Button
                full
                transparent
                style={[
                    styles.itemWindow,
                    {
                        minHeight: 0,
                        width: '80%',
                        alignSelf: 'center',
                        marginVertical: 15,
                        borderWidth: 0,
                        borderColor: '#BFBFBF',
                    },
                ]}
                onPress={() => updateSchedule()}>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'right',
                        fontWeight: '500',
                        fontSize: 14,
                    }}>
                    Update
                </Text>
            </Button>
        </View>
    );
};

export default EditSchedule;
