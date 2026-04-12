import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Axios default config
    axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    const res = await axios.get('/users/me');
                    setUser(res.data);
                } catch (err) {
                    localStorage.removeItem('token');
                    delete axios.defaults.headers.common['Authorization'];
                }
            }
            setLoading(false);
        };

        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        const res = await axios.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
    };

    const register = async (userData) => {
        const res = await axios.post('/auth/register', userData);
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
    };

    const seedDemoData = async () => {
        try {
            await axios.post('/users/seed');
        } catch (error) {
            console.error("Failed to seed demo data", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const res = await axios.get('/users/me');
            setUser(res.data);
            return res.data;
        } catch (err) {
            console.error("Failed to refresh user", err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, seedDemoData, refreshUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
