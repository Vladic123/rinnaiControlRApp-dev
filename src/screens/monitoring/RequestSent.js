/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Text, View} from 'react-native';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import {CommonActions} from '@react-navigation/native';

const RequestSent = ({route, navigation}) => {
    const dealerdata = route.params;
    const data = useSelector((state) => state.device.view);
    const device = useSelector((state) => state.device.view.device);
    const name = device.device_name ? device.device_name : data.name;
    const userData = useSelector((state) => state.auth.account);
    const [heaterLocation, setHeaterLocation] = useState();

    useEffect(() => {
        if (!heaterLocation && Object.keys(device).length > 0) {
            const updateDevice = {
                id: device.id,
                city: device.city ? device.city : userData.city,
                state: device.state ? device.state : userData.state,
                street: device.street ? device.street : userData.street,
                zip: device.zip ? device.zip : userData.zip,
            };
            setHeaterLocation(updateDevice);
        }
    }, [heaterLocation]);

    const exitScreen = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{name: 'DeviceHome'}],
            }),
        );
    };

    return (
        <View style={styles.appContainer}>
            <TitleBar backButton={true} backNav="menu" navigation={navigation} title={name.toUpperCase()} subTitle={false} drawer={false} />
            <View
                style={{
                    ...styles.formBox,
                    backgroundColor: 'transparent',
                    flex: 1,
                    borderRadius: 10,
                    marginTop: 0,
                    marginBottom: 50,
                }}>
                <Text
                    style={{
                        ...styles.h3,
                        fontWeight: '300',
                        fontSize: 22,
                        marginBottom: 10,
                    }}>
                    Monitoring Request Sent
                </Text>
                <Text
                    style={{
                        ...styles.h3,
                        fontWeight: '300',
                        fontSize: 14,
                        marginBottom: 50,
                        width: '90%',
                        textAlign: 'center',
                    }}>
                    Your request for monitoring for {name} has been sent to Company Name or email here. They will respond within 30 days. You’ll get a
                    notification when they respond to your request.
                </Text>
                <View
                    style={{
                        ...styles.itemWindow,
                        padding: 0,
                        marginBottom: 20,
                    }}>
                    <Text style={{...styles.h3, fontSize: 14, padding: 10}}>Company Information</Text>
                    <View
                        style={{
                            ...styles.dataRow,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <Text
                            style={{
                                ...styles.h3,
                                flex: 1,
                                textAlign: 'center',
                                fontSize: 12,
                                fontWeight: '500',
                            }}>
                            Company
                        </Text>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text
                                style={{
                                    ...styles.h3,
                                    fontWeight: '300',
                                    fontSize: 14,
                                }}>
                                {dealerdata.company ? dealerdata.company : dealerdata.name}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            ...styles.dataRow,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <Text
                            style={{
                                ...styles.h3,
                                flex: 1,
                                textAlign: 'center',
                                fontSize: 12,
                                fontWeight: '500',
                            }}>
                            ADDRESS
                        </Text>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text
                                style={{
                                    ...styles.h3,
                                    fontWeight: '300',
                                    fontSize: 14,
                                }}>
                                {dealerdata.street}
                            </Text>
                            <Text
                                style={{
                                    ...styles.h3,
                                    fontWeight: '300',
                                    fontSize: 14,
                                }}>
                                {dealerdata.city}, {dealerdata.state}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            ...styles.dataRow,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderBottomWidth: 0,
                        }}>
                        <Text
                            style={{
                                ...styles.h3,
                                flex: 1,
                                textAlign: 'center',
                                fontSize: 12,
                                fontWeight: '500',
                            }}>
                            PHONE
                        </Text>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text
                                style={{
                                    ...styles.h3,
                                    fontWeight: '300',
                                    fontSize: 14,
                                }}>
                                {dealerdata.phone}
                            </Text>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        ...styles.itemWindow,
                        padding: 0,
                        marginBottom: 20,
                    }}>
                    <Text style={{...styles.h3, fontSize: 14, padding: 10}}>Heater Information</Text>
                    <View
                        style={{
                            ...styles.dataRow,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <Text
                            style={{
                                ...styles.h3,
                                flex: 1,
                                textAlign: 'center',
                                fontSize: 12,
                                fontWeight: '500',
                            }}>
                            Name
                        </Text>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text
                                style={{
                                    ...styles.h3,
                                    fontWeight: '300',
                                    fontSize: 14,
                                }}>
                                {name}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            ...styles.dataRow,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <Text
                            style={{
                                ...styles.h3,
                                flex: 1,
                                textAlign: 'center',
                                fontSize: 12,
                                fontWeight: '500',
                            }}>
                            ADDRESS
                        </Text>
                        <View style={{flex: 1, flexDirection: 'column'}}>
                            <Text
                                style={{
                                    ...styles.h3,
                                    fontWeight: '300',
                                    fontSize: 14,
                                }}>
                                {device.street}
                            </Text>
                            <Text
                                style={{
                                    ...styles.h3,
                                    fontWeight: '300',
                                    fontSize: 14,
                                }}>
                                {device.city}, {device.state}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <Button
                full
                transparent
                style={[
                    styles.itemWindow,
                    {
                        borderRadius: 0,
                        minHeight: 90,
                        width: '100%',
                        alignSelf: 'center',
                        marginTop: 10,
                    },
                ]}
                onPress={() => exitScreen()}>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'right',
                        fontWeight: '500',
                        fontSize: 14,
                    }}>
                    Close
                </Text>
            </Button>
        </View>
    );
};

export default RequestSent;
