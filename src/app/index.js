import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import Header from '../components/header';
import { FontAwesome6 } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

const DashboardScreen = () => {
    const { logout, user } = useAuth();

    const handlePressLogout = () => {
        logout();
    };

    return (
        <>
            <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
                <ScrollView>
                    <Header user={user} />
                    <View style={styles.rowContainerOne}>
                        <TouchableOpacity>
                            <View style={[styles.boxOne, { backgroundColor: '#F9F5FF' }]}>
                                <View style={[styles.iconOne, { width: 50, alignItems: 'center' }]}>
                                    <FontAwesome6 name='user-large' size={24} style={{ color: '#254EDB' }} />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.textOne}>Add Patients</Text>
                                    <Text style={styles.subTextOne} numberOfLines={2}>Get instant Disbursement</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={[styles.boxOne, { backgroundColor: '#EDFCF2' }]}>
                                <View style={[styles.iconOne, { backgroundColor: '#AAF0C4', width: 50, alignItems: 'center' }]}>
                                    <FontAwesome6 name='newspaper' size={24} style={{ color: '#16B364' }} />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.textOne}>View Loans</Text>
                                    <Text style={styles.subTextOne} numberOfLines={2}>Get the Details of Loans</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.rowContainerTwo}>
                        <TouchableOpacity>
                            <View style={[styles.boxOne, { backgroundColor: '#FEF6EE' }]}>
                                <View style={[styles.iconOne, { backgroundColor: '#F9DBAF', width: 50, alignItems: 'center' }]} >
                                    <FontAwesome6 name='user-large' size={24} style={{ color: '#EF6820' }} />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.textOne}>View Patients Status</Text>
                                    <Text style={[styles.subTextOne, { fontSize: 14 }]} numberOfLines={2}>Get Instant Status</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={[styles.boxOne, { backgroundColor: '#FEF3F2' }]}>
                                <View style={[styles.iconOne, { backgroundColor: '#FECDCA', width: 50, alignItems: 'center' }]}>
                                    <FontAwesome6 name='phone-volume' size={24} style={{ color: '#F04438' }} />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.textOne}>Contact Us</Text>
                                    <Text style={styles.subTextOne} numberOfLines={2}>Get Instant Support 24/7</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    rowContainerOne: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 10,
    },
    rowContainerTwo: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20,
    },
    boxOne: {
        height: 174,
        width: 174,
        borderRadius: 12,
        backgroundColor: '#D3F8DF',
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    iconOne: {
        borderRadius: 8,
        backgroundColor: '#A0B6EA',
        color: '#254EDB',
        paddingVertical: 10,
    },
    textContainer: {
        flex: 1,
        marginTop: 20
    },
    textOne: {
        fontFamily: 'Lexend_400Regular',
        fontSize: 18,
        marginBottom: 10,
    },
    subTextOne: {
        fontSize: 14,
        fontFamily: 'Lexend_400Regular',
        flexShrink: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
});

export default DashboardScreen;
