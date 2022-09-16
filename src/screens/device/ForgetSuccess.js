/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Text, View} from 'react-native';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import {authActions} from '../../reducers/auth';

const ForgetSuccess = ({route, navigation}) => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.device.view);
    const device = useSelector((state) => state.device.view.device);
    const name = device.device_name ? device.device_name : data.name;
    const userData = useSelector((state) => state.auth.account);

    useEffect(() => {
        dispatch(authActions.fetchUserByEmail(userData.email));
    }, []);

    return (
        <View style={styles.appContainer}>
            <TitleBar backButton={true} backNav="menu" navigation={navigation} title={name.toUpperCase()} subTitle="Forget Device" drawer={false} />
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
                        fontSize: 14,
                        fontWeight: '300',
                        margin: 20,
                        textAlign: 'center',
                    }}>
                    {`control•r™ has been disconnected. ${name} is no longer associated to your account.`}
                </Text>
            </View>
        </View>
    );
};

export default ForgetSuccess;
