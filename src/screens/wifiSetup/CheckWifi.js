/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Text, Image} from 'react-native';
import {Button} from 'native-base';
import styles from '../../styles/Style';
import TitleBar from '../../components/TitleBar';
import {deviceActions} from '../../reducers/device';
import * as Progress from 'react-native-progress';
import {CommonActions} from '@react-navigation/native';

const CheckWifi = ({navigation}) => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.account);
    const pairing = useSelector((state) => state.device.pairing);
    const [wifi, setWifi] = useState(false);
    const check = require('../../assets/images/green-check.png');

    useEffect(() => {
        if (!wifi) {
            setTimeout(() => {
                setWifi(true);
            }, 1000 * 45);
        }
    }, [wifi]);

    const setupDevice = () => {
        const user_uuid = userData.id;
        const register = {
            ...pairing,
            user_uuid,
        };

        dispatch(deviceActions.setPairing(register)).then((response) => {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Home'}],
                }),
            );
        });
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
                            onPress={() => navigation.navigate('WifiSetup')}>
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

export default CheckWifi;
