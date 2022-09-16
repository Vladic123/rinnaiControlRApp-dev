/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {KeyboardAvoidingView, TextInput, Text, View, TouchableOpacity, ScrollView, Platform} from 'react-native';
import {Button} from 'native-base';
import Amplify from 'aws-amplify';
import TitleBar from '../../components/TitleBar';
import styles from '../../styles/Style';
import awsconfig from '../../aws-exports';
import {SliderBox} from 'react-native-image-slider-box';
import API from '../../services/API';

const slide = require('../../assets/images/monitor_slide.png');

Amplify.configure(awsconfig);
const SignUp = ({navigation}) => {
    const data = useSelector((state) => state.device.view);
    const [search, setSearch] = useState('email');
    const [results, setResults] = useState([]);
    const device = useSelector((state) => state.device.view.device);
    const name = device.device_name ? device.device_name : data.name;

    const searchDealer = (dealer, find) => {
        if (find === 'company') {
            API.searchUserByCompany(dealer).then((users) => {
                setResults(users);
            });
        } else {
            API.searchUserByEmail(dealer).then((users) => {
                console.log(users);
                setResults(users);
            });
        }
    };

    const listDealers = () => {
        if (results && results.length > 0) {
            return results.map((user, key) => {
                console.log(user);
                if (user.roles && user.roles.includes('Dealer')) {
                    return (
                        <TouchableOpacity style={styles.searchDealer} onPress={() => navigation.navigate('Confirm', user)} key={key}>
                            <View>
                                <Text style={{...styles.h3, fontSize: 14}}>{user.email}</Text>
                                <Text
                                    style={{
                                        ...styles.h3,
                                        fontWeight: '300',
                                        fontSize: 14,
                                    }}>
                                    {user.city}, {user.state} {user.zip}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                }
            });
        }
    };

    return (
        <View style={styles.appContainer}>
            <TitleBar backButton={true} backNav="menu" navigation={navigation} title={name.toUpperCase()} subTitle={false} drawer={false} />
            <KeyboardAvoidingView
                style={{
                    flex: 1,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingBottom: 0,
                }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.select({
                    ios: 0,
                    android: 130,
                })}>
                <ScrollView style={{flex: 1, width: '100%'}}>
                    <View
                        style={{
                            ...styles.formBox,
                            alignSelf: 'center',
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
                            Rinnai Pro Monitoring
                        </Text>
                        <View style={{flexDirection: 'row', marginBottom: 50}}>
                            <SliderBox
                                images={[slide]}
                                sliderBoxHeight={200}
                                onCurrentImagePressed={(index) => console.warn(`image ${index} pressed`)}
                                dotColor="#697179"
                                inactiveDotColor="#90A4AE"
                                resizeMode="contain"
                                dotStyle={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    marginHorizontal: 0,
                                    padding: 0,
                                    marginBottom: 10,
                                    backgroundColor: 'rgba(128, 128, 128, 0.92)',
                                }}
                                ImageComponentStyle={{
                                    borderRadius: 15,
                                    padding: 20,
                                    width: '90%',
                                    marginTop: 5,
                                    marginBottom: 10,
                                }}
                            />
                        </View>
                        <Text
                            style={{
                                ...styles.h3,
                                fontWeight: '500',
                                fontSize: 16,
                                marginBottom: 20,
                            }}>
                            Send your Rinnai Pro a monitoring request
                        </Text>
                        <View
                            style={{
                                padding: 0,
                                marginBottom: 10,
                                flexDirection: 'row',
                            }}>
                            <Button
                                full
                                transparent
                                style={[
                                    styles.itemWindow,
                                    {
                                        borderRadius: 0,
                                        minHeight: 0,
                                        flex: 1,
                                        margin: 2,
                                        alignSelf: 'center',
                                    },
                                ]}
                                onPress={() => setSearch('email')}>
                                <Text
                                    style={{
                                        color: '#000000',
                                        textAlign: 'right',
                                        fontWeight: '500',
                                        fontSize: 14,
                                    }}>
                                    Search By Email
                                </Text>
                            </Button>
                            <Button
                                full
                                transparent
                                style={[
                                    styles.itemWindow,
                                    {
                                        borderRadius: 0,
                                        minHeight: 0,
                                        flex: 1,
                                        margin: 2,
                                        alignSelf: 'center',
                                    },
                                ]}
                                onPress={() => setSearch('company')}>
                                <Text
                                    style={{
                                        color: '#000000',
                                        textAlign: 'right',
                                        fontWeight: '500',
                                        fontSize: 14,
                                    }}>
                                    Search By Company
                                </Text>
                            </Button>
                        </View>
                        {search === 'email' && (
                            <View style={{...styles.formField, borderWidth: 1}}>
                                <Text style={styles.loginLabel}>Search by email address</Text>
                                <TextInput
                                    onChangeText={(dealer) => searchDealer(dealer, 'email')}
                                    style={styles.loginInput}
                                    autoCapitalize="none"
                                    placeholder="Ex. 'Weekday Mornings'"
                                    placeholderTextColor="#000000"
                                    underlineColorAndroid="transparent"
                                    keyboardAppearance="dark"
                                />
                            </View>
                        )}
                        {search === 'company' && (
                            <View style={{...styles.formField, borderWidth: 1}}>
                                <Text style={styles.loginLabel}>Search by Company</Text>
                                <TextInput
                                    onChangeText={(dealer) => searchDealer(dealer, 'company')}
                                    style={styles.loginInput}
                                    autoCapitalize="none"
                                    placeholder="Ex. 'Weekday Mornings'"
                                    placeholderTextColor="#000000"
                                    underlineColorAndroid="transparent"
                                    keyboardAppearance="dark"
                                />
                            </View>
                        )}
                        <ScrollView
                            style={{
                                flex: 1,
                                overflow: 'hidden',
                                borderRadius: 10,
                                backgroundColor: '#FEFCFC',
                                width: '100%',
                                height: 200,
                                padding: 0,
                            }}>
                            {listDealers()}
                        </ScrollView>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default SignUp;
