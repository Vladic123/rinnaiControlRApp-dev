/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import * as Progress from 'react-native-progress';
import {useSelector} from 'react-redux';
import {View, Text, Image, ScrollView} from 'react-native';
import styles from '../../styles/Style';
import TitleBar from '../../components/TitleBar';
import {Divider} from 'react-native-elements';
import useInterval from '../../hooks/useInterval';
import FadeInOutView from '../../components/finish_wifi/FadeInOutView';
import RestAPI from '../../services/API';
const recirculation = require('../../assets/images/recirculation.png');

const FinishWifiSetup = ({navigation}) => {
    const pairing = useSelector((state) => state.device.pairing);
    const userData = useSelector((state) => state.auth.account.userData);
    const device = useSelector((state) => state.device.view.device);
    const [timer, setTimer] = useState(20000);
    const maxConnectionChecks = 9;
    let connectionChecks = 0;

    useInterval(() => {
        // check for device connectivity
        checkConnection();
        if (connectionChecks >= maxConnectionChecks) {
            setTimer(null);
            navigation.navigate('ConnectFail');
        }
        connectionChecks++;
    }, timer);

    const displayTime = 12500;
    const fadeDuration = 1250;

    const getAnalyticsLog = () => {
        return {
            userId: userData?.id,
            dsn: device?.dsn,
            serial: device?.id,
            screen: 'FinishWifiSetup',
        };
    };

    const checkConnection = async () => {
        try {
            await RestAPI.getDeviceData(pairing.id, getAnalyticsLog());
            setTimer(null);
            navigation.navigate('ConnectSuccess');
        } catch (err) {
            console.error(err);
        }
    };

    const headlineCarouselData = {
        items: [
            {
                title: 'Make the most of your\n control•r™ experience:',
                details: 'a',
                src: recirculation,
                values: [1, 0, 0, 1, 1],
                timings: [4 * displayTime + 6 * fadeDuration, fadeDuration, displayTime + 2 * fadeDuration, fadeDuration, 0],
            },
            {
                title: 'Hang tight!',
                details: 'b',
                src: recirculation,
                values: [0, 1, 1, 0, 0],
                timings: [4 * displayTime + 7 * fadeDuration, fadeDuration, displayTime, fadeDuration, fadeDuration],
            },
        ],
    };

    const carouselData = {
        items: [
            {
                src: recirculation,
                title: 'On-Demand Recirculation',
                details: 'Begin recirculation when you want directly from the app.',
                values: [1, 0, 0, 1, 1],
                timings: [displayTime, fadeDuration, 4 * displayTime + 8 * fadeDuration, fadeDuration, 0],
            },
            {
                src: recirculation,
                title: 'Recirc. Scheduling & Vacation Mode',
                details: 'Create a custom recirculation schedule and set up a vacation mode.',
                values: [0, 1, 1, 0, 0],
                timings: [displayTime + fadeDuration, fadeDuration, displayTime, fadeDuration, 3 * displayTime + 7 * fadeDuration],
            },
            {
                src: recirculation,
                title: 'Rinnai PRO Monitoring',
                details: 'Send a request for your tankless to be monitored by a Rinnai Pro.',
                values: [0, 1, 1, 0, 0],
                timings: [
                    displayTime + fadeDuration + (displayTime + 2 * fadeDuration),
                    fadeDuration,
                    displayTime,
                    fadeDuration,
                    2 * displayTime + 5 * fadeDuration,
                ],
            },
            {
                src: recirculation,
                title: 'Register Your Tankless',
                details: 'Maximize your warranty benefits, and protect your investment by registering your tankless water heater.',
                values: [0, 1, 1, 0, 0],
                timings: [
                    displayTime + fadeDuration + 2 * (displayTime + 2 * fadeDuration),
                    fadeDuration,
                    displayTime,
                    fadeDuration,
                    displayTime + 3 * fadeDuration,
                ],
            },
            {
                src: undefined,
                title: 'We’re working to finish your control•r™ setup…',
                details: '',
                values: [0, 1, 1, 0, 0],
                timings: [displayTime + fadeDuration + 3 * (displayTime + 2 * fadeDuration), fadeDuration, displayTime, fadeDuration, fadeDuration],
            },
        ],
    };

    const headlineCarousel = () => {
        return headlineCarouselData.items.map((item) => (
            <FadeInOutView key={item.title} style={styles.stackInner} values={item.values} timings={item.timings}>
                <Text style={{...styles.h1, fontWeight: '300', textAlign: 'center'}}>{item.title}</Text>
            </FadeInOutView>
        ));
    };

    const carousel = () => {
        return carouselData.items.map((item) => (
            <FadeInOutView key={item.title} style={{...styles.stackInner, position: 'absolute'}} values={item.values} timings={item.timings}>
                <View style={{...styles.stackCarousel, justifyContent: 'center'}}>
                    <View style={{padding: 20}}>
                        <Image source={item.src} />
                    </View>
                    <View>
                        <Text style={{fontWeight: 'bold', marginBottom: 10}}>{item.title}</Text>
                        <Text>{item.details}</Text>
                    </View>
                </View>
            </FadeInOutView>
        ));
    };

    return (
        <ScrollView>
            <View style={styles.loginBox}>
                <TitleBar
                    navigation={navigation}
                    title="Finishing setup..."
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
                        flex: 1,
                        borderRadius: 10,
                        marginTop: 30,
                        marginBottom: 30,
                        padding: 20,
                        paddingTop: 50,
                        justifyContent: 'flex-start',
                    }}>
                    <View style={styles.loadingOuter}>
                        <Progress.Circle
                            style={{alignItems: 'center', justifyContent: 'center'}}
                            size={150}
                            color={'#4EC32D'}
                            thickness={30}
                            borderWidth={5}
                            strokeCap="round"
                            endAngle={0.3}
                            indeterminate={true}>
                            <View style={styles.loadingInner} />
                        </Progress.Circle>
                    </View>
                    <Text
                        style={{
                            ...styles.h3,
                            fontSize: 14,
                            fontWeight: '300',
                            marginTop: 30,
                            marginBottom: 30,
                            textAlign: 'center',
                            width: '90%',
                        }}>
                        {'Please wait a few minutes while\ncontrol•r™ finishes setup...'}
                    </Text>
                    <Divider style={{backgroundColor: 'black', height: 0.5, width: '40%', marginBottom: 20}} />
                    <View style={{...styles.stackOuter, height: 200}}>{headlineCarousel()}</View>

                    <View style={{...styles.stackCarouselContainer, height: 50}}>
                        <View style={styles.stackOuter}>{carousel()}</View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default FinishWifiSetup;
