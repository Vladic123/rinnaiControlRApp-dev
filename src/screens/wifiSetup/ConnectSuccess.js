/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image, Text} from 'react-native';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import {deviceActions} from '../../reducers/device';
import {CommonActions} from '@react-navigation/native';
import {useDispatch} from 'react-redux';

const ConnectSuccess = ({route, navigation}) => {
    const device = require('../../assets/images/device-success.png');
    const dispatch = useDispatch();

    function navigateHome() {
        dispatch(deviceActions.setPairing({})).then(() => {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Home'}],
                }),
            );
        });
    }

    function navigateRegistration() {
        dispatch(deviceActions.setPairing({})).then(() => {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'Home',
                        },
                    ],
                }),
            );
            navigation.navigate('Register', {
                screen: route,
                params: route.params,
            });
        });
    }

    return (
        <View style={styles.loginBox}>
            <TitleBar
                navigation={navigation}
                title={'Setup Complete'}
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
                    marginTop: 20,
                    marginBottom: 30,
                    padding: 20,
                    flex: 0.8,
                }}>
                <Image
                    resizeMethod="scale"
                    resizeMode="contain"
                    style={{
                        height: 250,
                        marginLeft: 20,
                        marginBottom: 20,
                        marginTop: 20,
                    }}
                    source={device}
                />
                <Text
                    style={{
                        ...styles.h1,
                        fontSize: 30,
                        fontWeight: '700',
                        marginBottom: 10,
                        width: '80%',
                        textAlign: 'center',
                    }}>
                    Success!
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
                    Your control•r™ Module is now ready for use.
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
                onPress={navigateRegistration}>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'right',
                        fontWeight: '500',
                        fontSize: 14,
                    }}>
                    Register My Tankless Water Heater
                </Text>
            </Button>
            <Button full transparent onPress={navigateHome}>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'center',
                        fontWeight: 'normal',
                        fontSize: 12,
                        marginBottom: 10,
                    }}>
                    Register Later
                </Text>
            </Button>
        </View>
    );
};

export default ConnectSuccess;
