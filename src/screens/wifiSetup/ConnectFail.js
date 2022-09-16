/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text} from 'react-native';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import {deviceActions} from '../../reducers/device';
import {CommonActions} from '@react-navigation/native';
import {useDispatch} from 'react-redux';

const ConnectFail = ({navigation}) => {
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

    return (
        <View style={styles.loginBox}>
            <TitleBar navigation={navigation} title={''} backButton={true} backNav="back" subTitle={false} drawer={false} transparent={true} />
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
                <Text
                    style={{
                        ...styles.h1,
                        fontSize: 30,
                        fontWeight: '700',
                        marginBottom: 10,
                        width: '80%',
                        textAlign: 'center',
                    }}>
                    Oops!
                </Text>
                <Text
                    style={{
                        ...styles.h3,
                        fontSize: 14,
                        fontWeight: '500',
                        marginBottom: 30,
                        width: '80%',
                        textAlign: 'center',
                    }}>
                    Something went wrong
                </Text>
                <Text
                    style={{
                        ...styles.h3,
                        fontSize: 14,
                        fontWeight: '500',
                        marginBottom: 10,
                        width: '80%',
                        textAlign: 'center',
                    }}>
                    Let’s try connecting your module in a different way. Tap the button below to set up your control•r™ Module with the Alternate
                    Connectivity Method.
                </Text>
                <Text
                    style={{
                        ...styles.h3,
                        fontSize: 14,
                        fontWeight: '500',
                        marginBottom: 10,
                        width: '75%',
                        color: '#3D3D3F',
                        textAlign: 'center',
                    }}>
                    Note: To use the Alternate Connectivity Method you will be required to temporarily leave the control•r™ app.
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
                onPress={navigateHome}>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'right',
                        fontWeight: '500',
                        fontSize: 14,
                    }}>
                    Alternate Connectivity Method
                </Text>
            </Button>
        </View>
    );
};

export default ConnectFail;
