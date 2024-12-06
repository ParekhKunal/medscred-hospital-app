import React, { useState } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Icons from '@expo/vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFontContext } from '../../context/FontContext';
import { useRouter } from 'expo-router';

const { height, width } = Dimensions.get('window');

const RegisterScreen = () => {
    const router = useRouter();
    const handleBackPress = () => {
        router.replace('auth/login');
    }

    const openEmail = () => {
        Linking.openURL('mailto:info@medscred.com');
    };

    const callNumber = () => {
        Linking.openURL('tel:+1234567890'); // Replace with your actual contact number
    };

    return (
        <>
            <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <Icons name='chevron-left' size={28} color="#000" />
                    </TouchableOpacity>
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Register Now</Text>
                    </View>
                </View>
                <View style={styles.contentContainer}>

                    <Text style={styles.title}>Welcome to MedsCred!</Text>
                    <Text style={styles.description}>
                        At MedsCred, we are committed to simplifying healthcare finance. Whether you need support with claim
                        reimbursements or comprehensive financial solutions, our team is here to help.
                        For any queries or to register with us, feel free to reach out.
                    </Text>

                    <View style={styles.contactContainer}>
                        <Text style={[styles.contactLabel, { textAlign: 'center' }]}>Email Us:</Text>
                        <TouchableOpacity onPress={openEmail}>
                            <Text style={[styles.contactLink, { textAlign: 'center' }]}>info@medscred.com</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.contactContainer}>
                        <Text style={styles.contactLabel}>Call Us:</Text>
                        <TouchableOpacity onPress={callNumber}>
                            <Text style={styles.contactLink}>+123-456-7890</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ position: 'absolute', bottom: 10, right: 0, left: 0 }}>
                    <Text style={{ fontFamily: 'Lexend_100Thin', textAlign: 'center' }}>v1.0.0</Text>
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        width: width,
        height: height,
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
        marginTop: 40
    },
    contentContainer: {
        flex: 1,
        marginTop: 40,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
        color: '#333',
        fontFamily: 'Lexend_300Light'
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    contactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    contactLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 5,
    },
    contactLink: {
        fontSize: 16,
        color: '#007BFF',
        textDecorationLine: 'underline',
    },
})

export default RegisterScreen;
