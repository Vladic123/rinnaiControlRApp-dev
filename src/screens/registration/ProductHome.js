/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {KeyboardAvoidingView, TextInput, Text, View, Alert} from 'react-native';
import {Button} from 'native-base';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import {deviceActions} from '../../reducers/device';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {TouchableOpacity} from 'react-native-gesture-handler';
import API from '../../services/API';

const ProductHome = ({navigation}) => {
    const dispatch = useDispatch();
    const device = useSelector((state) => state.device?.view?.device);
    const [serial, setSerial] = useState(false);
    const [scanner, setScanner] = useState(true);
    const [details] = useState(device?.info);

    const displaySerialNumberMessage = (message, title = 'Error') => {
        Alert.alert(title, message, [{text: 'OK', onPress: () => console.log('ok')}], {cancelable: false});
    };

    const registerProduct = (model, serialNumber) => {
        const product = {
            serial: serialNumber,
            thingName: details.name,
            model: model,
        };
        dispatch(deviceActions.setRegistration(product)).then(() => navigation.navigate('ProductInfo'));
    };

    const validateSerialNumber = async (serialNumber) => {
        const verify = await API.serialNumberValidation(serialNumber);
        if (!verify.valid) {
            displaySerialNumberMessage(verify.message);
            return;
        }
        registerProduct(verify.product_info.model, serialNumber);
    };

    const checkSerial = async (serialNumber) => {
        if (!serialNumber) {
            displaySerialNumberMessage('Please Scan or Input Serial Number', 'Serial Number');
            return;
        }
        try {
            await validateSerialNumber(serialNumber);
        } catch (e) {
            displaySerialNumberMessage('Could not check the serial number');
        }
    };

    const onRead = async (value) => {
        setSerial(value.data);
        checkSerial(value.data);
    };

    const toggleScanner = () => {
        setScanner(!scanner);
    };

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
                        marginTop: 50,
                        marginBottom: 10,
                    }}>
                    Product Registration
                </Text>
                <Text
                    style={{
                        ...styles.h3,
                        fontWeight: '300',
                        fontSize: 14,
                        marginBottom: 50,
                        width: '90%',
                        textAlign: 'center',
                    }}>
                    Register your Rinnai product today to ensure you maximize your product’s extended labor plan and receive the latest updates from
                    Rinnai
                </Text>
                {scanner ? (
                    <TouchableOpacity style={{flex: 0.8, width: '100%', alignItems: 'center'}}>
                        <QRCodeScanner
                            onRead={(read) => onRead(read)}
                            flashMode={RNCamera.Constants.FlashMode.off}
                            fadeIn={false}
                            reactivate={true}
                            reactivateTimeout={5000}
                            showMarker={true}
                            containerStyle={{
                                backgroundColor: '#ffffff',
                                width: '100%',
                                overflow: 'hidden',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        />
                    </TouchableOpacity>
                ) : (
                    <KeyboardAvoidingView
                        style={{
                            width: '100%',
                            margin: 'auto',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        behavior="padding">
                        <View
                            style={{
                                ...styles.formField,
                                borderWidth: 1,
                            }}>
                            <Text style={styles.loginLabel}>SERIAL NUMBER</Text>
                            <TextInput
                                onChangeText={(txtSerial) => setSerial(txtSerial)}
                                style={styles.loginInput}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Ex. JE.BA-293392"
                                placeholderTextColor="#697179"
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    </KeyboardAvoidingView>
                )}
            </View>
            <Button
                full
                transparent
                style={[
                    styles.itemWindow,
                    {
                        width: '90%',
                        alignSelf: 'center',
                        marginTop: 10,
                    },
                ]}
                onPress={() => toggleScanner()}>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'right',
                        fontWeight: '500',
                        fontSize: 14,
                    }}>
                    {scanner ? 'Type Serial Number' : 'Scan Serial Number'}
                </Text>
            </Button>
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
                onPress={() => checkSerial(serial)}>
                <Text
                    style={{
                        color: '#000000',
                        textAlign: 'right',
                        fontWeight: '500',
                        fontSize: 14,
                    }}>
                    Next
                </Text>
            </Button>
        </View>
    );
};

export default ProductHome;
