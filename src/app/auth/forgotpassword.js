import React, { useState } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Icons from '@expo/vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFontContext } from '../../context/FontContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import Toast from 'react-native-toast-message';
import { forgotPasswordRequest } from '../../config/api';

const { height, width } = Dimensions.get('window');

const ForgotPasswordScreen = () => {
    const router = useRouter();
    const { fontsLoaded } = useFontContext();
    const [formData, setFormData] = useState({
        user_email: '',
        new_password: '',
        confirm_password: ''
    })
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    if (!fontsLoaded) {
        return <Text>Loading fonts...</Text>;
    }

    const handleBackPress = () => {
        router.replace('auth/login');
    }


    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const onSubmit = async () => {
        try {

            const { user_email, new_password, confirm_password } = formData;

            if (!user_email) {
                Toast.show({
                    type: 'error',
                    text1: 'Validation Error',
                    text2: 'Email is required.',
                    visibilityTime: 5000,
                    autoHide: true,
                    draggable: true,
                    topOffset: 100,
                    bottomOffset: 40,
                });
                return;
            }

            if (!new_password) {
                Toast.show({
                    type: 'error',
                    text1: 'Validation Error',
                    text2: 'Password is required.',
                    visibilityTime: 5000,
                    autoHide: true,
                    draggable: true,
                    topOffset: 100,
                    bottomOffset: 40,
                });
                return;
            }

            if (!confirm_password) {
                Toast.show({
                    type: 'error',
                    text1: 'Validation Error',
                    text2: 'Confirm Password is required.',
                    visibilityTime: 5000,
                    autoHide: true,
                    draggable: true,
                    topOffset: 100,
                    bottomOffset: 40,
                });
                return;
            }

            if (new_password.length < 6 && confirm_password.length < 6) {
                Toast.show({
                    type: 'error',
                    text1: 'Validation Error',
                    text2: 'Password is must be atleast 6 character',
                    visibilityTime: 5000,
                    autoHide: true,
                    draggable: true,
                    topOffset: 100,
                    bottomOffset: 40,
                });
                return;
            }

            if (new_password !== confirm_password) {
                Toast.show({
                    type: 'error',
                    text1: 'Validation Error',
                    text2: 'Passwords do not match.',
                    visibilityTime: 5000,
                    autoHide: true,
                    draggable: true,
                    topOffset: 100,
                    bottomOffset: 40,
                });
                return;
            }

            const response = await forgotPasswordRequest(formData);

            if (response.status == 404) {
                console.log("done1");
                Toast.show({
                    type: 'Error',
                    text1: 'Not Account Found',
                    text2: response.data,
                    visibilityTime: 5000,
                    autoHide: true,
                    draggable: true,
                    topOffset: 80,
                    bottomOffset: 40,
                });
            } else {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: response.data.message,
                    visibilityTime: 5000,
                    autoHide: true,
                    draggable: true,
                    topOffset: 80,
                    bottomOffset: 40,
                });

                setTimeout(() => {
                    router.replace('auth/login');
                }, 2000)
            }
        } catch (error) {

            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response,
                visibilityTime: 5000,
                autoHide: true,
                draggable: true,
                topOffset: 100,
                bottomOffset: 40,
            });
            setTimeout(() => {
                router.replace('auth/login');
            }, 2000)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                    <Icons name='chevron-left' size={28} color="#000" />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>Forgot Password Request</Text>
                </View>
            </View>

            <View style={styles.contentContainer}>
                <Text style={{ color: 'red', fontSize: 18, fontFamily: 'Lexend_600SemiBold' }}>Note:</Text>
                <Text style={styles.text}>
                    <Text style={{ fontFamily: 'Lexend_700Bold', lineHeight: 22 }}>1.</Text> If you change your password, access to your account using the new password will be enabled after 24 hours.
                </Text>
                <Text style={styles.text}><Text style={{ fontFamily: 'Lexend_700Bold', lineHeight: 22 }}>2. </Text>This delay is for your security to ensure account safety.</Text>
                <Text style={styles.text}><Text style={{ fontFamily: 'Lexend_700Bold', lineHeight: 22 }}>3. </Text> If you face any issues or didn’t request a password change, please contact our support team immediately.</Text>
                <ScrollView style={{ flexGrow: 1, marginTop: 20 }}>
                    <View style={{ flex: 1 }}>
                        <View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>
                                    Email<Text style={{ color: 'red' }}>*</Text>
                                </Text>
                                <TextInput
                                    placeholder="Email"
                                    name="user_email"
                                    value={formData.user_email}
                                    onChangeText={(text) =>
                                        handleInputChange('user_email', text)
                                    }
                                    style={[styles.input, { borderColor: '#D4D4D4', borderWidth: 1, padding: 10, borderRadius: 5, }]}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>
                                    Password<Text style={{ color: 'red' }}>*</Text>
                                </Text>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        placeholder="Type your Password here..."
                                        onChangeText={(text) =>
                                            handleInputChange('new_password', text)
                                        }
                                        value={formData.new_password}
                                        secureTextEntry={!isPasswordVisible}
                                        style={styles.input}
                                    />
                                    <TouchableOpacity onPress={togglePasswordVisibility}>
                                        <Ionicons
                                            name={isPasswordVisible ? 'eye' : 'eye-off'}
                                            size={24}
                                            color="#000"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>
                                    Confirm Password<Text style={{ color: 'red' }}>*</Text>
                                </Text>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        placeholder="Type your Confirm Password here..."
                                        onChangeText={(text) =>
                                            handleInputChange('confirm_password', text)
                                        }
                                        value={formData.confirm_password}
                                        style={styles.input}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View>
                    <TouchableOpacity onPress={onSubmit} style={{ backgroundColor: '#008AFF', padding: 20, borderRadius: 6, marginBottom: 20 }}><Text style={{ textAlign: 'center', color: '#fff', fontFamily: 'Lexend_400Regular', fontSize: 16 }}>Submit Forgot Password Request</Text></TouchableOpacity>
                </View>
            </View>
            <Toast />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        width: width,
        height: height,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 30,
        width: width,
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
        marginTop: 40
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
        flex: 1,
        height: 50,
        textAlignVertical: 'center',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#D4D4D4',
        height: 50,
        paddingHorizontal: 10,
    },
})

export default ForgotPasswordScreen;
