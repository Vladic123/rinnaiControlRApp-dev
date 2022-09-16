/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useSelector} from 'react-redux';
import {Text, View} from 'react-native';
import {Button} from 'native-base';
import Amplify from 'aws-amplify';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import awsconfig from '../../aws-exports';

Amplify.configure(awsconfig);

const RegistrationSuccess = ({navigation}) => {
    const device = useSelector((state) => state.device.view.device);

    return (
        <View style={styles.appContainer}>
            <TitleBar
                backButton={true}
                backNav="menu"
                navigation={navigation}
                title={device?.device_name?.toUpperCase()}
                subTitle={false}
                drawer={false}
            />
            <View
                style={{
                    ...styles.formBox,
                    backgroundColor: 'transparent',
                    flex: 1,
                    borderRadius: 10,
                    marginTop: 0,
                    marginBottom: 50,
                }}>
                <Text
                    style={{
                        ...styles.h3,
                        fontWeight: '300',
                        fontSize: 22,
                        marginBottom: 10,
                    }}>
                    Product Registration Complete
                </Text>
            </View>
            <Button
                full
                transparent
                style={[
                    styles.itemWindow,
                    {
                        borderRadius: 0,
                        minHeight: 90,
                        width: '100%',
                        alignSelf: 'center',
                        marginTop: 10,
                    },
                ]}
                onPress={() => navigation.navigate('Home')}>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'right',
                        fontWeight: '500',
                        fontSize: 14,
                    }}>
                    Complete
                </Text>
            </Button>
        </View>
    );
};

export default RegistrationSuccess;
