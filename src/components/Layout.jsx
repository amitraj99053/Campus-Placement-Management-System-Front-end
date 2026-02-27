import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X, Briefcase, FileText, Calendar, BarChart } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Determine dashboard link based on role
    const getDashboardLink = () => {
        if (!user) return '/login';
        if (user.role === 'recruiter') return '/recruiter/dashboard';
        if (user.role === 'admin' || user.role === 'tpo') return '/admin/dashboard';
        return '/dashboard'; // Student generic dashboard
    };

    const getNavLinks = () => {
        if (!user) return [];

        switch (user.role) {
            case 'student':
                return [
                    { name: 'Dashboard', path: '/dashboard' },
                    { name: 'Jobs', path: '/jobs' },
                    { name: 'My Applications', path: '/student/applications' },
                    { name: 'Mock Interviews', path: '/student/mock-interviews' },
                ];
            case 'recruiter':
                return [
                    { name: 'Dashboard', path: '/recruiter/dashboard' },
                ];
            case 'admin':
            case 'tpo':
                return [
                    { name: 'Dashboard', path: '/admin/dashboard' },
                    { name: 'Manage Interviews', path: '/admin/mock-interviews' },
                ];
            default:
                return [];
        }
    };

    const navLinks = getNavLinks();

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex-shrink-0 cursor-pointer flex items-center gap-2" onClick={() => navigate('/')}>
                            <Briefcase className="text-indigo-600 h-8 w-8" />
                            <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hidden sm:block">CPMS</h1>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            <Link
                                to="/"
                                className={`px-3 py-2 rounded-md font-medium transition ${location.pathname === '/'
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                                    }`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/about"
                                className={`px-3 py-2 rounded-md font-medium transition ${location.pathname === '/about'
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                                    }`}
                            >
                                About
                            </Link>
                            <Link
                                to="/services"
                                className={`px-3 py-2 rounded-md font-medium transition ${location.pathname === '/services'
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                                    }`}
                            >
                                Services
                            </Link>
                            <Link
                                to="/contact"
                                className={`px-3 py-2 rounded-md font-medium transition ${location.pathname === '/contact'
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                                    }`}
                            >
                                Contact
                            </Link>

                            {user && navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-3 py-2 rounded-md font-medium transition ${location.pathname === link.path
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            {user ? (
                                <div className="flex items-center ml-4 pl-4 border-l border-gray-200 gap-4">
                                    {/* Notification Center */}
                                    <NotificationCenter />

                                    <div className="flex items-center gap-3">
                                        <div className="text-right hidden lg:block">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            <div className="text-xs text-gray-500 capitalize px-2 py-0.5 bg-gray-100 rounded-full inline-block">{user.role}</div>
                                        </div>
                                        <button
                                            onClick={logout}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                                            title="Logout"
                                        >
                                            <LogOut size={20} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 ml-4">
                                    <Link
                                        to="/login"
                                        className={`px-3 py-2 rounded-md font-medium transition ${location.pathname === '/login'
                                            ? 'bg-indigo-50 text-indigo-700'
                                            : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className={`px-4 py-2 rounded-md font-medium transition text-white ${location.pathname === '/register'
                                            ? 'bg-indigo-700 ring-2 ring-indigo-500 ring-offset-2'
                                            : 'bg-indigo-600 hover:bg-indigo-700'
                                            }`}
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center gap-4">
                            {user && <NotificationCenter />}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMobileMenuOpen ? (
                                    <X className="block h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <Menu className="block h-6 w-6" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link
                                to="/"
                                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/'
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to="/about"
                                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/about'
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                About
                            </Link>
                            <Link
                                to="/services"
                                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/services'
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Services
                            </Link>
                            <Link
                                to="/contact"
                                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/contact'
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Contact
                            </Link>
                            {user && navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === link.path
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                        <div className="pt-4 pb-4 border-t border-gray-200">
                            {user ? (
                                <div className="flex items-center px-5">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium leading-none text-gray-800">{user.name}</div>
                                        <div className="text-sm font-medium leading-none text-gray-500 mt-1 capitalize">{user.role}</div>
                                    </div>
                                    <button
                                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                        className="ml-auto bg-white flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-red-500 focus:outline-none"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div className="px-5 space-y-2">
                                    <Link
                                        to="/login"
                                        className={`block w-full text-center px-4 py-2 border rounded-md font-medium transition ${location.pathname === '/login'
                                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                            : 'text-gray-700 hover:bg-gray-50 border-gray-300'
                                            }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className={`block w-full text-center px-4 py-2 border border-transparent rounded-md text-white font-medium transition ${location.pathname === '/register'
                                            ? 'bg-indigo-700 ring-2 ring-indigo-500 ring-offset-2'
                                            : 'bg-indigo-600 hover:bg-indigo-700'
                                            }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>
            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-500 text-sm">© 2026 Campus Placement Management System. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
