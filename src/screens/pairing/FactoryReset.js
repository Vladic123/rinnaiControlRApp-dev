/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image, Text} from 'react-native';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import Amplify from 'aws-amplify';
import awsconfig from '../../aws-exports';
Amplify.configure(awsconfig);

const device = require('../../assets/images/Device.png');
const FactoryReset = ({route, navigation}) => {
    return (
        <View style={styles.loginBox}>
            <TitleBar
                navigation={navigation}
                title={'Confirm the light is \n solid red'}
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
                    flex: 1,
                    borderRadius: 10,
                    marginTop: 50,
                    marginBottom: 50,
                    padding: 20,
                }}>
                <Image
                    style={{
                        marginTop: 20,
                        marginBottom: 20,
                        height: 200,
                        width: 120,
                    }}
                    source={device}
                />
                <View style={{...styles.setup, marginBottom: 10}}>
                    <View
                        style={{
                            ...styles.setupItem,
                            flex: 0.15,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}>
                        <Text
                            style={{
                                ...styles.h3,
                                fontSize: 14,
                                textAlign: 'center',
                            }}>
                            1.
                        </Text>
                    </View>
                    <View style={styles.setupInstruction}>
                        <Text
                            style={{
                                ...styles.textBox,
                                fontWeight: '300',
                                marginBottom: 0,
                                color: '#697179',
                                paddingTop: 6,
                            }}>
                            Press and hold the connect button on the module for about 45 seconds
                        </Text>
                    </View>
                </View>
                <View style={{...styles.setup, marginBottom: 10}}>
                    <View
                        style={{
                            ...styles.setupItem,
                            flex: 0.15,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}>
                        <Text
                            style={{
                                ...styles.h3,
                                fontSize: 14,
                                textAlign: 'center',
                            }}>
                            2.
                        </Text>
                    </View>
                    <View style={styles.setupInstruction}>
                        <Text
                            style={{
                                ...styles.textBox,
                                fontWeight: '300',
                                marginBottom: 0,
                                color: '#697179',
                                paddingTop: 6,
                            }}>
                            Once the module shows a white light, release the connect button
                        </Text>
                    </View>
                </View>
                <View style={{...styles.setup, marginBottom: 10}}>
                    <View
                        style={{
                            ...styles.setupItem,
                            flex: 0.15,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}>
                        <Text
                            style={{
                                ...styles.h3,
                                fontSize: 14,
                                textAlign: 'center',
                            }}>
                            3.
                        </Text>
                    </View>
                    <View style={styles.setupInstruction}>
                        <Text
                            style={{
                                ...styles.textBox,
                                fontWeight: '300',
                                marginBottom: 0,
                                color: '#697179',
                                paddingTop: 6,
                            }}>
                            The module will now turn off and on. It will show a yellow light.
                        </Text>
                    </View>
                </View>
                <View style={{...styles.setup, marginBottom: 10}}>
                    <View
                        style={{
                            ...styles.setupItem,
                            flex: 0.15,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}>
                        <Text
                            style={{
                                ...styles.h3,
                                fontSize: 14,
                                textAlign: 'center',
                            }}>
                            4.
                        </Text>
                    </View>
                    <View style={styles.setupInstruction}>
                        <Text
                            style={{
                                ...styles.textBox,
                                fontWeight: '300',
                                marginBottom: 0,
                                color: '#697179',
                                paddingTop: 6,
                            }}>
                            Once the module has turned on again, it will show a red light.
                        </Text>
                    </View>
                </View>
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
        </View>
    );
};

export default FactoryReset;
