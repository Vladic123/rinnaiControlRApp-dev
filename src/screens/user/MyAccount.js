/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useSelector} from 'react-redux';
import {ScrollView, TextInput, Text, View, StyleSheet} from 'react-native';
import Amplify from 'aws-amplify';
import TitleBar from '../../components/TitleBar';
import awsconfig from '../../aws-exports';
import {TouchableOpacity} from 'react-native-gesture-handler';
import styles from '../../styles/Style';
import accountStyles from '../../styles/Account';

Amplify.configure(awsconfig);

const MyAccount = ({navigation}) => {
    const userData = useSelector((state) => state.auth.account);

    return (
        <View style={styles.appContainer}>
            <TitleBar backButton={true} backNav="back" navigation={navigation} title="" subTitle={false} drawer={true} />
            <View
                style={{
                    ...styles.formBox,
                    backgroundColor: 'transparent',
                    flex: 1,
                    borderRadius: 10,
                    marginTop: 0,
                    marginBottom: 20,
                    paddingBottom: 0,
                }}>
                <Text
                    style={{
                        ...styles.h3,
                        fontWeight: '300',
                        fontSize: 22,
                        marginBottom: 20,
                    }}>
                    My Account
                </Text>
                <ScrollView style={{flex: 1, width: '100%'}}>
                    <View
                        style={{
                            ...styles.itemWindow,
                            padding: 0,
                            marginBottom: 10,
                        }}>
                        <View style={accountStyles.accountItem}>
                            <View />
                            <View style={accountStyles.accountLabel}>
                                <Text style={{...styles.h3, fontSize: 12}}>Name</Text>
                            </View>
                            <View style={accountStyles.accountDetail}>
                                <Text style={accountStyles.accountText}>{userData.name}</Text>
                            </View>
                        </View>
                        <View style={accountStyles.accountItem}>
                            <View />
                            <View style={accountStyles.accountLabel}>
                                <Text style={{...styles.h3, fontSize: 12}}>Email</Text>
                            </View>
                            <View style={accountStyles.accountDetail}>
                                <Text style={accountStyles.accountText}>{userData.email}</Text>
                            </View>
                        </View>
                        <View style={accountStyles.accountItem}>
                            <View />
                            <View style={accountStyles.accountLabel}>
                                <Text style={{...styles.h3, fontSize: 12}}>Phone Number</Text>
                            </View>
                            <View style={accountStyles.accountDetail}>
                                <Text style={accountStyles.accountText}>{userData.phone}</Text>
                            </View>
                        </View>
                        <View style={accountStyles.accountItem}>
                            <View />
                            <View style={accountStyles.accountLabel}>
                                <Text style={{...styles.h3, fontSize: 12}}>Password</Text>
                            </View>
                            <View style={accountStyles.accountDetail}>
                                <TextInput
                                    secureTextEntry
                                    style={{
                                        ...styles.textInput,
                                        marginBottom: 5,
                                    }}
                                    autoCapitalize="none"
                                    placeholderTextColor="#000000"
                                    underlineColorAndroid="transparent"
                                    keyboardAppearance="dark"
                                    readOnly
                                    value="12345667"
                                />
                                <TouchableOpacity style={buttonStyle.button} onPress={() => navigation.navigate('UpdatePassword')}>
                                    <Text style={buttonStyle.buttonText}>Change Password</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={accountStyles.accountItem}>
                            <View />
                            <View style={accountStyles.accountLabel}>
                                <Text style={{...styles.h3, fontSize: 12}}>Address</Text>
                            </View>
                            <View style={accountStyles.accountDetail}>
                                <Text style={accountStyles.accountText}>{userData.street}</Text>
                                <Text style={{...accountStyles.accountText, marginBottom: 10}}>
                                    {userData.city}, {userData.state}
                                </Text>
                                <TouchableOpacity style={buttonStyle.button} onPress={() => navigation.navigate('EditAddress')}>
                                    <Text style={buttonStyle.buttonText}>{userData.street ? 'Edit' : 'Add'} Address</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

const buttonStyle = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderBottomWidth: 1,
        borderBottomColor: '#D8D8D8',
        paddingRight: 10,
        paddingBottom: 10,
    },
    button: {
        backgroundColor: '#E5E9ED',
        borderRadius: 30,
        padding: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontWeight: '700',
        color: '#2E353C',
        textAlign: 'center',
        fontSize: 12,
    },
});

export default MyAccount;
