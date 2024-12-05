import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Vibration, Image, Button, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import Icons from '@expo/vector-icons/Feather'
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import Toast from 'react-native-toast-message';
import { dischargeDataUpdate, getDischargeDetail } from '../../config/api';

const PatientDetailScreen = ({ route, navigation }) => {

    const { user, token } = useAuth();

    const { id } = route.params || {};

    const handleBackPress = () => {
        navigation.goBack();
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                    <Icons name='chevron-left' size={28} color="#000" />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>Patient Details</Text>
                </View>
            </View>
            <View style={styles.contentContainer}>
                <View style={{ backgroundColor: '#F0F8FF', borderRadius: 6, padding: 20 }}>
                    <Text>Case Id: {id}</Text>
                    <Text style={{ fontSize: 18, fontFamily: 'Lexend_500Medium' }}>Kunal Parekh</Text>
                    <Text style={{ fontSize: 14, fontFamily: 'Lexend_300Light' }}>
                        Hair
                    </Text>
                    <Text style={{ fontSize: 12, fontFamily: 'Lexend_300Light' }}>
                        1000
                    </Text>
                    <Text style={{ fontSize: 12, fontFamily: 'Lexend_300Light' }}>
                        3
                    </Text>
                </View>
            </View>
        </SafeAreaView>
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
    inputContainer: {
        marginBottom: 20,
    },
    contentContainer: {
        flex: 1,
        marginTop: 40,
        height: '100%'
    },
})

export default PatientDetailScreen;
