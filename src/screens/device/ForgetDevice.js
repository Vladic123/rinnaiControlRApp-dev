/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Text, View, Alert} from 'react-native';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import {authActions} from '../../reducers/auth';
import RinnaiLoader from '../../components/RinnaiLoader';
import API from '../../services/API';

const ForgetDevice = ({navigation}) => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.device.view);
    const device = useSelector((state) => state.device.view.device);
    const name = device.device_name ? device.device_name : data.name;
    const userData = useSelector((state) => state.auth.account);
    const [loading, setLoading] = useState(false);
    const forgetControlRMessage =
        'By choosing to Forget Device, the associated heater will no longer be linked to your account and you will no longer have mobile access.' +
        ' All schedules and personal information tied to the heater will be deleted.';

    useEffect(() => {
        dispatch(authActions.fetchUserByEmail(userData.email));
    }, []);

    const deleteDevice = async () => {
        setLoading(true);
        const remove = {
            id: device.id,
        };
        await API.removeUserDevice(remove);
        await dispatch(authActions.fetchUserByEmail(userData.email));
        setLoading(false);
        navigation.navigate('Home');
    };

    const forgetDevice = async () => {
        Alert.alert(
            `Are you sure you want to forget ${name} control•r?`,
            forgetControlRMessage,
            [
                {
                    text: `Forget ${name} control•r`,
                    onPress: () => deleteDevice(),
                },
                {
                    text: 'Cancel',
                    onPress: () => console.log('cancel'),
                },
            ],
            {cancelable: false},
        );
    };

    return (
        <View style={styles.appContainer}>
            <RinnaiLoader modal={loading} />
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
                    {forgetControlRMessage}
                </Text>
                <Button
                    full
                    transparent
                    style={[
                        styles.itemWindow,
                        {
                            width: '100%',
                            alignSelf: 'center',
                            marginTop: 10,
                        },
                    ]}
                    onPress={() => forgetDevice()}>
                    <Text
                        style={{
                            color: '#000000',
                            textAlign: 'right',
                            fontWeight: '500',
                            fontSize: 14,
                        }}>
                        {`Forget ${name.toUpperCase()}`}
                    </Text>
                </Button>
            </View>
        </View>
    );
};

export default ForgetDevice;
