import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    error: {
        marginLeft: 10,
        flex: 1,
    },
    errorWindow: {
        width: '100%',
        borderRadius: 10,
        shadowOffset: {width: 0, height: 5},
        shadowRadius: 8,
        shadowColor: 'black',
        shadowOpacity: 0.05,
        elevation: 1,
        maxHeight: 500,
        overflow: 'hidden',
        backgroundColor: '#FBFBFB',
        padding: 0,
        marginBottom: 10,
    },
    errorHeader: {
        fontWeight: '300',
        flexWrap: 'wrap',
        fontSize: 18,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        marginLeft: 10,
        marginTop: 10,
    },
    errorItem: {
        backgroundColor: '#ffffff',
        marginTop: 5,
        marginBottom: 5,
    },
    errorDetails: {
        flexDirection: 'row',
    },
    detailItems: {
        fontWeight: '300',
        fontSize: 13,
        padding: 5,
    },
});

export default styles;
