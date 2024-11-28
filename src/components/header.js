import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useFontContext } from '../context/FontContext';
import Icons from '@expo/vector-icons/Feather';

const Header = ({ user }) => {
    const navigation = useNavigation();
    const { fontsLoaded } = useFontContext();


    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    const onPressNotification = () => {
        navigation.navigate('Notification');
    };

    return (
        <View style={styles.headerContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.greeting}>Hi, Good Morning!</Text>
                <Text style={styles.firstName} numberOfLines={1}>
                    {user?.first_name || 'User'} {user?.last_name || ''}
                </Text>
                <Text style={styles.tagLine} numberOfLines={1}>
                    May you always in good condition
                </Text>
            </View>
            <TouchableOpacity onPress={onPressNotification} style={styles.notificationIcon}>
                <Icons name="bell" size={22} color="#007AFF" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#fff'
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    greeting: {
        fontSize: 14,
        fontFamily: 'Lexend_400Regular',
    },
    firstName: {
        fontSize: 16,
        fontFamily: 'Lexend_500Medium',
        flexShrink: 1,
    },
    tagLine: {
        fontSize: 12,
        fontFamily: 'Lexend_300Light',
        color: '#555',
    },
    notificationIcon: {
        borderWidth: 1,
        borderColor: '#D4D4D4',
        borderRadius: 100,
        padding: 10
    },
});

export default Header;
