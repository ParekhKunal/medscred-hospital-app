import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useFontContext } from '../../context/FontContext';
import Icons from '@expo/vector-icons/Feather'


const AboutMedscredScreen = ({ navigation }) => {


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
                        <Text style={styles.heading}>About MedsCred</Text>
                        <Text style={styles.text}>
                            We are dedicated to transforming healthcare financing in India. We connect patients, doctors, hospitals and insurance providers through a unified platform. This platform streamlines claims management, facilitates swift claims reimbursement and offers affordable financing for aesthetic treatments. Our mission is to empower every Indian to navigate their healthcare journey seamlessly by simplifying and accelerating access to financial support for healthcare expenses through cutting-edge technology.
                        </Text>
                        <Text style={styles.heading}>Our Vision</Text>
                        <Text style={styles.text}>
                            Empowering every Indian to navigate their healthcare journey seamlessly, MedsCred is the trusted platform that streamlines medical insurance claims and loans, ensuring financial well-being and peace of mind in times of health challenges.
                        </Text>
                        <Text style={styles.heading}>Our Mission</Text>
                        <Text style={styles.text}>
                            At MedsCred, our mission is to simplify and accelerate access to financial support for healthcare expenses by leveraging cutting-edge technology. We are dedicated to providing a user-friendly platform that enables every Indian to effortlessly manage and optimize their medical insurance claims and loans, fostering a healthier and financially secure nation.
                        </Text>
                    </View>
                </ScrollView>
                <View>
                    <Icons name='' />
                </View>
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
        fontFamily: 'Lexend_200ExtraLight',
        fontSize: 18,
        color: '#101317',
        marginBottom: 15,
        textAlign: 'justify',
        lineHeight: 24,
    },
    heading: {
        fontFamily: 'Lexend_700Bold',
        marginBottom: 15,
        marginTop: 15,
        fontSize: 24,
        color: '#008AFF',
    }
})

export default AboutMedscredScreen;
