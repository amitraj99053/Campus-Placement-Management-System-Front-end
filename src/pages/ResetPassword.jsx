import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const { resetToken } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await api.put(`/users/reset-password/${resetToken}`, { password });
            toast.success('Password updated successfully');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
            <div className="mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md">
                <h2 className="mt-6 text-center text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
                    Set new password
                </h2>
                <p className="mt-2 sm:mt-3 text-center text-xs sm:text-sm text-slate-600">
                    Create a strong, unique password for your account
                </p>
            </div>

            <div className="mt-6 sm:mt-8 mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md">
                <div className="bg-white/85 backdrop-blur-xl py-6 sm:py-8 px-4 sm:px-6 md:px-8 rounded-xl sm:rounded-2xl shadow-xl border border-white/40">
                    <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                New Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="appearance-none block w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-slate-200 rounded-lg sm:rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-600 text-sm transition-all bg-white/50 focus:bg-white"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">
                                Confirm Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    className="appearance-none block w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-slate-200 rounded-lg sm:rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-600 text-sm transition-all bg-white/50 focus:bg-white"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm password"
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
                                {loading ? 'Resetting...' : 'Reset Password'}
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
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
