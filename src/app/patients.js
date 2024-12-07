import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import Header from '../components/header';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useFontContext } from '../context/FontContext';
import { patientList } from '../config/api';
import { debounce } from 'lodash';

const PatientsScreen = ({ navigation }) => {
    const { user, token } = useAuth();
    const { fontsLoaded } = useFontContext();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterVisible, setFilterVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [totalRecords, setTotalRecords] = useState()

    const fetchPatientList = useCallback(async (resetPage = false, pageToFetch = page) => {
        if (loading) return; //new

        try {
            setLoading(true);

            const currentPage = resetPage ? 1 : pageToFetch;

            // const response = await patientList(token, currentPage, limit);

            const response = await patientList(token, currentPage, limit, {
                search: searchQuery,
                status: selectedStatus
            });

            const { data, pagination } = response.data;

            setPatients(prevPatients =>
                resetPage ? data : [...prevPatients, ...data]
            );

            setPage(currentPage);
            setTotalPages(pagination.totalPages);
            setTotalRecords(pagination.totalRecords)
        } catch (error) {
            console.error('Failed to fetch patients:', error);
            Alert.alert('Error', 'Unable to load patients. Please try again later.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [token, page, limit, searchQuery, selectedStatus]);

    useEffect(() => {
        fetchPatientList(true, 1);
    }, [token]);

    const filteredPatients = useMemo(() => {
        return patients.filter((patient) => {
            const fullName = `${patient.first_name} ${patient.middle_name || ''} ${patient.last_name}`.toLowerCase();
            const email = patient.email?.toLowerCase() || '';
            const phoneNumber = patient.phone_number?.toLowerCase() || '';
            const searchQueryLower = searchQuery.toLowerCase();

            const matchesSearch =
                fullName.includes(searchQueryLower) ||
                email.includes(searchQueryLower) ||
                phoneNumber.includes(searchQueryLower);

            const matchesStatus =
                selectedStatus === 'All' ||
                selectedStatus === '' ||
                patient.status === selectedStatus;

            return matchesSearch && matchesStatus;
        });
    }, [patients, searchQuery, selectedStatus]);

    // const handleEndReached = () => {
    //     if (page < totalPages && !loading) {
    //         const nextPage = page + 1;
    //         setPage(nextPage);
    //         fetchPatientList(false);
    //     }
    // };

    const handleEndReached = () => {

        if (page < totalPages && !loading) {
            const nextPage = page + 1;
            fetchPatientList(false, nextPage);
        }
    };

    // Debounced Search Handler
    const debouncedSearch = useCallback(
        debounce((query) => {
            setSearchQuery(query);
            setPage(1);
            fetchPatientList(true);
        }, 1000),
        [fetchPatientList]
    );

    // Refresh Control
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchPatientList(true);
    }, [fetchPatientList]);

    const statuses = ['All', 'Admitted', 'Discharged', 'Under Observation'];

    const handleFilterApply = (status) => {
        setSelectedStatus(status);
        setFilterVisible(false);
        setPage(1); // Reset to page 1 when filter changes
        fetchPatientList(true); // Fetch data with the new filter
    };

    const handleAddPatient = () => {
        navigation.navigate('AddPatient');
    };

    return (
        <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
            <Header user={user} />

            <Text style={styles.screenTitle}>Patient List</Text>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search patients"
                    onChangeText={(text) => debouncedSearch(text)}
                    accessibilityLabel="Search patients"
                />
            </View>
            <View style={{ paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 14, textAlign: 'right', fontFamily: 'Lexend_400Regular' }}>{totalRecords ? `Total Patients ${totalRecords}` : ''}</Text>
            </View>

            <FlatList
                data={filteredPatients}
                keyExtractor={(item) => `${item.patient_id}`}
                contentContainerStyle={{ padding: 16 }}
                style={{ marginBottom: 80 }}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('PatientDetails', { id: item.patient_id })}
                        accessibilityRole="button"
                        key={item.patient_id}
                        accessibilityLabel={`View details for ${item.first_name} ${item.last_name}`}
                    >
                        <View style={styles.patientCard}>
                            <View>
                                <Text style={styles.patientName}>
                                    {`${item.first_name} ${item.middle_name || ''} ${item.last_name} `}
                                </Text>
                                <Text style={styles.patientData}>{item.email}</Text>
                                <Text style={styles.patientData}>{item.phone_number}</Text>
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
                ListEmptyComponent={
                    <Text style={styles.emptyListText}>
                        No patients found
                    </Text>
                }
                ListFooterComponent={loading ? <ActivityIndicator size="large" color="#007AFF" /> : null}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />

            <View style={styles.addPatientContainer}>
                <TouchableOpacity
                    style={styles.addPatientButton}
                    onPress={handleAddPatient}
                    accessibilityLabel="Add new patient"
                >
                    <Ionicons name="add-outline" size={38} color="#fff" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    searchInput: {
        flex: 1,
        height: 60,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        fontFamily: 'Lexend_400Regular'
    },
    filterButton: {
        marginLeft: 10,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        height: 60,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
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
    patientStatus: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
        fontFamily: 'Lexend_500Medium'
    },
    patientData: {
        fontSize: 12,
        color: '#888',
        fontFamily: 'Lexend_300Light',
    },
    patientDate: {
        fontSize: 12,
        color: '#888',
        fontFamily: 'Lexend_300Light',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterModal: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 16,
        fontFamily: 'Lexend_600SemiBold'
    },
    applyFilterButton: {
        marginTop: 20,
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    applyFilterText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Lexend_400Regular'
    },
    closeModalButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    addPatientContainer: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    addPatientButton: {
        backgroundColor: '#007AFF',
        borderRadius: 100,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    addPatientText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
    },
    emptyListText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 18,
        color: '#888',
        fontFamily: 'Lexend_500Medium'
    },
    screenTitle: {
        textAlign: 'center',
        fontSize: 28,
        fontFamily: 'Lexend_500Medium',
        marginBottom: 10
    }

});

export default PatientsScreen;
