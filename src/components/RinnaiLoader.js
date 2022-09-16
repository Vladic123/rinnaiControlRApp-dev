/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Modal, Platform, Text, Image, View} from 'react-native';
import styles from '../styles/Style';
import * as Progress from 'react-native-progress';
import {BlurView} from '@react-native-community/blur';
const rinnaiImage = require('../assets/images/logo.png');

const RinnaiLoader = ({modal = false, title}) => {
    return (
        <Modal animationType="fade" transparent={true} visible={modal}>
            {Platform.OS === 'ios' ? (
                <BlurView
                    blurType="dark"
                    blurAmount={5}
                    reducedTransparencyFallbackColor="white"
                    style={{
                        flexDirection: 'row',
                        width: '100%',
                        height: '100%',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <View style={{...styles.loadingOuter, height: 160, width: 160}}>
                        <Progress.Circle
                            style={{alignItems: 'center', justifyContent: 'center'}}
                            size={150}
                            color="#CF000E"
                            thickness={30}
                            borderWidth={5}
                            strokeCap="round"
                            endAngle={0.3}
                            indeterminate={true}>
                            <View style={styles.loadingInner}>
                                <Image
                                    style={{
                                        position: 'absolute',
                                        marginBottom: 30,
                                        marginTop: 20,
                                        width: 78,
                                        height: 70,
                                    }}
                                    source={rinnaiImage}
                                />
                            </View>
                        </Progress.Circle>
                    </View>
                </BlurView>
            ) : (
                <View
                    style={{
                        flexDirection: 'column',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <BlurView
                        blurType="dark"
                        blurAmount={5}
                        reducedTransparencyFallbackColor="white"
                        style={{
                            flexDirection: 'row',
                            width: '100%',
                            height: '100%',
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    />
                    <View>
                        <Text style={{color: '#ffffff'}}>{title}</Text>
                    </View>
                    <Progress.Circle
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            position: 'absolute',
                        }}
                        size={150}
                        color="#CF000E"
                        thickness={30}
                        borderWidth={5}
                        strokeCap="round"
                        endAngle={0.3}
                        indeterminate={true}>
                        <View style={styles.loadingInner}>
                            <Image
                                style={{
                                    position: 'absolute',
                                    marginBottom: 30,
                                    marginTop: 20,
                                    width: 78,
                                    height: 70,
                                }}
                                source={rinnaiImage}
                            />
                        </View>
                    </Progress.Circle>
                </View>
            )}
        </Modal>
    );
};

export default RinnaiLoader;
