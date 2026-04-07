import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, Briefcase, Building, ScanFace, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { Helmet } from 'react-helmet-async';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import api from '../services/api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants defined outside component to prevent recreation
const CONTAINER_VARIANTS = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
};

const ITEM_VARIANTS = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const SLIDE_IN_LEFT = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const SLIDE_IN_RIGHT = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

// Memoized Form Field Components
const EmailField = memo(({ value, onChange, error }) => (
    <motion.div variants={ITEM_VARIANTS}>
        <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">Email Address</label>
        <motion.div className="relative group">
            <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
                type="email"
                required
                value={value}
                onChange={onChange}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 border-slate-200 rounded-lg sm:rounded-xl focus:border-indigo-600 focus:ring-1 focus:ring-indigo-200 focus:outline-none transition-all bg-white/50 focus:bg-white text-sm placeholder:text-slate-400"
                placeholder="you@example.com"
            />
        </motion.div>
    </motion.div>
));
EmailField.displayName = 'EmailField';

const PasswordField = memo(({ value, onChange, showPassword, setShowPassword }) => (
    <motion.div variants={ITEM_VARIANTS}>
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700">Password</label>
            <Link to="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors">
                Forgot?
            </Link>
        </div>
        <motion.div className="relative group">
            <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
                type={showPassword ? 'text' : 'password'}
                required
                value={value}
                onChange={onChange}
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 border-2 border-slate-200 rounded-lg sm:rounded-xl focus:border-indigo-600 focus:ring-1 focus:ring-indigo-200 focus:outline-none transition-all bg-white/50 focus:bg-white text-sm placeholder:text-slate-400"
                placeholder="••••••••"
            />
            <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                whileHover={{ scale: 1.1 }}
            >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </motion.button>
        </motion.div>
    </motion.div>
));
PasswordField.displayName = 'PasswordField';

