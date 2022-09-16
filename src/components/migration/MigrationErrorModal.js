import React from 'react';
import {View, Modal, Text, TouchableWithoutFeedback, Linking, StyleSheet, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5Pro';
import {Button} from 'native-base';

const MigrationErrorModal = (props) => {
    let icon = <Icon name="exclamation-triangle" size={100} color="#DD0000" solid />;
    return (
        <View>
            <Modal transparent={true} animationType="fade">
                <View style={styles.mainContainer}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalOverlay} />
                    </TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                        <View style={styles.iconContainer}>{icon}</View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Oh no! {props.errorCode} Error</Text>
                        </View>
                        <Text style={styles.contact}>
                            An error has occurred. Please try again later or
                            <Text style={styles.contactLink} onPress={() => Linking.openURL(props.migrationSupportLink)}>
                                {' '}
                                contact support
                            </Text>
                        </Text>
                        <View style={styles.buttonContainer}>
                            <Button full transparent style={styles.button} onPress={props.close}>
                                <Text style={styles.buttonText}>Okay</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    modalContent: {
        flex: Platform.OS === 'android' ? 0.5 : 0.45,
        justifyContent: 'center',
        margin: 20,
        padding: 10,
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
    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    iconContainer: {
        margin: '5%',
    },
    buttonContainer: {
        flex: 1,
    },
    button: {
        flex: 1,
        padding: 10,
        alignItems: 'flex-end',
    },
    buttonText: {
        padding: 10,
        color: 'black',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
    },
    title: {
        padding: 10,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20,
    },
    contactContainer: {
        marginVertical: '10%',
    },
    contact: {
        color: '#888',
        fontSize: 15,
        textAlign: 'center',
    },
    contactLink: {
        color: '#888',
        textDecorationLine: 'underline',
        fontSize: 15,
    },
});

export default MigrationErrorModal;
