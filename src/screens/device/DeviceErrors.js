/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {useSelector} from 'react-redux';
import {Image, Text, View, TouchableOpacity} from 'react-native';
import Amplify, {Auth} from 'aws-amplify';
import gql from 'graphql-tag';
import AWSAppSyncClient, {AUTH_TYPE} from 'aws-appsync';
import TitleBar from '../../components/TitleBar';
import awsconfig from '../../aws-exports';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import moment from 'moment-timezone';
import {useIsFocused} from '@react-navigation/native';
import * as subscriptions from '../../graphql/deviceSubscriptions';
import styles from '../../styles/Style';
import errorStyles from '../../styles/Error';
import {ScrollView} from 'react-native-gesture-handler';
import API from '../../services/API';
const active = require('../../assets/images/alert-active.png');
const inActive = require('../../assets/images/alert-inactive.png');

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

const DeviceErrors = ({navigation}) => {
    let errorSubscriptionRef = useRef(null);
    const isFocused = useIsFocused();
    const data = useSelector((state) => state.device.view);
    const [weekErrors, setWeekErrors] = useState([]);
    const [dayErrors, setDayErrors] = useState([]);
    const [monthErrors, setMonthErrors] = useState([]);
    const [ref, setRef] = useState(null);
    const [codes, setCodes] = useState({});
    const [refresh, setRefresh] = useState(false);
    const [toggleMenu, setToggleMenu] = useState(false);
    const [dataSourceCords, setDataSourceCords] = useState([]);
    const device = useSelector((state) => state.device.view.device);
    const name = device && device.name ? device.device_name : data.name;

    useEffect(() => {
        if (!refresh) {
            errorDay();
            errorWeek();
            errorMonth();
        }
    }, [device]);

    // Subscription to Error History
    useEffect(() => {
        if (isFocused) {
            errorSubscription();
        }
    }, [isFocused]);

    useEffect(() => {
        return () => {
            if (errorSubscriptionRef?.unsubscribe === 'function') {
                errorSubscriptionRef.unsubscribe();
            }
        };
    }, []);

    const errorSubscription = () => {
        errorSubscriptionRef = client
            .subscribe({
                query: gql(subscriptions.onCreateDeviceErrorHistory),
                variables: {serial_id: device.id},
            })
            .subscribe({
                next: (historyData) => {
                    const subData = historyData.data.onCreateDeviceErrorHistory;
                    console.log(subData);
                    console.log(dayErrors);
                    errorDay();
                    setRefresh(true);
                },
                error: (error) => {
                    console.warn(error);
                },
            });
    };

    const drawerMenu = (menu) => {
        if (menu === toggleMenu) {
            setToggleMenu(false);
        } else {
            setToggleMenu(menu);
        }
    };

    const toggleIcon = (menu) => {
        if (menu === toggleMenu) {
            return <FontAwesome5Pro name="chevron-up" style={{color: '#000000'}} light />;
        } else {
            return <FontAwesome5Pro name="chevron-down" style={{color: '#000000'}} light />;
        }
    };

    const errorDay = () => {
        const now = moment().add(5, 'hours').format('YYYY-MM-DDTHH:mm:ss.sss');
        const to = moment().subtract(1, 'day').format('YYYY-MM-DDTHH:mm:ss.sss');
        API.listErrors().then((errList) => {
            setCodes(errList);
        });
        API.getDeviceErrors(device.id, now, to).then((errors) => {
            setDayErrors(errors);
        });
    };

    const errorWeek = () => {
        const now = moment().subtract(20, 'hours').format('YYYY-MM-DDTHH:mm:ss.sss');
        const to = moment().subtract(7, 'day').format('YYYY-MM-DDTHH:mm:ss.sss');
        API.listErrors().then((errList) => {
            setCodes(errList);
        });
        API.getDeviceErrors(device.id, now, to).then((errors) => {
            setWeekErrors(errors);
        });
    };

    const errorMonth = () => {
        const now = moment().subtract(6, 'day').format('YYYY-MM-DDTHH:mm:ss.sss');
        const to = moment().subtract(30, 'day').format('YYYY-MM-DDTHH:mm:ss.sss');
        API.listErrors().then((errList) => {
            setCodes(errList);
        });
        API.getDeviceErrors(device.id, now, to).then((errors) => {
            setMonthErrors(errors);
        });
    };

    const displayErrors = (errorMap) => {
        return errorMap.map((error, key) => {
            const codeID = error.id;
            const getCode = Object.keys(codes).length > 0 ? codes.find(({id}) => id === `${error.error_code}`) : false;
            const day = moment(error.createdAt).format('MM/DD');
            const time = moment(error.createdAt).format('hh:mm a');
            const errorActive = error.active ? active : inActive;
            const type = getCode ? getCode.type : 'N/A';
            const message = getCode ? getCode.message : 'N/A';
            return (
                <View style={errorStyles.errorItem} key={key}>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 10,
                        }}
                        onLayout={(event) => {
                            const layout = event.nativeEvent.layout;
                            dataSourceCords[key] = layout;
                            setDataSourceCords(dataSourceCords);
                        }}
                        onPress={() => drawerMenu(codeID)}>
                        <Image
                            style={{
                                margin: 5,
                                height: 50,
                                width: 50,
                            }}
                            source={errorActive}
                        />
                        <View style={errorStyles.error}>
                            <View>
                                <Text
                                    style={{
                                        fontWeight: '400',
                                        fontSize: 14,
                                    }}>
                                    {error.error_code}
                                </Text>
                                <Text
                                    style={{
                                        fontWeight: '400',
                                        flexWrap: 'wrap',
                                        fontSize: 14,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    {type}
                                </Text>
                            </View>
                            <View style={errorStyles.errorDetails}>
                                <Text style={errorStyles.detailItems}>{day}</Text>
                                <Text style={errorStyles.detailItems}>{time}</Text>
                            </View>
                        </View>
                        <View style={{flex: 0.07, alignItems: 'center'}}>
                            <Text>{toggleIcon(codeID)}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.datePicker}>
                        {codeID === toggleMenu && (
                            <View style={{width: '100%'}}>
                                <Text
                                    style={{
                                        backgroundColor: '#F3F5F7',
                                        padding: 20,
                                        fontWeight: '300',
                                        flexWrap: 'wrap',
                                        fontSize: 12,
                                    }}>
                                    {message}
                                </Text>
                                <View style={styles.deviceStatus}>
                                    <View />
                                    <View style={styles.statusTitle}>
                                        <Text style={{...styles.h3, fontSize: 14}}>Water Flow</Text>
                                    </View>
                                    <View style={styles.statusValue}>
                                        <Text style={styles.statusText}>{error.m01_water_flow_rate_raw ? error.m01_water_flow_rate_raw : 'N/A'}</Text>
                                    </View>
                                </View>
                                <View style={styles.deviceStatus}>
                                    <View />
                                    <View style={styles.statusTitle}>
                                        <Text style={{...styles.h3, fontSize: 14}}>Outlet Temp</Text>
                                    </View>
                                    <View style={styles.statusValue}>
                                        <Text style={styles.statusText}>
                                            {error.m02_outlet_temperature ? error.m02_outlet_temperature : 0} &#176;f
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.deviceStatus}>
                                    <View />
                                    <View style={styles.statusTitle}>
                                        <Text style={{...styles.h3, fontSize: 14}}>Operation Hours x100</Text>
                                    </View>
                                    <View style={styles.statusValue}>
                                        <Text style={styles.statusText}>{error.operation_hours ? error.operation_hours : 'N/A'}</Text>
                                    </View>
                                </View>
                                <View style={styles.deviceStatus}>
                                    <View />
                                    <View style={styles.statusTitle}>
                                        <Text style={{...styles.h3, fontSize: 14}}>Combustion Cycles x100</Text>
                                    </View>
                                    <View style={styles.statusValue}>
                                        <Text style={styles.statusText}>{error.m04_combustion_cycles ? error.m04_combustion_cycles : 0}</Text>
                                    </View>
                                </View>
                                <View style={styles.deviceStatus}>
                                    <View />
                                    <View style={styles.statusTitle}>
                                        <Text style={{...styles.h3, fontSize: 14}}>Inlet Temp</Text>
                                    </View>
                                    <View style={styles.statusValue}>
                                        <Text style={styles.statusText}>{error.m08_inlet_temperature ? error.m08_inlet_temperature : 0} &#176;f</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            );
        });
    };
    return (
        <View style={styles.appContainer}>
            <TitleBar backButton={true} backNav="menu" navigation={navigation} title={name.toUpperCase()} subTitle={false} drawer={false} />
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
                    Error History
                </Text>
                <ScrollView style={{flex: 1, width: '100%'}}>
                    <View style={errorStyles.errorWindow}>
                        <Text style={errorStyles.errorHeader}>24 Hours</Text>
                        <ScrollView
                            ref={(scrollRef) => {
                                setRef(scrollRef);
                            }}
                            style={{width: '100%'}}>
                            {displayErrors(dayErrors)}
                        </ScrollView>
                    </View>
                    <View style={errorStyles.errorWindow}>
                        <Text style={errorStyles.errorHeader}>This Week</Text>
                        <ScrollView
                            ref={(scrollRef) => {
                                setRef(scrollRef);
                            }}
                            style={{width: '100%'}}>
                            {displayErrors(weekErrors)}
                        </ScrollView>
                    </View>
                    <View style={errorStyles.errorWindow}>
                        <Text style={errorStyles.errorHeader}>This Month</Text>
                        <ScrollView
                            ref={(scrollRef) => {
                                setRef(scrollRef);
                            }}
                            style={{width: '100%'}}>
                            {displayErrors(monthErrors)}
                        </ScrollView>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default DeviceErrors;
