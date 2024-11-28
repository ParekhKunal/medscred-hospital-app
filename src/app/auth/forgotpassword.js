import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import Icons from '@expo/vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFontContext } from '../../context/FontContext';
import { useRouter } from 'expo-router';

const { height, width } = Dimensions.get('window');

const ForgotPasswordScreen = () => {
    const router = useRouter();
    const { fontsLoaded } = useFontContext();

    if (!fontsLoaded) {
        return <Text>Loading fonts...</Text>;
    }

    const handleBackPress = () => {
        router.replace('auth/login');
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                    <Icons name='chevron-left' size={28} color="#000" />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>Forgot Password</Text>
                </View>
            </View>

            <View style={styles.contentContainer}>
                <Text style={styles.text}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti eveniet ut iste fugit beatae, necessitatibus accusamus alias. Id ipsam aut sint, fugiat ipsum aliquam facilis totam dolorum laborum fuga iste in aspernatur accusantium libero rem error mollitia dolor? Eaque odit a fuga eum nam. Rerum incidunt eius sequi harum eum pariatur excepturi, quibusdam soluta magni, quos blanditiis nesciunt itaque natus. Tenetur doloribus id alias. Ullam est, ipsam obcaecati animi numquam quae assumenda, reprehenderit provident eveniet commodi pariatur voluptatum repudiandae unde sapiente quia, dolorem nulla ducimus adipisci deleniti suscipit dolores quo velit eaque nisi! Quibusdam hic voluptatum deserunt amet cum recusandae explicabo ab esse praesentium. Asperiores ad a dolor tenetur, illum quasi illo harum libero ipsa eos sint perferendis debitis nam. Placeat, hic perferendis, quis vero exercitationem consequatur porro in dolorem aperiam perspiciatis laudantium temporibus nesciunt unde libero a, aliquam laboriosam natus repellendus maxime fugiat numquam. Sint vitae adipisci repellat ullam quis suscipit minus ea consequuntur ducimus error sunt voluptate magnam, accusamus reiciendis quae necessitatibus cum deserunt saepe numquam soluta accusantium! Rerum, doloremque sapiente id beatae temporibus obcaecati ratione illo adipisci doloribus fugiat commodi et laudantium facilis quae sit provident minus impedit sequi! Unde officiis harum voluptates perspiciatis recusandae maxime nostrum quos eaque, obcaecati, accusamus ducimus ratione cupiditate! Accusamus molestiae placeat quia iusto, ratione fugit minima voluptatum hic nulla? Cupiditate, tempore molestiae sequi adipisci magnam possimus nisi? Quod quisquam vel repudiandae aperiam aut vitae voluptatem dolore atque. Quas, maxime enim! Ratione consequuntur recusandae temporibus provident molestias nobis. Esse sequi magni eligendi!</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        width: width,
        height: height,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 30,
        width: width,
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
    }
})

export default ForgotPasswordScreen;
