/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {KeyboardAvoidingView, TextInput, Text, View, TouchableOpacity, ScrollView, Platform} from 'react-native';
import {Button} from 'native-base';
import Amplify from 'aws-amplify';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import awsconfig from '../../aws-exports';
import {us_states, canada_provinces} from '../../config/states_provinces';
import RadioForm from 'react-native-simple-radio-button';
import {deviceActions} from '../../reducers/device';
import API from '../../services/API';

Amplify.configure(awsconfig);

const countries = [
    {label: 'United States', value: 'us'},
    {label: 'Canada', value: 'canada'},
];

const Confirm = ({route, navigation}) => {
    const dispatch = useDispatch();
    const dealerdata = route.params;
    const data = useSelector((state) => state.device.view);
    const device = useSelector((state) => state.device.view.device);
    const name = device.device_name ? device.device_name : data.name;
    const userData = useSelector((state) => state.auth.account);
    const [heaterLocation, setHeaterLocation] = useState();
    const [country, setCountry] = useState('us');
    const [select, setSelect] = useState(false);
    const [territory, setTerritory] = useState(device.state);

    useEffect(() => {
        if (!heaterLocation && Object.keys(device).length > 0) {
            const updateDevice = {
                id: device.id,
                city: device.city ? device.city : userData.city,
                state: device.state ? device.state : userData.state,
                address: device.street ? device.street : userData.street,
                zip: device.zip ? device.zip : userData.zip,
            };
            setHeaterLocation(updateDevice);
        }
    }, [heaterLocation]);

    const toggleMenu = () => {
        setSelect(!select);
    };

    const handleInput = (key, value) => {
        setHeaterLocation({
            ...heaterLocation,
            [key]: value,
        });
    };

    const deviceUpdate = () => {
        // console.log(heaterLocation);
        API.updateUserDevice(heaterLocation).then((location) => {
            const update = location.data.updateDevice;
            const updateDevice = {
                ...device,
                ...update,
            };
            const view = {
                device: updateDevice,
                name: name,
            };
            dispatch(deviceActions.setDeviceView(view)).then((res) => {
                navigation.navigate('Request', dealerdata);
            });
        });
    };

    const selectTerritory = (value) => {
        setTerritory(value);
        setSelect(false);
    };

    const selectCountry = (value) => {
        setHeaterLocation({
            ...heaterLocation,
            country: value,
        });
        setCountry(value);
        setSelect(false);
    };

    const listTerritory = () => {
        var items;
        if (country === 'canada') {
            items = canada_provinces;
        } else {
            items = us_states;
        }

        return Object.keys(items).map((item, key) => {
            return (
                <Button
                    full
                    transparent
                    style={[
                        styles.itemWindow,
                        {
                            backgroundColor: key % 2 ? '#ECF0F3' : '#F7FBFF',
                            borderRadius: 0,
                            minHeight: 0,
                            width: '100%',
                            alignSelf: 'center',
                        },
                    ]}
                    key={key}
                    onPress={() => selectTerritory(item)}>
                    <Text
                        style={{
                            color: '#000000',
                            textAlign: 'right',
                            fontWeight: '500',
                            fontSize: 14,
                        }}>
                        {items[item]}
                    </Text>
                </Button>
            );
        });
    };

    return (
        <View style={styles.appContainer}>
            <TitleBar backButton={true} backNav="back" navigation={navigation} title={name.toUpperCase()} subTitle={false} drawer={false} />
            <ScrollView style={{width: '100%'}}>
                <KeyboardAvoidingView
                    style={{
                        width: '100%',
                        margin: 'auto',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.select({
                        ios: 130,
                        android: 130,
                    })}>
                    <View
                        style={{
                            ...styles.formBox,
                            backgroundColor: 'transparent',
                            flex: 1,
                            borderRadius: 10,
                            marginLeft: 'auto',
                            marginRight: 'auto',
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
                            {dealerdata.name}
                        </Text>
                        <Text
                            style={{
                                ...styles.h3,
                                fontWeight: '500',
                                fontSize: 16,
                                marginBottom: 50,
                            }}>
                            Send your Rinnai Pro a monitoring request
                        </Text>
                        <View
                            style={{
                                ...styles.itemWindow,
                                padding: 0,
                                marginBottom: 20,
                            }}>
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
                                }}>
                                <Text
                                    style={{
                                        ...styles.h3,
                                        flex: 1,
                                        textAlign: 'center',
                                        fontSize: 12,
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
                        <Text
                            style={{
                                ...styles.h3,
                                fontWeight: '300',
                                fontSize: 22,
                                marginBottom: 30,
                            }}>
                            Confirm Heater Location
                        </Text>
                        <View
                            style={{
                                ...styles.buttonGroup,
                                marginBottom: 10,
                                padding: 10,
                                backgroundColor: '#ffffff',
                            }}>
                            <RadioForm
                                radio_props={countries}
                                initial={'United States'}
                                buttonColor={'#000000'}
                                selectedButtonColor={'#000000'}
                                buttonSize={15}
                                buttonOuterSize={25}
                                animation={false}
                                style={{}}
                                onPress={(value) => {
                                    selectCountry(value);
                                }}
                            />
                        </View>
                        <View style={{...styles.formField, borderWidth: 1}}>
                            <Text style={styles.loginLabel}>Address</Text>
                            <TextInput
                                onChangeText={(address) => handleInput('address', address)}
                                style={styles.loginInput}
                                autoCapitalize="none"
                                placeholder="Device Address"
                                placeholderTextColor="#697179"
                                underlineColorAndroid="transparent"
                                keyboardAppearance="dark"
                                value={device.street ? device.street : userData.street}
                            />
                        </View>
                        <View style={{...styles.formField, borderWidth: 1}}>
                            <Text style={styles.loginLabel}>City</Text>
                            <TextInput
                                onChangeText={(city) => handleInput('city', city)}
                                style={styles.loginInput}
                                autoCapitalize="none"
                                placeholder="Device City"
                                placeholderTextColor="#697179"
                                underlineColorAndroid="transparent"
                                keyboardAppearance="dark"
                                value={device.city ? device.city : userData.city}
                            />
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View
                                style={{
                                    ...styles.formField,
                                    margin: 3,
                                    flex: 1,
                                    borderWidth: 1,
                                }}>
                                <TouchableOpacity style={{width: '90%'}} onPress={() => toggleMenu()}>
                                    <Text style={styles.loginLabel}>State</Text>
                                    <Text style={styles.textInput}>{territory ? territory : userData.state}</Text>
                                </TouchableOpacity>
                                {select && (
                                    <View
                                        style={{
                                            ...styles.stateDropDown,
                                            borderRadius: 10,
                                        }}>
                                        <ScrollView
                                            style={{
                                                flex: 1,
                                                borderRadius: 10,
                                                width: '100%',
                                            }}>
                                            {listTerritory()}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>
                            <View
                                style={{
                                    ...styles.formField,
                                    margin: 3,
                                    flex: 1,
                                    borderWidth: 1,
                                }}>
                                <Text style={styles.loginLabel}>Zipcode</Text>
                                <TextInput
                                    onChangeText={(city) => handleInput('city', city)}
                                    style={styles.loginInput}
                                    autoCapitalize="none"
                                    placeholder="Device City"
                                    placeholderTextColor="#697179"
                                    underlineColorAndroid="transparent"
                                    keyboardAppearance="dark"
                                    value={device.zip ? device.zip : userData.zip}
                                />
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
            <Button
                full
                transparent
                style={[
                    styles.itemWindow,
                    {
                        borderRadius: 0,
                        minHeight: 70,
                        width: '100%',
                        alignSelf: 'center',
                        marginTop: 10,
                    },
                ]}
                onPress={() => deviceUpdate()}>
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
        </View>
    );
};

export default Confirm;
