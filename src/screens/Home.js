/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import {View, ScrollView, TouchableOpacity, Platform, RefreshControl, PermissionsAndroid, SafeAreaView, Image} from 'react-native';
import TitleBar from '../components/TitleBar';
import Device from '../components/Device';
import styles from '../styles/Style';
import Amplify, {Auth} from 'aws-amplify';
import Terms from '../components/Terms';
import {authActions} from '../reducers/auth';
import {useIsFocused} from '@react-navigation/native';
import API from '../services/API';
import PopUp from '../components/PopUp';
import MigrationModal from '../components/migration/MigratonModal';
import {appVersion} from '../config';
import awsconfig from '../aws-exports';
Amplify.configure(awsconfig);
import {getMigrationData, deleteMigrationData} from '../components/Storage';
import {migrationActions} from '../reducers/migration';
const connectBanner = require('../assets/images/connect-device-banner.png');

const Home = (props) => {
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const migrationData = useSelector((state) => state.migration.migrationData);
    const userData = useSelector((state) => state.auth.account);
    const devices = useSelector((state) => state.auth.account.devices);
    useSelector((state) => state.auth.verify.email);
    let migrated = useSelector((state) => state.auth.migrated);

    const [refresh, setRefresh] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [deviceList, setDeviceList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showInitialModal, setShowInitalModal] = useState(false);
    const [blocknitialModal, setBlockInitalModal] = useState(false);
    const [shouldCheckMigration, setShouldCheckMigration] = useState(true);

    useEffect(() => {
        const fetchMigrationData = async () => {
            const newMigrationData = await getMigrationData();
            if (newMigrationData) {
                dispatch(migrationActions.setMigrationData(newMigrationData));
            }
        };
        if (shouldCheckMigration) {
            setShouldCheckMigration(false);
            fetchMigrationData().then();
        }
    }, [shouldCheckMigration]);

    useEffect(() => {
        const setMigrationModalIfNeeded = async () => {
            if (migrationData && Object.entries(migrationData).length > 0) {
                dispatch(authActions.updateMigrated(true));
            }
        };
        setMigrationModalIfNeeded().then();
    }, [migrationData]);

    useEffect(() => {
        if (!blocknitialModal && migrated) {
            setShowInitalModal(true);
            setBlockInitalModal(true);
        }
    }, [migrated, devices, migrationData]);

    useEffect(() => {
        // pulling stuck device list from s3
        API.findStuck().then((res) => {
            setDeviceList(res);
        });
    }, []);

    useEffect(() => {
        refreshAccount();
    }, [isFocused, userData?.username]);

    useEffect(() => {
        if (Object.keys(userData).length > 0) {
            setShowTerms(!userData.terms_accepted);
            dispatch(authActions.fetchUserByEmail(userData.username));
        }
    }, [isFocused]);

    useEffect(() => {
        if (!userData?.id || (userData.app_version && userData.app_version === appVersion)) {
            return;
        }
        API.updateUser({id: userData.id, app_version: appVersion});
    }, [userData?.id]);

    useEffect(() => {
        setShowTerms(!userData.terms_accepted);
        if (Object.keys(userData).length === 0) {
            Auth.currentAuthenticatedUser()
                .then((data) => {
                    dispatch(authActions.fetchUserByEmail(data.username));
                    dispatch(authActions.loginUser());
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [userData]);

    const refreshAccount = async () => {
        if (!userData?.username) {
            return;
        }
        await dispatch(authActions.fetchUserByEmail(userData.username));
        setRefresh(true);
        setRefreshing(true);
        setTimeout(() => {
            setRefresh(false);
            setRefreshing(false);
        }, 1000);
    };

    const refreshDevices = () => {
        setRefresh(true);
        setRefreshing(true);
        setTimeout(() => {
            setRefresh(false);
            setRefreshing(false);
        }, 1000);
    };

    const userDevices = () => {
        if (devices && devices.items && devices.items.length > 0) {
            const listDevices = devices.items;

            return listDevices.map((device, key) => {
                return (
                    <Device
                        device={device}
                        dsn={device.dsn}
                        item={key}
                        refresh={refresh}
                        deviceList={deviceList}
                        navigation={props.navigation}
                        key={key}
                    />
                );
            });
        } else {
            return (
                <View style={{marginTop: 0}}>
                    <TouchableOpacity
                        style={{...styles.banner, backgroundColor: '#ffffff'}}
                        onPress={() =>
                            props.navigation.navigate('Pairing', {
                                screen: 'PairingHome',
                            })
                        }>
                        <Image style={{resizeMode: 'contain', width: '100%'}} source={connectBanner} />
                    </TouchableOpacity>
                </View>
            );
        }
    };

    const userLocation = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                title: 'Allow "Rinnai control•r" to use your location?',
                message: 'We require location permission during the pairing process to ensure your iPhone is connected to the control•r™ Module',
            });

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                Geolocation.getCurrentPosition((info) => {
                    dispatch(authActions.setUserLocation(info));
                });
            } else {
                console.log('Location denied');
            }
        } else {
            Geolocation.getCurrentPosition((info) => {
                dispatch(authActions.setUserLocation(info));
            });
        }
    };

    const terms = () => {
        setTimeout(() => {
            if (showTerms) {
                return <Terms modal={showTerms} />;
            }
        }, 500);
        return;
    };

    userLocation();

    const initialModal = () => {
        const title = {
            type: 'header',
            value: 'Update Pending',
        };

        const description = {
            type: 'description',
            value: 'You are now logged in to your updated control•r™ app. Your control•r™ Module(s) will now update to the latest firmware version.',
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
                modal={showInitialModal}
                modalButton={true}
                submit={(data) => {
                    setShowModal(true);
                    setShowInitalModal(false);
                    //dispatch(authActions.updateMigrated(false));
                }}
                showModal={() => {
                    setShowInitalModal(false);
                }}
            />
        );
    };

    return (
        <View style={styles.appContainer}>
            {terms()}
            <TitleBar navigation={props.navigation} backButton={false} subTitle={false} drawer={true} transparent={true} />
            <SafeAreaView style={styles.formBox}>
                <View
                    style={{
                        flex: 1,
                        width: '100%',
                        marginTop: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <ScrollView
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshDevices} />}
                        style={{
                            flex: 1,
                            width: '100%',
                            padding: 0,
                            paddingBottom: 25,
                        }}>
                        {showInitialModal ? initialModal() : null}
                        {showModal ? (
                            <MigrationModal
                                show={showModal}
                                onFinish={() => {
                                    setShowModal(false);
                                    setShowInitalModal(false);
                                    dispatch(authActions.updateMigrated(false));
                                    deleteMigrationData().then(async () => {
                                        dispatch(migrationActions.deleteMigrationData());
                                    });
                                }}
                            />
                        ) : null}
                        {userDevices()}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default Home;
