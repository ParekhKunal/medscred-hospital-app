import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import { StatusBar } from 'expo-status-bar';

const Splash = () => {
    return (
        <>
            <StatusBar backgroundColor="#FFF" barStyle="light-content" />
            <View style={styles.container}>
                <Animatable.Image
                    animation="bounceOut"
                    duration={4000}
                    source={require('../../assets/logo-color.png')}
                    style={styles.image}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        resizeMode: 'contain',
        width: 220,
        height: 100,
    },
});

export default Splash;
