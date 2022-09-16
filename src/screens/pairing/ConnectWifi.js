/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image, Text} from 'react-native';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import Amplify from 'aws-amplify';
import awsconfig from '../../aws-exports';

Amplify.configure(awsconfig);
const device = require('../../assets/images/Device-blue.png');

const ConnectWifi = ({navigation}) => {
    return (
        <View style={styles.loginBox}>
            <TitleBar
                navigation={navigation}
                title={'Wait for the blue light'}
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
                    marginBottom: 50,
                    padding: 20,
                }}>
                <Image
                    style={{
                        width: 155,
                        height: 250,
                        marginBottom: 30,
                        marginTop: 20,
                    }}
                    source={device}
                />
                <Text
                    style={{
                        ...styles.h3,
                        fontSize: 16,
                        fontWeight: '300',
                        marginBottom: 30,
                        width: '80%',
                        textAlign: 'center',
                    }}>
                    Text explaining either continuing WIFI setup or being done
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
                    Continue and setup Wifi
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
                onPress={() => navigation.navigate('Home')}>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'right',
                        fontWeight: '500',
                        fontSize: 14,
                    }}>
                    Done
                </Text>
            </Button>
        </View>
    );
};

export default ConnectWifi;
