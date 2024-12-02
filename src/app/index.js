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

const DashboardScreen = ({ navigation }) => {
    const { logout, user, token } = useAuth();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);

    const fetchPatientList = useCallback(async (resetPage = false) => {
        try {
            setLoading(true);
            const currentPage = resetPage ? 1 : page;
            const response = await patientList(token, currentPage, limit);
            const { data, pagination } = response.data;

            setPatients(prevPatients =>
                resetPage ? data : [...prevPatients, ...data]
            );
            setPage(currentPage);
            setTotalPages(pagination.totalPages);
        } catch (error) {
            console.error('Failed to fetch patients:', error);
            Alert.alert('Error', 'Unable to load patients. Please try again later.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [token, page, limit]);

    useEffect(() => {
        fetchPatientList();
    }, [token, page]);

    const handlePressLogout = () => {
        logout();
    };

    return (
        <>
            <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
                <FlatList
                    data={patients}
                    keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
                    contentContainerStyle={{ paddingBottom: 16, marginBottom: 80 }}
                    ListHeaderComponent={
                        <>
                            <Header user={user} />
                            <View style={styles.rowContainerOne}>
                                <TouchableOpacity onPress={() => navigation.navigate('AddPatient')}>
                                    <View style={[styles.boxOne, { backgroundColor: '#F9F5FF' }]}>
                                        <View style={[styles.iconOne, { width: 50, alignItems: 'center' }]}>
                                            <FontAwesome6 name='user-large' size={24} style={{ color: '#254EDB' }} />
                                        </View>
                                        <View style={styles.textContainer}>
                                            <Text style={styles.textOne}>Admit Patients</Text>
                                            <Text style={styles.subTextOne} numberOfLines={2}>Get instant Disbursement</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate('Loans')}>
                                    <View style={[styles.boxOne, { backgroundColor: '#EDFCF2' }]}>
                                        <View style={[styles.iconOne, { backgroundColor: '#AAF0C4', width: 50, alignItems: 'center' }]}>
                                            <FontAwesome6 name='newspaper' size={24} style={{ color: '#16B364' }} />
                                        </View>
                                        <View style={styles.textContainer}>
                                            <Text style={styles.textOne}>Edit Patient</Text>
                                            <Text style={styles.subTextOne} numberOfLines={2}>Edit The Patient Details</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.rowContainerTwo}>
                                <TouchableOpacity>
                                    <View style={[styles.boxOne, { backgroundColor: '#FEF6EE' }]}>
                                        <View style={[styles.iconOne, { backgroundColor: '#F9DBAF', width: 50, alignItems: 'center' }]}>
                                            <FontAwesome6 name='user-large' size={24} style={{ color: '#EF6820' }} />
                                        </View>
                                        <View style={styles.textContainer}>
                                            <Text style={styles.textOne}>Discharge Patient</Text>
                                            <Text style={[styles.subTextOne, { fontSize: 14 }]} numberOfLines={2}>Update The Discharge Details</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate('Support')}>
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
                            <View style={{ padding: 20 }}>
                                <Text style={{ fontFamily: 'Lexend_500Medium', fontSize: 22, marginTop: 10 }}>Patient List</Text>
                            </View>
                        </>
                    }
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('PatientDetails', { id: item.id })}
                            accessibilityRole="button"
                            key={item.id}
                            style={{ paddingHorizontal: 20 }}
                            accessibilityLabel={`View details for ${item.first_name} ${item.last_name}`}
                        >
                            <View style={styles.patientCard}>
                                <View>
                                    <Text style={styles.patientName}>
                                        {`${item.first_name} ${item.middle_name || ''} ${item.last_name}`}
                                    </Text>
                                    <Text style={[styles.patientDate, { fontFamily: 'Lexend_200ExtraLight' }]}>
                                        {new Date(item.created_at).toDateString()}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.patientStatus}>{item.status}</Text>
                                    <Feather name='chevron-right' size={28} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    initialNumToRender={1}
                    ListEmptyComponent={
                        <Text style={styles.emptyListText}>
                            No patients found
                        </Text>
                    }
                />
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
    patientCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 1,
        shadowColor: '#D4D4D4',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1.41,
        borderLeftWidth: 8,
        borderColor: '#008AFF'
    },
    patientName: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Lexend_600SemiBold'
    },
});

export default DashboardScreen;
