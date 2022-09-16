/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image, Text} from 'react-native';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import Amplify from 'aws-amplify';
import awsconfig from '../../aws-exports';
import {CommonActions} from '@react-navigation/native';

Amplify.configure(awsconfig);

const device = require('../../assets/images/device_confirm.png');

const resetHome = () => {
    navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{name: 'Home'}],
        }),
    );
};

const ConfirmUpdate = ({route, navigation}) => {
    return (
        <View style={styles.loginBox}>
            <TitleBar
                navigation={navigation}
                title={'Your control•r™ Module \n is now updated'}
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
                    flex: 0.9,
                    borderRadius: 10,
                    marginTop: 50,
                    marginBottom: 50,
                    padding: 20,
                }}>
                <Image
                    style={{
                        width: 230,
                        height: 300,
                        marginBottom: 30,
                        marginTop: 20,
                        marginLeft: 20,
                    }}
                    source={device}
                />
                <Text
                    style={{
                        ...styles.h3,
                        fontSize: 16,
                        fontWeight: '600',
                        marginBottom: 30,
                        width: '80%',
                        textAlign: 'center',
                    }}>
                    Software Update Finished
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
                    Would you like to move forward with pairing your module?
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
                onPress={() => navigation.navigate('WifiSetup')}>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'right',
                        fontWeight: '500',
                        fontSize: 14,
                    }}>
                    Yes, continue with pairing
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
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        borderColor: '#ffffff',
                    },
                ]}
                onPress={() => resetHome()}>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'right',
                        fontWeight: '500',
                        fontSize: 14,
                    }}>
                    Do not continue pairing
                </Text>
            </Button>
        </View>
    );
};

export default ConfirmUpdate;
