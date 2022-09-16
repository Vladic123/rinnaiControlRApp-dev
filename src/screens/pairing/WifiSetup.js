/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Image, Text, Alert, SafeAreaView, Platform, ScrollView} from 'react-native';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import Amplify from 'aws-amplify';
import {deviceActions} from '../../reducers/device';
import NetInfo from '@react-native-community/netinfo';
import WifiManager from 'react-native-wifi-reborn';
import awsconfig from '../../aws-exports';
Amplify.configure(awsconfig);

const settingsImage = require('../../assets/images/settings-button.png');
const androidSettingsImage = require('../../assets/images/android-settings-button.png');
const wifiImage = require('../../assets/images/wifi-button.png');
const androidWifiImage = require('../../assets/images/android-wifi-button.png');
const androidPopup = require('../../assets/images/rinnai-popup.png');
const androidNetworkPopup = require('../../assets/images/rinnai-network-popup.png');

const networkImage = require('../../assets/images/network-button.png');

const WifiSetup = ({navigation}) => {
    const dispatch = useDispatch();
    const connection = useSelector((state) => state.device.connection);
    const [wifi, setWifi] = useState(false);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        NetInfo.addEventListener((state) => {
            const ssid = state.details.ssid;
            if (ssid) {
                const network = ssid.split('-');
                const conn = {
                    bssid: state.details.bssid,
                    ipAddress: state.details.ipAddress,
                    ssid: network[0],
                    subnet: state.details.subnet,
                };
                dispatch(deviceActions.setConnection(conn));
            }
        });
    }, [dispatch]);

    useEffect(() => {
        if (!connected) {
            WifiManager.getCurrentWifiSSID().then(
                (ssid) => {
                    const network = ssid.split('-');
                    const update = {
                        bssid: connection.bssid,
                        ipAddress: connection.ipAddress,
                        ssid: network[0],
                        subnet: connection.subnet,
                    };
                    setWifi(network[0]);
                    if (network[0] === 'Rinnai' || network[0] === 'rinnai') {
                        setConnected(true);
                        dispatch(deviceActions.setConnection(update));
                        if (Platform.OS === 'ios') {
                            navigation.navigate('CheckNetwork');
                        }
                    }
                },
                () => {
                    console.log('Cannot get Wifi');
                },
            );
        }
    }, [wifi, connection.bssid, connection.ipAddress, connection.subnet, dispatch]);

    const checkWifi = () => {
        WifiManager.getCurrentWifiSSID().then(
            (ssid) => {
                const network = ssid.split('-');
                const update = {
                    bssid: connection.bssid,
                    ipAddress: connection.ipAddress,
                    ssid: network[0],
                    subnet: connection.subnet,
                };
                setWifi(network[0]);
                if (network[0] === 'Rinnai' || network[0] === 'rinnai') {
                    dispatch(deviceActions.setConnection(update));
                    navigation.navigate('CheckNetwork');
                } else {
                    Alert.alert('Not Connected to Rinnai Wi-Fi', 'Please check your wifi settings', [{text: 'OK'}], {
                        cancelable: false,
                    });
                    // navigation.navigate('CheckNetwork');
                }
            },
            () => {
                Alert.alert('Not Connected to Rinnai Wi-Fi', 'Please check your wifi settings', [{text: 'OK'}], {
                    cancelable: false,
                });
                // navigation.navigate('FirmwareReset');
            },
        );
    };

    return (
        <View style={styles.appContainer}>
            <TitleBar
                backButton={true}
                backNav="back"
                navigation={navigation}
                title="Connect your phone to the Rinnai control•r™ Module"
                subTitle={false}
                full={true}
            />
            <SafeAreaView style={{flex: 1, width: '90%'}}>
                <View
                    style={{
                        ...styles.setupBox,
                        backgroundColor: '#ffffff',
                        flex: 0.9,
                        borderRadius: 10,
                        marginTop: 10,
                        padding: 10,
                    }}>
                    <ScrollView style={{width: '100%', flex: 1}}>
                        <Text
                            style={{
                                ...styles.h3,
                                fontSize: 18,
                                textAlign: 'left',
                                alignSelf: 'flex-start',
                                marginLeft: 5,
                                marginTop: 10,
                                marginBottom: 15,
                            }}>
                            Wireless Setup
                        </Text>
                        <View style={styles.setup}>
                            <View style={styles.setupItem}>
                                <Text style={{...styles.h3, fontSize: 14}}>Step 1:</Text>
                            </View>
                            <View style={styles.setupInstruction}>
                                <Text
                                    style={{
                                        ...styles.textBox,
                                        paddingTop: 0,
                                        fontWeight: '300',
                                        marginBottom: 0,
                                        color: '#000000',
                                    }}>
                                    Leave the control•r™ app and launch the Settings app.
                                </Text>
                                <View style={styles.imageBox}>
                                    <Image
                                        resizeMethod="scale"
                                        resizeMode="contain"
                                        style={{
                                            width: 200,
                                            height: 60,
                                        }}
                                        source={Platform.OS === 'ios' ? settingsImage : androidSettingsImage}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={styles.setup}>
                            <View style={styles.setupItem}>
                                <Text style={{...styles.h3, fontSize: 14}}>Step 2:</Text>
                            </View>
                            <View style={styles.setupInstruction}>
                                <Text
                                    style={{
                                        ...styles.textBox,
                                        paddingTop: 10,
                                        fontWeight: '300',
                                        marginBottom: 0,
                                        color: '#000000',
                                    }}>
                                    Tap on {Platform.OS === 'ios' ? '"WI-FI"' : '"Network & internet"'}
                                </Text>
                                <View style={styles.imageBox}>
                                    <Image
                                        resizeMethod="scale"
                                        resizeMode="contain"
                                        style={{
                                            width: 200,
                                            height: 60,
                                        }}
                                        source={Platform.OS === 'ios' ? wifiImage : androidWifiImage}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.setup}>
                            <View style={styles.setupItem}>
                                <Text style={{...styles.h3, fontSize: 14}}>Step 3:</Text>
                            </View>
                            <View style={styles.setupInstruction}>
                                <Text
                                    style={{
                                        ...styles.textBox,
                                        paddingTop: 10,
                                        fontWeight: '300',
                                        marginBottom: 0,
                                        color: '#000000',
                                    }}>
                                    Select the network starting with Rinnai
                                </Text>
                                <View style={styles.imageBox}>
                                    <Image
                                        resizeMethod="scale"
                                        resizeMode="contain"
                                        style={{
                                            width: 200,
                                            height: 60,
                                        }}
                                        source={networkImage}
                                    />
                                </View>
                            </View>
                        </View>
                        {Platform.OS === 'ios' && (
                            <View style={styles.setup}>
                                <View style={styles.setupItem}>
                                    <Text style={{...styles.h3, fontSize: 14}}>Step 4:</Text>
                                </View>
                                <View style={styles.setupInstruction}>
                                    <Text
                                        style={{
                                            ...styles.textBox,
                                            paddingTop: 10,
                                            fontWeight: '300',
                                            marginBottom: 0,
                                            color: '#000000',
                                        }}>
                                        Return to the control•r™ app, and press “Next” to continue
                                    </Text>
                                    <View style={styles.imageBox} />
                                </View>
                            </View>
                        )}
                        {Platform.OS === 'android' && (
                            <View style={styles.setup}>
                                <View style={styles.setupItem}>
                                    <Text style={{...styles.h3, fontSize: 14}}>Step 4:</Text>
                                </View>
                                <View style={styles.setupInstruction}>
                                    <Text
                                        style={{
                                            ...styles.textBox,
                                            paddingTop: 10,
                                            fontWeight: '300',
                                            marginBottom: 0,
                                            color: '#000000',
                                        }}>
                                        Wait a few seconds after selecting “Rinnai-xxxxxx”. A popup will appear alerting the network has no internet
                                        access. Tap that pop up
                                    </Text>
                                    <View style={styles.imageBox}>
                                        <Image
                                            resizeMethod="scale"
                                            resizeMode="contain"
                                            style={{
                                                width: 200,
                                                height: 100,
                                            }}
                                            source={androidPopup}
                                        />
                                    </View>
                                </View>
                            </View>
                        )}
                        {Platform.OS === 'android' && (
                            <View style={styles.setup}>
                                <View style={styles.setupItem}>
                                    <Text style={{...styles.h3, fontSize: 14}}>Step 5:</Text>
                                </View>
                                <View style={styles.setupInstruction}>
                                    <Text
                                        style={{
                                            ...styles.textBox,
                                            paddingTop: 10,
                                            fontWeight: '300',
                                            marginBottom: 0,
                                            color: '#000000',
                                        }}>
                                        Select "Yes" to stay connected then return to the control•r™ app, and press “Next” to continue
                                    </Text>
                                    <View style={styles.imageBox}>
                                        <Image
                                            resizeMethod="scale"
                                            resizeMode="contain"
                                            style={{
                                                width: 200,
                                                height: 150,
                                            }}
                                            source={androidNetworkPopup}
                                        />
                                    </View>
                                </View>
                            </View>
                        )}
                    </ScrollView>
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
                            // display: redirect ? 'flex' : 'none',
                        },
                    ]}
                    onPress={() => checkWifi()}>
                    <Text
                        style={{
                            color: '#000000',
                            textAlign: 'right',
                            fontWeight: '500',
                            fontSize: 14,
                        }}>
                        Next
                    </Text>
                </Button>
            </SafeAreaView>
        </View>
    );
};

export default WifiSetup;
