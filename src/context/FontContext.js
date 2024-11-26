import React, { createContext, useState, useContext } from 'react';
import { useFonts } from 'expo-font';
import { Lexend_100Thin, Lexend_300Light, Lexend_500Medium, Lexend_400Regular, Lexend_600SemiBold, Lexend_700Bold, Lexend_800ExtraBold, Lexend_200ExtraLight, Lexend_900Black } from '@expo-google-fonts/lexend';

const FontContext = createContext();

export const FontProvider = ({ children }) => {
    const [fontsLoaded] = useFonts({
        Lexend_100Thin,
        Lexend_200ExtraLight,
        Lexend_300Light,
        Lexend_400Regular,
        Lexend_500Medium,
        Lexend_600SemiBold,
        Lexend_700Bold,
        Lexend_800ExtraBold,
        Lexend_900Black
    });

    return (
        <FontContext.Provider value={{ fontsLoaded }}>
            {fontsLoaded ? children : null}
        </FontContext.Provider>
    );
};

export const useFontContext = () => useContext(FontContext);
