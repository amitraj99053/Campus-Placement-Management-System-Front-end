import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, Briefcase, Building, ScanFace, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import api from '../services/api';
import { toast } from 'react-toastify';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [selectedRole, setSelectedRole] = useState('student');
    const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'face'
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const webcamRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadModels = async () => {
            try {
                const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                ]);
                setModelsLoaded(true);
            } catch (err) {
                console.error("Failed to load face-api models", err);
                toast.error("Face Login unavailable: Models not loaded.");
            }
        };
        loadModels();
    }, []);

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(formData.email, formData.password);
        } catch (err) {
            console.error("Login Error Details:", err);
            const errorMessage = err.response?.data?.message
                || err.response?.statusText
                || err.message
                || 'Login failed. Please check your connection and credentials.';
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);
            const res = await api.post('/users/google-auth', { token: credentialResponse.credential });
            localStorage.setItem('userInfo', JSON.stringify(res.data));
            if (res.data.token) {
                // Context update might be needed if not auto-detected
                window.location.reload();
            } else {
                // Assuming token is set in cookie or response handles it
                // For now, reload to trigger auth check
                window.location.reload();
            }
        } catch (err) {
            setError('Google Login Failed');
            setLoading(false);
        }
    };

    const handleFaceLogin = async () => {
        if (!formData.email) {
            setError('Please enter your email first to identify you.');
            return;
        }
        setLoading(true);
        setError('');

        try {
            console.log("Starting Face Login for:", formData.email);
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) throw new Error("Webcam not ready");

            const img = await faceapi.fetchImage(imageSrc);
            const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

            if (!detection) {
                console.warn("No face detected during login");
                throw new Error("No face detected. Please position yourself clearly.");
            }

            console.log("Face detected. Sending descriptor...");
            const descriptor = Array.from(detection.descriptor);

            const res = await api.post('/users/face-login', {
                email: formData.email,
                descriptor
            });

            console.log("Face Login successful");
            localStorage.setItem('userInfo', JSON.stringify(res.data));
            window.location.reload();

        } catch (err) {
            console.error("Face Login Error:", err);
            setError(err.response?.data?.message || err.message || 'Face Login failed');
        } finally {
            setLoading(false);
        }
    };

    const roles = [
        { id: 'student', label: 'Student', icon: User, desc: 'Student Portal' },
        { id: 'recruiter', label: 'Recruiter', icon: Briefcase, desc: 'Recruiter Portal' },
        { id: 'tpo', label: 'TPO', icon: Building, desc: 'Admin Portal' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
                    Welcome Back
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Sign in to your account
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/50">

                    {/* Login Method Tabs */}
                    <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
                        <button
                            onClick={() => setLoginMethod('email')}
                            className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-lg transition-all ${loginMethod === 'email' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Mail size={16} className="mr-2" /> Email
                        </button>
                        <button
                            onClick={() => setLoginMethod('face')}
                            className={`flex-1 flex items-center justify-center py-2 text-sm font-medium rounded-lg transition-all ${loginMethod === 'face' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <ScanFace size={16} className="mr-2" /> Face ID
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {loginMethod === 'email' ? (
                        <form className="space-y-6" onSubmit={handleEmailLogin}>
                            {/* Role Selection (Visual Only for now, backend detects role usually) */}
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {roles.map((type) => {
                                    const Icon = type.icon;
                                    const isSelected = selectedRole === type.id;
                                    return (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setSelectedRole(type.id)}
                                            className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${isSelected
                                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                                : 'border-gray-200 hover:border-indigo-200 hover:bg-gray-50 text-gray-500'
                                                }`}
                                        >
                                            <Icon size={20} className={isSelected ? 'text-indigo-600' : 'text-gray-400'} />
                                            <span className="mt-1 text-[10px] uppercase font-bold tracking-wider">{type.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                    <div className="text-sm">
                                        <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-6 text-center">
                            <div className="bg-black rounded-lg overflow-hidden h-64 relative">
                                {modelsLoaded ? (
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-white">Loading Models...</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">Confirm Email</label>
                                <input
                                    type="email"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Confirm your email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <button
                                onClick={handleFaceLogin}
                                disabled={loading || !modelsLoaded}
                                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all ${loading ? 'opacity-75' : ''}`}
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" /> : <ScanFace className="mr-2" />}
                                {loading ? 'Verifying...' : 'Scan Face to Login'}
                            </button>
                        </div>
                    )}

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white/80 text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => {
                                    console.log('Login Failed');
                                    toast.error("Google Login Failed");
                                }}
                            />
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 inline-flex items-center">
                                Create free account <ArrowRight size={14} className="ml-1" />
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
