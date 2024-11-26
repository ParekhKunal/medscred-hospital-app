import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Lexend_400Regular, Lexend_700Bold, Lexend_200ExtraLight } from '@expo-google-fonts/lexend';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

const { height, width } = Dimensions.get('window');

const LoginScreen = () => {
    const router = useRouter();
    const { login } = useAuth();
    const [fontsLoaded] = useFonts({
        Lexend_400Regular,
        Lexend_700Bold,
        Lexend_200ExtraLight,
    });

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState('');

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    const onPressLogin = async () => {
        setLoading(true);
        setError('');
        console.log(email);

        try {
            const success = await login(email, password);
            if (success) {
                router.push('.');
            } else {
                setError('Invalid credentials. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onPressRegisterAccount = () => {
        router.push('auth/registeraccount');
    }
    const onPressForgotPassword = () => {
        router.push('auth/forgotpassword');
    }

    return (
        <>
            <KeyboardAvoidingView style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <SafeAreaView style={styles.safeAreaContainer}>
                    <View style={styles.logoContainer}>
                        <Image source={require('../../../assets/logo-color.png')} resizeMode='contain' style={styles.logo} />
                    </View>

                    <View style={styles.innerContainer}>
                        <Text style={styles.headingLineOne}>Welcome Back 👋</Text>
                        <Text style={styles.headingLineTwo}>
                            to <Text style={styles.headingLineTwoInner}>MedsCred</Text>
                        </Text>
                        <Text style={styles.subtitle}>Hello there, login to continue</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <TextInput
                            placeholder='Email Address'
                            style={styles.inputEmail}
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <TextInput
                            placeholder='Password'
                            style={styles.inputEmail}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    <TouchableOpacity style={styles.forgotPasswordContainer} onPress={onPressForgotPassword}>
                        <Text style={styles.forgotPassword}>Forgot Password ?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.loginButton} onPress={onPressLogin} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.loginButtonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.accountContainer} onPress={onPressRegisterAccount}>
                        <Text style={styles.accountText}>Didn't have an account? <Text style={{ color: '#008AFF' }}>Register</Text></Text>
                    </TouchableOpacity>
                    <View style={{ position: 'absolute', bottom: 10, left: 0, right: 0 }}>
                        <Text style={{ textAlign: 'center', fontFamily: 'Lexend_100Thin' }}>MedsCred - v1.0.0</Text>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
    },
    safeAreaContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    logoContainer: {
        marginBottom: 20,
    },
    logo: {
        resizeMode: 'contain',
        height: 100,
        width: '50%',
    },
    innerContainer: {
        marginBottom: 20,
    },
    headingLineOne: {
        fontSize: 32,
        fontFamily: 'Lexend_700Bold',
        lineHeight: 40,
        color: '#101317',
    },
    headingLineTwo: {
        fontSize: 32,
        fontFamily: 'Lexend_700Bold',
        lineHeight: 40,
        color: '#101317',
    },
    headingLineTwoInner: {
        color: '#008AFF',
    },
    subtitle: {
        color: '#ACAFB5',
        fontSize: 14,
        lineHeight: 22,
        fontFamily: 'Lexend_200ExtraLight',
        marginTop: 5,
    },
    formContainer: {
        width: '100%',
    },
    inputEmail: {
        height: 56,
        borderWidth: 1,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderColor: '#008AFF',
        marginBottom: 20,
        fontSize: 16,
        color: '#101317',
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: 40
    },
    forgotPassword: {
        fontSize: 14,
        color: '#008AFF',
        fontFamily: 'Lexend_200ExtraLight',
        textAlign: 'right',
        textDecorationLine: 'underline',
    },
    loginButton: {
        backgroundColor: '#008AFF',
        borderRadius: 10,
        paddingVertical: 16,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Lexend_700Bold',
    },
    accountContainer: {
    },
    accountText: {
        fontSize: 14,
        textAlign: 'center',
        alignItems: 'center',
        fontFamily: 'Lexend_200ExtraLight',
    }

});

export default LoginScreen;
