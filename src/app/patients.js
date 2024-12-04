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

    // Memoized Filtered Patients
    const filteredPatients = useMemo(() => {
        return patients.filter((patient) => {
            const fullName = `${patient.first_name} ${patient.middle_name || ''} ${patient.last_name}`.toLowerCase();
            const matchesSearch = fullName.includes(searchQuery.toLowerCase());
            const matchesStatus =
                selectedStatus === 'All' ||
                selectedStatus === '' ||
                patient.status === selectedStatus;
            return matchesSearch && matchesStatus;
        });
    }, [patients, searchQuery, selectedStatus]);

    // Pagination Handler
    const handleEndReached = () => {
        if (page < totalPages && !loading) {
            setPage(prevPage => prevPage + 1);
        }
    };

    // Debounced Search Handler
    const debouncedSearch = useCallback(
        debounce((query) => {
            setSearchQuery(query);
        }, 300),
        []
    );

    // Refresh Control
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchPatientList(true);
    }, []);

    const statuses = ['All', 'Admitted', 'Discharged', 'Under Observation'];

    const handleFilterApply = (status) => {
        setSelectedStatus(status);
        setFilterVisible(false);
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
                {/* <TouchableOpacity
                    onPress={() => setFilterVisible(true)}
                    style={styles.filterButton}
                    accessibilityLabel="Filter patients"
                >
                    <Ionicons name="filter" size={24} color="#fff" />
                </TouchableOpacity> */}
            </View>

            <FlatList
                data={filteredPatients}
                keyExtractor={(item, index) => `${item.patient_id || index}`}
                contentContainerStyle={{ padding: 16 }}
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
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={21}
                removeClippedSubviews={true}
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

            <Modal
                visible={isFilterVisible}
                transparent={true}
                animationType="slide"
                accessibilityLabel="Filter patients modal"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.filterModal}>
                        <Text style={styles.modalTitle}>Filter by Status</Text>
                        {statuses.map((status, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleFilterApply(status)}
                                style={[
                                    styles.filterOption,
                                    selectedStatus === status && styles.selectedFilterOption,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.filterOptionText,
                                        selectedStatus === status && styles.selectedFilterText,
                                    ]}
                                >
                                    {status}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={styles.closeModalButton}
                            onPress={() => setFilterVisible(false)}
                        >
                            <Ionicons name="close-circle" size={28} color="#d9534f" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
