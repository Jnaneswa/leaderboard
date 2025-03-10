import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const verifyToken = async () => {
            if (token) {
                try {
                    const response = await axios.post('https://surfers-bakend.onrender.com/api/auth/verify', null, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setIsAdmin(response.data);
                } catch (error) {
                    console.error('Token verification failed:', error);
                    setIsAdmin(false);
                    setToken(null);
                    localStorage.removeItem('token');
                }
            }
        };

        verifyToken();
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await axios.post('https://surfers-bakend.onrender.com/api/auth/login', {
                username,
                password
            });
            const { token } = response.data;
            setToken(token);
            localStorage.setItem('token', token);
            setIsAdmin(true);
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        setIsAdmin(false);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ isAdmin, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
