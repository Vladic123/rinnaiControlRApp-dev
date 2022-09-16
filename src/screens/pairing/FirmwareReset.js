/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Image, Text, Platform, Alert} from 'react-native';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import Amplify from 'aws-amplify';
import awsconfig from '../../aws-exports';
import {useIsFocused} from '@react-navigation/native';
import * as Progress from 'react-native-progress';

Amplify.configure(awsconfig);
const device = require('../../assets/images/device_check.png');
const check = require('../../assets/images/green-check.png');

const FirmwareReset = ({navigation}) => {
    const [rebooting, setRebooting] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused && rebooting) {
            setTimeout(() => {
                setRebooting(false);
            }, 1000 * 60);
        }
    }, [isFocused, rebooting]);

    const deviceStateButtons = () => {
        return (
            <View style={{width: '100%'}}>
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
                    onPress={() => navigation.navigate('WifiHome')}>
                    <Text
                        style={{
                            color: '#000000',
                            textAlign: 'right',
                            fontWeight: '500',
                            fontSize: 14,
                        }}>
                        Continue Setup
                    </Text>
                </Button>
            </View>
        );
    };

    const showLoader = () => {
        return (
            <Progress.Circle
                style={{alignItems: 'center', justifyContent: 'center'}}
                size={150}
                color={rebooting ? '#4EC32D' : '#697179'}
                thickness={30}
                borderWidth={5}
                strokeCap="round"
                endAngle={0.3}
                indeterminate={rebooting}>
                <View style={styles.loadingInner}>
                    {!rebooting && (
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
        );
    };

    return (
        <View style={styles.loginBox}>
            <TitleBar
                navigation={navigation}
                title={'Wait for the red or white light'}
                backButton={true}
                backNav="back"
                subTitle={false}
                drawer={false}
                transparent={true}
            />
            <View style={styles.stepProgressLabel}>
                <View style={styles.progressLabel}>
                    <Text>Step 1:</Text>
                </View>
                <View style={styles.labelSpacer} />
                <View style={styles.progressLabel}>
                    <Text>Step 2:</Text>
                </View>
                <View style={styles.labelSpacer} />
                <View style={styles.progressLabel}>
                    <Text>Step 3:</Text>
                </View>
            </View>
            <View style={styles.stepProgress}>
                <View
                    style={{
                        ...styles.progressDot,
                        backgroundColor: '#94CB2A',
                    }}
                />
                <View
                    style={{
                        ...styles.progressSpacer,
                        backgroundColor: '#94CB2A',
                    }}
                />
                <View
                    style={{
                        ...styles.progressDot,
                        backgroundColor: '#94CB2A',
                    }}
                />
                <View
                    style={{
                        ...styles.progressSpacer,
                        backgroundColor: '#94CB2A',
                    }}
                />
                <View style={{...styles.progressDot, backgroundColor: '#94CB2A'}} />
            </View>
            <View
                style={{
                    ...styles.formBox,
                    flexDirection: 'column',
                    backgroundColor: '#ffffff',
                    flex: 0.8,
                    borderRadius: 10,
                    marginBottom: Platform.OS === 'android' ? 10 : 40,
                    padding: 20,
                    paddingBottom: 0,
                }}>
                <View style={{flex: 1, flexDirection: 'column'}}>
                    <Text
                        style={{
                            ...styles.h3,
                            fontSize: 16,
                            fontWeight: '500',
                            marginBottom: Platform.OS === 'android' ? 0 : 20,
                            marginTop: Platform.OS === 'android' ? 0 : 20,
                            color: '#000000',
                            textAlign: 'center',
                        }}>
                        Restarting control•r™ Module
                    </Text>
                    <Text
                        style={{
                            ...styles.h3,
                            fontSize: 16,
                            fontWeight: '300',
                            marginBottom: Platform.OS === 'android' ? 0 : 30,
                            textAlign: 'center',
                        }}>
                        Once the restart is complete, the light will be red or white. Select Continue setup once loading is complete and either red or
                        white is displayed on the control•r™ Module.
                    </Text>
                </View>
                {rebooting ? (
                    showLoader()
                ) : (
                    <Image
                        resizeMethod="scale"
                        resizeMode="contain"
                        style={{
                            height: Platform.OS === 'android' ? 130 : 120,
                            marginBottom: Platform.OS === 'android' ? 0 : 20,
                            marginTop: 20,
                        }}
                        source={device}
                    />
                )}
            </View>
            {rebooting || deviceStateButtons()}
        </View>
    );
};

export default FirmwareReset;
