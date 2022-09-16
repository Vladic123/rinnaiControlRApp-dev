/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {KeyboardAvoidingView, TextInput, Text, View, Alert} from 'react-native';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import {deviceActions} from '../../reducers/device';

const ProductInfo = ({navigation}) => {
    const dispatch = useDispatch();
    const registration = useSelector((state) => state.device.registration);
    const data = useSelector((state) => state.device.view);
    const device = useSelector((state) => state.device.view.device);
    const name = device.device_name ? device.device_name : data.name;
    const userData = useSelector((state) => state.auth.account);
    const [heaterInfo, setHeaterInfo] = useState({});

    useEffect(() => {
        if (Object.keys(heaterInfo).length === 0) {
            const updateDevice = {
                first_name: userData.firstname,
                last_name: userData.lastname,
                phone: userData.phone,
                email: userData.email,
            };
            setHeaterInfo(updateDevice);
        }
    }, [heaterInfo]);

    const handleInput = (key, value) => {
        setHeaterInfo({
            ...heaterInfo,
            [key]: value,
        });
    };

    const save = () => {
        // console.log(heaterLocation);
        if (Object.keys(heaterInfo).length === 4) {
            const update = {...registration, ...heaterInfo};

            console.log(update);
            dispatch(deviceActions.setRegistration(update)).then(() => {
                navigation.navigate('ProductLocation');
            });
        } else {
            Alert.alert(
                'All fields are required',
                '',
                [
                    {
                        text: 'OK',
                        onPress: () => console.log('OK Pressed'),
                    },
                ],
                {cancelable: false},
            );
        }
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
                Your Information
            </Text>
            <View
                style={{
                    ...styles.formBox,
                    backgroundColor: 'transparent',
                    flex: 1,
                    borderRadius: 10,
                    marginTop: 0,
                    marginBottom: 50,
                }}>
                <KeyboardAvoidingView
                    style={{
                        width: '100%',
                        margin: 'auto',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    behavior="padding">
                    <View style={{...styles.formField, borderWidth: 1}}>
                        <Text style={styles.loginLabel}>FIRST NAME</Text>
                        <TextInput
                            onChangeText={(first_name) => handleInput('first_name', first_name)}
                            style={styles.loginInput}
                            autoCapitalize="none"
                            placeholder="Enter your first name"
                            placeholderTextColor="#697179"
                            underlineColorAndroid="transparent"
                            value={userData.firstname}
                        />
                    </View>
                    <View style={{...styles.formField, borderWidth: 1}}>
                        <Text style={styles.loginLabel}>LAST NAME</Text>
                        <TextInput
                            onChangeText={(last_name) => handleInput('last_name', last_name)}
                            style={styles.loginInput}
                            autoCapitalize="none"
                            placeholder="Enter your last name"
                            placeholderTextColor="#697179"
                            underlineColorAndroid="transparent"
                            value={userData.lastname}
                        />
                    </View>
                    <View style={{...styles.formField, borderWidth: 1}}>
                        <Text style={styles.loginLabel}>MOBILE NUMBER</Text>
                        <TextInput
                            onChangeText={(phone) => handleInput('phone', phone)}
                            style={styles.loginInput}
                            autoCapitalize="none"
                            placeholder="Enter your phone number"
                            placeholderTextColor="#697179"
                            underlineColorAndroid="transparent"
                            keyboardType="phone-pad"
                            value={userData.phone}
                        />
                    </View>
                    <View style={{...styles.formField, borderWidth: 1}}>
                        <Text style={styles.loginLabel}>EMAIL</Text>
                        <TextInput
                            onChangeText={(email) => handleInput('email', email)}
                            style={styles.loginInput}
                            autoCapitalize="none"
                            placeholder="Enter your email"
                            placeholderTextColor="#697179"
                            underlineColorAndroid="transparent"
                            keyboardType="email-address"
                            value={userData.email}
                        />
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
                        minHeight: 90,
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

export default ProductInfo;
