import '../../global.css';
import React, { useState, useContext } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext, AuthProvider, useAuth } from '../context/AuthContext';
import { FontProvider } from '../context/FontContext';

import Icon from '@expo/vector-icons/Ionicons';

import LoginScreen from "./auth/login"
import ForgotPasswordScreen from './auth/forgotpassword';
import RegisterScreen from './auth/registeraccount';

import SupportScreen from './screens/support';

import DashboardScreen from "."


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const DashboardStack = () => { };
const PatientStack = () => { };
const LoanStack = () => { };
const ProfileStack = () => { };

export default RootLayout = () => {
    return (
        <FontProvider>
            <AuthProvider>
                <SafeAreaProvider>
                    <StatusBar backgroundColor="#008AFF" barStyle="light-content" />
                    <AppNavigator />
                </SafeAreaProvider>
            </AuthProvider>
        </FontProvider>
    )
}

function AppNavigator() {
    const { token, user } = useAuth();

    console.log('Token in AppNavigator:', token);
    console.log('User Role', user?.role);

    if (!token) {
        return (
            <Stack.Navigator>
                <Stack.Screen
                    name="auth/login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="auth/forgotpassword"
                    component={ForgotPasswordScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="auth/registeraccount"
                    component={RegisterScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        );
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Dashboard') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Hospital') {
                        iconName = focused ? 'business' : 'business-outline';
                    } else if (route.name === 'Scan QR') {
                        iconName = focused ? 'qr-code' : 'qr-code-outline';
                    } else if (route.name === 'Loans') {
                        iconName = focused ? 'cash' : 'cash-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    height: 80,
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    paddingTop: 15,
                    paddingBottom: 15,
                    borderTopWidth: 0.2,
                    borderLeftWidth: 0.2,
                    borderRightWidth: 0.2,
                    shadowColor: '#DDE6ED',
                    shadowOffset: { width: 0, height: -3 },
                    shadowOpacity: 0.1,
                    shadowRadius: 5,
                    position: 'absolute',
                    elevation: 0,
                    bottom: 0,
                    borderColor: '#DDE6ED',
                    paddingLeft: 10,
                    paddingRight: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    paddingBottom: 7,
                },
                headerShown: false,
            })}

        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
        </Tab.Navigator>
    );
}
