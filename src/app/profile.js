import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useFontContext } from '../context/FontContext';
import Icons from '@expo/vector-icons/Feather'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Header from '../components/header';

const ProfileScreen = ({ navigation }) => {

    const { user, logout } = useAuth();
    const { fontsLoaded } = useFontContext();


    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );;
    }

    const onPressMyProfile = () => {
        const userId = user?.id
        navigation.navigate('MyProfileDetail');
    }

    const onPressSupport = () => {
        navigation.navigate('Support');
    }
    const onPressTermsCondition = () => {
        navigation.navigate('TermsConditions');
    }

    const onPressAboutMedscred = () => {
        navigation.navigate('AboutMedsCred');
    }
    const onPressLogout = () => {
        logout();
    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                <ScrollView style={{ marginBottom: 100 }}>
                    <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 30, marginBottom: 20 }}>
                        <Image source={require('../../assets/logo-color.png')} style={{ resizeMode: 'contain', width: 180, height: 65 }} />
                        <Text style={[styles.profileName, { marginTop: 0, fontSize: 14, fontFamily: 'Lexend_200ExtraLight' }]}>Simplifying All Healthcare Finance</Text>
                    </View>
                    <View style={[styles.horizontalLine, { paddingHorizontal: 20 }]} />
                    <View style={styles.profileContainer}>
                        <Image source={require('../../assets/avatar.png')} style={styles.avatar} />
                        <Text style={[styles.profileName, { textAlign: 'center', fontSize: 18 }]}>{user?.first_name} {user?.last_name}</Text>
                        <Text style={styles.profileEmail}>{user?.email}</Text>
                    </View>
                    <View style={styles.profileOptionsContainer}>
                        <View>
                            <TouchableOpacity style={styles.myProfileOption} onPress={onPressMyProfile}>
                                <Icons name="user" size={22} style={styles.icon} />
                                <Text style={styles.optionText}>My Profile</Text>
                                <Icons name="chevron-right" size={22} style={styles.iconRight} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.horizontalLine} />
                        <View>
                            <TouchableOpacity style={styles.myProfileOption} onPress={onPressSupport}>
                                <MaterialIcons name="support-agent" size={22} style={styles.icon} />
                                <Text style={styles.optionText}>Support</Text>
                                <Icons name="chevron-right" size={22} style={styles.iconRight} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.horizontalLine} />
                        <View>
                            <TouchableOpacity style={styles.myProfileOption} onPress={onPressTermsCondition}>
                                <MaterialIcons name="info-outline" size={22} style={styles.icon} />
                                <Text style={styles.optionText}>Terms & Conditions</Text>
                                <Icons name="chevron-right" size={22} style={styles.iconRight} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.horizontalLine} />
                        <View>
                            <TouchableOpacity style={styles.myProfileOption} onPress={onPressAboutMedscred}>
                                <Icons name="twitch" size={22} style={styles.icon} />
                                <Text style={styles.optionText}>About MedsCred</Text>
                                <Icons name="chevron-right" size={22} style={styles.iconRight} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.horizontalLine} />
                        <View>
                            <TouchableOpacity style={styles.myProfileOption} onPress={onPressLogout}>
                                <MaterialIcons name="logout" size={22} style={[styles.icon, { color: 'red', backgroundColor: '#FFCCCB' }]} />
                                <Text style={[styles.optionText, { color: 'red' }]}>Log out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    profileContainer: {
        alignItems: 'center',
        marginTop: 30,
    },
    avatar: {
        resizeMode: 'contain',
        height: 140,
        width: 140,
        alignItems: 'center',
        borderRadius: 100,
        borderWidth: 0.5,
        borderColor: '#008AFF',
        justifyContent: 'center',
        alignItems: 'center'
    },
    profileName: {
        fontSize: 28,
        marginTop: 20,
        fontFamily: 'Lexend_600SemiBold',
    },
    profileEmail: {
        fontSize: 16,
        marginTop: 5,
        fontFamily: 'Lexend_400Regular',
    },
    profileOptionsContainer: {
        padding: 10,
        marginTop: 30
    },
    myProfileOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    icon: {
        marginRight: 20,
        color: '#333',
        borderRadius: 100,
        padding: 10,
        backgroundColor: '#FAFAFA'
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        fontFamily: 'Lexend_400Regular'
    },
    iconRight: {
        color: '#000',
    },
    horizontalLine: {
        height: 1,
        backgroundColor: '#ECECEC',
        alignSelf: 'stretch',
        opacity: 0.5
    },
})

export default ProfileScreen;
