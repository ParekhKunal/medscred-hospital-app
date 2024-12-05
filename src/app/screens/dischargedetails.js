import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Vibration, Image, Button, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import Icons from '@expo/vector-icons/Feather'
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import Toast from 'react-native-toast-message';
import { dischargeDataUpdate, getDischargeDetail } from '../../config/api';

const DischargeDetailScreen = ({ route, navigation }) => {

    const { user, token } = useAuth();

    const { id, data } = route.params || {};  // Safely access params

    const handleBackPress = () => {
        navigation.goBack();
    }
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dischargeData, setDischargeData] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);

    const [formData, setFormData] = useState({
        caseId: id,
        date_of_admission: '',
        discharge_date: '',
        mrn_number: '',
        final_bill_amount: '',
        final_bill: '', //doc
        discharge_summary: '',
        showModal: false,
        selectedField: '',
        bank_name: '',
        account_holder_name: '',
        account_number: '',
        bank_doc: null,
    });

    const toggleModal = (field) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            showModal: !prevFormData.showModal,
            selectedField: field,
        }));
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) {
            return `${bytes} bytes`;
        } else if (bytes < 1048576) {
            return `${(bytes / 1024).toFixed(2)} KB`;
        } else {
            return `${(bytes / 1048576).toFixed(2)} MB`;
        }
    };

    const pickImage = async (isCamera) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const { cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted' && cameraStatus !== 'granted') {
            Alert.alert('Permission Denied', 'We need permission to access your media library and camera.');
            return;
        }

        let result;

        if (isCamera) {
            result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 1,
            });
        } else {
            // Launch image picker (gallery)
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaType,
                allowsEditing: true,
                quality: 1,
            });
        }

        if (!result.canceled) {

            const { uri, fileSize, width, height } = result.assets[0];

            const compressedImage = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 1200 } }],
                { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
            );

            const compressedFileSize = compressedImage.uri ? await getFileSize(compressedImage.uri) : 0;

            const formattedSize = formatFileSize(compressedFileSize);

            // [formData.selectedField]: result.assets[0].uri,
            setFormData((prevFormData) => ({
                ...prevFormData,
                [formData.selectedField]: compressedImage.uri,
            }));
            setFormData((prevFormData) => ({
                ...prevFormData,
                showModal: false,
            }));
        }
    };

    const getFileSize = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob.size;
    };

    const pickPDF = async () => {

        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/pdf',
        });

        if (result.canceled) {
            return;
        }

        if (result.assets && result.assets.length > 0) {
            const file = result.assets[0];

            setFormData((prevFormData) => ({
                ...prevFormData,
                [formData.selectedField]: file.uri,
                showModal: false,
            }));
        } else {
            console.log('No document selected');
        }
    };

    const renderFilePreview = (fileName) => {

        if (formData[fileName]) {
            const fileUri = formData[fileName];

            if (fileUri.endsWith('.jpg') || fileUri.endsWith('.jpeg') || fileUri.endsWith('.png')) {
                return <Image source={{ uri: fileUri }} style={styles.imagePreview} />;
            }
            else if (fileUri.endsWith('.pdf')) {
                return (
                    <View style={styles.pdfPreviewContainer}>
                        <Text style={styles.fileName}>PDF Uploaded: {fileName}</Text>
                    </View>
                );
            }
        }

        return null;
    };

    const handleInputChange = (field, value) => {

        if (field === 'pan_card') {
            setErrors((prev) => ({
                ...prev,
                pan_card: value.length === 10 ? '' : 'PAN Card must be 10 digits',
            }));
        }

        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // setFormData({ ...formData, [field]: value });
    };

    const isFormValid = () => {
        if (currentStep === 3) {
            if (formData.loan_type == 1) {
                const fieldNames = {
                    passportPhoto: 'Patient Passort Photo',
                    aadhaarFront: 'Aadhaar Card Front',
                    aadhaarBack: 'Aadhaar Card Back',
                    aadhaarBack: 'PAN Card',
                    insuranceCard: 'Insurance Card',
                    insuredAadhaarFront: 'Insured Aadhaar Card Front',
                    insuredAadhaarBack: 'Insured Aadhaar Card Back',
                    insuredPanCard: 'Insured Pan Card',
                    insuredInsuranceCard: 'Insured Insurance Card',
                };

                let requiredFields

                if (formData.relationship_with_insured != 'SELF') {

                    requiredFields = ['passportPhoto', 'aadhaarFront', 'aadhaarBack', 'aadhaarBack', 'insuranceCard', 'insuredAadhaarFront', 'insuredAadhaarBack', 'insuredPanCard', 'insuredInsuranceCard'];
                } else {
                    requiredFields = ['passportPhoto', 'aadhaarFront', 'aadhaarBack', 'aadhaarBack', 'insuranceCard'];
                }
                const missingFields = [];

                requiredFields.forEach(field => {
                    if (!formData[field]) {
                        missingFields.push(fieldNames[field]);
                    }
                });

                if (missingFields.length > 0) {

                    Vibration.vibrate(400);

                    const message = `Please fill the following fields in Step 1: ${missingFields.join(', ')}`;
                    Toast.show({
                        type: 'error',
                        position: 'top',
                        text1: 'Form Incomplete',
                        text2: message,
                        visibilityTime: 5000,
                        autoHide: true,
                        draggable: true,
                        topOffset: 100,
                        bottomOffset: 40,
                    });
                    return false;
                }
            }
        }
        return true;
    };

    const onFinsh = async () => {
        try {
            console.log('Full formData:', formData); // Debug log

            const formDataPayload = new FormData();

            // Add other form fields
            Object.keys(formData).forEach(key => {
                if (key !== 'showModal' && key !== 'selectedField' && formData[key] != null) {
                    if (formData[key] instanceof Date) {
                        formDataPayload.append(key, formData[key].toISOString());
                    } else {
                        formDataPayload.append(key, formData[key]);
                    }
                }
            });

            if (formData.final_bill && formData.final_bill.length !== 0) {
                const fileUri = formData.final_bill;

                if (typeof fileUri === 'string') {
                    const fileType = fileUri.toLowerCase().includes('.pdf')
                        ? 'application/pdf'
                        : 'image/jpeg';
                    const fileName = fileUri.split('/').pop();

                    formDataPayload.append('final_bill', {
                        uri: fileUri,
                        type: fileType,
                        name: fileName
                    });
                }
            }

            if (formData.bank_doc && formData.bank_doc.length !== 0) {
                const fileUri = formData.bank_doc;

                if (typeof fileUri === 'string') {
                    const fileType = fileUri.toLowerCase().includes('.pdf')
                        ? 'application/pdf'
                        : 'image/jpeg';
                    const fileName = fileUri.split('/').pop();

                    formDataPayload.append('bank_doc', {
                        uri: fileUri,
                        type: fileType,
                        name: fileName
                    });
                }
            }

            const response = await dischargeDataUpdate(token, formDataPayload);

            console.log('Payload ready to send', response.data);
        } catch (error) {
            console.error('Upload error:', error);
        }
    }

    useEffect(() => {

        const fetchDischargeData = async () => {

            try {

                const response = await getDischargeDetail(token, id);

                if (response.status == 404) {
                    console.log('No Data Found');
                }

                setFormData((prevFormData) => ({
                    ...prevFormData,
                    ...response.data.data,
                }));

            } catch (error) {
                console.log(error);
            }
        }

        if (token) {
            fetchDischargeData()
        }
    }, [token, id])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                    <Icons name='chevron-left' size={28} color="#000" />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>Discharge Details</Text>
                </View>
            </View>
            <View style={styles.contentContainer}>
                <View style={{ backgroundColor: '#F0F8FF', borderRadius: 6, padding: 20 }}>
                    <Text>Case Id: {id}</Text>
                    <Text style={{ fontSize: 18, fontFamily: 'Lexend_500Medium' }}>{data.first_name} {data.middle_name ? data.middle_name : ''} {data.last_name}</Text>
                    <Text style={{ fontSize: 14, fontFamily: 'Lexend_300Light' }}>
                        {data.treatment_name ? `Treatment Name: ${data.treatment_name}` : 'Treatment Name: N/A'}
                    </Text>
                    <Text style={{ fontSize: 12, fontFamily: 'Lexend_300Light' }}>
                        {data.estimated_amount ? `Estimated Amount: ${data.estimated_amount}` : 'Estimated Amount: N/A'}
                    </Text>
                    <Text style={{ fontSize: 12, fontFamily: 'Lexend_300Light' }}>
                        {data.estimated_stay ? `Estimated Stay: ${data.estimated_stay}` : 'Estimated Stay: N/A'}
                    </Text>
                </View>
                {
                    data.status_name &&
                    <View style={{ backgroundColor: 'red', padding: 10, borderRadius: 6, marginTop: 10 }}>
                        <Text style={{ textAlign: 'center', fontFamily: 'Lexend_700Bold', fontSize: 16, color: '#fff' }}>{data.status_name ? `Case Status: ${data.status_name}` : ''}</Text>
                    </View>
                }
                <ScrollView style={{ marginBottom: 100 }}>
                    <View>
                        <View style={{ marginTop: 20, marginBottom: 20 }}>
                            <Text style={{ fontFamily: 'Lexend_600SemiBold', fontSize: 18, textAlign: 'center' }}>Update Discharge & Bank Details</Text>
                        </View>
                        <View style={{ height: 1, backgroundColor: '#ECECEC', alignSelf: 'stretch', opacity: 0.5, marginBottom: 20 }} />
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                                Account Number<Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TextInput
                                placeholder="Account Number"
                                value={formData.account_number}
                                onChangeText={(text) =>
                                    handleInputChange('account_number', text)
                                }
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                                Account Holder Name<Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TextInput
                                placeholder="Account Holder Name"
                                value={formData.account_holder_name}
                                onChangeText={(text) =>
                                    handleInputChange('account_holder_name', text)
                                }
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                                Bank Name<Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TextInput
                                placeholder="Bank Name"
                                value={formData.bank_name}
                                onChangeText={(text) =>
                                    handleInputChange('bank_name', text)
                                }
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                                IFSC Code<Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TextInput
                                placeholder="IFSC Code"
                                value={formData.ifsc_code}
                                onChangeText={(text) =>
                                    handleInputChange('ifsc_code', text)
                                }
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                                Upload Cancelled Cheque<Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TouchableOpacity onPress={() => toggleModal('bank_doc')} style={styles.uploadButton}>
                                <Text style={styles.uploadButtonText}>Upload Cancelled Cheque or Take Photo</Text>
                            </TouchableOpacity>
                            {renderFilePreview('bank_doc')}
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                                Date of Admission<Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                style={styles.input}
                            >
                                <Text style={styles.inputText}>
                                    {formData.date_of_admission ? new Date(formData.date_of_admission).toISOString().split('T')[0] : 'Select Date'}
                                </Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={formData.date_of_admission || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        if (selectedDate) {
                                            handleInputChange(
                                                'date_of_admission',
                                                selectedDate
                                            );
                                        }
                                        setShowDatePicker(false);
                                    }}
                                />
                            )}
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                                Discharge Date<Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                style={styles.input}
                            >
                                <Text style={styles.inputText}>
                                    {formData.discharge_date ? new Date(formData.discharge_date).toISOString().split('T')[0] : 'Select Date'}
                                </Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={formData.discharge_date || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        if (selectedDate) {
                                            handleInputChange(
                                                'discharge_date',
                                                selectedDate
                                            );
                                        }
                                        setShowDatePicker(false);
                                    }}
                                />
                            )}
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                                Final Bill Amount<Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TextInput
                                placeholder="Final Bill Amount"
                                value={formData.final_bill_amount}
                                onChangeText={(text) =>
                                    handleInputChange('final_bill_amount', text)
                                }
                                style={styles.input}
                                keyboardType="number-pad"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                                MRN Number
                            </Text>
                            <TextInput
                                placeholder="MRN Number"
                                value={formData.mrn_number}
                                onChangeText={(text) =>
                                    handleInputChange('mrn_number', text)
                                }
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                                Invoice Number
                            </Text>
                            <TextInput
                                placeholder="Invoice Number"
                                value={formData.invoice_number}
                                onChangeText={(text) =>
                                    handleInputChange('invoice_number', text)
                                }
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                                Upload Final PDF<Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TouchableOpacity onPress={() => toggleModal('final_bill')} style={styles.uploadButton}>
                                <Text style={styles.uploadButtonText}>Upload Final Bill PDF or Take Photo</Text>
                            </TouchableOpacity>
                            {renderFilePreview('final_bill')}
                        </View>
                        <View >
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    { backgroundColor: '#008AFF', justifyContent: 'center', width: '100%' }
                                ]}
                                onPress={onFinsh}
                            >
                                <Text style={[styles.buttonText, { color: '#fff' }]}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
            <Modal
                visible={formData.showModal}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setFormData({ ...formData, showModal: false })}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Choose Upload Option</Text>
                        <TouchableOpacity onPress={() => pickImage(true)} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Take Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => pickImage(false)} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Upload Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={pickPDF} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Upload PDF</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setFormData({ ...formData, showModal: false })}
                            style={[styles.modalButton, styles.cancelButton]}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
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
    inputContainer: {
        marginBottom: 20,
    },
    contentContainer: {
        flex: 1,
        marginTop: 40,
        height: '100%'
    },
    input: {
        padding: 10,
        height: 50,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#D4D4D4',
        justifyContent: 'center'
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 70,
        backgroundColor: 'white',
    },
    button: {
        backgroundColor: '#008AFF',
        padding: 10,
        borderRadius: 6,
        width: 100,
    },
    disabledButton: {
        backgroundColor: '#ccc',
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Lexend_700Bold',
    },
    inputLabel: {
        fontSize: 14,
        fontFamily: 'Lexend_700Bold',
        marginBottom: 5,
    },
    titleText: {
        textAlign: 'center',
        fontSize: 28,
        fontFamily: 'Lexend_700Bold',
    },
    descriptionText: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Lexend_300Light',
        marginTop: 10,
    },
    infoText: {
        fontSize: 16,
        fontFamily: 'Lexend_400Regular',
        textAlign: 'center',
        marginVertical: 20,
    },
    picker: {
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
        alignSelf: 'center',
    },
    uploadButtonText: {
        color: '#000',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'Lexend_700Bold',
    },
    uploadButton: {
        backgroundColor: 'transparent',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#D4D4D4'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    modalButton: {
        backgroundColor: '#008AFF',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 8,
        marginVertical: 8,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#dc3545',
    },
    pdfPreviewContainer: {
    },
    error: {
        color: 'red',
        fontSize: 12,
    },
})

export default DischargeDetailScreen;
