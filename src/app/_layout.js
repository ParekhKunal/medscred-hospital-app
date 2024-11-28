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
import AboutMedscredScreen from './screens/aboutmedscred';
import TermsConditionsScreen from './screens/termscondition';
import NotificationScreen from './screens/notification';
import MyProfileDetailScreen from './screens/profiledetails/[id]';
import AddPatientScreen from './screens/addpatient';

import DashboardScreen from "."
import ProfileScreen from "./profile"
import PatientsScreen from "./patients"
import LoansScreen from "./loans"


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const DashboardStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                gestureEnabled: true,
                transitionSpec: {
                    open: { animation: 'timing', config: { duration: 200 } },
                    close: { animation: 'timing', config: { duration: 200 } },
                },
                cardStyleInterpolator: ({ current, layouts }) => ({
                    cardStyle: {
                        opacity: current.progress,
                        transform: [{
                            translateX: current.progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [layouts.screen.width, 0],
                            }),
                        }],
                    },
                }),
            }}
        >
            <Stack.Screen
                name="index"
                component={DashboardScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Notification"
                component={NotificationScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AddPatient"
                component={AddPatientScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Support"
                component={SupportScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
};
const PatientStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                gestureEnabled: true,
                transitionSpec: {
                    open: { animation: 'timing', config: { duration: 200 } },
                    close: { animation: 'timing', config: { duration: 200 } },
                },
                cardStyleInterpolator: ({ current, layouts }) => ({
                    cardStyle: {
                        opacity: current.progress,
                        transform: [{
                            translateX: current.progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [layouts.screen.width, 0],
                            }),
                        }],
                    },
                }),
            }}
        >
            <Stack.Screen
                name="index"
                component={PatientsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AddPatient"
                component={AddPatientScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
};
const LoanStack = () => { };

const ProfileStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                gestureEnabled: true,
                transitionSpec: {
                    open: { animation: 'timing', config: { duration: 200 } },
                    close: { animation: 'timing', config: { duration: 200 } },
                },
                cardStyleInterpolator: ({ current, layouts }) => ({
                    cardStyle: {
                        opacity: current.progress,
                        transform: [{
                            translateX: current.progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [layouts.screen.width, 0],
                            }),
                        }],
                    },
                }),
            }}
        >
            <Stack.Screen
                name="home"
                component={ProfileScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Support"
                component={SupportScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="TermsConditions"
                component={TermsConditionsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AboutMedsCred"
                component={AboutMedscredScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="MyProfileDetail"
                component={MyProfileDetailScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Notification"
                component={NotificationScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
};

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
                    } else if (route.name === 'Patients') {
                        iconName = focused ? 'people' : 'people-outline';
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
                    boxShadowColor: '#DDE6ED',
                    boxShadowOffset: { width: 0, height: -3 },
                    boxShadowOpacity: 0.1,
                    boxShadowRadius: 5,
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
            <Tab.Screen name="Dashboard" component={DashboardStack} />
            <Tab.Screen name="Patients" component={PatientStack} />
            <Tab.Screen name="Loans" component={LoansScreen} />
            <Tab.Screen name="Profile" component={ProfileStack} />
        </Tab.Navigator>
    );
}
