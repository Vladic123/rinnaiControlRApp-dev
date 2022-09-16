/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Image, Text} from 'react-native';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import Amplify from 'aws-amplify';
import * as Progress from 'react-native-progress';
import awsconfig from '../../aws-exports';
import ModuleService from '../../services/ModuleService';
import analytics from '../../services/analytics';

Amplify.configure(awsconfig);

const FirmwareInstall = ({navigation, route}) => {
    const stateOptions = {
        skippedInitialState: 'INITIAL',
        uploading: 'UPLOADING',
        uploadingComplete: 'UPLOAD_COMPLETE',
        applying: 'APPLYING',
        done: 'DONE',
    };

    const serialId = route?.params?.serialId;
    const [state, setState] = useState(stateOptions.uploading);
    const [status, setStatus] = useState('Downloading to control•r™ Module');
    const [info, setInfo] = useState('Please wait for your control•r™ Module to download the update');
    const [actionText, setActionText] = useState('Next');
    const [step, setStep] = useState(0);
    const [progress, setProgress] = useState(false);
    const check = require('../../assets/images/green-check.png');

    useEffect(() => {
        uploadOtaUpdate();
    }, []);

    useEffect(() => {
        setProgress([stateOptions.uploading, stateOptions.applying].includes(state));
        setStep(getStep(state));
        setActionText(getActionText(state));
    }, [state]);

    function getActionText(stateParam) {
        return stateParam === stateOptions.skippedInitialState ? 'Retry' : 'Next';
    }

    function getStep(stateParam) {
        if (stateParam === stateOptions.uploading) {
            return 0;
        } else if (state === stateOptions.uploading || state === stateOptions.uploadingComplete) {
            return 1;
        }
        return 2;
    }
    // TODO move time out to module service (have it throw timeout exception)

    const uploadOtaUpdate = async () => {
        try {
            await analytics.logEvent('firmware_update_upload', {serialId});
            setState(stateOptions.uploading);
            await ModuleService.uploadFirmware();
            setState(stateOptions.uploadingComplete);
            setStatus('Download to control•r™ \n Module Complete');
            await analytics.logEvent('firmware_update_upload_sucess', {serialId});
        } catch (err) {
            await analytics.logEvent('firmware_update_upload_failure', {serialId, err});
            setState(stateOptions.skippedInitialState);
            setStatus('Upload failed.');
        }
    };

    const executeUpdate = async () => {
        try {
            await analytics.logEvent('firmware_update_install', {serialId});
            setState(stateOptions.applying);
            setStatus('Installing Update');
            setInfo('Please wait for your control•r™ update to be installed.');
            await ModuleService.installFirmware();
            await analytics.logEvent('firmware_update_install_sucess', {serialId});
            setState(stateOptions.done);
            setTimeout(() => {
                setStatus('Update Installed');
                setInfo('');
                navigation.navigate('FirmwareReset');
            }, 600);
        } catch (err) {
            await analytics.logEvent('firmware_update_install_failure', {serialId, err});
            setState(stateOptions.uploadingComplete);
            setStatus('Update Install failed');
            setInfo('');
        }
    };

    const installProgress = async () => {
        if (state === stateOptions.skippedInitialState) {
            await uploadOtaUpdate();
        }
        if (state === stateOptions.uploadingComplete) {
            await executeUpdate();
        }
    };

    return (
        <View style={styles.appContainer}>
            <TitleBar
                navigation={navigation}
                title={'Software Update \n In-Progress'}
                backButton={true}
                backNav="back"
                subTitle={false}
                drawer={false}
                transparent={true}
            />
            <View style={styles.stepProgressLabel}>
                <View style={styles.progressLabel}>
                    <Text>Step 1:</Text>
                </View>
                <View style={styles.labelSpacer} />
                <View style={styles.progressLabel}>
                    <Text>Step 2:</Text>
                </View>
                <View style={styles.labelSpacer} />
                <View style={styles.progressLabel}>
                    <Text>Step 3:</Text>
                </View>
            </View>
            <View style={styles.stepProgress}>
                <View
                    style={{
                        ...styles.progressDot,
                        backgroundColor: step >= 1 ? '#94CB2A' : '#C1C1C1',
                    }}
                />
                <View
                    style={{
                        ...styles.progressSpacer,
                        backgroundColor: step >= 2 ? '#94CB2A' : '#C1C1C1',
                    }}
                />
                <View
                    style={{
                        ...styles.progressDot,
                        backgroundColor: step >= 2 ? '#94CB2A' : '#C1C1C1',
                    }}
                />
                <View
                    style={{
                        ...styles.progressSpacer,
                        backgroundColor: step === 3 ? '#94CB2A' : '#C1C1C1',
                    }}
                />
                <View style={{...styles.progressDot, backgroundColor: step === 3 ? '#94CB2A' : '#C1C1C1'}} />
            </View>
            <View
                style={{
                    ...styles.itemWindow,
                    flex: 0.8,
                    width: '90%',
                    borderRadius: 10,
                    marginBottom: 10,
                    padding: 20,
                    paddingTop: 50,
                    alignItems: 'center',
                }}>
                <Text
                    style={{
                        ...styles.h3,
                        fontSize: 16,
                        fontWeight: '500',
                        marginRight: 7,
                        marginLeft: 10,
                        marginBottom: 20,
                        color: '#000000',
                        textAlign: 'center',
                        width: '90%',
                    }}>
                    {status}
                </Text>
                <Text
                    style={{
                        ...styles.h3,
                        fontSize: 16,
                        fontWeight: '300',
                        marginRight: 7,
                        marginLeft: 10,
                        marginBottom: info ? 30 : 0,
                        textAlign: 'center',
                        color: '#697179',
                        width: '90%',
                    }}>
                    {info}
                </Text>
                <Progress.Circle
                    style={{alignItems: 'center', justifyContent: 'center'}}
                    size={150}
                    color={progress ? '#4EC32D' : '#697179'}
                    thickness={30}
                    borderWidth={5}
                    strokeCap="round"
                    endAngle={0.3}
                    indeterminate={progress}>
                    <View style={styles.loadingInner}>
                        {!progress && (
                            <Image
                                style={{
                                    position: 'absolute',
                                    marginBottom: 30,
                                    marginTop: 20,
                                    width: 78,
                                    height: 65,
                                }}
                                source={check}
                            />
                        )}
                    </View>
                </Progress.Circle>
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
                        display: progress ? 'none' : 'flex',
                    },
                ]}
                onPress={() => installProgress()}>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'right',
                        fontWeight: '500',
                        fontSize: 14,
                    }}>
                    {actionText}
                </Text>
            </Button>
        </View>
    );
};

export default FirmwareInstall;
