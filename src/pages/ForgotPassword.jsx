import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/users/forgot-password', { email });
            setSuccess(true);
            toast.success(data.data); // "Email sent (check console)"
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
            <div className="mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md">
                <h2 className="mt-6 text-center text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
                    Reset your password
                </h2>
                <p className="mt-2 sm:mt-3 text-center text-xs sm:text-sm text-slate-600">
                    Enter your email to receive a reset link
                </p>
            </div>

            <div className="mt-6 sm:mt-8 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md">
                <div className="bg-white/85 backdrop-blur-xl py-6 sm:py-8 px-4 sm:px-6 md:px-8 rounded-xl sm:rounded-2xl shadow-xl border border-white/40">
                    {success ? (
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 sm:h-14 w-12 sm:w-14 rounded-full bg-green-100 mb-4 sm:mb-6">
                                <svg className="h-6 sm:h-7 w-6 sm:w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">Email Sent!</h3>
                            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600">
                                Check your email (or server console in dev) for the reset link.
                            </p>
                            <div className="mt-6 sm:mt-8">
                                <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm sm:text-base">
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="appearance-none block w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-slate-200 rounded-lg sm:rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-600 text-sm transition-all bg-white/50 focus:bg-white"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-lg sm:rounded-xl shadow-md text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-purple-700'
                                        }`}
                                >
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </div>

                            <div className="mt-4 sm:mt-6 border-t border-slate-200 pt-4 sm:pt-6">
                                <div className="text-center">
                                    <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 text-xs sm:text-sm transition-colors">
                                        Back to Login
                                    </Link>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
