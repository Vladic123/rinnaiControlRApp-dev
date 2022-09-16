/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, ScrollView, TextInput, Text, Image, Alert, KeyboardAvoidingView, Platform} from 'react-native';
import {Button} from 'native-base';
import NetInfo from '@react-native-community/netinfo';
import {useDispatch} from 'react-redux';
import {migrationActions} from '../../reducers/migration';
import {authActions} from '../../reducers/auth';
import {storeMigrationData} from '../../components/Storage';
import RinnaiLoader from '../../components/RinnaiLoader';
import MigrationErrorModal from '../../components/migration/MigrationErrorModal';
import PopUp from '../../components/PopUp';
import styles from '../../styles/Style';
import API from '../../services/API';
import utils from '../../utils';
import {Auth} from 'aws-amplify';

const logo = require('../../assets/images/rinnai-text-logo.png');

const Login = ({navigation}) => {
    const dispatch = useDispatch();
    const [modal, setModal] = useState(false);
    const [errorModal, setErrorModal] = useState(false);
    const [errorCode, setErrorCode] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [migrationSupportLink, setMigrationSupportLink] = useState();

    const [migrationModal, setMigrationModal] = useState(false);
    const [migrationModalEmail, setMigrationModalEmail] = useState(false);

    const validate = () => {
        if (!email || !password) {
            alertHandler('EmptyEmailOrPassword');
            return false;
        }

        if (isLoading) {
            return false;
        }

        return true;
    };

    const handleLogin = async () => {
        if (!validate()) {
            return;
        }

        let isConnected = (await NetInfo.fetch()).isConnected;
        if (!isConnected) {
            await checkLoginError('NetworkError');
            return;
        }

        try {
            const params = {username: email, password};
            console.log(params)
            setIsLoading(true);
            await Auth.signIn(params);
            dispatch(authActions.loginUser());
            await dispatch(authActions.fetchUserByEmail(email));
            navigation.navigate('Home');
        } catch (error) {
            await checkLoginError(error.code);
        } finally {
            setIsLoading(false);
        }
    };

    const migrateUser = async () => {
        //If it is not a call from ForgotPassword, migrate user from Ayla

        const response = await API.migrateAylaUser(email, password);

        if (response) {
            if (response.deviceDsns && response.deviceDsns.length > 0) {
                const migrationData = {
                    initialTime: Date.now(),
                    waitTime: parseInt(response.expectedWaitTimeSeconds, 10),
                    waitTimeText: response.expectedWaitTimeDisplayText,
                    dsnList: response.deviceDsns,
                    migrationSupportLink: response.migrationSupportLink,
                };
                await storeMigrationData(migrationData);
                dispatch(migrationActions.setMigrationData(migrationData));
                dispatch(authActions.updateMigrated(true));
            }
        }
    };

    const checkErrorCode = (status, isMigration) => {
        /*
        we're wrapping these alerts in a timeout to push to the next loop to workaround an issue with the alerts
        being dismissed automatically. I believe this is a framework issue with the loading indicator dismissal.
       */
        switch (status) {
            case 404:
                alertHandler('InvalidUsernameOrEmail');

                break;
            case 401:
                alertHandler('InvalidLoginOrPassword');
                break;
            case 500:
                if (isMigration) {
                    setErrorCode(status);
                    setErrorModal(true);
                } else {
                    alertHandler('InternalError');
                }
                break;

            default:
                if (isMigration) {
                    setErrorCode(status);
                    setErrorModal(true);
                } else {
                    alertHandler('InternalError');
                }
                break;
        }
    };

    const alertHandler = (error) => {
        let title = 'Error';
        let message = 'An error has occurred. Please contact support.';

        switch (error) {
            case 'NotAuthorizedException':
                title = 'Login Error';
                message = 'Email or Password is incorrect. Please Try Again';
                break;

            case 'InvalidParameterException':
                message = 'Invalid email or password';
                break;

            case 'LimitExceededException':
                message = 'Reset limit exceeded';
                break;

            case 'NetworkError':
                message = 'Network connection error';
                break;

            case 'UpdateError':
                title = 'Update Error';
                message = 'Please enter your email address';
                break;

            case 'EmptyEmailOrPassword':
                title = 'Login Error';
                message = 'Must fill out both email and password to login';
                break;

            case 'InvalidUsernameOrEmail':
                message = 'Invalid username or email.';
                break;

            case 'InvalidLoginOrPassword':
                message = 'Invalid username/email or password.';
                break;

            case 'InternalError':
                message = 'An Internal Server error occurred. Please contact support.';
                break;

            default:
                break;
        }
        setTimeout(() => {
            Alert.alert(
                title,
                message,
                [
                    {
                        text: 'OK',
                        onPress: () => console.log('OK Pressed'),
                    },
                ],
                {cancelable: false},
            );
        }, 0);
    };

    const checkLoginError = async (code, config) => {
        setModal(false);
        switch (code) {
            case 'UserNotFoundException':
                if (!config || !config.forgot) {
                    try {
                        console.log('MIGRATE USER');
                        await migrateUser();
                        await handleLogin();
                    } catch (err) {
                        if (err && err.response && err.response.data && err.response.data.migrationSupportLink) {
                            setMigrationSupportLink(err.response.data.migrationSupportLink);
                            checkErrorCode(err.response.status, true);
                        } else {
                            setMigrationSupportLink('https://www.rinnai.us/');
                            checkErrorCode(500, true);
                        }
                    }
                } else {
                    try {
                        console.log('FORGOT PASSWORD');
                        const resp = await API.validateAylaUser(config.email);
                        if (resp) {
                            setMigrationModalEmail(config.email);
                            setMigrationModal(true);
                            if (resp.deviceDsns && resp.deviceDsns.length > 0) {
                                const migrationData = {
                                    initialTime: Date.now(),
                                    waitTime: parseInt(resp.expectedWaitTimeSeconds, 10),
                                    waitTimeText: resp.expectedWaitTimeDisplayText,
                                    dsnList: resp.deviceDsns,
                                    migrationSupportLink: resp.migrationSupportLink,
                                };
                                await storeMigrationData(migrationData);
                                dispatch(migrationActions.setMigrationData(migrationData));
                                dispatch(authActions.updateMigrated(true));
                            }
                        }
                    } catch (error) {
                        console.log('ERROR RECOVERING PASSWORD');
                        console.log(error);
                        checkErrorCode(error.response.status, false);
                    }
                }
                break;
            case 'NotAuthorizedException':
                dispatch(authActions.fetchUserByEmail(email)).then((user) => {
                    if (!user) {
                        alertHandler('NotAuthorizedException');
                    } else {
                        if (!user.aws_confirm) {
                            //If the user has not yet confirmed their aws account
                            //Alert them to reset their password here
                            forgotPassword();
                        } else {
                            alertHandler('NotAuthorizedException');
                        }
                    }
                });
                break;
            case 'InvalidParameterException':
                alertHandler('InvalidParameterException');
                break;
            case 'LimitExceededException':
                alertHandler('LimitExceededException');
                break;
            case 'NetworkError':
                alertHandler('NetworkError');
                break;
            default:
                break;
        }
    };

    const forgotPassword = async (data) => {
        if (!data.email) {
            alertHandler('UpdateError');
        } else {
            try {
                setIsLoading(true);
                const passData = await Auth.forgotPassword(data.email);

                const codeDelivery = passData.CodeDeliveryDetails;
                await dispatch(
                    authActions.setVerifyData({
                        ...data,
                        codeDelivery,
                    }),
                );
                setModal(false);
                navigation.navigate('Forgot', passData);
            } catch (error) {
                let userMail = data.email;
                checkLoginError(error.code, {
                    email: userMail,
                    forgot: true,
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const passwordModal = () => {
        const title = {
            type: 'header',
            value: 'Update Your Password',
        };

        const description = {
            type: 'description',
            value: 'Enter your email address. A confirmation email will be sent to the email you have on file',
        };

        const emailContent = {
            type: 'input',
            name: 'email',
            placeholder: 'Email Address',
        };

        const loginContent = [title, description, emailContent];

        return (
            <PopUp
                content={loginContent}
                modal={modal}
                autoCorrect={false}
                modalButton={true}
                submit={(data) => {
                    forgotPassword(data);
                }}
                showModal={() => {
                    setModal(!modal);
                }}
            />
        );
    };

    const passwordMigrationModal = () => {
        const title = {
            type: 'header',
            value: 'Forgot Password Unavailable',
        };

        const description = {
            type: 'description',
            value:
                'Recovering your old password is unavailable. Please create a new account. Your devices and settings will be transferred to your new account.',
        };

        const buttonlContent = {
            type: 'button',
            name: 'Okay',
            title: 'Okay',
        };

        const migrationContent = [title, description, buttonlContent];

        return (
            <PopUp
                content={migrationContent}
                modal={migrationModal}
                modalButton={true}
                submit={(data) => {
                    //Initiate user new account setUp
                    setMigrationModal(false);
                    navigation.navigate('Register', {email: migrationModalEmail});
                    setMigrationModalEmail(null);
                }}
                showModal={() => {
                    setMigrationModal(!migrationModal);
                }}
            />
        );
    };

    return (
        <View style={styles.loginBox}>
            <RinnaiLoader modal={isLoading} />
            <View style={styles.title}>
                <Image accessible={true} accessibilityId="rinnai-logo" visible="true" style={{height: 26, width: 100}} source={logo} />
            </View>
            {passwordModal()}
            {passwordMigrationModal()}
            {errorModal ? (
                <MigrationErrorModal
                    errorCode={errorCode}
                    migrationSupportLink={migrationSupportLink}
                    close={() => {
                        setErrorModal(false);
                        setErrorCode('');
                    }}
                />
            ) : null}

            <View style={styles.formBox}>
                <KeyboardAvoidingView
                    style={{
                        flex: 1,
                        width: '100%',
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
                            padding: 15,
                            paddingBottom: 25,
                        }}>
                        <View style={{width: '100%'}}>
                            <View style={styles.formField}>
                                <Text style={styles.loginLabel}>Email:</Text>
                                <TextInput
                                    onChangeText={(text) => setEmail(text.trim().toLowerCase())}
                                    autoCorrect={false}
                                    style={styles.loginInput}
                                    autoCapitalize="none"
                                    placeholder="Enter your email"
                                    placeholderTextColor="#697179"
                                    underlineColorAndroid="transparent"
                                    keyboardAppearance="dark"
                                    keyboardType="email-address"
                                    {...utils.getID('email')}
                                />
                            </View>
                            <View style={styles.formField}>
                                <Text style={styles.loginLabel}>Password:</Text>
                                <TextInput
                                    onChangeText={(text) => setPassword(text.trim())}
                                    secureTextEntry
                                    style={styles.loginInput}
                                    autoCapitalize="none"
                                    placeholder="Enter your password"
                                    placeholderTextColor="#697179"
                                    underlineColorAndroid="transparent"
                                    keyboardAppearance="dark"
                                    {...utils.getID('password')}
                                />
                            </View>
                        </View>

                        <Button
                            disabled={isLoading}
                            full
                            transparent
                            style={[
                                styles.itemWindow,
                                {
                                    minHeight: 0,
                                    width: '95%',
                                    alignSelf: 'center',
                                    marginTop: 10,
                                    backgroundColor: isLoading ? '#697179' : '#ffffff',
                                },
                            ]}
                            {...utils.getID('sign-in')}
                            onPress={() => handleLogin()}>
                            <Text
                                style={{
                                    color: '#000000',
                                    textAlign: 'right',
                                    fontWeight: '500',
                                    fontSize: 14,
                                }}>
                                Sign In
                            </Text>
                        </Button>
                    </ScrollView>
                </KeyboardAvoidingView>
                <View style={styles.buttonGroupHz}>
                    <Button full transparent style={{marginTop: 20}} {...utils.getID('forgot-password')} onPress={() => setModal(!modal)}>
                        <Text
                            style={{
                                color: '#000000',
                                textAlign: 'right',
                                fontWeight: '500',
                                fontSize: 14,
                            }}>
                            Forgot Password?
                        </Text>
                    </Button>
                </View>
            </View>
            <Button
                full
                transparent
                style={{
                    ...styles.itemWindow,
                    minHeight: 90,
                    borderRadius: 0,
                    marginTop: 0,
                }}
                {...utils.getID('sign-up')}
                onPress={() => navigation.navigate('Register')}>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'right',
                        fontWeight: '300',
                        fontSize: 18,
                    }}>
                    New to control•r?
                </Text>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'right',
                        fontWeight: '700',
                        fontSize: 18,
                        marginLeft: 5,
                    }}>
                    SIGN UP
                </Text>
            </Button>
        </View>
    );
};

export default Login;
