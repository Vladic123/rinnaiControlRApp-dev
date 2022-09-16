/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {TouchableWithoutFeedback, KeyboardAvoidingView, TextInput, Text, View, Platform} from 'react-native';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import {us_states, canada_provinces} from '../../config/states_provinces';
import RadioForm from 'react-native-simple-radio-button';
import {deviceActions} from '../../reducers/device';
import {useIsFocused} from '@react-navigation/native';
import RinnaiLoader from '../../components/RinnaiLoader';
import API from '../../services/API';

const defaultHeaterData = {
    id: '',
    city: '',
    state: '',
    address: '',
    zip: '',
    country: '',
};

const countries = [
    {label: 'United States', value: 'us'},
    {label: 'Canada', value: 'canada'},
];

const EditLocation = ({route, navigation}) => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const data = useSelector((state) => state.device.view);
    const device = useSelector((state) => state.device.view.device);
    const name = device.device_name ? device.device_name : data.name;
    const userData = useSelector((state) => state.auth.account);
    const [heaterLocation, setHeaterLocation] = useState(defaultHeaterData);
    const [select, setSelect] = useState(false);
    const [territory, setTerritory] = useState(device.state);
    const [loading, setLoading] = useState(false);
    const [countryIndex, setCountryIndex] = useState(() => {
        var countryData = userData.country;
        if (countryData) {
            const searchIndex = countries.findIndex((it) => it.value.toUpperCase() === countryData.toUpperCase());
            //Using Math.max to handle setting default country if not found in countries array
            return Math.max(0, searchIndex);
        } else {
            return 0;
        }
    });
    useEffect(() => {
        if (isFocused && Object.keys(device).length > 0) {
            const updateDevice = {
                id: device.id,
                city: device.city ? device.city : userData.city,
                state: device.state ? device.state : userData.state,
                address: device.street ? device.street : userData.street,
                zip: device.zip ? device.zip : userData.zip,
                country: countries[countryIndex].value.toUpperCase(),
            };
            setHeaterLocation(updateDevice);
        }
    }, [isFocused]);

    const toggleMenu = () => {
        setSelect(!select);
    };

    const handleInput = (key, value) => {
        setHeaterLocation({
            ...heaterLocation,
            [key]: value,
        });
    };

    const save = () => {
        const update = {...heaterLocation, id: device.id};
        setLoading(true);
        console.log(update);
        API.updateUserDevice(update).then(async (res) => {
            API.getViewDevice(device.id, device.device_name).then(async (view) => {
                await dispatch(deviceActions.setDeviceView(view));
                setLoading(false);
                navigation.goBack();
            });
        });
    };

    const selectTerritory = (value) => {
        setHeaterLocation({
            ...heaterLocation,
            state: value.toUpperCase(),
        });
        setTerritory(value);
        setSelect(false);
    };

    const selectCountry = (value, index) => {
        setHeaterLocation({
            ...heaterLocation,
            country: value.toUpperCase(),
        });
        setCountryIndex(index);
        setSelect(false);
    };

    const listTerritory = () => {
        var items;
        if (countries[countryIndex].value === 'canada') {
            items = canada_provinces;
        } else {
            items = us_states;
        }

        return Object.keys(items).map((item, key) => {
            return (
                <TouchableOpacity
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
                            textAlign: 'center',
                            fontWeight: '500',
                            fontSize: 14,
                        }}>
                        {items[item]}
                    </Text>
                </TouchableOpacity>
            );
        });
    };

    return (
        <View style={styles.appContainer}>
            <TouchableWithoutFeedback
                onPress={() => {
                    console.log('touchable without feedback firing');
                    setSelect(false);
                }}>
                <View style={{position: 'absolute', width: '100%', height: '100%'}} />
            </TouchableWithoutFeedback>
            <RinnaiLoader modal={loading} />
            <TitleBar backButton={true} backNav="back" navigation={navigation} title={name.toUpperCase()} subTitle={false} drawer={true} />
            <Text
                style={{
                    ...styles.h3,
                    fontWeight: '300',
                    fontSize: 22,
                    marginBottom: 30,
                }}>
                Device Address
            </Text>
            <View
                style={{
                    ...styles.formBox,
                    backgroundColor: 'transparent',
                    flex: 1,
                    justifyContent: 'flex-start',
                    borderRadius: 10,
                    marginTop: 0,
                    marginBottom: 0,
                    height: 300,
                }}>
                <KeyboardAvoidingView
                    style={{
                        flexDirection: 'row',
                        width: '100%',
                        flex: 1,
                        margin: 'auto',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                    }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.select({
                        ios: 130,
                        android: 130,
                    })}>
                    <ScrollView
                        style={{
                            flexDirection: 'column',
                            width: '100%',
                            padding: 0,
                            height: '100%',
                        }}>
                        <View
                            style={{
                                ...styles.buttonGroup,
                                marginBottom: 10,
                                padding: 10,
                                backgroundColor: '#ffffff',
                            }}>
                            <RadioForm
                                radio_props={countries}
                                initial={countryIndex}
                                buttonColor={'#000000'}
                                selectedButtonColor={'#000000'}
                                animation={false}
                                buttonSize={15}
                                buttonOuterSize={25}
                                style={{}}
                                onPress={(value, index) => {
                                    selectCountry(value, index);
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
                                autoCorrect={false}
                                value={heaterLocation.address ? heaterLocation.address : ''}
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
                                autoCorrect={false}
                                value={heaterLocation.city}
                            />
                        </View>
                        <View style={{flex: 1, flexDirection: 'row', overflow: 'visible'}}>
                            <View
                                style={{
                                    ...styles.formField,
                                    margin: 3,
                                    flex: 1,
                                    borderWidth: 1,
                                    overflow: 'visible',
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
                                    onChangeText={(zip) => handleInput('zip', zip)}
                                    style={styles.loginInput}
                                    autoCapitalize="none"
                                    placeholder="Device Zipcode"
                                    placeholderTextColor="#697179"
                                    underlineColorAndroid="transparent"
                                    keyboardAppearance="dark"
                                    value={heaterLocation.zip}
                                    autoCorrect={false}
                                />
                            </View>
                        </View>
                        <View style={{height: 200, zIndex: -99}} />
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
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
                onPress={() => save()}>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'right',
                        fontWeight: '500',
                        fontSize: 14,
                    }}>
                    Save
                </Text>
            </Button>
        </View>
    );
};

export default EditLocation;
