/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {Text, View, TouchableOpacity, Alert} from 'react-native';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import moment from 'moment-timezone';
import {Calendar} from 'react-native-calendars';

const VacationSchedule = ({navigation}) => {
    const data = useSelector((state) => state.device.view);
    const [dateRange, setDateRange] = useState('Select Date Range');
    const [toggleStart, setToggleStart] = useState(false);
    const [toggleEnd, setToggleEnd] = useState(false);
    const [period, setPeriod] = useState({});

    const device = useSelector((state) => state.device.view.device);
    const name = device.device_name ? device.device_name : data.name;

    const showTimeSelector = (selector) => {
        if (selector === 'start') {
            setToggleEnd(false);
            setToggleStart(!toggleStart);
        } else {
            setToggleStart(false);
            setToggleEnd(!toggleEnd);
        }
    };

    const saveSchedule = () => {
        if (Object.keys(period).length > 0) {
            navigation.navigate('Schedule');
        } else {
            Alert.alert('Schedule Error', 'Please Select A Date Range', [{text: 'OK', onPress: () => console.log('OK Pressed')}], {
                cancelable: false,
            });
        }
    };

    const setRange = () => {
        var range = [];
        var end;
        var start;

        Object.keys(period).forEach((day) => {
            range.push(day);
        });
        range.sort();
        if (range.length > 1) {
            const total = range.length - 1;
            end = range[total];
        }

        start = range[0];
        const startDate = moment(start).format('ll');
        const endDate = moment(end).format('ll');
        const displayRange = `${startDate} - ${endDate}`;
        setDateRange(displayRange);
        console.log(range);
    };

    const addToPeriod = (date) => {
        console.log(date.dateString);
        const color = {
            color: '#2F363D',
            textColor: 'white',
        };

        setPeriod({
            ...period,
            [date.dateString]: color,
        });
        setToggleStart(false);
    };

    return (
        <View style={styles.appContainer}>
            <TitleBar backButton={false} navigation={navigation} title={name.toUpperCase()} subTitle={false} drawer={true} />
            <View
                style={{
                    ...styles.formBox,
                    backgroundColor: 'transparent',
                    flex: 1,
                    borderRadius: 10,
                    marginTop: 0,
                    marginBottom: 0,
                }}>
                <Text
                    style={{
                        ...styles.h3,
                        fontWeight: '300',
                        fontSize: 22,
                        marginBottom: 20,
                    }}>
                    Vacation Mode
                </Text>
                <Text
                    style={{
                        ...styles.h3,
                        width: '90%',
                        fontWeight: '300',
                        fontSize: 16,
                        marginTop: 20,
                        marginBottom: 20,
                        textAlign: 'center',
                    }}>
                    Recirculation schedules will be inactive while heater is on Vacation Mode
                </Text>
                <View style={styles.timeSchedule}>
                    <TouchableOpacity style={styles.timeSelector} onPress={() => showTimeSelector('start')}>
                        <View style={styles.time}>
                            <Text style={{fontWeight: '400', fontSize: 12}}>DATE RANGE</Text>
                            <Text
                                style={{
                                    fontWeight: '300',
                                    fontSize: 16,
                                    marginRight: 10,
                                }}>
                                {dateRange}
                            </Text>
                        </View>
                        <View style={styles.selectTime}>
                            <Text>
                                <FontAwesome5Pro name={'calendar-alt'} />
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.datePicker}>
                        {toggleStart && (
                            <View>
                                <Calendar onDayPress={(day) => addToPeriod(day)} markedDates={period} markingType={'period'} />
                                <Button
                                    full
                                    transparent
                                    style={[
                                        styles.itemWindow,
                                        {
                                            borderRadius: 0,
                                            minHeight: 0,
                                            width: '100%',
                                            alignSelf: 'center',
                                            marginTop: 10,
                                        },
                                    ]}
                                    onPress={() => setRange()}>
                                    <Text
                                        style={{
                                            color: '#000000',
                                            textAlign: 'right',
                                            fontWeight: '500',
                                            fontSize: 14,
                                        }}>
                                        Confirm
                                    </Text>
                                </Button>
                            </View>
                        )}
                    </View>
                </View>
            </View>
            <Button
                full
                transparent
                style={[
                    styles.itemWindow,
                    {
                        borderRadius: 0,
                        minHeight: 0,
                        width: '100%',
                        alignSelf: 'center',
                        marginTop: 10,
                    },
                ]}
                onPress={() => saveSchedule()}>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'right',
                        fontWeight: '500',
                        fontSize: 14,
                    }}>
                    Save
                </Text>
            </Button>
        </View>
    );
};

export default VacationSchedule;
