import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyProfileDetailScreen = ({ route }) => {

    const { userId } = route.params;


    return (
        <>
            <SafeAreaView>
                <View>
                    <Text>MyProfileScreen Screen  {userId}</Text>
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({})

export default MyProfileDetailScreen;
