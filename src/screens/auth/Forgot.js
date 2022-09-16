/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, ScrollView, TextInput, Text, Platform, Alert, KeyboardAvoidingView} from 'react-native';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import {Auth} from 'aws-amplify';
import {authActions} from '../../reducers/auth';
import API from '../../services/API';

import RinnaiLoader from '../../components/RinnaiLoader';

const Forgot = ({route, navigation}) => {
    const [verify, setVerify] = useState({});
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const {Destination} = route.params.CodeDeliveryDetails;
    const userData = useSelector((state) => state.auth.account);
    const email = useSelector((state) => state.auth.verify.email);

    useEffect(() => {
        // console.log(userData);
    }, [userData]);

    const handleInput = (key, value) => {
        setVerify({
            ...verify,
            [key]: value,
        });
    };

    const verifyAccount = () => {
        setLoading(true);
        if (!verify.password || !verify.confirm_password) {
            setLoading(false);
            Alert.alert('Password Error', 'Your passwords cannot be empty!', [{text: 'OK', onPress: () => console.log('OK Pressed')}], {
                cancelable: false,
            });
            return;
        } else if (verify.password !== verify.confirm_password) {
            setLoading(false);
            Alert.alert('Password Error', 'Your passwords do not match!', [{text: 'OK', onPress: () => console.log('OK Pressed')}], {
                cancelable: false,
            });
            return;
        }
        if (verify.code) {
            Auth.forgotPasswordSubmit(email, verify.code, verify.password)
                .then(() => {
                    const params = {
                        username: email,
                        password: verify.password,
                    };

                    Auth.signIn(params)
                        .then((data) => {
                            //update user
                            const user = data.attributes;
                            dispatch(authActions.fetchUserByEmail(user.email)).then((getUser) => {
                                const confirm = {
                                    id: getUser.id,
                                    email: getUser.email,
                                    aws_confirm: true,
                                };

                                API.confirmUser(confirm).then(() => {
                                    dispatch(authActions.loginUser());
                                    navigation.navigate('Home');
                                    setLoading(false);
                                });
                            });
                        })
                        .catch((err) => {
                            setLoading(false);
                            console.log(err);
                        });
                })
                .catch((err) => {
                    setLoading(false);
                    Alert.alert(
                        'Verify Error',
                        err.message,
                        [
                            {
                                text: 'OK',
                                onPress: () => console.log('OK Pressed'),
                            },
                        ],
                        {cancelable: false},
                    );
                });
        } else {
            setLoading(false);
            Alert.alert('Code Error', 'Please enter the verification code', [{text: 'OK', onPress: () => console.log('OK Pressed')}], {
                cancelable: false,
            });
        }
    };

    const resendVerification = () => {
        Auth.forgotPassword(email)
            .then(() => {
                Alert.alert('Verification', 'verification sent', [{text: 'OK', onPress: () => console.log('OK Pressed')}], {cancelable: false});
            })
            .catch((error) => {
                Alert.alert('Error', error.message, [{text: 'OK', onPress: () => console.log('OK Pressed')}], {cancelable: false});
            });
    };

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1, backgroundColor: '#F3F5F7', justifyContent: 'center'}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
                keyboardVerticalOffset={Platform.select({
                    ios: 130,
                    android: 0,
                })}>
                <RinnaiLoader modal={loading} />
                <View style={styles.loginBox}>
                    <TitleBar backButton={true} backNav="back" navigation={navigation} title="RINNAI" subTitle={false} drawer={false} />
                    <View style={styles.textWrapper}>
                        <Text style={styles.text}>We sent a code to:</Text>
                        <Text style={{...styles.text, fontWeight: 'bold'}}>{Destination}</Text>
                        <Text style={styles.text}>To verify your account</Text>
                    </View>
                    <View style={styles.formBox}>
                        <View
                            style={{
                                flexv: 1,
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <ScrollView
                                style={{
                                    flex: 1,
                                    width: '100%',
                                    padding: 10,
                                    paddingBottom: 5,
                                }}>
                                <View style={styles.formField}>
                                    <Text style={styles.label}>Enter the 6-digit code:</Text>
                                    <TextInput
                                        onChangeText={(code) => handleInput('code', code)}
                                        style={styles.textInput}
                                        autoCapitalize="none"
                                        keyboardType="number-pad"
                                        placeholderTextColor="#000000"
                                        underlineColorAndroid="transparent"
                                        keyboardAppearance="dark"
                                    />
                                </View>
                                <View style={styles.formField}>
                                    <Text style={styles.label}>Password</Text>
                                    <TextInput
                                        onChangeText={(password) => handleInput('password', password)}
                                        style={styles.textInput}
                                        secureTextEntry
                                        autoCapitalize="none"
                                        placeholderTextColor="#000000"
                                        underlineColorAndroid="transparent"
                                        keyboardAppearance="dark"
                                    />
                                </View>
                                <View style={styles.formField}>
                                    <Text style={styles.label}>Confirm Password</Text>
                                    <TextInput
                                        onChangeText={(confirm_password) => handleInput('confirm_password', confirm_password)}
                                        style={styles.textInput}
                                        secureTextEntry
                                        autoCapitalize="none"
                                        placeholderTextColor="#000000"
                                        underlineColorAndroid="transparent"
                                        keyboardAppearance="dark"
                                    />
                                </View>
                                <Button
                                    full
                                    transparent
                                    style={[
                                        styles.button,
                                        {
                                            width: '80%',
                                            alignSelf: 'center',
                                            marginTop: 10,
                                        },
                                    ]}
                                    onPress={() => verifyAccount()}>
                                    <Text
                                        style={{
                                            color: '#000000',
                                            textAlign: 'right',
                                            fontWeight: '500',
                                            fontSize: 14,
                                        }}>
                                        Verify
                                    </Text>
                                </Button>
                            </ScrollView>
                        </View>
                        <View style={styles.buttonGroupHz}>
                            <Button
                                full
                                transparent
                                style={{
                                    marginTop: 10,
                                }}
                                onPress={() => resendVerification()}>
                                <Text
                                    style={{
                                        color: '#000000',
                                        textAlign: 'right',
                                        fontWeight: '500',
                                        fontSize: 14,
                                    }}>
                                    Resend Verification Code
                                </Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
    );
};

export default Forgot;
