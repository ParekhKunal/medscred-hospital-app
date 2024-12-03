import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DischargeDetailScreen = ({ route }) => {

    const { id } = route.params || {};  // Safely access params
    console.log(route.params);


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View>
                <Text>Discharge Detail Screen {id}</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default DischargeDetailScreen;
