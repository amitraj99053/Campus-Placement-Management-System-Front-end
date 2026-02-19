import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Determine dashboard link based on role
    const getDashboardLink = () => {
        if (!user) return '/login';
        if (user.role === 'recruiter') return '/recruiter/dashboard';
        if (user.role === 'admin' || user.role === 'tpo') return '/admin/dashboard';
        return '/dashboard'; // Student generic dashboard
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
                            <h1 className="text-2xl font-bold text-indigo-600">PlacementSys</h1>
                        </div>

                        <div className="flex items-center">
                            <div className="hidden md:flex items-center space-x-4">
                                <Link to="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Home</Link>
                                {user ? (
                                    <>
                                        <Link to={getDashboardLink()} className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Dashboard</Link>

                                        {/* Notification Center */}
                                        <NotificationCenter />

                                        <div className="flex items-center space-x-3 ml-2 border-l pl-4 border-gray-200">
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm font-medium text-gray-900">{user.name}</span>
                                                <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                                            </div>
                                            <button
                                                onClick={logout}
                                                className="p-2 text-gray-400 hover:text-red-600 transition"
                                                title="Logout"
                                            >
                                                <LogOut size={20} />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Login</Link>
                                        <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">Register</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-500 text-sm">© 2024 Campus Placement Management System. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
