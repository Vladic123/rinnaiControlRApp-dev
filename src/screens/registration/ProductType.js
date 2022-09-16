/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {TouchableWithoutFeedback, KeyboardAvoidingView, Alert, Text, View} from 'react-native';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import RinnaiLoader from '../../components/RinnaiLoader';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import {deviceActions} from '../../reducers/device';
import {Calendar} from 'react-native-calendars';
import API from '../../services/API';

const product = {
    boiler: 'Condensing Boiler',
    tankless: 'Tankless Water Heater',
    furnace: 'Direct Vent Wall Furnaces',
    convector: 'Vent Free Fan Convectors',
    commercial: 'Commercial',
};

const application = {
    'residential-hot-water-only': 'Residential Hot Water only',
    'residential-hot-water-home-heating': 'Residential Hot Water/Home Heating',
    'residential-home-heating-only': 'Residential Home Heating only',
    'commercial-hot-water-only': 'Commercial Hot Water Only',
    'commercial-hot-water-structure-heating': 'Commercial Hot Water/Structure Heating',
};

const recirculation = {
    'no-recirculation': 'No Recirculation System',
    'ondemand-recirculation': 'Recirculation System with Motion Sensor or Activation Switch (On Demand)',
    'activated-recirculation': 'Recirculation System with Aquastat/Thermostat (Timer or Other Activation Device)',
    'continuous-recirculation': 'Recirculation System with No Activation Device (Continuously Running Pump)',
    'dontknow-recirculation': 'I Don’t Know',
};

const defaultTypes = {
    recirculation_type: '',
    application_type: '',
    registration_type: '',
    install_datetime: '',
};

