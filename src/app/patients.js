import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, FlatList, Modal, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import Header from '../components/header';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useFontContext } from '../context/FontContext';

const PatientsScreen = ({ navigation }) => {

    const { user } = useAuth();
    const { fontsLoaded } = useFontContext();

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );;
    }

    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterVisible, setFilterVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');

    const patients = [
        { id: '1', name: 'John Doe', status: 'Admitted', date: '2024-11-25', email: 'john@mail.com', phone_number: '1234567890' },
        { id: '2', name: 'Jane Smith', status: 'Discharged', date: '2024-11-20', email: 'jane@mail.com', phone_number: '1234567890' },
        { id: '3', name: 'Michael Brown', status: 'Under Observation', date: '2024-11-22', email: 'michael@mail.com', phone_number: '1234567890' },
        { id: '4', name: 'Michael Brown', status: 'Under Observation', date: '2024-11-22', email: 'michael@mail.com', phone_number: '1234567890' },
        { id: '5', name: 'Michael Brown', status: 'Under Observation', date: '2024-11-22', email: 'michael@mail.com', phone_number: '1234567890' },
        { id: '6', name: 'Michael Brown', status: 'Under Observation', date: '2024-11-22', email: 'michael@mail.com', phone_number: '1234567890' },
        { id: '7', name: 'Michael Brown', status: 'Under Observation', date: '2024-11-22', email: 'michael@mail.com', phone_number: '1234567890' },
        { id: '8', name: 'Michael Brown', status: 'Under Observation', date: '2024-11-22', email: 'michael@mail.com', phone_number: '1234567890' },
        { id: '9', name: 'Michael Brown', status: 'Under Observation', date: '2024-11-22', email: 'michael@mail.com', phone_number: '1234567890' },
        { id: '10', name: 'Michael Brown', status: 'Under Observation', date: '2024-11-22', email: 'michael@mail.com', phone_number: '1234567890' },
    ];

    const statuses = ['All', 'Admitted', 'Discharged', 'Under Observation'];

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const filteredPatients = patients.filter((patient) => {
        const matchesSearch =
            patient.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            selectedStatus === 'All' || selectedStatus === '' || patient.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const handleFilterApply = (status) => {
        setSelectedStatus(status);
        setFilterVisible(false);
    };

    const handleAddPatient = () => {
        navigation.navigate('AddPatient')
    };

    return (
        <>
            <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
                <Header user={user} />

                <Text style={{ textAlign: 'center', fontSize: 28, fontFamily: 'Lexend_500Medium', marginBottom: 10 }}>Patient List</Text>

                {/* Search & Filter */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search patients"
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    <TouchableOpacity onPress={() => setFilterVisible(true)} style={styles.filterButton}>
                        <Ionicons name="filter" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={filteredPatients}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 16 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity>
                            <View style={styles.patientCard}>
                                <View>
                                    <Text style={styles.patientName}>{item.name}</Text>
                                    <Text style={styles.patientData}>{item.email}</Text>
                                    <Text style={styles.patientData}>{item.phone_number}</Text>
                                </View>
                                <View>
                                    <Text style={styles.patientStatus}>{item.status}</Text>
                                    <Text style={styles.patientDate}>{item.date}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />

                <View style={styles.addPatientContainer}>
                    <TouchableOpacity
                        style={styles.addPatientButton}
                        onPress={handleAddPatient}
                    >
                        <Ionicons name="add-outline" size={38} color="#fff" />
                    </TouchableOpacity>
                </View>

                <Modal
                    visible={isFilterVisible}
                    transparent={true}
                    animationType="slide"
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
        </>
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
        textAlign: 'right'
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
});

export default PatientsScreen;
