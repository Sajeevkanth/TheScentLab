import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from './api';

const AuthContext = createContext();

const STORAGE_KEY = 'thescentlab_user';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem(STORAGE_KEY);
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await userAPI.login({ email, password });
            const userData = response.data.user;
            setUser(userData);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed'
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await userAPI.register({ name, email, password });
            const userData = response.data;
            setUser(userData);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Registration failed'
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {!loading && children}
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