const ProductType = ({route, navigation}) => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.device.view);
    const registration = useSelector((state) => state.device.registration);
    const device = useSelector((state) => state.device.view.device);
    const name = device.device_name ? device.device_name : data.name;
    const userData = useSelector((state) => state.auth.account);
    const [heaterType, setHeaterType] = useState(defaultTypes);
    const [dropdown, setDropdown] = useState(false);
    const [datePicker, setDatePicker] = useState(false);
    const [loading, setLoader] = useState(false);

    const handleDateInput = (key, date) => {
        setHeaterType({
            ...heaterType,
            [key]: date.dateString,
        });

        setDatePicker(false);
    };

    const save = async () => {
        const registration_type = 'consumer';
        const update = {...registration, ...heaterType};
        update.registration_type = registration_type;

        const registerProduct = {
            serial: update.serial,
            device_id: device.id,
            user_uuid: userData.id,
            model: update.model,
            gateway_dsn: device.dsn,
            application_type: update.application_type,
            recirculation_type: update.recirculation_type,
            install_datetime: update.install_datetime,
            registration_type: update.registration_type,
        };

        setLoader(true);
        await dispatch(deviceActions.setRegistration(update));
        try {
            await API.productRegistration(update);
            setLoader(false);
            const view = await API.getViewDevice(device.id, device.device_name);
            dispatch(deviceActions.setDeviceView(view));
            await API.createProductRegistration(registerProduct);
            navigation.navigate('RegistrationSuccess');
        } catch (error) {
            Alert.alert('Registration Error', JSON.stringify(error), [{text: 'OK'}], {
                cancelable: false,
            });
        }
    };

    const setType = (key, value) => {
        setHeaterType({
            ...heaterType,
            [key]: value,
        });
        setDropdown(false);
    };

    const dropDownItems = () => {
        let items;
        let itemKey;
        switch (dropdown) {
            case 'product':
                items = product;
                itemKey = 'registration_type';
                break;
            case 'application':
                items = application;
                itemKey = 'application_type';
                break;
            case 'recirculation':
                items = recirculation;
                itemKey = 'recirculation_type';
                break;
            default:
                items = product;
                itemKey = 'registration_type';
                break;
        }

        return Object.keys(items).map((item, key) => {
            const value = items[item];
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
                    onPress={() => setType(itemKey, item)}>
                    <Text
                        style={{
                            color: '#000000',
                            textAlign: 'center',
                            fontWeight: '500',
                            fontSize: 14,
                        }}>
                        {value}
                    </Text>
                </TouchableOpacity>
            );
        });
    };

    return (
        <>
            <View style={styles.appContainer}>
                <TouchableWithoutFeedback onPress={() => setDropdown(false)}>
                    <View style={{position: 'absolute', width: '100%', height: '100%'}} />
                </TouchableWithoutFeedback>
                <RinnaiLoader modal={loading} />
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
                    Product Type
                </Text>
                <View
                    style={{
                        ...styles.formBox,
                        backgroundColor: 'transparent',
                        flex: 1,
                        borderRadius: 10,
                        marginTop: 0,
                    }}>
                    <ScrollView style={{width: '100%'}}>
                        <KeyboardAvoidingView
                            style={{
                                width: '100%',
                                margin: 'auto',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            behavior="padding">
                            <View
                                style={{
                                    ...styles.formField,
                                    margin: 3,
                                    borderWidth: 1,
                                    zIndex: 8,
                                }}>
                                <TouchableOpacity
                                    style={{width: '90%', flexDirection: 'row'}}
                                    onPress={() => setDropdown(dropdown === 'application' ? false : 'application')}>
                                    <View
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                        <Text style={styles.loginLabel}>APPLICATION TYPE</Text>
                                        <Text style={{...styles.textInput, color: '#697179'}}>
                                            {heaterType.application_type ? heaterType.application_type : 'Select Application Type'}
                                        </Text>
                                    </View>
                                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                        <Text>
                                            {dropdown === 'application' ? (
                                                <FontAwesome5Pro name="chevron-up" style={{color: '#697179'}} light />
                                            ) : (
                                                <FontAwesome5Pro name="chevron-down" style={{color: '#697179'}} light />
                                            )}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                {dropdown === 'application' && (
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
                                            {dropDownItems()}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>
                            <View
                                style={{
                                    ...styles.formField,
                                    margin: 3,
                                    borderWidth: 1,
                                    zIndex: 7,
                                }}>
                                <TouchableOpacity
                                    style={{width: '90%', flexDirection: 'row'}}
                                    onPress={() => setDropdown(dropdown === 'recirculation' ? false : 'recirculation')}>
                                    <View
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                        <Text style={styles.loginLabel}>RECIRCULATION TYPE</Text>
                                        <Text style={{...styles.textInput, color: '#697179'}}>
                                            {heaterType.recirculation_type ? heaterType.recirculation_type : 'Select Recirculation Type'}
                                        </Text>
                                    </View>
                                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                        <Text>
                                            {dropdown === 'recirculation' ? (
                                                <FontAwesome5Pro name="chevron-up" style={{color: '#697179'}} light />
                                            ) : (
                                                <FontAwesome5Pro name="chevron-down" style={{color: '#697179'}} light />
                                            )}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                {dropdown === 'recirculation' && (
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
                                            {dropDownItems()}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>
                            <View style={{width: '100%'}}>
                                <View
                                    style={{
                                        ...styles.formField,
                                        margin: 3,
                                        borderWidth: 1,
                                        width: 'auto',
                                    }}>
                                    <TouchableOpacity style={{width: '90%', flexDirection: 'row'}} onPress={() => setDatePicker(!datePicker)}>
                                        <View
                                            style={{
                                                flex: 1,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                            <Text style={styles.loginLabel}>Install Purchase Date - Optional</Text>
                                            <Text style={{...styles.textInput, color: '#697179'}}>
                                                {heaterType.install_datetime ? heaterType.install_datetime : 'Select Purchase Date'}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                            <Text>
                                                <FontAwesome5Pro name="calendar-alt" style={{color: '#697179', fontSize: 18}} light />
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.datePicker}>
                                    {datePicker && (
                                        <View>
                                            <Calendar
                                                onDayPress={(day) => handleDateInput('install_datetime', day)}
                                                theme={{
                                                    textDayFontSize: 12,
                                                    textMonthFontSize: 12,
                                                    textDayHeaderFontSize: 12,
                                                }}
                                            />
                                        </View>
                                    )}
                                </View>
                            </View>
                            <View style={{height: 125}} />
                        </KeyboardAvoidingView>
                    </ScrollView>
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
                            marginTop: 0,
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
                        Complete Registration
                    </Text>
                </Button>
            </View>
        </>
    );
};

export default ProductType;
