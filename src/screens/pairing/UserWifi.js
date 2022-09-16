/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, ScrollView, RefreshControl, Text, Image, Alert} from 'react-native';
import {Button} from 'native-base';
import styles from '../../styles/Style';
import TitleBar from '../../components/TitleBar';
import {deviceActions} from '../../reducers/device';
import RinnaiLoader from '../../components/RinnaiLoader';
import ModuleService from '../../services/ModuleService';

const wifiStrong = require('../../assets/images/wifi-strong.png');
const wifiMedium = require('../../assets/images/wifi-medium.png');
const wifiWeak = require('../../assets/images/wifi-weak.png');
const selectedCheck = require('../../assets/images/selected-check.png');

const UserWifi = ({route, navigation}) => {
    const dispatch = useDispatch();
    const [initialLoading, setInitialLoading] = useState(true);
    const pairing = useSelector((state) => state.device.pairing);
    const [wifiNetwork, setWifiNetwork] = useState('');
    const [networks, setNetworks] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    async function fetchNetworks() {
        const data = await ModuleService.getWifiNetworks();
        if (data.length > 0) {
            setNetworks(data);
        } else if (!networks || networks.length === 0) {
            setNetworks([]);
        }
    }

    let retryNetworkFetchHandle;
    useEffect(() => {
        const retry = async () => {
            try {
                setRefreshing(true);
                await fetchNetworks();
            } finally {
                setRefreshing(false);
                setInitialLoading(false);
            }
        };
        if (!networks || networks.length === 0) {
            const delay = initialLoading ? 0 : 3000;
            retryNetworkFetchHandle = setTimeout(retry, delay);
        }
    }, [networks]);

    const onRefresh = React.useCallback(async () => {
        try {
            clearTimeout(retryNetworkFetchHandle);
            setRefreshing(true);
            await fetchNetworks();
        } finally {
            setRefreshing(false);
        }
    }, []);

    const setWifiPassword = () => {
        if (wifiNetwork) {
            const ssid = wifiNetwork;
            const update = {...pairing, ssid};
            dispatch(deviceActions.setPairing(update)).then(() => {
                navigation.navigate('WifiPassword');
            });
        } else {
            Alert.alert('Wifi Error', 'Must fill out wifi network', [{text: 'OK', onPress: () => console.log('OK Pressed')}], {cancelable: false});
        }
    };

    const wifiNetworks = (signal, ssid, key) => {
        let wifi;
        if (signal >= -67) {
            wifi = wifiStrong;
        } else if (signal < -67 && signal >= -70) {
            wifi = wifiMedium;
        } else if (signal < -70) {
            wifi = wifiWeak;
        }
        return (
            <Button style={styles.wifiSelect} key={key} onPress={() => setWifiNetwork(ssid)}>
                <View style={styles.signal}>
                    <Image style={{height: 15, width: 20}} source={wifiNetwork === ssid ? selectedCheck : wifi} />
                </View>
                <View style={styles.ssid}>
                    <Text
                        style={{
                            ...styles.h2,
                            color: wifiNetwork === ssid ? '#306F99' : '#000000',
                        }}>
                        {ssid}
                    </Text>
                </View>
            </Button>
        );
    };

    const listNetworks = () => {
        if (!networks) {
            return <Text style={styles.h1}>No Networks Available</Text>;
        }

        return Object.values(networks)
            .sort((a, b) => parseFloat(b.signal) - parseFloat(a.signal))
            .reduce((accum, network, index) => {
                const scrubbedSsid = network.ssid
                    .trim()
                    .split('')
                    .filter((s) => s !== '\u0000') // some ssid's only consist of these and render as blank
                    .join('');

                if (!scrubbedSsid) {
                    return accum;
                }

                const ssidAlreadyExists = accum.some((n) => n.ssid === network.ssid);

                if (ssidAlreadyExists) {
                    return accum;
                }

                return [...accum, wifiNetworks(network.signal, scrubbedSsid, index)];
            }, []);
    };

    return (
        <View style={styles.appContainer}>
            <RinnaiLoader modal={initialLoading} />
            <TitleBar
                navigation={navigation}
                title="Connect to your Wi-Fi network"
                backButton={true}
                backNav="back"
                subTitle={false}
                drawer={false}
                transparent={true}
            />
            <View style={{padding: 20}}>
                <Text
                    style={{
                        ...styles.h3,
                        fontWeight: '300',
                        fontSize: 12,
                        marginBottom: 30,
                        lineHeight: 18,
                        color: '#000000',
                    }}>
                    Choose the Wi-Fi network you want your module to use. Your control•r™ Module will only work with 2.4GHz networks. If you have more
                    than one network, choose the network closest to the Rinnai unit.
                </Text>
            </View>
            <View
                style={{
                    ...styles.formBox,
                    backgroundColor: '#ffffff',
                    flex: 0.8,
                    borderRadius: 10,
                    marginTop: 10,
                    marginBottom: 50,
                    padding: 10,
                }}>
                <ScrollView style={{width: '100%'}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                    {listNetworks()}
                </ScrollView>
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
                onPress={() => setWifiPassword()}>
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

export default UserWifi;
