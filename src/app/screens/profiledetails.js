import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useFontContext } from '../../context/FontContext';
import Icons from '@expo/vector-icons/Feather'
import { profileInfoApi } from '../../config/api';

import Toast from 'react-native-toast-message';

const MyProfileDetailScreen = ({ navigation }) => {

    const { user, logout, token } = useAuth();
    const [profileData, setProfileData] = useState([])
    const [profileDataLoading, setProfileDataLoading] = useState(true);

    const handleBackPress = () => {
        navigation.goBack();
    }

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    useEffect(() => {

        const fetchProfileDetails = async () => {
            try {
                setProfileDataLoading(true);

                const data = await profileInfoApi(token);

                setProfileData(data.data.data);

            } catch (error) {

                Toast.show({
                    type: 'error',
                    position: 'top',
                    text1: 'Something Went Wrong',
                    visibilityTime: 5000,
                    autoHide: true,
                    draggable: true,
                    topOffset: 100,
                    bottomOffset: 40,
                });

            } finally {
                setProfileDataLoading(false);
            }
        }

        if (token) {
            fetchProfileDetails();
        }

    }, [token])

    if (!token) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        )
    }

    return (
        <>
            {
                profileDataLoading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                        <ActivityIndicator size="large" color="#007AFF" />
                    </View>
                ) : (
                    profileData ? (
                        <>
                            <SafeAreaView style={styles.container}>
                                <View style={styles.headerContainer}>
                                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                                        <Icons name='chevron-left' size={28} color="#000" />
                                    </TouchableOpacity>
                                    <View style={styles.titleContainer}>
                                        <Text style={styles.titleText}>My Profile</Text>
                                    </View>
                                </View>
                                <View style={styles.contentContainer}>
                                    <Text style={[styles.text, { paddingBottom: 20, color: 'orange', fontFamily: 'Lexend_300Light' }]}>Note: To Change Any Information Of Your profile Please Contact Support Team</Text>
                                    <ScrollView style={{ marginBottom: 80 }}>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.inputLabel}>
                                                Name<Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                placeholder="Name"
                                                value={profileData.hospital_name}
                                                onChangeText={(text) =>
                                                    handleInputChange('firstName', text)
                                                }
                                                style={styles.input}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.inputLabel}>
                                                Email<Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                placeholder="Email"
                                                value={profileData.email}
                                                onChangeText={(text) =>
                                                    handleInputChange('email', text)
                                                }
                                                style={styles.input}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.inputLabel}>
                                                Phone Number<Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                placeholder="Phone Number"
                                                value={profileData.phone_number || ''}
                                                onChangeText={(text) =>
                                                    handleInputChange('phone_number', text)
                                                }
                                                style={styles.input}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.inputLabel}>
                                                Address Line 1<Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                placeholder="Address Line 1"
                                                value={profileData.address_line_1 || ''}
                                                onChangeText={(text) =>
                                                    handleInputChange('address_line_1', text)
                                                }
                                                style={styles.input}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.inputLabel}>
                                                Address Line 2
                                            </Text>
                                            <TextInput
                                                placeholder="Address Line 2"
                                                value={profileData.address_line_2 || ''}
                                                onChangeText={(text) =>
                                                    handleInputChange('address_line_2', text)
                                                }
                                                style={styles.input}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.inputLabel}>
                                                City<Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                placeholder="City"
                                                value={profileData.city || ''}
                                                onChangeText={(text) =>
                                                    handleInputChange('city', text)
                                                }
                                                style={styles.input}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.inputLabel}>
                                                State<Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                placeholder="State"
                                                value={profileData.state || ''}
                                                onChangeText={(text) =>
                                                    handleInputChange('state', text)
                                                }
                                                style={styles.input}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.inputLabel}>
                                                Pin Code<Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                placeholder="Pin Code"
                                                value={profileData.pincode || ''}
                                                onChangeText={(text) =>
                                                    handleInputChange('pincode', text)
                                                }
                                                style={styles.input}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.inputLabel}>
                                                Country<Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                            <TextInput
                                                placeholder="Country"
                                                value='INDIA'
                                                onChangeText={(text) =>
                                                    handleInputChange('country', text)
                                                }
                                                style={styles.input}
                                            />
                                        </View>

                                    </ScrollView>
                                </View>
                                <Toast />
                            </SafeAreaView >
                        </>
                    ) : (
                        <Text>No Profile Data</Text>
                    )
                )
            }
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#fff'
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    backButton: {
        position: 'absolute',
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
    },
    contentContainer: {
        flex: 1,
        marginTop: 40
    },
    text: {
        fontFamily: 'Lexend_300Light',
        textAlign: 'justify',
        fontSize: 14,
        color: '#101317',
        lineHeight: 18
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontFamily: 'Lexend_700Bold',
        marginBottom: 5,
    },
    input: {
        padding: 10,
        height: 50,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#D4D4D4',
        justifyContent: 'center'
    },
})

export default MyProfileDetailScreen;
