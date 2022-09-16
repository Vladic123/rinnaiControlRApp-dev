/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef} from 'react';
import {useSelector} from 'react-redux';
import {Alert, Text, View} from 'react-native';
import {Button} from 'native-base';
import Amplify, {Auth} from 'aws-amplify';
import * as deviceSubscriptions from '../../graphql/deviceSubscriptions';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import gql from 'graphql-tag';
import AWSAppSyncClient, {AUTH_TYPE} from 'aws-appsync';
import awsconfig from '../../aws-exports';
import API from '../../services/API';
import RinnaiLoader from '../../components/RinnaiLoader';
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

const defaultInfo = {
    serial_id: '',
    name: '',
    m08_inlet_temperature: '',
    m04_combustion_cycles: '',
    operation_hours: '',
    m02_outlet_temperature: '',
    m01_water_flow_rate_raw: '',
};

const DeviceStatus = ({navigation}) => {
    const data = useSelector((state) => state.device.view);
    const device = useSelector((state) => state.device.view.device);
    const name = device?.device_name || data?.name;
    const [loading, setLoading] = useState(false);
    const [deviceInfo, setDeviceInfo] = useState(device?.info || defaultInfo);
    let deviceSubscriptionRef = useRef(null);

    useEffect(() => {
        setDeviceInfo(device?.info || defaultInfo);
    }, [device]);

    useEffect(() => {
        doMaintenanceRetrieval(false);
    }, []);

    useEffect(() => {
        return () => {
            if (deviceSubscriptionRef?.unsubscribe === 'function') {
                deviceSubscriptionRef.unsubscribe();
            }
        };
    }, []);

    const infoSubscription = () => {
        deviceSubscriptionRef = client
            .subscribe({
                query: gql(deviceSubscriptions.onUpdateDeviceInfo),
                variables: {
                    serial_id: deviceInfo?.serial_id,
                },
            })
            .subscribe({
                next: (infoData) => {
                    const getInfo = infoData.data.onUpdateDeviceInfo;
                    if (getInfo.name === deviceInfo?.name) {
                        setDeviceInfo(getInfo);
                    }
                },
                error: (error) => {
                    console.warn(error);
                },
            });
    };

    const performMaintenanceRetrieval = async () => {
        try {
            setLoading(true);
            await API.doMaintenanceRetrieval(deviceInfo?.name);
            infoSubscription();
        } finally {
            setLoading(false);
        }
    };

    const doMaintenanceRetrieval = async (alert) => {
        if (!alert) {
            await performMaintenanceRetrieval();
            return;
        }
        Alert.alert(
            'Run Maintenance Retrieval?',
            'this can take a few seconds to run, Values will change if the system detects a change',
            [
                {
                    text: 'OK',
                    onPress: async () => {
                        await performMaintenanceRetrieval();
                    },
                },
            ],
            {cancelable: false},
        );
    };

    return (
        <View style={styles.appContainer}>
            <TitleBar backButton={false} navigation={navigation} title={name?.toUpperCase()} subTitle={false} drawer={true} />
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
                    System Status
                </Text>
                <Button
                    full
                    transparent
                    style={[
                        {
                            minHeight: 0,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 50,
                            borderColor: '#ffffff',
                            borderWidth: 5,
                            borderRadius: 10,
                            backgroundColor: 'transparent',
                        },
                    ]}
                    onPress={() => doMaintenanceRetrieval(true)}>
                    <Text
                        style={{
                            color: '#000000',
                            textAlign: 'center',
                            fontWeight: '500',
                            fontSize: 14,
                        }}>
                        Refresh Results
                    </Text>
                </Button>
                <RinnaiLoader modal={loading} />
                <View style={{...styles.itemWindow, marginBottom: 10}}>
                    <View style={styles.deviceStatus}>
                        <View />
                        <View style={styles.statusTitle}>
                            <Text style={{...styles.h3, fontSize: 12}}>Water Flow</Text>
                        </View>
                        <View style={styles.statusValue}>
                            <Text style={{...styles.statusText, fontWeight: '300'}}>{deviceInfo?.m01_water_flow_rate_raw || 'N/A'}</Text>
                        </View>
                    </View>
                    <View style={styles.deviceStatus}>
                        <View />
                        <View style={styles.statusTitle}>
                            <Text style={{...styles.h3, fontSize: 12}}>Outlet Temp</Text>
                        </View>
                        <View style={styles.statusValue}>
                            <Text style={{...styles.statusText, fontWeight: '300'}}>{deviceInfo?.m02_outlet_temperature} &#176;f</Text>
                        </View>
                    </View>
                    <View style={styles.deviceStatus}>
                        <View />
                        <View style={styles.statusTitle}>
                            <Text style={{...styles.h3, fontSize: 12}}>Operation Hours x100</Text>
                        </View>
                        <View style={styles.statusValue}>
                            <Text style={{...styles.statusText, fontWeight: '300'}}>{deviceInfo?.operation_hours || 'N/A'}</Text>
                        </View>
                    </View>
                    <View style={styles.deviceStatus}>
                        <View />
                        <View style={styles.statusTitle}>
                            <Text style={{...styles.h3, fontSize: 12}}>Combustion Cycles x100</Text>
                        </View>
                        <View style={styles.statusValue}>
                            <Text style={{...styles.statusText, fontWeight: '300'}}>{deviceInfo?.m04_combustion_cycles}</Text>
                        </View>
                    </View>
                    <View style={styles.deviceStatus}>
                        <View />
                        <View style={styles.statusTitle}>
                            <Text style={{...styles.h3, fontSize: 12}}>Inlet Temp</Text>
                        </View>
                        <View style={styles.statusValue}>
                            <Text style={{...styles.statusText, fontWeight: '300'}}>{deviceInfo?.m08_inlet_temperature} &#176;f</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default DeviceStatus;
