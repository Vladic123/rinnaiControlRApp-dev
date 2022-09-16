/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {TouchableWithoutFeedback, KeyboardAvoidingView, TextInput, Text, View} from 'react-native';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import {us_states, canada_provinces} from '../../config/states_provinces';
import RadioForm from 'react-native-simple-radio-button';
import {deviceActions} from '../../reducers/device';

const countries = [
    {label: 'United States', value: 'us'},
    {label: 'Canada', value: 'canada'},
];

const ProductLocation = ({route, navigation}) => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.device.view);
    const registration = useSelector((state) => state.device.registration);
    const device = useSelector((state) => state.device.view.device);
    const name = device.device_name ? device.device_name : data.name;
    const userData = useSelector((state) => state.auth.account);
    const [heaterLocation, setHeaterLocation] = useState();
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
    const [territory, setTerritory] = useState(device.state);

    useEffect(() => {
        if (!heaterLocation && Object.keys(device).length > 0) {
            const updateDevice = {
                id: device.id,
                city: device.city ? device.city : userData.city,
                state: device.state ? device.state : userData.state,
                address: device.street ? device.street : userData.street,
                postal: device.zip ? device.zip : userData.zip,
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

    const save = () => {
        const update = {...registration, ...heaterLocation};

        console.log(update);
        dispatch(deviceActions.setRegistration(update)).then((res) => {
            navigation.navigate('ProductType');
        });
    };

    const selectTerritory = (value) => {
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
            <TitleBar backButton={true} backNav="back" navigation={navigation} title={name.toUpperCase()} subTitle={false} drawer={false} />
            <Text
                style={{
                    ...styles.h3,
                    fontWeight: '300',
                    fontSize: 22,
                    marginBottom: 30,
                }}>
                Product Registration
            </Text>
            <Text
                style={{
                    ...styles.h3,
                    fontWeight: '500',
                    fontSize: 14,
                    marginBottom: 20,
                    width: '90%',
                    textAlign: 'left',
                }}>
                Address
            </Text>
            <TouchableWithoutFeedback onPress={() => setSelect(false)}>
                <View style={{position: 'absolute', width: '100%', height: '100%'}} />
            </TouchableWithoutFeedback>
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
                        radio_props={countries}
                        initial={countryIndex}
                        buttonColor={'#000000'}
                        selectedButtonColor={'#000000'}
                        buttonSize={15}
                        animation={false}
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
                                onChangeText={(postal) => handleInput('postal', postal)}
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
                    Continue
                </Text>
            </Button>
        </View>
    );
};

export default ProductLocation;
