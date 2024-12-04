import React, { useState, useRef, forwardRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView, TextInput, Vibration, Image, Modal, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext'
import { hospitalAccountType } from '../../config/api';

const AddPatientScreen = ({ navigation }) => {
    const { user, token } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [animation] = useState(new Animated.Value(0));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [hospitalType, setHospitalType] = useState([])
    const [errors, setErrors] = useState({ email: '', phone_number: '', aadhar_card: '', pan_card: '' });
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        phone_number: '',
        gender: '',
        date_of_birth: '',
        pan_card: '',
        aadhar_card: '',
        doctor_id: '',
        treatment_name: '',
        treatment_type: '',
        attendant_name: '',
        relationship_with_insured: '',
        estimated_amount: '',
        estimated_stay: '',
        is_patient_admitted: '',
        date_of_admission: '',
        admission_time: '',
        cash_type: '',
        loan_type: '',
        passportPhoto: null,
        aadhaarFront: null,
        aadhaarBack: null,
        panCard: null,
        insuranceCard: null,
        insuredAadhaarFront: null,
        insuredAadhaarBack: null,
        insuredPanCard: null,
        insuredInsuranceCard: null,
        showModal: false,
        selectedField: '',
    });

    useEffect(() => {

        const hospitalType = async () => {
            try {

                const data = await hospitalAccountType(token);

                const processedTypes = data[0]?.account_type.split(',').map((type, index) => ({
                    label: type.trim(),
                    value: index + 1,
                }));

                setHospitalType(processedTypes || []);

            } catch (error) {
                console.error(error)
            }
        }

        hospitalType()

    }, [token]);

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
            console.log('Document selection was canceled');
            return;
        }

        if (result.assets && result.assets.length > 0) {
            const file = result.assets[0];
            console.log('Selected document:', file);

            setFormData((prevFormData) => ({
                ...prevFormData,
                [formData.selectedField]: file.uri,
            }));
        } else {
            console.log('No document selected');
        }
    };

    const renderFilePreview = (fileName) => {
        console.log('Rendering preview for:', fileName);

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

        if (field === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            setErrors((prev) => ({
                ...prev,
                email: emailRegex.test(value) ? '' : 'Invalid email format',
            }));
        }

        if (field === 'phone_number') {
            setErrors((prev) => ({
                ...prev,
                phone_number: value.length === 10 ? '' : 'Phone Number must be 10 digits',
            }));
        }
        if (field === 'aadhar_card') {
            setErrors((prev) => ({
                ...prev,
                aadhar_card: value.length === 12 ? '' : 'Aadhaar Card must be 12 digits',
            }));
        }
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
        if (currentStep === 1) {
            const fieldNames = {
                firstName: 'First Name',
                lastName: 'Last Name',
                email: 'Email Address',
                phone_number: 'Phone Number',
                gender: 'Gender',
                date_of_birth: 'Date of Birth',
                aadhar_card: 'Aadhar Card Number',
                pan_card: 'PAN Card Number',
            };

            const requiredFields = ['firstName', 'lastName', 'email', 'phone_number', 'gender', 'date_of_birth', 'aadhar_card', 'pan_card'];
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
        if (currentStep === 2) {
            if (formData.loan_type == 1) {
                const fieldNames = {
                    treating_doctor_name: 'Doctor Name',
                    treatment_name: 'Treatment Name',
                    treatment_type: 'Treatment Type',
                    attendant_name: 'Attendant Name',
                    relationship_with_insured: 'Relationship With Insured',
                    estimated_amount: 'Estimated Amount',
                    estimated_stay: 'Estimated Stay',
                    is_patient_admitted: 'Is Patient Admitted',
                    date_of_admission: 'Date Of Admission',
                };

                const requiredFields = ['doctor_id', 'treatment_name', 'treatment_type', 'attendant_name', 'relationship_with_insured', 'estimated_amount', 'estimated_stay', 'is_patient_admitted', 'date_of_admission'];
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

    const handleNextStep = () => {
        if (currentStep < 4 && isFormValid()) {
            setCurrentStep(currentStep + 1);
            Animated.timing(animation, {
                toValue: currentStep * 100,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            Animated.timing(animation, {
                toValue: (currentStep - 2) * 100,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    const getStepText = () => {
        switch (currentStep) {
            case 1:
                return 'Patient Info';
            case 2:
                return 'Case Info';
            case 3:
                return 'Document Collections';
            case 4:
                return 'Review and Submit';
            default:
                return '';
        }
    };

    const getStepDescription = () => {
        switch (currentStep) {
            case 1:
                return "Fill in the Patient data. It will take a couple of minutes. You don't need any document here.";
            case 2:
                return 'Provide the details related to the case. It will only take a few seconds.';
            case 3:
                return 'Please upload the required documents.';
            case 4:
                return 'Review the information and submit your form.';
            default:
                return '';
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                                First Name<Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TextInput
                                placeholder="First Name"
                                value={formData.firstName}
                                onChangeText={(text) =>
                                    handleInputChange('firstName', text)
                                }
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Middle Name</Text>
                            <TextInput
                                placeholder="Middle Name"
                                value={formData.middleName}
                                onChangeText={(text) =>
                                    handleInputChange('middleName', text)
                                }
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                                Last Name<Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TextInput
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChangeText={(text) =>
                                    handleInputChange('lastName', text)
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
                                value={formData.email}
                                onChangeText={(text) =>
                                    handleInputChange('email', text)
                                }
                                keyboardType='email-address'
                                style={styles.input}
                            />
                            {errors.phone_number ? <Text style={styles.error}>{errors.email}</Text> : null}
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                                Phone Number<Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TextInput
                                placeholder="Phone Number"
                                value={formData.phone_number}
                                onChangeText={(text) =>
                                    handleInputChange('phone_number', text)
                                }
                                keyboardType='phone-pad'
                                style={styles.input}
                            />
                            {errors.phone_number ? <Text style={styles.error}>{errors.phone_number}</Text> : null}
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Gender<Text style={{ color: 'red' }}>*</Text></Text>
                            <View style={{ borderWidth: 1, height: 50, borderColor: '#D4D4D4', borderRadius: 6, justifyContent: 'center' }}>
                                <Picker
                                    selectedValue={formData.gender}
                                    onValueChange={(itemValue) =>
                                        handleInputChange('gender', itemValue)
                                    }
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Select Gender" value="" />
                                    <Picker.Item label="Male" value="male" />
                                    <Picker.Item label="Female" value="female" />
                                    <Picker.Item label="Other" value="other" />
                                </Picker>
                            </View>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                                Date of Birth<Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                style={styles.input}
                            >
                                <Text style={styles.inputText}>
                                    {formData.date_of_birth ? formData?.date_of_birth?.toISOString()?.split('T')[0] : 'Select Date'}
                                </Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={formData.date_of_birth || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        if (selectedDate) {
                                            handleInputChange(
                                                'date_of_birth',
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
                                Aadhaar Card<Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TextInput
                                placeholder="Aadhaar Card"
                                value={formData.aadhar_card}
                                onChangeText={(text) =>
                                    handleInputChange('aadhar_card', text)
                                }
                                keyboardType='phone-pad'
                                style={styles.input}
                            />
                            {errors.aadhar_card ? <Text style={styles.error}>{errors.aadhar_card}</Text> : null}
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>
                                PAN Card<Text style={{ color: 'red' }}>*</Text>
                            </Text>
                            <TextInput
                                placeholder="PAN Card"
                                value={formData.pan_card}
                                onChangeText={(text) =>
                                    handleInputChange('pan_card', text)
                                }
                                style={styles.input}
                            />
                            {errors.pan_card ? <Text style={styles.error}>{errors.pan_card}</Text> : null}
                        </View>
                    </>
                );
            case 2:
                return (
                    <>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Is Patient Admitted?<Text style={{ color: 'red' }}>*</Text></Text>
                            <View style={{ borderWidth: 1, height: 50, borderColor: '#D4D4D4', borderRadius: 6, justifyContent: 'center' }}>
                                <Picker
                                    selectedValue={formData.loan_type}
                                    onValueChange={(itemValue) =>
                                        handleInputChange('loan_type', itemValue)
                                    }
                                    style={styles.picker}
                                >

                                    {
                                        hospitalType.map((type) => (
                                            <Picker.Item key={type.value} label={type.label} value={type.value} />
                                        ))
                                    }
                                </Picker>
                            </View>
                        </View>
                        {
                            formData.loan_type == 1 &&
                            (
                                <>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>
                                            Treating Doctor Name<Text style={{ color: 'red' }}>*</Text>
                                        </Text>
                                        <TextInput
                                            placeholder="Treating Doctor Name"
                                            value={formData.doctor_id}
                                            onChangeText={(text) =>
                                                handleInputChange('doctor_id', text)
                                            }
                                            style={styles.input}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>Treatment Name<Text style={{ color: 'red' }}>*</Text></Text>
                                        <TextInput
                                            placeholder="Treatment Name"
                                            value={formData.treatment_name}
                                            onChangeText={(text) =>
                                                handleInputChange('treatment_name', text)
                                            }
                                            style={styles.input}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>Treatment Type<Text style={{ color: 'red' }}>*</Text></Text>
                                        <View style={{ borderWidth: 1, height: 50, borderColor: '#D4D4D4', borderRadius: 6, justifyContent: 'center' }}>
                                            <Picker
                                                selectedValue={formData.treatment_type}
                                                onValueChange={(itemValue) =>
                                                    handleInputChange('treatment_type', itemValue)
                                                }
                                                style={styles.picker}
                                            >
                                                <Picker.Item label="Medical Management" value="Medical Management" />
                                                <Picker.Item label="Surgical Management" value="Surgical Management" />
                                            </Picker>
                                        </View>
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>Attendant/Policy Holder Name<Text style={{ color: 'red' }}>*</Text></Text>
                                        <TextInput
                                            placeholder="Attendant/Policy Holder Name"
                                            value={formData.attendant_name}
                                            onChangeText={(text) =>
                                                handleInputChange('attendant_name', text)
                                            }
                                            style={styles.input}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>Relationship With Insured<Text style={{ color: 'red' }}>*</Text></Text>
                                        <View style={{ borderWidth: 1, height: 50, borderColor: '#D4D4D4', borderRadius: 6, justifyContent: 'center' }}>
                                            <Picker
                                                selectedValue={formData.relationship_with_insured}
                                                onValueChange={(itemValue) =>
                                                    handleInputChange('relationship_with_insured', itemValue)
                                                }
                                                style={styles.picker}
                                            >
                                                <Picker.Item label="SELF" value="SELF" />
                                                <Picker.Item label="DEPENDENT CHILD" value="DEPENDENT CHILD" />
                                                <Picker.Item label="SPOUSE" value="SPOUSE" />
                                                <Picker.Item label="MOTHER" value="MOTHER" />
                                                <Picker.Item label="FATHER" value="FATHER" />
                                                <Picker.Item label="OTHER" value="OTHER" />
                                            </Picker>
                                        </View>
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>Estimated Amount<Text style={{ color: 'red' }}>*</Text></Text>
                                        <TextInput
                                            placeholder="Estimated Amount"
                                            value={formData.estimated_amount}
                                            onChangeText={(text) =>
                                                handleInputChange('estimated_amount', text)
                                            }
                                            keyboardType='numeric'
                                            style={styles.input}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>Estimated Stay<Text style={{ color: 'red' }}>*</Text></Text>
                                        <TextInput
                                            placeholder="Estimated Stay"
                                            value={formData.estimated_stay}
                                            onChangeText={(text) =>
                                                handleInputChange('estimated_stay', text)
                                            }
                                            keyboardType='numeric'
                                            style={styles.input}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>Is Patient Admitted?<Text style={{ color: 'red' }}>*</Text></Text>
                                        <View style={{ borderWidth: 1, height: 50, borderColor: '#D4D4D4', borderRadius: 6, justifyContent: 'center' }}>
                                            <Picker
                                                selectedValue={formData.is_patient_admitted}
                                                onValueChange={(itemValue) =>
                                                    handleInputChange('is_patient_admitted', itemValue)
                                                }
                                                style={styles.picker}
                                            >
                                                <Picker.Item label="PLANNED ADMISSION" value="PLANNED ADMISSION" />
                                                <Picker.Item label="PATIENT ADMITTED" value="PATIENT ADMITTED" />
                                            </Picker>
                                        </View>
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
                                                {formData.date_of_admission ? formData.date_of_admission.toISOString().split('T')[0] : 'Select Date'}
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
                                </>
                            )
                        }
                        {
                            formData.loan_type == 2 &&
                            (
                                <>
                                    <View>
                                        <Text>Cashless Form</Text>
                                    </View>
                                </>
                            )
                        }
                        {
                            formData.loan_type == 3 &&
                            (
                                <>
                                    <View>
                                        <Text>Aesthetic Form</Text>
                                    </View>
                                </>
                            )
                        }
                    </>
                );
            case 3:
                return (
                    <>
                        {
                            formData.loan_type == 1 && (
                                <>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>
                                            Upload Passport Photo<Text style={{ color: 'red' }}>*</Text>
                                        </Text>
                                        <TouchableOpacity onPress={() => toggleModal('passportPhoto')} style={styles.uploadButton}>
                                            <Text style={styles.uploadButtonText}>Upload Passport Photo or Take Photo</Text>
                                        </TouchableOpacity>
                                        {renderFilePreview('passportPhoto')}
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>
                                            Aadhaar Card Front<Text style={{ color: 'red' }}>*</Text>
                                        </Text>
                                        <TouchableOpacity onPress={() => toggleModal('aadhaarFront')} style={styles.uploadButton}>
                                            <Text style={styles.uploadButtonText}>Upload Aadhaar Front</Text>
                                        </TouchableOpacity>
                                        {renderFilePreview('aadhaarFront')}
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>
                                            PAN Card<Text style={{ color: 'red' }}>*</Text>
                                        </Text>
                                        <TouchableOpacity onPress={() => toggleModal('panCard')} style={styles.uploadButton}>
                                            <Text style={styles.uploadButtonText}>Upload PAN</Text>
                                        </TouchableOpacity>
                                        {renderFilePreview('panCard')}
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>
                                            Patient/Insured Insurance Card<Text style={{ color: 'red' }}>*</Text>
                                        </Text>
                                        <TouchableOpacity onPress={() => toggleModal('insuranceCard')} style={styles.uploadButton}>
                                            <Text style={styles.uploadButtonText}>Upload Aadhaar Front</Text>
                                        </TouchableOpacity>
                                        {renderFilePreview('insuranceCard')}
                                    </View>

                                    {
                                        formData.relationship_with_insured != 'SELF' &&
                                        (
                                            <>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.inputLabel}>
                                                        Insured Aadhaar Card Front<Text style={{ color: 'red' }}>*</Text>
                                                    </Text>
                                                    <TouchableOpacity onPress={() => toggleModal('insuredAadhaarFront')} style={styles.uploadButton}>
                                                        <Text style={styles.uploadButtonText}>Upload Insured Aadhaar Front</Text>
                                                    </TouchableOpacity>
                                                    {renderFilePreview('insuredAadhaarFront')}
                                                </View>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.inputLabel}>
                                                        Insured Aadhaar Card Front<Text style={{ color: 'red' }}>*</Text>
                                                    </Text>
                                                    <TouchableOpacity onPress={() => toggleModal('insuredAadhaarBack')} style={styles.uploadButton}>
                                                        <Text style={styles.uploadButtonText}>Upload Insured Aadhaar Back</Text>
                                                    </TouchableOpacity>
                                                    {renderFilePreview('insuredAadhaarBack')}
                                                </View>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.inputLabel}>
                                                        Insured PAN Card<Text style={{ color: 'red' }}>*</Text>
                                                    </Text>
                                                    <TouchableOpacity onPress={() => toggleModal('insuredPanCard')} style={styles.uploadButton}>
                                                        <Text style={styles.uploadButtonText}>Upload Insured PAN Card</Text>
                                                    </TouchableOpacity>
                                                    {renderFilePreview('insuredPanCard')}
                                                </View>
                                                <View style={styles.inputContainer}>
                                                    <Text style={styles.inputLabel}>
                                                        Insured Insurance Card<Text style={{ color: 'red' }}>*</Text>
                                                    </Text>
                                                    <TouchableOpacity onPress={() => toggleModal('insuredInsuranceCard')} style={styles.uploadButton}>
                                                        <Text style={styles.uploadButtonText}>Upload Insured Insurance Card</Text>
                                                    </TouchableOpacity>
                                                    {renderFilePreview('insuredInsuranceCard')}
                                                </View>
                                            </>
                                        )
                                    }
                                </>
                            )
                        }
                        {
                            formData.loan_type == 2 && (
                                <>
                                    <View>
                                        <Text>Cashless Document</Text>
                                    </View>
                                </>
                            )
                        }
                        {
                            formData.loan_type == 3 && (
                                <>
                                    <View>
                                        <Text>Aesthetic Document</Text>
                                    </View>
                                </>
                            )
                        }
                    </>
                );
            // case 4:
            //     return (
            //         <Text style={styles.infoText}>
            //             Review and submit the details here.
            //         </Text>
            //     );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.stepsContainer}>
                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ position: 'absolute', left: 0 }}>
                    <Feather name='chevron-left' size={32}></Feather>
                </TouchableOpacity>
                <View
                    style={[
                        styles.step,
                        currentStep >= 1 && styles.activeStep,
                    ]}
                />
                <View
                    style={[styles.line, currentStep >= 2 && styles.activeLine]}
                />
                <View
                    style={[
                        styles.step,
                        currentStep >= 2 && styles.activeStep,
                    ]}
                />
                <View
                    style={[styles.line, currentStep >= 3 && styles.activeLine]}
                />
                <View
                    style={[
                        styles.step,
                        currentStep >= 3 && styles.activeStep,
                    ]}
                />
                {/* <View
                    style={[styles.line, currentStep >= 4 && styles.activeLine]}
                />
                <View
                    style={[
                        styles.step,
                        currentStep >= 4 && styles.activeStep,
                    ]}
                /> */}
            </View>

            <View style={{ marginTop: 20 }}>
                <Text style={styles.titleText}>{getStepText()}</Text>
                <Text style={styles.descriptionText}>
                    {getStepDescription()}
                </Text>
            </View>
            <View
                style={{
                    height: 1,
                    backgroundColor: '#D4D4D4',
                    marginVertical: 20,
                }}
            />
            <ScrollView contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}>
                {renderStepContent()}
            </ScrollView>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        currentStep === 1 && styles.disabledButton,
                    ]}
                    onPress={handlePreviousStep}
                    disabled={currentStep === 1}
                >
                    <Text style={styles.buttonText}>Previous</Text>
                </TouchableOpacity>

                {currentStep != 3 && <TouchableOpacity
                    style={[
                        styles.button,
                        currentStep === 3 && styles.disabledButton,
                    ]}
                    onPress={handleNextStep}
                    disabled={currentStep === 3}
                >
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>}
                {
                    currentStep === 3 &&
                    <TouchableOpacity
                        style={[
                            styles.button,
                            { backgroundColor: 'green' }
                        ]}
                        onPress={() => { console.log('Press') }}
                    >
                        <Text style={[styles.buttonText, { color: '#fff' }]}>Submit</Text>
                    </TouchableOpacity>
                }
            </View>
            <Toast />
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
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
    },
    stepsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    step: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#D4D4D4',
    },
    line: {
        width: 30,
        height: 2,
        backgroundColor: '#D4D4D4',
        marginHorizontal: 10,
    },
    activeStep: {
        backgroundColor: '#008AFF',
    },
    activeLine: {
        backgroundColor: '#008AFF',
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
});

export default AddPatientScreen;
