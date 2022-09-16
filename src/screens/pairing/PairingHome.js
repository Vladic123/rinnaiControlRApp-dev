/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {View, Text} from 'react-native';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import RinnaiLoader from '../../components/RinnaiLoader';
import styles from '../../styles/Style';
import {Storage} from 'aws-amplify';
import RNFetchBlob from 'rn-fetch-blob';
import {deviceActions} from '../../reducers/device';
const device = require('../../assets/images/Device.png');

const PairingHome = ({route, navigation}) => {
    const dispatch = useDispatch();
    const [loading, setLoader] = useState(false);
    const getOtaDownload = async () => {
        setLoader(true);
        let dirs = RNFetchBlob.fs.dirs;
        let location = dirs.DocumentDir + '/otaUpdate.tgz';

        await RNFetchBlob.fs.exists(location).then((exist) => {
            if (exist) {
                RNFetchBlob.fs.unlink(location).then(() => {
                    console.log('removed tmp file');
                });
            }
        });

        let otaUpdates = {};

        await Storage.list('', {level: 'public'})
            .then((result) => {
                result.map((item, key) => {
                    const otaItem = item.key;
                    const otaCheck = otaItem.split('.');
                    if (otaCheck[1] === 'tgz') {
                        const otaName = otaItem.split('_');
                        const version = otaName[0].split('-');
                        const ota = {
                            [version[1]]: otaItem,
                        };
                        otaUpdates = {...otaUpdates, ...ota};
                    }
                });

                const latestName = Object.values(otaUpdates).reverse();
                const latestNumber = Object.keys(otaUpdates).reverse();

                const update = {
                    updateVersion: latestNumber[0],
                    updateName: latestName[0],
                };

                console.log(update);
                dispatch(deviceActions.setPairing(update));

                Storage.get(latestName[0]).then((otaDownload) => {
                    RNFetchBlob.fs
                        .exists(location)
                        .then((exist) => {
                            if (exist) {
                                console.log(`File Exists: ${exist}`);
                                navigation.navigate('DeviceConnect');
                            } else {
                                RNFetchBlob.config({
                                    fileCache: true,
                                    path: location,
                                })
                                    .fetch('GET', otaDownload)
                                    .then((res) => {
                                        // the temp file path
                                        setLoader(false);
                                        navigation.navigate('DeviceConnect');
                                    });
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                });
            })
            .catch((err) => console.log(err));
    };

    return (
        <View style={styles.loginBox}>
            <RinnaiLoader modal={loading} />
            <TitleBar
                navigation={navigation}
                title="Before Starting"
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
                    flex: 0.9,
                    borderRadius: 10,
                    marginTop: 10,
                    marginBottom: 50,
                    padding: 20,
                    paddingTop: 30,
                }}>
                <Text
                    style={{
                        ...styles.h3,
                        fontSize: 18,
                        marginBottom: 30,
                        marginLeft: 10,
                        textAlign: 'left',
                        alignSelf: 'flex-start',
                    }}>
                    Have your Wi-Fi password ready
                </Text>
                <Text
                    style={{
                        ...styles.h3,
                        fontSize: 16,
                        fontWeight: '300',
                        marginBottom: 30,
                        marginRight: 10,
                        marginLeft: 10,
                        color: '#000000',
                    }}>
                    The module will only pair with a 2.4GHz network. If you aren’t sure what kind of network you have, please visit rinnai.us/wifi
                    before pairing.
                </Text>
                <Text
                    style={{
                        ...styles.h3,
                        fontSize: 16,
                        fontWeight: '300',
                        marginBottom: 30,
                        marginRight: 10,
                        marginLeft: 10,
                        color: '#000000',
                    }}>
                    Be near the control•r™ Module. You’ll need to interact with it to complete the setup.
                </Text>
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
                onPress={() => getOtaDownload()}>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'right',
                        fontWeight: '500',
                        fontSize: 14,
                    }}>
                    Begin Setup
                </Text>
            </Button>
            <Button full transparent onPress={() => navigation.navigate('Home')}>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'center',
                        fontWeight: 'normal',
                        fontSize: 12,
                    }}>
                    Cancel Device Pairing
                </Text>
            </Button>
        </View>
    );
};

export default PairingHome;
