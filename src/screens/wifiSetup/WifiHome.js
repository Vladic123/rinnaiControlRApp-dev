/* eslint-disable react-native/no-inline-styles */
import {View, Text} from 'react-native';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import React from 'react';

const WifiHome = ({navigation}) => {
    return (
        <View style={styles.loginBox}>
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
                        color: '#697179',
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
                        color: '#697179',
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
                onPress={() => navigation.navigate('APMode')}>
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

export default WifiHome;
