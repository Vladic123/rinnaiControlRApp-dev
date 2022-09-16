import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import PairingHome from '../screens/pairing/PairingHome';
import ConfirmAPMode from '../screens/pairing/ConfirmAPMode';
import DeviceConnect from '../screens/pairing/DeviceConnect';
import WifiSetup from '../screens/pairing/WifiSetup';
import UserWifi from '../screens/pairing/UserWifi';
import UserDevice from '../screens/pairing/UserDevice';
import DeviceName from '../screens/pairing/DeviceName';
import WifiPassword from '../screens/pairing/WifiPassword';
import WifiCheck from '../screens/pairing/WifiCheck';
import CheckNetwork from '../screens/pairing/CheckNetwork';
import FactoryReset from '../screens/pairing/FactoryReset';
import Firmware from '../screens/pairing/Firmware';
import FirmwareInstall from '../screens/pairing/FirmwareInstall';
import FirmwareReset from '../screens/pairing/FirmwareReset';
import ConnectWifi from '../screens/pairing/ConnectWifi';
import ConfirmUpdate from '../screens/pairing/ConfirmUpdate';
import DeviceInfo from '../screens/device/DeviceInfo';

import WifiHome from '../screens/wifiSetup/WifiHome';
import APMode from '../screens/wifiSetup/APMode';
import ConnectRinnai from '../screens/wifiSetup/ConnectRinnai';
import CheckWifi from '../screens/wifiSetup/CheckWifi';
import FinishWifiSetup from '../screens/wifiSetup/FinishWifiSetup';
import ConnectSuccess from '../screens/wifiSetup/ConnectSuccess';
import ConnectFail from '../screens/wifiSetup/ConnectFail';

const Stack = createStackNavigator();

function PairingStack() {
    return (
        <Stack.Navigator headerMode="none" initialRouteName="PairingHome">
            <Stack.Screen name="PairingHome" component={PairingHome} />
            <Stack.Screen name="DeviceConnect" component={DeviceConnect} />
            <Stack.Screen name="ConfirmAPMode" component={ConfirmAPMode} />
            <Stack.Screen name="FactoryReset" component={FactoryReset} />
            <Stack.Screen name="CheckNetwork" component={CheckNetwork} />
            <Stack.Screen name="Firmware" component={Firmware} />
            <Stack.Screen name="FirmwareReset" component={FirmwareReset} />
            <Stack.Screen name="ConfirmUpdate" component={ConfirmUpdate} />
            <Stack.Screen name="ConnectWifi" component={ConnectWifi} />
            <Stack.Screen name="FirmwareInstall" component={FirmwareInstall} />
            <Stack.Screen name="WifiSetup" component={WifiSetup} />
            <Stack.Screen name="DeviceName" component={DeviceName} />
            <Stack.Screen name="UserDevice" component={UserDevice} />
            <Stack.Screen name="UserWifi" component={UserWifi} />
            <Stack.Screen name="WifiPassword" component={WifiPassword} />
            <Stack.Screen name="WifiCheck" component={WifiCheck} />
            <Stack.Screen name="Info" component={DeviceInfo} />
            <Stack.Screen name="WifiHome" component={WifiHome} />
            <Stack.Screen name="ConnectRinnai" component={ConnectRinnai} />
            <Stack.Screen name="APMode" component={APMode} />
            <Stack.Screen name="CheckWifi" component={CheckWifi} />
            <Stack.Screen name="FinishWifiSetup" component={FinishWifiSetup} />
            <Stack.Screen name="ConnectSuccess" component={ConnectSuccess} />
            <Stack.Screen name="ConnectFail" component={ConnectFail} />
        </Stack.Navigator>
    );
}

export default PairingStack;
