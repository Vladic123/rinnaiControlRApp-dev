/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image, Text, Platform} from 'react-native';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import Amplify from 'aws-amplify';
import awsconfig from '../../aws-exports';
Amplify.configure(awsconfig);

const device = require('../../assets/images/Device.png');

const ConfirmAPMode = ({route, navigation}) => {
    return (
        <View style={styles.loginBox}>
            <TitleBar
                navigation={navigation}
                title={'Confirm the light \n is solid red'}
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
                    flex: 0.8,
                    borderRadius: 10,
                    marginTop: Platform.OS === 'ios' ? 40 : 20,
                    marginBottom: 0,
                    padding: 20,
                }}>
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
                    It might take a minute for the light on your Rinnai control•r™ Module to turn red. You have 30 minutes before the broadcast times
                    out.
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
                    The light is red
                </Text>
            </Button>
            <Button
                full
                transparent
                style={[
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
                onPress={() => navigation.navigate('FactoryReset')}>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'right',
                        fontWeight: '500',
                        fontSize: 14,
                    }}>
                    I’m not seeing the red light
                </Text>
            </Button>
        </View>
    );
};

export default ConfirmAPMode;
