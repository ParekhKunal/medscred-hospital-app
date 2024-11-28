import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icons from '@expo/vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFontContext } from '../../context/FontContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

const { height, width } = Dimensions.get('window');

const NotificationScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { fontsLoaded } = useFontContext();

    if (!fontsLoaded) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <Icons name="chevron-left" size={28} color="#000" />
                    </TouchableOpacity>
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Notifications</Text>
                    </View>
                </View>

                <View style={styles.notificationsContainer}>
                    <View style={styles.notificationCard}>
                        <View style={styles.iconContainer}>
                            <Icons name="user" size={24} style={styles.icon} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.messageHeading}>Lorem ipsum dolor sit amet</Text>
                            <Text style={styles.text} numberOfLines={2}>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            </Text>
                            <Text style={styles.date}>November 27, 2024 at 23:28 PM</Text>
                        </View>
                    </View>
                    <View style={styles.horizontalLine} />
                    <View style={styles.notificationCard}>
                        <View style={styles.iconContainer}>
                            <Icons name="user" size={24} style={styles.icon} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.messageHeading}>Lorem ipsum dolor sit amet</Text>
                            <Text style={styles.text} numberOfLines={2}>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            </Text>
                            <Text style={styles.date}>November 27, 2024 at 23:28 PM</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    backButton: {
        marginRight: 15,
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
        textAlign: 'center',
    },
    notificationsContainer: {
        flex: 1,
    },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        marginTop: 10
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D4F6FF',
        borderRadius: 25,
        width: 50,
        height: 50,
    },
    icon: {
        color: '#008AFF',
    },
    textContainer: {
        flex: 1,
        marginLeft: 15,
    },
    messageHeading: {
        fontSize: 16,
        fontFamily: 'Lexend_500Medium',
        color: '#333',
    },
    text: {
        fontSize: 14,
        fontFamily: 'Lexend_300Light',
        color: '#555',
        marginTop: 5,
    },
    date: {
        fontSize: 12,
        fontFamily: 'Lexend_200ExtraLight',
        color: '#888',
        marginTop: 8,
    },
    horizontalLine: {
        height: 1,
        backgroundColor: '#ECECEC',
        alignSelf: 'stretch',
        opacity: 0.5
    },
});

export default NotificationScreen;
