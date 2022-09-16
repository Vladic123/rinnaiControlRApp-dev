/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View} from 'react-native';
import Amplify from 'aws-amplify';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import awsconfig from '../../aws-exports';

Amplify.configure(awsconfig);

const Support = ({navigation}) => {
    return (
        <View style={styles.appContainer}>
            <TitleBar backButton={true} navigation={navigation} title="Support" subTitle={false} drawer={true} />
            <View
                style={{
                    ...styles.formBox,
                    backgroundColor: 'transparent',
                    flex: 1,
                    borderRadius: 10,
                    marginTop: 0,
                    marginBottom: 50,
                    padding: 20,
                }}>
                <Text style={{...styles.h3, fontWeight: '300', marginBottom: 30}}>Support</Text>

                <Text
                    style={{
                        ...styles.h3,
                        width: '100%',
                        fontWeight: '500',
                        fontSize: 16,
                        marginTop: 20,
                    }}>
                    Frequently Asked Questions
                </Text>
            </View>
        </View>
    );
};

export default Support;
