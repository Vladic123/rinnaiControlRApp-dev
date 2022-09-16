/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, ScrollView, Text, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as RNLocalize from 'react-native-localize';
import moment from 'moment-timezone';
import {Button} from 'native-base';
import styles from '../../styles/Style';
import TitleBar from '../../components/TitleBar';
import RinnaiLoader from '../../components/RinnaiLoader';
import {deviceActions} from '../../reducers/device';
import API from '../../services/API';
import utils from '../../utils';

const selectedCheck = require('../../assets/images/selected-check.png');

const Timezones = ({navigation}) => {
    const dispatch = useDispatch();
    const [loading, setLoader] = useState(false);
    const [timezone, setTimezone] = useState('');
    const localTZ = RNLocalize.getTimeZone();
    const date = new Date();
    const [time, setTime] = useState(utils.getDeviceTimeZoneCodeDescription(moment(date).tz(localTZ).format('z')));
    const data = useSelector((state) => state.device.view);
    const device = useSelector((state) => state.device.view.device);
    const name = device.device_name ? device.device_name : data.name;
    const thingName = device.thing_name;

    const timezones = {
        Eastern: 'EST5EDT,M3.2.0,M11.1.0',
        Central: 'CST6CDT,M3.2.0,M11.1.0',
        Mountain: 'MST7MDT,M3.2.0,M11.1.0',
        Pacific: 'PST8PDT,M3.2.0,M11.1.0',
        Alaska: 'AKST9AKDT,M3.2.0,M11.1.0',
        Hawaii: 'HAW10',
        Atlantic: 'AST4ADT,M4.1.0/00:01:00,M10.5.0/00:01:00',
        Newfoundland: 'NST+3:30NDT+2:30,M3.2.0/00:01:00,M11.1.0/00:01:00',
    };

    const zones = {
        Eastern: 'America/New_York',
        Central: 'America/Chicago',
        Mountain: 'America/Denver',
        Pacific: 'America/Los_Angeles',
        Alaska: 'America/Anchorage',
        Hawaii: 'Pacific/Honolulu',
        Atlantic: 'America/Halifax',
        Newfoundland: 'America/St_Johns',
    };

    useEffect(() => {
        const zone = utils.getTimeZoneCoordinatesDescription(device?.shadow?.timezone);
        setTimezone(zone);
        setTime(zone);
    }, [device]);

    const saveTimezone = async () => {
        setLoader(true);
        try {
            await API.setTimezone(thingName, timezones[timezone]);
            setTimeout(() => {
                API.getViewDevice(device?.id, name).then(async (view) => {
                    await dispatch(deviceActions.setDeviceView(view));
                });
            }, 800);
            dispatch(deviceActions.setTransientShadow({id: device?.id, timezone: timezones[timezone]}));
        } finally {
            setLoader(false);
            navigation.goBack();
        }
    };

    const listNetworks = () => {
        return Object.keys(timezones).map((item, key) => {
            const zone_name = zones[item];
            const zone = moment().tz(zone_name).format('H:mm a');

            return (
                <Button style={styles.wifiSelect} key={key} onPress={() => setTimezone(item)}>
                    <View style={styles.signal}>{timezone === item && <Image style={{height: 15, width: 20}} source={selectedCheck} />}</View>
                    <View style={styles.ssid}>
                        <Text
                            style={{
                                ...styles.h2,
                                color: timezone === item ? '#306F99' : '#000000',
                            }}>
                            {item}
                        </Text>
                    </View>
                    <View style={styles.timezoneTime}>
                        <Text
                            style={{
                                ...styles.h2,
                                color: timezone === item ? '#306F99' : '#000000',
                            }}>
                            {zone}
                        </Text>
                    </View>
                </Button>
            );
        });
    };

    return (
        <View style={styles.appContainer}>
            <RinnaiLoader modal={loading} />
            <TitleBar navigation={navigation} title="Time Zone" backButton={true} backNav="back" subTitle={false} drawer={false} transparent={true} />
            <View style={{flex: 1, alignItems: 'center', width: '100%'}}>
                <View
                    style={{
                        ...styles.formBox,
                        backgroundColor: '#ffffff',
                        flex: 0.1,
                        borderRadius: 10,
                        marginTop: 10,
                        marginBottom: 10,
                        padding: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Text style={{...styles.h2, width: '100%', textAlign: 'center', fontSize: 20}}>{time}</Text>
                </View>
                <View
                    style={{
                        ...styles.formBox,
                        backgroundColor: '#ffffff',
                        flex: 1,
                        borderRadius: 10,
                        marginTop: 10,
                        marginBottom: 50,
                        padding: 0,
                    }}>
                    <ScrollView style={{width: '100%'}}>{listNetworks()}</ScrollView>
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
                onPress={() => saveTimezone()}>
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

export default Timezones;
