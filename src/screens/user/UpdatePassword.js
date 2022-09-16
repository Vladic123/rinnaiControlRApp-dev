/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, ScrollView, TextInput, Text, Alert, KeyboardAvoidingView, Keyboard, Platform, SafeAreaView} from 'react-native';
import {Button} from 'native-base';
import styles from '../../styles/Style';
import TitleBar from '../../components/TitleBar';
import {Auth} from 'aws-amplify';

import RinnaiLoader from '../../components/RinnaiLoader';

const Register = ({navigation}) => {
    const [update, setUpdate] = useState([]);
    const [error, setError] = useState({state: false, message: ''});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
        Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

        // cleanup function
        return () => {
            Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
            Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
        };
    }, []);

    const _keyboardDidShow = () => {};

    const _keyboardDidHide = () => {};

    const handleInput = (key, value) => {
        setUpdate({
            ...update,
            [key]: value,
        });
    };

    const handlePassword = () => {
        setLoading(true);
        if (!update.password || !update.confirm_password) {
            setLoading(false);
            setError({
                state: true,
                message: 'Passwords cannot be empty',
            });
            return;
        } else if (update.password !== update.confirm_password) {
            setLoading(false);
            setError({
                state: true,
                message: 'Passwords Do Not Match',
            });
            return;
        } else if (!update.current) {
            setLoading(false);
            setError({
                state: true,
                message: 'Current password cannot be empty',
            });
            return;
        }

        Auth.currentAuthenticatedUser()
            .then((user) => {
                Auth.changePassword(user, update.current, update.password)
                    .then((resp) => {
                        console.log('Change password call');
                        Alert.alert('Password Update', '', [{text: 'OK', onPress: () => navigation.goBack()}], {cancelable: false});
                    })
                    .catch((err) => {
                        Alert.alert('Password Error', err.message, [{text: 'OK', onPress: () => console.log('OK Pressed')}], {cancelable: false});
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            })
            .catch((err) => {
                Alert.alert('Password Error', err.message, [{text: 'OK', onPress: () => console.log('OK Pressed')}], {cancelable: false});
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <View style={{...styles.loginBox}}>
            <TitleBar backButton={true} backNav="back" navigation={navigation} title="Update Password" subTitle={false} drawer={true} />
            <ScrollView contentContainerStyle={{flexGrow: 1, backgroundColor: '#F3F5F7', justifyContent: 'center'}} nestedScrollEnabled={true}>
                <RinnaiLoader modal={loading} />
                <KeyboardAvoidingView>
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
                            <View
                                style={{
                                    flex: 1,
                                    width: '100%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                keyboardVerticalOffset={Platform.select({
                                    ios: 130,
                                    android: 500,
                                })}>
                                <View
                                    style={{
                                        flex: 1,
                                        width: '100%',
                                        padding: 15,
                                        paddingBottom: 25,
                                    }}>
                                    <View style={{...styles.formField, marginBottom: 50}}>
                                        <Text style={styles.label}>Current Password:</Text>
                                        <TextInput
                                            onChangeText={(current) => handleInput('current', current)}
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
                                    <View style={styles.formField}>
                                        <Text style={styles.label}>New Password:</Text>
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
                                        <Text style={styles.label}>Confirm New Password:</Text>
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
                                </View>
                            </View>
                            <Button
                                full
                                transparent
                                style={[
                                    styles.itemWindow,
                                    {
                                        minHeight: 90,
                                        borderRadius: 0,
                                        marginTop: 0,
                                    },
                                ]}
                                onPress={() => handlePassword()}>
                                <Text
                                    style={{
                                        color: '#000000',
                                        textAlign: 'right',
                                        fontWeight: '500',
                                        fontSize: 14,
                                    }}>
                                    Update Password
                                </Text>
                            </Button>
                        </View>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
};

export default Register;
