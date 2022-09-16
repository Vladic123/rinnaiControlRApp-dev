/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {View, TextInput, Text, Image, Alert, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import {Button} from 'native-base';
import styles from '../../styles/Style';
import TitleBar from '../../components/TitleBar';
import ModuleService from '../../services/ModuleService';
const showPassword = require('../../assets/images/show-password-icon.png');
const hidePassword = require('../../assets/images/hide-password-icon.png');
const WifiPassword = ({navigation}) => {
    const pairing = useSelector((state) => state.device.pairing);
    const [wifi, setWifi] = useState([]);
    const [passwordSecured, setPasswordSecured] = useState(false);

    const [uploadingPassword, setUploadingPassword] = useState(false);

    const handleInput = (key, value) => {
        setWifi({
            ...wifi,
            [key]: value,
        });
    };

    const handleWifi = async () => {
        const network = pairing.ssid;
        const password = wifi.password;
        if (!password) {
            Alert.alert('Wi-Fi Error', 'Must fill out password to send', [{text: 'OK', onPress: () => console.log('OK Pressed')}], {
                cancelable: false,
            });
            return;
        }
        if (!uploadingPassword) {
            try {
                setUploadingPassword(true);
                await ModuleService.sendWifiCreds(network, password);
                navigation.navigate('WifiCheck');
            } catch (err) {
                Alert.alert(
                    'Wi-Fi Error',
                    'Unable to communicate with control•r™ Module. Try again.',
                    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                    {
                        cancelable: false,
                    },
                );
            } finally {
                setUploadingPassword(false);
            }
        }
    };

    return (
        <View style={styles.loginBox}>
            <TitleBar
                navigation={navigation}
                title={`Connect to \n ${pairing.ssid}`}
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
                    flex: 0.8,
                    borderRadius: 10,
                    marginTop: 50,
                    marginBottom: 50,
                    padding: 20,
                }}>
                <Text style={{...styles.h3, fontWeight: '300', marginBottom: 30}}>Please enter the password for this network:</Text>
                <KeyboardAvoidingView
                    style={{
                        width: '100%',
                        margin: 'auto',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    behavior="padding">
                    <View style={{...styles.formField, borderWidth: 1}}>
                        <Text style={styles.loginLabel}>Wifi Password:</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                onChangeText={(password) => handleInput('password', password)}
                                style={styles.secureInputStyle}
                                autoCapitalize="none"
                                placeholder="Enter Wi-Fi password"
                                placeholderTextColor="#697179"
                                underlineColorAndroid="transparent"
                                keyboardAppearance="dark"
                                secureTextEntry={passwordSecured}
                            />
                            <TouchableOpacity onPress={() => setPasswordSecured(!passwordSecured)}>
                                <Image style={{resizeMode: 'contain'}} source={passwordSecured ? hidePassword : showPassword} />
                            </TouchableOpacity>
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
                        minHeight: 0,
                        width: '90%',
                        alignSelf: 'center',
                        marginTop: 10,
                    },
                ]}
                onPress={() => handleWifi()}>
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

export default WifiPassword;
