import {StyleSheet} from 'react-native';

const modalStyles = StyleSheet.create({
    h1: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    description: {
        fontSize: 12,
        fontWeight: 'normal',
        textAlign: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        overflow: 'hidden',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    contentWrapper: {
        padding: 35,
        paddingBottom: 0,
        flex: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonWrapper: {
        flex: 0.5,
        borderTopWidth: 0.5,
        borderTopColor: 'rgba(151,151,151,0.5)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textWrapper: {
        marginBottom: 10,
    },
    basicButton: {
        flex: 1,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        padding: 10,
        color: 'black',
        textAlign: 'center',
        fontSize: 14,
    },
    titleWrapper: {
        marginBottom: 15,
        textAlign: 'center',
    },
    textInput: {
        borderColor: '#979797',
        borderWidth: 1,
        padding: 8,
        margin: 5,
        width: 270,
        height: 40,
    },
});

export default modalStyles;
