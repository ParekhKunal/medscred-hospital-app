import React from 'react';
import { StyleSheet, View, SafeAreaView, Text } from 'react-native';

const PatientDetailScreen = ({ route }) => {

    const { id } = route.params || {};  // Safely access params
    console.log(route.params);


    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
            <View>
                <Text>patient id {id}</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default PatientDetailScreen;
