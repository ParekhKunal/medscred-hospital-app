import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const loadAuthData = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            const storedUser = await AsyncStorage.getItem('user');
            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        };
        loadAuthData();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(
                'https://api.medscred.com/api/v1/auth/login',
                { email, password }
            );

            const { accessToken, data } = response.data;

            if (!accessToken) {
                throw new Error('Access token is missing in the response.');
            }

            if (!data) {
                throw new Error('User data is missing in the response.');
            }

            await AsyncStorage.setItem('token', accessToken);
            await AsyncStorage.setItem('user', JSON.stringify(data));

            setToken(accessToken);
            setUser(data);
        } catch (err) {
            console.error('Login failed:', err.response?.data || err.message);
            throw err;
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};