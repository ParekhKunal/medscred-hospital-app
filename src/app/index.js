import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

const DashboardScreen = () => {

    const { logout, user, token } = useAuth()

    const handlePressLogout = () => {
        logout();
    }

    return (
        <SafeAreaView className="flex-1 items-center justify-center bg-white">
            <View>
                <Text>Dashboard {user?.first_name}</Text>
            </View>
            <View>
                <TouchableOpacity onPress={handlePressLogout}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default DashboardScreen;
