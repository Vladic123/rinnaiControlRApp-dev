/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {View, Text, Image, Alert} from 'react-native';
import {Button} from 'native-base';
import styles from '../../styles/Style';
import TitleBar from '../../components/TitleBar';
import * as Progress from 'react-native-progress';
import API from '../../services/API';

import RinnaiLoader from '../../components/RinnaiLoader';

const WifiCheck = ({navigation}) => {
    const userData = useSelector((state) => state.auth.account);
    const pairing = useSelector((state) => state.device.pairing);
    const [wifi, setWifi] = useState(false);
    const check = require('../../assets/images/green-check.png');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!wifi) {
            setTimeout(() => {
                setWifi(true);
            }, 1000 * 45);
        }
    }, [wifi]);

    const setupDevice = async () => {
        try {
            setIsLoading(true);
            const user_uuid = userData.id;
            const register = {
                ...pairing,
                user_uuid,
            };
            delete register.ssid;
            const newDevice = await API.checkDevice(pairing.id);
            if (newDevice?.data?.getDevice) {
                await API.updateUserDevice(register);
                navigation.navigate('FinishWifiSetup');
            } else {
                await API.createUserDevice({...register, thing_name: 'none'});
                navigation.navigate('FinishWifiSetup');
            }
        } catch (err) {
            let errorMessage = 'Please try again.';
            if (err?.errors?.toString().includes('Network Error')) {
                errorMessage = 'Please, check your wifi connection and try again.';
            }
            Alert.alert('Failed to fetch and create device', errorMessage, [{text: 'OK', onPress: () => console.log('OK Pressed')}], {
                cancelable: false,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.loginBox}>
            <TitleBar
                navigation={navigation}
                title={`Connecting to \n ${pairing.ssid}`}
                backButton={true}
                subTitle={false}
                drawer={false}
                transparent={true}
            />
            <RinnaiLoader modal={isLoading} />
            <View
                style={{
                    ...styles.formBox,
                    backgroundColor: '#ffffff',
                    flex: 0.9,
                    borderRadius: 10,
                    marginTop: 20,
                    marginBottom: 20,
                    padding: 20,
                }}>
                <Progress.Circle
                    style={{alignItems: 'center', justifyContent: 'center'}}
                    size={150}
                    color={wifi ? '#4EC32D' : '#697179'}
                    thickness={30}
                    borderWidth={5}
                    strokeCap="round"
                    endAngle={0.3}
                    indeterminate={!wifi}>
                    <View style={styles.loadingInner}>
                        {wifi && (
                            <Image
                                style={{
                                    position: 'absolute',
                                    marginBottom: 30,
                                    marginTop: 20,
                                    width: 78,
                                    height: 65,
                                }}
                                source={check}
                            />
                        )}
                    </View>
                </Progress.Circle>
                <Text
                    style={{
                        ...styles.h3,
                        fontSize: 12,
                        fontWeight: '300',
                        marginTop: 10,
                        marginBottom: 10,
                    }}>
                    When the module is connecting, it will flash blue and red for a few seconds. If the wifi connects, it will flash blue and green.
                    If the light stays blinking blue and red then select the proper choice below. Please wait a few moments for the module to conduct
                    this process.
                </Text>
                {wifi && (
                    <View>
                        <Button
                            full
                            transparent
                            disabled={isLoading}
                            style={[
                                styles.itemWindow,
                                {
                                    minHeight: 0,
                                    width: '90%',
                                    alignSelf: 'center',
                                    marginTop: 10,
                                    borderWidth: 1,
                                    borderColor: '#BFBFBF',
                                },
                            ]}
                            onPress={() => setupDevice()}>
                            <Text
                                style={{
                                    color: '#000000',
                                    textAlign: 'right',
                                    fontWeight: '500',
                                    fontSize: 14,
                                }}>
                                The light is blinking blue and green
                            </Text>
                        </Button>
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
                                    borderWidth: 1,
                                    borderColor: '#BFBFBF',
                                },
                            ]}
                            onPress={() => navigation.navigate('WifiHome')}>
                            <Text
                                style={{
                                    color: '#000000',
                                    textAlign: 'right',
                                    fontWeight: '500',
                                    fontSize: 14,
                                }}>
                                The light is blinking blue and red
                            </Text>
                        </Button>
                    </View>
                )}
            </View>
        </View>
    );
};

export default WifiCheck;
