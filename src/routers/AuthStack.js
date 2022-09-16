import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import Forgot from '../screens/auth/Forgot';
import Verify from '../screens/auth/Verify';
import MyAccount from '../screens/user/MyAccount';
import EditAddress from '../screens/user/EditAddress';
import UpdatePassword from '../screens/user/UpdatePassword';
import RinnaiStack from './RinnaiStack';

const Stack = createStackNavigator();

export function ProfileStack() {
    return (
        <Stack.Navigator headerMode="none" initialRouteName="MyAccount">
            <Stack.Screen name="MyAccount" component={MyAccount} />
            <Stack.Screen name="EditAddress" component={EditAddress} />
            <Stack.Screen name="UpdatePassword" component={UpdatePassword} />
        </Stack.Navigator>
    );
}

export function LogOutStack() {
    return (
        <Stack.Navigator headerMode="none" initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Verify" component={Verify} />
            <Stack.Screen name="Forgot" component={Forgot} />
            <Stack.Screen name="Home" component={RinnaiStack} />
        </Stack.Navigator>
    );
}

function AuthStack() {
    return (
        <NavigationContainer>
            <Stack.Navigator headerMode="none" initialRouteName="Login">
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="Verify" component={Verify} />
                <Stack.Screen name="Forgot" component={Forgot} />
                <Stack.Screen name="Home" component={RinnaiStack} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AuthStack;
