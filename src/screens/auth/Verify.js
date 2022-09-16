/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {View, TextInput, Text, Alert, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import {Auth} from 'aws-amplify';
import RinnaiLoader from '../../components/RinnaiLoader';

const Verify = ({route, navigation}) => {
    const {Destination} = route.params.CodeDeliveryDetails;
    const email = useSelector((state) => state.auth.verify.email);
    const [verify, setVerify] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInput = (key, value) => {
        setVerify({
            ...verify,
            [key]: value,
        });
    };

    function alert(title, message) {
        // we're doing this to avoid some unexpected interactions with the loading modal and alerts.
        setIsLoading(false);
        setTimeout(
            () =>
                Alert.alert(title, message, [{text: 'OK', onPress: () => console.log('OK Pressed')}], {
                    cancelable: false,
                }),
            0,
        );
    }

    async function verifyAccount() {
        if (!verify.code) {
            alert('Code Error', 'Please enter the verification code');
        }
        try {
            setIsLoading(true);
            await Auth.confirmSignUp(email, verify.code);
            navigation.navigate('Login');
        } catch (err) {
            alert('Verify Error', err.message);
        } finally {
            setIsLoading(false);
        }
    }

    async function resendVerification() {
        try {
            setIsLoading(true);
            await Auth.resendSignUp(email);
            alert('Verification', 'verification sent');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <ScrollView contentContainerStyle={{flexGrow: 1, backgroundColor: '#F3F5F7', justifyContent: 'center'}}>
            <RinnaiLoader modal={isLoading} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.select({
                    ios: 130,
                    android: 130,
                })}>
                <View style={styles.loginBox}>
                    <View style={styles.formBox}>
                        <TitleBar backButton={true} backNav="back" navigation={navigation} title="RINNAI" subTitle={false} drawer={false} />
                        <View style={styles.textWrapper}>
                            <Text style={styles.text}>We sent a code to:</Text>
                            <Text style={{...styles.text, fontWeight: 'bold'}}>{Destination}</Text>
                            <Text style={styles.text}>To verify your account</Text>
                        </View>
                        <View
                            style={{
                                width: '100%',
                                margin: 'auto',
                                alignItems: 'center',
                                justifyContent: 'center',
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
                            <Button
                                full
                                transparent
                                disabled={isLoading}
                                style={[styles.button, {width: '80%', alignSelf: 'center', marginTop: 10}]}
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
                        </View>
                        <View style={styles.buttonGroupHz}>
                            <Button
                                full
                                transparent
                                disabled={isLoading}
                                style={{
                                    marginTop: 20,
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

export default Verify;
