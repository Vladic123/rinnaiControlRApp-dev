/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text} from 'react-native';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import Amplify from 'aws-amplify';
import awsconfig from '../../aws-exports';

Amplify.configure(awsconfig);

const Firmware = ({navigation, route}) => {
    return (
        <View style={styles.appContainer}>
            <TitleBar
                navigation={navigation}
                title={'Software Update \n Required'}
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
                    flex: 0.8,
                    borderRadius: 10,
                    marginTop: 50,
                    marginBottom: 50,
                    padding: 20,
                    paddingTop: 50,
                    alignItems: 'flex-start',
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
                    An update is required to get your control•r™ Module running on the latest software.
                </Text>
                <Text
                    style={{
                        ...styles.h3,
                        fontSize: 16,
                        fontWeight: '300',
                        marginRight: 7,
                        marginLeft: 8,
                        color: '#697179',
                    }}>
                    This will take around 3 minutes. Please keep the app open while the Software update is in progress. Please click the button below
                    to upgrade your system to the new control•r™ 2.0 experience.
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
                onPress={() => navigation.navigate('FirmwareInstall', route?.params?.serialId)}>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'right',
                        fontWeight: '500',
                        fontSize: 14,
                    }}>
                    Start Software Update
                </Text>
            </Button>
        </View>
    );
};

export default Firmware;
