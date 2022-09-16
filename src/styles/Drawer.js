import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    drawer: {
        flex: 1,
        minHeight: 450,
    },
    drawerSettings: {},
    drawerStyle: {
        flex: 1,
        flexShrink: 0,
        flexDirection: 'column',
        backgroundColor: '#2E353C',
    },
    drawerButton: {
        backgroundColor: '#39414A',
        width: '90%',
        alignSelf: 'center',
        borderRadius: 10,
        marginBottom: 10,
    },
    drawerItem: {
        color: '#F3F5F7',
        flexWrap: 'wrap',
    },
    drawerLabel: {
        color: '#F3F5F7',
        flexWrap: 'wrap',
    },
});

export default styles;
