/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, TextInput, Text, Alert, KeyboardAvoidingView} from 'react-native';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import {deviceActions} from '../../reducers/device';
import RinnaiLoader from '../../components/RinnaiLoader';
import API from '../../services/API';

const EditHeater = ({route, navigation}) => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.device.view);
    const device = useSelector((state) => state.device.view.device);
    const name = data.name;
    const [deviceName, setDeviceName] = useState(name);
    const [loading, setLoading] = useState(false);

    const setHeaterName = () => {
        if (deviceName) {
            setLoading(true);
            let updateDevice = {};
            updateDevice = device;
            updateDevice = {...updateDevice, device_name: deviceName};
            delete updateDevice.updatedAt;
            delete updateDevice.createdAt;
            delete updateDevice.monitoring;
            delete updateDevice.schedule;
            delete updateDevice.info;
            delete updateDevice.errorLogs;
            delete updateDevice.registration;
            delete updateDevice.activity;
            delete updateDevice.shadow;
            delete updateDevice.user;
            console.log(updateDevice);
            API.updateUserDevice(updateDevice).then((res) => {
                API.getViewDevice(device.id, device.device_name).then(async (newView) => {
                    await dispatch(deviceActions.setDeviceView(newView));
                    setLoading(false);
                    navigation.goBack();
                });
            });
        }
    };

    const checkLength = (val) => {
        if (val.length > 15) {
            Alert.alert(
                'Tankless name too long',
                'Tankless name cannot contain more than 15 characters',
                [
                    {
                        text: 'OK',
                        onPress: () => console.log('OK Pressed'),
                    },
                ],
                {cancelable: false},
            );
        } else {
            setDeviceName(val);
        }
    };

    return (
        <View style={styles.appContainer}>
            <RinnaiLoader modal={loading} />
            <TitleBar
                navigation={navigation}
                title="Update Your Tankless Name"
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
                }}>
                <Text style={{...styles.h3, fontWeight: '300', marginBottom: 30}}>
                    Give your tankless a unique name! This will help you organize your personalized settings in the future.
                </Text>
                <KeyboardAvoidingView
                    style={{
                        width: '100%',
                        margin: 'auto',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    behavior="padding">
                    <View style={{...styles.formField, borderWidth: 1}}>
                        <Text style={styles.loginLabel}>Heater Name:</Text>
                        <TextInput
                            onChangeText={(device_name) => checkLength(device_name)}
                            style={styles.loginInput}
                            autoCapitalize="none"
                            placeholder="Ex. 'Home Basement', 'Lake House'"
                            placeholderTextColor="#697179"
                            underlineColorAndroid="transparent"
                            keyboardAppearance="dark"
                            value={deviceName}
                        />
                    </View>
                    <Text
                        style={{
                            ...styles.loginLabel,
                            textTransform: 'lowercase',
                            color: '#b9b9c3',
                        }}>
                        maximum 15 characters
                    </Text>
                </KeyboardAvoidingView>
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
                onPress={() => setHeaterName()}>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'right',
                        fontWeight: '500',
                        fontSize: 14,
                    }}>
                    SAVE
                </Text>
            </Button>
            <Button full transparent onPress={() => navigation.goBack()}>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'center',
                        fontWeight: 'normal',
                        fontSize: 12,
                    }}>
                    Cancel
                </Text>
            </Button>
        </View>
    );
};

export default EditHeater;