const RoleButton = memo(({ role, isSelected, onClick }) => {
    const Icon = role.icon;
    return (
        <motion.button
            key={role.id}
            onClick={onClick}
            className={`relative p-2.5 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                isSelected
                    ? 'border-indigo-600 bg-indigo-50 shadow-md'
                    : 'border-slate-200 hover:border-indigo-300 bg-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variants={ITEM_VARIANTS}
        >
            <Icon className={`w-5 sm:w-6 h-5 sm:h-6 mx-auto mb-1 sm:mb-2 transition-colors ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
            <div className="text-xs font-bold text-slate-900">{role.label}</div>
            <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 line-clamp-1">{role.desc}</div>
        </motion.button>
    );
});
RoleButton.displayName = 'RoleButton';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [selectedRole, setSelectedRole] = useState('student');
    const [loginMethod, setLoginMethod] = useState('email');
    const [showPassword, setShowPassword] = useState(false);
    const { user, login, googleLogin, faceLogin } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const webcamRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const dashboardLink = user.role === 'recruiter' ? '/recruiter/dashboard' : 
                                 (user.role === 'admin' || user.role === 'tpo') ? '/admin/dashboard' : 
                                 '/dashboard';
            navigate(dashboardLink);
        }
    }, [user, navigate]);

    // Load face-api models only when face login is selected (lazy loading for better UX)
    useEffect(() => {
        if (loginMethod !== 'face') return;
        
        const loadModels = async () => {
            if (modelsLoaded) return; // Don't reload if already loaded
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
    }, [loginMethod, modelsLoaded]);

    // Debounced email handler to prevent excessive re-renders
    const emailTimeoutRef = useRef(null);
    const handleEmailChange = useCallback((e) => {
        const value = e.target.value;
        clearTimeout(emailTimeoutRef.current);
        // Update immediately for UX, debounce internal operations
        setFormData(prev => ({ ...prev, email: value }));
    }, []);

    // Debounced password handler
    const passwordTimeoutRef = useRef(null);
    const handlePasswordChange = useCallback((e) => {
        const value = e.target.value;
        clearTimeout(passwordTimeoutRef.current);
        setFormData(prev => ({ ...prev, password: value }));
    }, []);

    const handleEmailLogin = useCallback(async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(formData.email, formData.password);
        } catch (err) {
            const errorMessage = err.response?.data?.message
                || err.response?.statusText
                || err.message
                || 'Login failed. Please check your connection and credentials.';
            setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
        } finally {
            setLoading(false);
        }
    }, [formData.email, formData.password, login]);

    const handleGoogleSuccess = useCallback(async (credentialResponse) => {
        try {
            setLoading(true);
            const res = await api.post('/users/google-auth', { token: credentialResponse.credential });
            googleLogin(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Google Login Failed');
        } finally {
            setLoading(false);
        }
    }, [googleLogin]);

    const handleFaceLogin = useCallback(async () => {
        if (!formData.email) {
            setError('Please enter your email first to identify you.');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const imageSrc = webcamRef.current?.getScreenshot();
            if (!imageSrc) throw new Error("Webcam not ready");

            const img = await faceapi.fetchImage(imageSrc);
            const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

            if (!detection) {
                throw new Error("No face detected. Please position yourself clearly.");
            }

            const descriptor = Array.from(detection.descriptor);
            await faceLogin(formData.email, descriptor);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Face Login failed');
        } finally {
            setLoading(false);
        }
    }, [formData.email, faceLogin]);

    const roles = useMemo(() => [
        { id: 'student', label: 'Student', icon: User, desc: 'Job Board Access' },
        { id: 'recruiter', label: 'Recruiter', icon: Briefcase, desc: 'Post Jobs' },
        { id: 'tpo', label: 'Admin', icon: Building, desc: 'Management' },
    ], []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12 lg:py-16 relative overflow-hidden">
            <Helmet>
                <title>Login | CPMS</title>
                <meta name="description" content="Sign in to your Campus Placement Management System account." />
            </Helmet>

            {/* Animated Background Elements - Reduced animation intensity with will-change */}
            <motion.div
                className="absolute top-0 right-0 -mr-40 -mt-40 w-80 h-80 sm:w-96 sm:h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 12, repeat: Infinity }}
                style={{ willChange: 'transform' }}
            ></motion.div>
            <motion.div
                className="absolute bottom-0 left-0 -ml-40 -mb-40 w-80 h-80 sm:w-96 sm:h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                animate={{ scale: [1.05, 1, 1.05] }}
                transition={{ duration: 12, repeat: Infinity, delay: 1 }}
                style={{ willChange: 'transform' }}
            ></motion.div>

            <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 max-w-7xl w-full relative z-10"
                variants={CONTAINER_VARIANTS}
                initial="hidden"
                animate="visible"
            >
                {/* Left Side - Visual */}
                <motion.div 
                    className="hidden md:flex flex-col justify-center"
                    variants={SLIDE_IN_LEFT}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 sm:mb-6 lg:mb-6 leading-tight">
                            Welcome Back to <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">CPMS</span>
                        </h1>
                        <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-6 sm:mb-8 lg:mb-8 leading-relaxed">
                            Your gateway to career opportunities and placement success. Fast, secure, and intelligent campus recruitment platform.
                        </p>

                        <motion.div 
                            className="space-y-4"
                            variants={CONTAINER_VARIANTS}
                            initial="hidden"
                            animate="visible"
                        >
                            {[
                                'Secure face recognition login',
                                'One-click Google authentication',
                                'Multi-role access control'
                            ].map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    className="flex items-center gap-3 text-slate-700"
                                    variants={ITEM_VARIANTS}
                                >
                                    <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                                    <span className="font-medium">{feature}</span>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Floating Elements */}
                        <motion.div
                            className="mt-12 grid grid-cols-3 gap-4"
                        >
                            {[
                                { label: '10k+', desc: 'Students' },
                                { label: '500+', desc: 'Companies' },
                                { label: '95%', desc: 'Success' }
                            ].map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/40 text-center"
                                    whileHover={{ y: -4 }}
                                >
                                    <div className="text-2xl font-bold text-indigo-600">{stat.label}</div>
                                    <div className="text-sm text-slate-600 mt-1">{stat.desc}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Right Side - Form */}
                <motion.div 
                    className="flex flex-col justify-center"
                    variants={SLIDE_IN_RIGHT}
                >
                    <motion.div
                        className="bg-white/85 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/40 space-y-5 sm:space-y-6"
                        variants={ITEM_VARIANTS}
                    >
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">Sign In</h2>
                            <p className="text-xs sm:text-sm text-slate-600">Access your placement journey</p>
                        </motion.div>

                        {/* Login Method Tabs */}
                        <motion.div
                            className="flex gap-2 bg-slate-100 p-1.5 rounded-lg sm:rounded-xl"
                            variants={ITEM_VARIANTS}
                        >
                            <motion.button
                                onClick={() => setLoginMethod('email')}
                                className={`flex-1 flex items-center justify-center py-2 sm:py-2.5 px-3 sm:px-4 rounded-md sm:rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 ${
                                    loginMethod === 'email'
                                        ? 'bg-white text-indigo-600 shadow-md'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Mail size={16} className="mr-1 sm:mr-2" />
                                <span className="hidden xs:inline">Email</span>
                            </motion.button>
                            <motion.button
                                onClick={() => setLoginMethod('face')}
                                className={`flex-1 flex items-center justify-center py-2 sm:py-2.5 px-3 sm:px-4 rounded-md sm:rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 ${
                                    loginMethod === 'face'
                                        ? 'bg-white text-indigo-600 shadow-md'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <ScanFace size={16} className="mr-1 sm:mr-2" />
                                <span className="hidden xs:inline">Face ID</span>
                            </motion.button>
                        </motion.div>

                        {/* Error Alert */}
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: error ? 1 : 0, height: error ? 'auto' : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                                    <p className="text-sm text-red-700 font-medium">{error}</p>
                                </div>
                            )}
                        </motion.div>

                        {/* Role Selection */}
                        <motion.div
                            className="grid grid-cols-3 gap-2 sm:gap-3"
                            variants={CONTAINER_VARIANTS}
                            initial="hidden"
                            animate="visible"
                        >
                            {roles.map((role) => (
                                <RoleButton
                                    key={role.id}
                                    role={role}
                                    isSelected={selectedRole === role.id}
                                    onClick={() => setSelectedRole(role.id)}
                                />
                            ))}
                        </motion.div>

                        {loginMethod === 'email' ? (
                            <motion.form 
                                className="space-y-4"
                                onSubmit={handleEmailLogin}
                                variants={CONTAINER_VARIANTS}
                                initial="hidden"
                                animate="visible"
                            >
                                <EmailField value={formData.email} onChange={handleEmailChange} />
                                <PasswordField value={formData.password} onChange={handlePasswordChange} showPassword={showPassword} setShowPassword={setShowPassword} />

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-4 sm:mt-6 py-2.5 sm:py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:shadow-xl transition-all disabled:opacity-75 disabled:cursor-not-allowed relative overflow-hidden group"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    variants={ITEM_VARIANTS}
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        initial={{ x: -100 }}
                                        whileHover={{ x: 100 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                    <div className="relative flex items-center justify-center">
                                        {loading ? (
                                            <Loader2 className="animate-spin" size={18} />
                                        ) : (
                                            <>
                                                Sign In
                                                <ArrowRight className="ml-2" size={16} />
                                            </>
                                        )}
                                    </div>
                                </motion.button>
                            </motion.form>
                        ) : (
                            <motion.div 
                                className="space-y-4"
                                variants={CONTAINER_VARIANTS}
                                initial="hidden"
                                animate="visible"
                            >
                                <motion.div
                                    className="bg-slate-900 rounded-2xl overflow-hidden h-64 relative border-4 border-slate-200"
                                    variants={ITEM_VARIANTS}
                                >
                                    {modelsLoaded ? (
                                        <Webcam
                                            audio={false}
                                            ref={webcamRef}
                                            screenshotFormat="image/jpeg"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-white">
                                            <Loader2 className="animate-spin mr-2" />
                                            Loading Face Recognition...
                                        </div>
                                    )}
                                </motion.div>

                                <motion.div variants={ITEM_VARIANTS}>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5 sm:mb-2">Email for Verification</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-none transition-all"
                                        placeholder="Enter your email"
                                    />
                                </motion.div>

                                <motion.button
                                    onClick={handleFaceLogin}
                                    disabled={loading || !modelsLoaded}
                                    className="w-full py-2.5 sm:py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm sm:text-base rounded-lg sm:rounded-xl hover:shadow-lg transition-all disabled:opacity-75"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    variants={ITEM_VARIANTS}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <Loader2 className="animate-spin mr-2" size={18} />
                                            Verifying Face...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <ScanFace className="mr-2" size={18} />
                                            Scan Face to Login
                                        </div>
                                    )}
                                </motion.button>
                            </motion.div>
                        )}

                        {/* Google Login */}
                        {import.meta.env.VITE_GOOGLE_CLIENT_ID && import.meta.env.VITE_GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE' && (
                            <motion.div variants={ITEM_VARIANTS} className="pt-4">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-3 bg-white text-slate-600 font-medium">Or continue with</span>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => toast.error("Google Login Failed")}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Sign Up Link */}
                        <motion.div 
                            className="text-center pt-4 border-t border-slate-200"
                            variants={ITEM_VARIANTS}
                        >
                            <p className="text-slate-700">
                                Don't have an account?{' '}
                                <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center hover:gap-2 transition-all">
                                    Create one now <ArrowRight size={16} />
                                </Link>
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
