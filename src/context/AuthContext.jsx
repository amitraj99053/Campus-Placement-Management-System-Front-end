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
                // We need an endpoint to get the current user profile from the cookie
                // For now, let's assume if there's a stored user in localStorage we use it, 
                // OR better, we try to hit a /profile endpoint.
                // Since we haven't built /profile yet, strictly speaking we rely on login response.
                const storedUser = localStorage.getItem('userInfo');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Auth check failed', error);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/users/auth', { email, password });
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        navigate('/dashboard');
    };

    const register = async (name, email, password, role) => {
        const { data } = await api.post('/users', { name, email, password, role });
        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
        navigate('/dashboard');
    };

    const logout = async () => {
        await api.post('/users/logout');
        setUser(null);
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
