// Archivo: src/auth/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (credentials) => {
        const response = await apiLogin(credentials);
        const { token, role, name, userId } = response.data;
        const userData = { token, role, name, userId };

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        return response; 
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const value = { user, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};