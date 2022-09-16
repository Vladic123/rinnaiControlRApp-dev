import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    accountLabel: {
        width: 150,
    },
    accountDetail: {
        flex: 1,
        textAlign: 'left',
        fontWeight: '300',
    },
    accountItem: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#D8D8D8',
    },
    accountText: {
        flex: 1,
        textAlign: 'left',
        fontWeight: '300',
        maxWidth: 250,
    },
});

export default styles;
