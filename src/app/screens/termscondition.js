import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useFontContext } from '../../context/FontContext';
import Icons from '@expo/vector-icons/Feather'

import Toast from 'react-native-toast-message';
import { Link } from 'expo-router';

const TermsConditionsScreen = ({ navigation }) => {


    const { user, token } = useAuth();

    const handleBackPress = () => {
        navigation.goBack();
    }

    if (!token) {
        return (
            <SafeAreaView >

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            </SafeAreaView>
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
                        <Text style={styles.titleText}>Terms & Conditions</Text>
                    </View>
                </View>
                <ScrollView style={{ marginBottom: 100 }}>

                    <View style={styles.contentContainer}>
                        <Text style={styles.text}>
                            Definitions and Interpretation
                        </Text>
                        <Text style={styles.term}><Text style={styles.bold}>“Application” and/or “App”</Text> refers to a computer software designed for a handheld device;</Text>
                        <Text style={styles.term}><Text style={styles.bold}>“Customers”; “User”</Text> means any person, organisation, or entity that accesses, uses or attempts to access and/or use MedsCred’s Website and/or Application and its allied Platforms (including Services);</Text>
                        <Text style={styles.term}><Text style={styles.bold}>“Device”</Text> means mobile phones, personal digital assistance or combination of both or any other device used to communicate, send or transmit any text, video, audio or image;</Text>
                        <Text style={styles.term}><Text style={styles.bold}>“Platform” and/or “MedsCred Platform”</Text> means a platform or digital platform in which a piece of software is executed including and not limited to hardware, operating software, web browser, associated application programming interfaces, or other underlying software.</Text>
                        <Text style={styles.term}><Text style={styles.bold}>“Services”</Text> means any or all products, services that MedsCred provides and may provide as a financial technology platform.</Text>
                        <Text style={styles.term}><Text style={styles.bold}>“Website”</Text> means a set of related web pages located under the domain name “www.medscred.com”</Text>
                        <Text style={styles.term}>The terms <Text style={styles.bold}>“WE”, "OUR" and "US"</Text> refer to MedsCred and the terms <Text style={styles.bold}>“YOU”, "YOUR" "USER" or “CUSTOMER”</Text> refer to you, as a user of the MedsCred Website and/or App.</Text>
                        <Link
                            href="https://medscred.com/terms-condition.html"
                            style={{ fontFamily: 'Lexend_300Light', textAlign: 'center', marginTop: 20 }}
                        >
                            <Text style={{ fontFamily: 'Lexend_300Light', textAlign: 'center', marginTop: 20, color: '#008AFF', textDecorationLine: 'underline' }}>
                                To know more, visit our website
                            </Text>
                        </Link>
                    </View>
                </ScrollView>
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
        fontFamily: 'Lexend_700Bold',
        textAlign: 'justify',
        fontSize: 18,
        color: '#101317',
        lineHeight: 18,
        marginBottom: 15
    },
    term: {
        fontSize: 16,
        lineHeight: 22,
        color: '#101317',
        marginBottom: 8,
    },
    bold: {
        fontWeight: 'bold',
    }
})

export default TermsConditionsScreen;
