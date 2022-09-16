/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {KeyboardAvoidingView, TextInput, Text, View, TouchableOpacity, ScrollView, Platform} from 'react-native';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import {us_states, canada_provinces} from '../../config/states_provinces';
import RadioForm from 'react-native-simple-radio-button';
import {authActions} from '../../reducers/auth';
import {useIsFocused} from '@react-navigation/native';

import {Picker} from '@react-native-picker/picker';

import RinnaiLoader from '../../components/RinnaiLoader';

const countries = [
    {label: 'United States', value: 'US', territories: us_states},
    {label: 'Canada', value: 'CANADA', territories: canada_provinces},
];

const defaultAddress = {
    id: '',
    city: '',
    state: '',
    street: '',
    zip: '',
    country: '',
};

const EditAddress = ({route, navigation}) => {
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.account);
    const [address, setAddress] = useState(defaultAddress);
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
    const [select, setSelect] = useState(false);
    const [territory, setTerritory] = useState(userData.state);
    const [loading, settLoading] = useState(false);

    useEffect(() => {
        if (isFocused && !address.id) {
            const updateDevice = {
                id: userData.id,
                city: userData.city,
                state: userData.state,
                street: userData.street,
                zip: userData.zip,
                country: userData.country,
            };
            setAddress(updateDevice);
            setTerritory(userData.state);
        }
    }, [isFocused]);

    const toggleMenu = () => {
        setSelect(!select);
    };

    const handleInput = (key, value) => {
        setAddress({
            ...address,
            [key]: value,
        });
    };

    const save = () => {
        settLoading(true);
        dispatch(authActions.updateUser(address)).then(async (user) => {
            await dispatch(authActions.fetchUserByEmail(userData.username));
            settLoading(false);
            navigation.navigate('MyAccount');
        });
    };

    const selectTerritory = (value) => {
        setTerritory(value);
        setAddress({
            ...address,
            state: value,
        });
        setSelect(false);
    };

    const selectCountry = (value, index) => {
        setAddress({
            ...address,
            country: value.toUpperCase(),
        });
        setCountryIndex(index);
        setSelect(false);
    };

    const listTerritory = () => {
        let items = countries[countryIndex].territories;
        return Object.keys(items).map((item, key) => {
            if (Platform.OS === 'android') {
                return <Picker.Item label={items[item]} value={item} key={key} style={{backgroundColor: key % 2 ? '#ECF0F3' : '#F7FBFF'}} />;
            }
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
                    onPress={() => {
                        selectTerritory(item);
                    }}>
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

    let statePicker = (
        <View
            style={{
                ...styles.formField,
                margin: 3,
                flex: 1,
                borderWidth: 1,
                height: '51%',
            }}>
            <TouchableOpacity
                style={{width: '90%'}}
                onPress={() => {
                    toggleMenu();
                }}>
                <Text style={styles.loginLabel}>State</Text>
                <Text style={styles.textInput}>{territory}</Text>
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
                            zIndex: 999,
                        }}>
                        {listTerritory()}
                    </ScrollView>
                </View>
            )}
        </View>
    );

    if (Platform.OS === 'android') {
        statePicker = (
            <View style={{...styles.pickerContatiner, height: '51%', margin: 3}}>
                <Text style={{...styles.loginLabel, textAlign: 'left', marginTop: 15}}>State</Text>
                <Picker
                    style={{
                        width: '100%',
                    }}
                    mode="dropdown"
                    itemStyle={{borderWidth: 2, margin: 2, borderColor: 'rgba(174, 174, 192, .7)'}}
                    selectedValue={territory}
                    onValueChange={(itemValue, itemIndex) => selectTerritory(itemValue)}>
                    {listTerritory()}
                </Picker>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1, backgroundColor: '#F3F5F7', justifyContent: 'center'}} nestedScrollEnabled={true}>
            <View style={styles.appContainer}>
                <RinnaiLoader modal={loading} />
                <TitleBar backButton={true} backNav="back" navigation={navigation} title="Edit Address" subTitle={false} drawer={true} />
                <View
                    style={{
                        ...styles.formBox,
                        backgroundColor: 'transparent',
                        flex: 1,
                        borderRadius: 10,
                        marginTop: 0,
                        marginBottom: 50,
                    }}>
                    <View
                        style={{
                            ...styles.buttonGroup,
                            marginBottom: 10,
                            padding: 10,
                            backgroundColor: '#ffffff',
                        }}>
                        <RadioForm
                            animation={false}
                            radio_props={countries}
                            initial={countryIndex}
                            buttonColor={'#000000'}
                            selectedButtonColor={'#000000'}
                            buttonSize={15}
                            buttonOuterSize={25}
                            style={{}}
                            onPress={(value, index) => {
                                selectCountry(value, index);
                            }}
                        />
                    </View>
                    <KeyboardAvoidingView
                        style={{
                            width: '100%',
                            margin: 'auto',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        behavior="padding">
                        <View style={{...styles.formField, borderWidth: 1}}>
                            <Text style={styles.loginLabel}>Address</Text>
                            <TextInput
                                onChangeText={(street) => handleInput('street', street)}
                                style={styles.loginInput}
                                autoCapitalize="none"
                                placeholder="Address"
                                placeholderTextColor="#697179"
                                underlineColorAndroid="transparent"
                                keyboardAppearance="dark"
                                value={address.street}
                            />
                        </View>
                        <View style={{...styles.formField, borderWidth: 1}}>
                            <Text style={styles.loginLabel}>City</Text>
                            <TextInput
                                onChangeText={(city) => handleInput('city', city)}
                                style={styles.loginInput}
                                autoCapitalize="none"
                                placeholder="City"
                                placeholderTextColor="#697179"
                                underlineColorAndroid="transparent"
                                keyboardAppearance="dark"
                                value={address.city}
                            />
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            {statePicker}
                            <View
                                style={{
                                    ...styles.formField,
                                    margin: 3,
                                    flex: 1,
                                    borderWidth: 1,
                                    height: '51%',
                                }}>
                                <Text style={{...styles.loginLabel}}>Zipcode</Text>
                                <TextInput
                                    onChangeText={(zip) => handleInput('zip', zip)}
                                    style={styles.loginInput}
                                    autoCapitalize="none"
                                    placeholder="Zipcode"
                                    placeholderTextColor="#697179"
                                    underlineColorAndroid="transparent"
                                    keyboardAppearance="dark"
                                    value={address.zip}
                                />
                            </View>
                        </View>
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
        </ScrollView>
    );
};

export default EditAddress;
