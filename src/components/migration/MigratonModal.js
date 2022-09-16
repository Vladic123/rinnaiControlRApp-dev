import React, {useEffect, useState, useRef, useCallback} from 'react';
import {View, Modal, Text, TouchableWithoutFeedback, Linking, StyleSheet, Image} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5Pro';
import * as Progress from 'react-native-progress';
import {Button} from 'native-base';

import {useSelector, useDispatch} from 'react-redux';
import {authActions} from '../../reducers/auth';
import {useAppState, AppStates} from '../../hooks/useAppState';
import analytics from '../../services/analytics';

import externalStyles from '../../styles/Style';

const check = require('../../assets/images/green-check.png');

const MigrationModal = (props) => {
    const defaultTxt = useRef('You can leave the app without harming the update');
    const [status, setStatus] = useState('updating');
    const [desc, setDesc] = useState(defaultTxt.current);
    const [finished, setFinished] = useState(false);
    const [error, setError] = useState(false);
    const [title, setTitle] = useState('Updating...');
    const [timer, setTimer] = useState(null);
    const userData = useSelector((state) => state.auth.account);
    const devices = useSelector((state) => state.auth.account.devices);
    const migrationData = useSelector((state) => state.migration.migrationData);
    const [supportLink, setSupportLink] = useState('');
    const dispatch = useDispatch();

    const appState = useAppState();

    useEffect(() => {
        if (appState === AppStates.active) {
            if (devices) {
                checkMigration(devices.items);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appState]);

    useEffect(() => {
        //first check if the process is still not finished and if we have devices to check
        if (!finished && devices && !error && migrationData && migrationData.initialTime !== 0) {
            //Not finished and there are devices to check
            checkMigration(devices.items);
        }
    }, [devices, finished, error, migrationData, checkMigration]);

    useEffect(() => {
        if (migrationData && migrationData.migrationSupportLink) {
            setSupportLink(migrationData.migrationSupportLink);
        }
    }, [migrationData]);
    useEffect(() => {
        if (finished) {
            //update to new status of 'finished'
            setStatus('finished');
        }
        if (error) {
            setStatus('error');
        }
    }, [finished, error, dispatch]);

    useEffect(() => {
        if (!migrationData) {
            return;
        }
        //update title and description according to status
        analytics.logScreenView({
            screen_name: `migration-${status}`,
            screen_class: `migration-${status}`,
        });
        switch (status) {
            case 'updating':
                setTitle('Updating...');
                setDesc(`${defaultTxt.current}. This process can take ${migrationData.waitTimeText}.`);
                break;
            case 'finished':
                setTitle('Update Complete!');
                setDesc('The control•™ module update is now complete.');
                break;
            case 'error':
                setTitle('Update Failed');
                setDesc(
                    'In order to use your module(s), follow the “Connect Now” instructions on the following screen. Your devices will update as part of that process.',
                );
                break;

            default:
                setTitle('Updating...');
                setDesc(`${defaultTxt.current}. This process can take ${migrationData.waitTimeText}.`);
                break;
        }
    }, [status, migrationData]);

    const refreshAccount = useCallback(() => {
        const timeInterval = setTimeout(() => {
            // if fetchUserByEmail fails for any reason we just reschedule the call instead of breaking the loop
            dispatch(authActions.fetchUserByEmail(userData.username)).catch(() => refreshAccount());
        }, 20000);
        setTimer(timeInterval);
    }, [dispatch, userData.username]);

    const areEqual = (first, second) => {
        if (first && second && first.length !== second.length) {
            return false;
        }
        if (first && second) {
            for (let i = 0; i < first.length; i++) {
                if (!second.includes(first[i])) {
                    return false;
                }
            }
            return true;
        }
        if (!first && !second) {
            return true;
        }
    };

    const checkMigration = useCallback(
        (userDevices) => {
            analytics.logEvent('checkMigration');
            clearTimeout(timer);
            const now = new Date().getTime();
            if (migrationData && now - migrationData.initialTime >= migrationData.waitTime * 1000) {
                setError(true);
            }

            let migration = true;
            const dsnReturned = [];
            userDevices.forEach((item) => {
                dsnReturned.push(item.dsn);
            });

            if (migrationData && !areEqual(migrationData.dsnList ? migrationData.dsnList : [], dsnReturned)) {
                migration = false;
            }

            if (!migration) {
                //if any of the users devices does not have a 'thing_name' set, then refresh the account (after 5 sec) which will trigger another check
                refreshAccount();
            } else {
                //it s finished, so enable button and update Modal content
                setFinished(true);
            }
        },
        [refreshAccount, migrationData, timer],
    );

    let icon = !finished ? (
        <Progress.Circle
            style={{alignItems: 'center', justifyContent: 'center'}}
            size={110}
            color={'#4EC32D'}
            thickness={30}
            borderWidth={5}
            strokeCap="round"
            endAngle={0.3}
            indeterminate={!finished}>
            <View style={{...externalStyles.loadingInner, borderRadius: 100 / 2, height: 100, width: 100}} />
        </Progress.Circle>
    ) : (
        <Progress.Circle
            style={{alignItems: 'center', justifyContent: 'center'}}
            size={110}
            color={'#697179'}
            thickness={30}
            borderWidth={5}
            strokeCap="round"
            endAngle={0.3}
            indeterminate={!finished}>
            <View style={{...externalStyles.loadingInner, borderRadius: 100 / 2, height: 100, width: 100}}>
                <Image
                    style={{
                        position: 'absolute',
                        marginBottom: 30,
                        marginTop: 20,
                        width: 62,
                        height: 52,
                    }}
                    source={check}
                />
            </View>
        </Progress.Circle>
    );

    if (error) {
        //Update Icon if error
        icon = <Icon name="exclamation-triangle" size={75} color="#DD0000" solid />;
    }

    return (
        <View>
            <Modal visible={props.show} transparent={true} animationType="fade">
                <View style={styles.mainContainer}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalOverlay} />
                    </TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                        <View style={styles.iconContainer}>{icon}</View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{title}</Text>
                        </View>
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.description}>{desc}</Text>
                        </View>
                        <View style={styles.contactContainer}>
                            {status === 'updating' || status === 'error' ? (
                                <View style={styles.contact}>
                                    <Text style={styles.contactText}>
                                        <Text style={styles.contactLink} onPress={() => Linking.openURL(supportLink)}>
                                            Contact support{' '}
                                        </Text>
                                        if there are any issues
                                    </Text>
                                </View>
                            ) : null}
                        </View>

                        <View style={styles.buttonContainer}>
                            <Button full transparent style={styles.button} disabled={!finished && !error} onPress={props.onFinish}>
                                <Text style={[styles.buttonText, !finished && !error ? styles.buttonDisabled : styles.buttonEnabled]}>
                                    {error ? 'Okay' : 'Finish'}
                                </Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    modalContent: {
        flex: 0.5,
        justifyContent: 'center',
        margin: 20,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        overflow: 'visible',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    iconContainer: {
        flexShrink: 1,
        overflow: 'hidden',
        margin: '2%',
    },
    buttonContainer: {
        flex: 1,
        flexShrink: 0,
        marginVertical: '2%',
    },
    button: {
        flex: 1,
        alignItems: 'flex-end',
    },
    buttonText: {
        height: 20,
        color: 'black',
        textAlign: 'center',
        fontSize: 14,
    },
    buttonDisabled: {
        color: '#979797',
    },
    buttonEnabled: {
        color: '#000000',
    },
    title: {
        padding: 10,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20,
    },
    description: {
        color: '#979797',
        fontWeight: 'normal',
        textAlign: 'center',
        fontSize: 15,
    },
    contactContainer: {
        marginVertical: '5%',
    },
    contact: {
        flexDirection: 'row',
    },
    contactText: {
        color: '#888',
        fontSize: 15,
    },
    contactLink: {
        color: '#888',
        textDecorationLine: 'underline',
        fontSize: 15,
    },
});

export default MigrationModal;
