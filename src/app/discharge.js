import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import Header from '../components/header';
import { FontAwesome6 } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { patientList } from '../config/api';
import { debounce } from 'lodash';
import { Feather } from '@expo/vector-icons';

const LoansScreen = ({ navigation }) => {

    const { logout, user, token } = useAuth();

    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <Header user={user} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ textAlign: 'center' }}>Loans Screen</Text>
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({})

export default LoansScreen;
