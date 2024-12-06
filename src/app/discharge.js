import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import Header from '../components/header';
import { FontAwesome6 } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { caseList, patientList } from '../config/api';
import { debounce } from 'lodash';
import { Feather } from '@expo/vector-icons';

const LoansScreen = ({ navigation }) => {

    const { logout, user, token } = useAuth();
    const [caseData, setCaseData] = useState([])
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);


    const fetchCaseList = async () => {

        try {
            setLoading(true)
            const data = await caseList(token);
            setCaseData(data.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
            setRefreshing(false);
        }
    }

    useEffect(() => {
        if (token) {
            fetchCaseList();
        }
    }, [token])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchCaseList(true);
    }, []);


    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <Header user={user} />
                <Text style={styles.screenTitle}>Discharge Patient List</Text>
                <FlatList
                    data={caseData}
                    style={{ marginBottom: 80 }}
                    keyExtractor={(item, index) => `${item.case_id || index}`}
                    contentContainerStyle={{ padding: 16 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('DischargeDetails', { id: item.case_id, data: item })}
                            accessibilityRole="button"
                            accessibilityLabel={`View details for ${item.first_name} ${item.last_name}`}
                        >
                            <View style={styles.patientCard}>
                                <View>
                                    <Text style={styles.patientName}>
                                        {`${item.first_name} ${item.middle_name || ''} ${item.last_name} `}
                                    </Text>
                                    <Text style={[styles.patientData, { fontFamily: 'Lexend_400Regular' }]}>{item?.treatment_name ? `Treatment Name: ${item.treatment_name}` : 'N/A'}</Text>
                                    <Text style={[styles.patientData, { fontFamily: 'Lexend_400Regular' }]}>{item?.estimated_amount ? `Estimated Amount: ${item.estimated_amount}` : 'N/A'}</Text>
                                    <Text style={[styles.patientData, { color: 'red' }]}>{item.status_name}</Text>
                                    <Text style={[styles.patientDate, { fontFamily: 'Lexend_200ExtraLight' }]}>
                                        {new Date(item.expected_doa).toDateString() ? `Date Of Admission ${new Date(item.expected_doa).toDateString()}` : 'N/A'}
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
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
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

export default LoansScreen;
