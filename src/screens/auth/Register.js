/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {View, ScrollView, TextInput, Text, Alert, KeyboardAvoidingView, Keyboard, Platform, SafeAreaView} from 'react-native';
import {Button} from 'native-base';
import {Picker} from '@react-native-picker/picker';
import styles from '../../styles/Style';
import TitleBar from '../../components/TitleBar';
import {Auth} from 'aws-amplify';
import {authActions} from '../../reducers/auth';
import RinnaiLoader from '../../components/RinnaiLoader';

const Register = ({navigation, route}) => {
    const dispatch = useDispatch();
    const [register, setRegister] = useState({email: route?.params?.email});
    const [error, setError] = useState({state: false, message: ''});
    const [phoneErr, setPhoneError] = useState({state: false, message: ''});
    const [country, setCountry] = useState({phone_country_code: 'us'});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
        Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

        return () => {
            Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
            Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
        };
    }, []);

    const _keyboardDidShow = () => {};

    const _keyboardDidHide = () => {};

    const handleInput = (key, value) => {
        setRegister({
            ...register,
            [key]: value,
        });
    };

    const handleSelect = (key, value) => {
        setCountry({
            ...country,
            [key]: value,
        });
    };

    const handlePhone = (key, value) => {
        let numbers = /^[0-9]+$/;
        if (value.match(numbers)) {
            if (value.length < 10) {
                setPhoneError({
                    state: true,
                    message: 'Include Area Code and Phone Number',
                });
                setRegister({
                    ...register,
                    [key]: '',
                });
            } else if (value.length > 10) {
                setPhoneError({
                    state: true,
                    message: 'Too Many Numbers',
                });
                setRegister({
                    ...register,
                    [key]: '',
                });
            } else if (value.length === 10) {
                setPhoneError({
                    state: false,
                    message: '',
                });
                setRegister({
                    ...register,
                    [key]: value,
                });
            }
        } else {
            setPhoneError({
                state: true,
                message: 'Numbers Only',
            });
            setRegister({
                ...register,
                [key]: '',
            });
        }
    };

    const prepareData = () => {
        const data = register;
        data.email = data.email.trim().toLowerCase();
        setRegister(data);
    };

    const validSignUp = () => {
        setError({state: false, message: ''});
        if (register.password !== register.confirm_password) {
            setError({state: true, message: 'Passwords Do Not Match'});
            return false;
        }
        return true;
    };

    const getSignUpParams = () => {
        return {
            username: register.email,
            password: register.password,
            attributes: {
                email: register.email,
                phone_number: '+1' + register.phone,
            },
            validationData: [
                {
                    Name: 'import',
                    Value: 'false',
                },
            ],
        };
    };

    const displaySignUpError = (message) => {
        Alert.alert(
            'Register Error',
            message,
            [
                {
                    text: 'OK',
                    onPress: () => console.log('OK Pressed'),
                },
            ],
            {cancelable: false},
        );
    };

    const getRinnaiNewUserPayload = (awsUser) => {
        return {
            id: awsUser.userSub,
            aws_confirm: true,
            name: `${register.firstname} ${register.lastname}`,
            email: register.email,
            username: register.email,
            firstname: register.firstname,
            lastname: register.lastname,
            phone: register.phone,
        };
    };

    const createRinnaiUser = async (awsUser) => {
        await dispatch(authActions.createUser(getRinnaiNewUserPayload(awsUser))).catch((err) => console.log(err));
    };

    const goToVerifyCodeScreen = async (awsUser) => {
        const codeDelivery = {CodeDeliveryDetails: awsUser.codeDeliveryDetails};
        const verifyData = {...register, codeDelivery};
        await dispatch(authActions.setVerifyData(verifyData)).then(() => setTimeout(() => navigation.navigate('Verify', codeDelivery), 500));
    };

    const registerUser = async () => {
        try {
            const awsUser = await Auth.signUp(getSignUpParams());
            await createRinnaiUser(awsUser);
            await goToVerifyCodeScreen(awsUser);
        } catch (err) {
            displaySignUpError(err.message);
        }
    };

    const handleRegistration = async () => {
        try {
            setIsLoading(true);
            if (!validSignUp()) {
                return;
            }
            prepareData();
            await registerUser();
        } catch (err) {
            Alert.alert('Error', 'An error occurred while creating your user. Please contact support.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={{...styles.loginBox}}>
            <RinnaiLoader modal={isLoading} />
            <TitleBar backButton={true} backNav="back" navigation={navigation} title="RINNAI" subTitle={false} drawer={false} />
            <Text
                style={{
                    ...styles.error,
                    display: error.state ? 'flex' : 'none',
                    textAlign: 'center',
                    padding: 10,
                }}>
                {error.message}
            </Text>
            <SafeAreaView
                style={{
                    flex: 1,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <View style={styles.formBox}>
                    <KeyboardAvoidingView
                        style={{
                            flex: 1,
                            width: '100%',
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={Platform.select({
                            ios: 130,
                            android: 130,
                        })}>
                        <ScrollView
                            style={{
                                flex: 1,
                                width: '100%',
                                height: '100%',
                                padding: 15,
                            }}>
                            <View style={styles.formField}>
                                <Text style={styles.label}>First Name:</Text>
                                <TextInput
                                    onChangeText={(firstname) => handleInput('firstname', firstname)}
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    placeholder="Enter your first name"
                                    placeholderTextColor="rgba(0,0,0,0.5)"
                                    underlineColorAndroid="transparent"
                                    keyboardAppearance="dark"
                                />
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.label}>Last Name:</Text>
                                <TextInput
                                    onChangeText={(lastname) => handleInput('lastname', lastname)}
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    placeholder="Enter your last name"
                                    placeholderTextColor="rgba(0,0,0,0.5)"
                                    underlineColorAndroid="transparent"
                                    keyboardAppearance="dark"
                                />
                            </View>

                            <View style={styles.formField}>
                                <Text
                                    style={{
                                        ...styles.error,
                                        display: phoneErr.state ? 'flex' : 'none',
                                    }}>
                                    {phoneErr.message}
                                </Text>
                                <Text style={styles.label}>Phone Number:</Text>
                                <TextInput
                                    onChangeText={(phone) => handlePhone('phone', phone)}
                                    style={{
                                        ...styles.textInput,
                                        marginBottom: 5,
                                    }}
                                    keyboardType="number-pad"
                                    autoCapitalize="none"
                                    placeholder="Enter your phone number"
                                    placeholderTextColor="rgba(0,0,0,0.5)"
                                    underlineColorAndroid="transparent"
                                    keyboardAppearance="dark"
                                />
                            </View>
                            <Text style={styles.caption}>Must have access to this number.</Text>
                            <View style={styles.formField}>
                                <Text style={styles.label}>Email:</Text>
                                <TextInput
                                    defaultValue={route.params ? route.params.email : undefined}
                                    onChangeText={(email) => handleInput('email', email)}
                                    style={{
                                        ...styles.textInput,
                                        marginBottom: 5,
                                    }}
                                    autoCapitalize="none"
                                    placeholder="Enter your email address"
                                    placeholderTextColor="rgba(0,0,0,0.5)"
                                    underlineColorAndroid="transparent"
                                    keyboardAppearance="dark"
                                    keyboardType="email-address"
                                    autoCorrect={false}
                                />
                            </View>
                            <Text style={styles.caption}>
                                Must be a valid email you can access. This will be your username. An account verification code will be emailed to you.
                            </Text>
                            <View style={styles.formField}>
                                <Text style={styles.label}>Password:</Text>
                                <TextInput
                                    onChangeText={(password) => handleInput('password', password)}
                                    secureTextEntry
                                    style={{
                                        ...styles.textInput,
                                        marginBottom: 5,
                                    }}
                                    autoCapitalize="none"
                                    placeholderTextColor="#000000"
                                    underlineColorAndroid="transparent"
                                    keyboardAppearance="dark"
                                />
                            </View>
                            <Text style={styles.caption}>Password must contain at least 8 characters and at least one number</Text>
                            <View style={styles.formField}>
                                <Text style={styles.label}>Confirm Password:</Text>
                                <TextInput
                                    onChangeText={(confirm_password) => handleInput('confirm_password', confirm_password)}
                                    secureTextEntry
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    placeholderTextColor="#000000"
                                    underlineColorAndroid="transparent"
                                    keyboardAppearance="dark"
                                />
                            </View>
                            <View style={styles.spacer} />
                        </ScrollView>
                        <Picker
                            selectedValue={country.phone_country_code}
                            style={{
                                height: 50,
                                width: '100%',
                                flex: 0.55,
                                display: 'none',
                            }}
                            onValueChange={(itemValue, itemIndex) => handleSelect('phone_country_code', itemValue)}>
                            <Picker.Item label="US" value="us" />
                            <Picker.Item label="Canada" value="ca" />
                        </Picker>
                    </KeyboardAvoidingView>
                </View>
            </SafeAreaView>
            <Button
                full
                transparent
                disabled={isLoading}
                style={[
                    styles.itemWindow,
                    {
                        minHeight: 90,
                        borderRadius: 0,
                        marginTop: 0,
                    },
                ]}
                onPress={() => handleRegistration()}>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'right',
                        fontWeight: '500',
                        fontSize: 14,
                    }}>
                    Create my account
                </Text>
            </Button>
        </View>
    );
};

export default Register;
