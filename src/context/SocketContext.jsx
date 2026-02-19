import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        // Only connect if user is logged in
        if (user) {
            const newSocket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');

            newSocket.on('connect', () => {
                console.log('Connected to socket server');
                // Join user-specific room
                newSocket.emit('join', user._id);
            });

            newSocket.on('notification', (data) => {
                toast.info(data.message);
            });

            newSocket.on('new-job', (data) => {
                // Only show to students
                if (user.role === 'student') {
                    toast.success(data.message);
                }
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        }
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
