/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, Image, View} from 'react-native';
import {Header, Left, Body, Right, Button} from 'native-base';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import styles from '../styles/Style';

const logo = require('../assets/images/rinnai-text-logo.png');

const TitleBar = ({navigation, backButton = true, backNav = '', title = '', subTitle = '', drawer = false, transparent = true, full = false}) => {
    const backNavigation = () => {
        if (backNav === 'menu') {
            navigation.toggleDrawer();
        } else if (backNav === 'back') {
            navigation.goBack();
        } else {
            navigation.navigate(backNav);
        }
    };

    const backView = () => {
        if (backButton) {
            return (
                <Left style={{flex: 0.25, alignItems: 'center'}}>
                    <Button
                        style={{
                            justifyContent: 'center',
                            alignContent: 'center',
                            textAlign: 'center',
                        }}
                        transparent
                        onPress={() => backNavigation()}>
                        <FontAwesome5Pro name={'chevron-left'} style={{color: '#C2C8CF', fontSize: 20}} />
                    </Button>
                </Left>
            );
        } else {
            if (!full) {
                return <Left style={{flex: 0.25}} />;
            }
        }
    };

    const drawerView = () => {
        if (drawer) {
            return (
                <Right style={{flex: 0.25}}>
                    <Button accessible={true} accessibilityLabel="main-menu-button" transparent onPress={() => navigation.toggleDrawer()}>
                        <FontAwesome5Pro name={'bars'} style={{color: '#C2C8CF', fontSize: 20}} />
                    </Button>
                </Right>
            );
        } else {
            return <Right style={{flex: 0.25}} />;
        }
    };

    const subTitleView = () => {
        if (subTitle) {
            return <Text style={{...styles.h4, textAlign: 'center'}}>{subTitle}</Text>;
        }
    };

    const TitleView = () => {
        if (title) {
            return (
                <Text
                    style={{
                        ...styles.h1,
                        fontSize: 18,
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    {title}
                </Text>
            );
        } else {
            return <Image style={{height: 22, width: 100, resizeMode: 'contain'}} source={logo} />;
        }
    };

    return (
        <View style={{width: '100%', marginBottom: 0}}>
            <Header
                transparent={transparent ? true : false}
                style={{
                    backgroundColor: transparent ? 'transparent' : '#D8D8D8',
                }}>
                {backView()}
                <Body
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    {TitleView()}
                    {subTitleView()}
                </Body>
                {drawerView()}
            </Header>
        </View>
    );
};

export default TitleBar;
