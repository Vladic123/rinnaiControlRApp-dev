/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Alert, Modal, TextInput, Text, View} from 'react-native';
import {Button} from 'native-base';
import modalStyles from '../styles/Modal';
import styles from '../styles/Style';

const PopUp = ({content = [], modal = false, modalButton = true, submit = () => {}, showModal = () => {}, autoCorrect = true}) => {
    const [modalContent, setModalContent] = useState([]);

    useEffect(() => {
        if (!modal) {
            setModalContent([]);
        }
    }, [modal]);

    const showContent = () => {
        if (content.length > 0) {
            return content.map((item, key) => {
                return contentType(item, key);
            });
        }
    };

    const handleInput = (key, value) => {
        setModalContent({
            ...modalContent,
            [key]: value,
        });
    };

    const submitData = () => {
        submit(modalContent);
    };

    const contentType = (data, key) => {
        switch (data.type) {
            case 'header':
                return (
                    <View style={modalStyles.titleWrapper} key={key}>
                        <Text style={modalStyles.h1}>{data.value}</Text>
                    </View>
                );
            case 'description':
                return (
                    <View style={modalStyles.textWrapper} key={key}>
                        <Text style={{...modalStyles.description, color: '#979797', fontSize: 15}}>{data.value}</Text>
                    </View>
                );
            case 'input':
                return (
                    <View style={modalStyles.inputWrapper} key={key}>
                        <TextInput
                            onChangeText={(input) => handleInput(data.name, input)}
                            style={modalStyles.textInput}
                            autoCorrect={autoCorrect}
                            autoCapitalize="none"
                            placeholder={data.placeholder}
                            placeholderTextColor="#000000"
                            underlineColorAndroid="transparent"
                            keyboardAppearance="dark"
                        />
                    </View>
                );
            case 'button':
                return (
                    <View style={{flex: 1}} key={key}>
                        <Button
                            full
                            transparent
                            style={{...modalStyles.basicButton, alignItems: 'flex-end', margin: '5%', elevation: 0}}
                            onPress={() => {
                                submitData();
                            }}>
                            <Text style={{fontWeight: 'bold', textAlignVertical: 'top'}}>{data.title}</Text>
                        </Button>
                    </View>
                );
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modal}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
            }}>
            <View style={modalStyles.centeredView}>
                <View style={{...modalStyles.modalView, height: 250}}>
                    <View style={modalStyles.contentWrapper}>{showContent()}</View>
                    {content.filter((item) => {
                        return item.type === 'button';
                    }).length > 0 ? null : (
                        <View style={modalStyles.buttonWrapper}>
                            <Button
                                full
                                transparent
                                style={modalStyles.basicButton}
                                onPress={() => {
                                    showModal(!modal);
                                }}>
                                <Text style={modalStyles.textStyle}>Cancel</Text>
                            </Button>
                            <View style={styles.separator} />
                            <Button
                                full
                                transparent
                                style={{
                                    ...modalStyles.basicButton,
                                    display: modalButton ? 'flex' : 'none',
                                }}
                                onPress={() => {
                                    submitData();
                                }}>
                                <Text style={modalStyles.textStyle}>Submit</Text>
                            </Button>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default PopUp;
