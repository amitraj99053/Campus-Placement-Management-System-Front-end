import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Prefer server-validated session using HTTP-only cookie
                const { data } = await api.get('/users/profile');
                setUser(data);
                localStorage.setItem('userInfo', JSON.stringify(data));
            } catch (error) {
                // Fallback to locally stored user if available
                const storedUser = localStorage.getItem('userInfo');
                if (storedUser) {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch {
                        localStorage.removeItem('userInfo');
                    }
                } else {
                    setUser(null);
                }
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const completeLogin = (userData, redirectPath = '/dashboard') => {
        setUser(userData);
        localStorage.setItem('userInfo', JSON.stringify(userData));
        navigate(redirectPath);
    };

    const login = async (email, password) => {
        const { data } = await api.post('/users/auth', { email, password });
        completeLogin(data);
    };

    const register = async (name, email, password, role) => {
        const { data } = await api.post('/users', { name, email, password, role });
        completeLogin(data, '/dashboard');
    };

    const googleLogin = (data) => {
        completeLogin(data);
    };

    const logout = async () => {
        try {
            await api.post('/users/logout');
        } catch (error) {
            console.error('Logout API failed but clearing local session:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('userInfo');
            navigate('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, googleLogin, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
