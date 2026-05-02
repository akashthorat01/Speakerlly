import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userData = await AsyncStorage.getItem('user');
            if (token && userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {}
        setIsLoading(false);
    };

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user || data));
            setUser(data.user || data);
            return true;
        } catch (error) {
            alert(error.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password, role });
            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user || data));
            setUser(data.user || data);
            return true;
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed');
            return false;
        }
    }

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
