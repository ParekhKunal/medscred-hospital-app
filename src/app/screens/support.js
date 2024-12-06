import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useFontContext } from '../../context/FontContext';
import Icons from '@expo/vector-icons/Feather'
import { supportForm } from '../../config/api';

import Toast from 'react-native-toast-message';

const SupportScreen = ({ navigation }) => {


    const { user, token } = useAuth();
    const [formData, setFormData] = useState({
        subject: '',
        message: ''
    })

    const handleBackPress = () => {
        navigation.goBack();
    }

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const onSubmit = async () => {
        try {

            if (!formData.subject.trim() || !formData.message.trim()) {
                Toast.show({
                    type: 'error',
                    text1: 'Validation Error',
                    text2: 'Subject and Message are required fields.',
                });
                return;
            }

            const payload = {
                email: user?.email,
                issue_type: formData.subject,
                message: formData.message,
                platform: 'MOBILE APP'
            };


            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };

            const response = await supportForm(payload, config);

            if (response.status === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'We received your response, our team will get back to you soon!',
                    visibilityTime: 5000,
                    autoHide: true,
                    draggable: true,
                    topOffset: 100,
                    bottomOffset: 40,
                });

                setFormData({
                    email: `${user?.email}`,
                    subject: '',
                    message: '',
                });

                setTimeout(() => {
                    navigation.goBack();
                }, 2000);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to send the message. Please try again later.',
                visibilityTime: 5000,
                autoHide: true,
                draggable: true,
                topOffset: 100,
                bottomOffset: 40,
            });
        }
    }

    if (!token) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        )
    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <Icons name='chevron-left' size={28} color="#000" />
                    </TouchableOpacity>
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Support</Text>
                    </View>
                </View>
                <View style={styles.contentContainer}>
                    <ScrollView style={{ marginBottom: 80, flexGrow: 1 }}>
                        <View style={{ flex: 1 }}>
                            <View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>
                                        Subject<Text style={{ color: 'red' }}>*</Text>
                                    </Text>
                                    <TextInput
                                        placeholder="Subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChangeText={(text) =>
                                            handleInputChange('subject', text)
                                        }
                                        style={styles.input}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>
                                        Message<Text style={{ color: 'red' }}>*</Text>
                                    </Text>
                                    <TextInput
                                        placeholder="Type your message here..."
                                        onChangeText={(text) =>
                                            handleInputChange('message', text)
                                        }
                                        value={formData.message}
                                        name='message'
                                        style={[styles.input, styles.textArea]}
                                        multiline={true}
                                        numberOfLines={4}
                                    />
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    <View>
                        <TouchableOpacity onPress={onSubmit} style={{ backgroundColor: '#008AFF', padding: 20, borderRadius: 6, marginBottom: 80 }}><Text style={{ textAlign: 'center', color: '#fff', fontFamily: 'Lexend_400Regular', fontSize: 16 }}>Submit</Text></TouchableOpacity>
                    </View>
                </View>
                <Toast />
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#fff'
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    backButton: {
        position: 'absolute',
    },
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 22,
        fontFamily: 'Lexend_400Regular',
        color: '#000',
    },
    contentContainer: {
        flex: 1,
        marginTop: 40,
        height: '100%'
    },
    text: {
        fontFamily: 'Lexend_300Light',
        textAlign: 'justify',
        fontSize: 14,
        color: '#101317',
        lineHeight: 18
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontFamily: 'Lexend_700Bold',
        marginBottom: 5,
    },
    input: {
        padding: 10,
        height: 50,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#D4D4D4',
        justifyContent: 'center',
        textAlignVertical: 'center',
    },
    textArea: {
        height: 150,
        textAlignVertical: 'top',
    },
})

export default SupportScreen;
