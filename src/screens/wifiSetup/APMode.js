/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {View, Image, Text, Alert, Platform} from 'react-native';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import {deviceActions} from '../../reducers/device';
import {CommonActions} from '@react-navigation/native';
import WifiManager from 'react-native-wifi-reborn';

const APMode = ({navigation}) => {
    const dispatch = useDispatch();
    const device = require('../../assets/images/Device.png');

    const [modalVisibility, setModalVisibility] = useState(false);

    const cancelPairing = () => {
        WifiManager.getCurrentWifiSSID().then(
            (ssid) => {
                const wifi = ssid.split('-');
                if (wifi[0] === 'Rinnai' || wifi[0] === 'rinnai') {
                    if (!modalVisibility) {
                        setModalVisibility(true);
                        Alert.alert(
                            'Switch back to your Internet Wi-Fi',
                            `In order to proceed change your settings and disconnect ${wifi}`,
                            [{text: 'OK'}],
                            {
                                cancelable: false,
                            },
                        );
                    }
                } else {
                    dispatch(deviceActions.setPairing({})).then((response) => {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{name: 'Home'}],
                            }),
                        );
                    });
                }
            },
            () => {
                dispatch(deviceActions.setPairing({})).then((response) => {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{name: 'Home'}],
                        }),
                    );
                });
            },
        );
    };

    return (
        <View style={styles.loginBox}>
            <TitleBar
                navigation={navigation}
                title={'Press the Connect button'}
                backButton={true}
                backNav="back"
                subTitle={false}
                drawer={false}
                transparent={true}
            />
            <View
                style={{
                    ...styles.formBox,
                    backgroundColor: '#ffffff',
                    borderRadius: 10,
                    marginTop: Platform.OS === 'ios' ? 40 : 20,
                    marginBottom: 30,
                    padding: 20,
                }}>
                <Text
                    style={{
                        ...styles.h3,
                        fontSize: 16,
                        fontWeight: '500',
                        width: '90%',
                        textAlign: 'center',
                    }}>
                    Press and hold the connect button on the module until the light turns red. If it’s already red, tap continue below.
                </Text>
                <Image
                    resizeMethod="scale"
                    resizeMode="contain"
                    style={{
                        height: 170,
                        marginBottom: 20,
                        marginTop: 20,
                    }}
                    source={device}
                />
                <Text
                    style={{
                        ...styles.h3,
                        fontSize: 14,
                        fontWeight: '300',
                        marginBottom: 30,
                        width: '80%',
                        textAlign: 'center',
                    }}>
                    It may take a few moments for the light on your Rinnai control•r™ Module to turn red.
                </Text>
                <Text
                    style={{
                        ...styles.h3,
                        fontSize: 14,
                        fontWeight: '300',
                        marginBottom: 30,
                        width: '80%',
                        textAlign: 'center',
                    }}>
                    You have 5 minutes until the broadcast times out and the button will need to be pressed again
                </Text>
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
                    },
                ]}
                onPress={() => navigation.navigate('ConnectRinnai')}>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'right',
                        fontWeight: '500',
                        fontSize: 14,
                    }}>
                    Continue
                </Text>
            </Button>
            <Button full transparent onPress={() => cancelPairing()}>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'center',
                        fontWeight: 'normal',
                        fontSize: 12,
                        marginBottom: 10,
                    }}>
                    Cancel Device Pairing
                </Text>
            </Button>
        </View>
    );
};

export default APMode;
