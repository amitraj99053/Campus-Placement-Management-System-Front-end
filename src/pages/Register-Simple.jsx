import { useState, useCallback, useMemo, memo, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, Briefcase, Building, Mail, Lock, ArrowRight, Loader2, ScanFace, CheckCircle2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

// Simple animation variants
const FADE_IN = { opacity: 0, y: 10 };
const FADE_IN_VISIBLE = { opacity: 1, y: 0 };

// Memoized form fields
const RegNameField = memo(({ value, onChange }) => (
    <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
        <input
            type="text"
            required
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-colors text-sm"
            placeholder="John Doe"
        />
    </div>
));
RegNameField.displayName = 'RegNameField';

const RegEmailField = memo(({ value, onChange }) => (
    <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
        <input
            type="email"
            required
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-colors text-sm"
            placeholder="you@example.com"
        />
    </div>
));
RegEmailField.displayName = 'RegEmailField';

const RegUniversityField = memo(({ value, onChange }) => (
    <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">University / College</label>
        <input
            type="text"
            required
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-colors text-sm"
            placeholder="e.g. Stanford University"
        />
        <p className="mt-1 text-xs text-slate-500">Exact spelling helps link with campus partners</p>
    </div>
));
RegUniversityField.displayName = 'RegUniversityField';

const RegPasswordField = memo(({ value, onChange }) => (
    <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
        <input
            type="password"
            required
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-colors text-sm"
            placeholder="••••••••"
        />
    </div>
));
RegPasswordField.displayName = 'RegPasswordField';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student', university: '' });
    const { user, register, googleLogin } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [faceProcessing, setFaceProcessing] = useState(false);
    const webcamRef = useRef(null);

    // Redirect if already logged in
    React.useEffect(() => {
        if (user) {
            const dashboardLink = user.role === 'recruiter' ? '/recruiter/dashboard' : 
                                 (user.role === 'admin' || user.role === 'tpo') ? '/admin/dashboard' : 
                                 '/dashboard';
            navigate(dashboardLink);
        }
    }, [user, navigate]);

    // Load face-api models only on step 2
    React.useEffect(() => {
        if (step !== 2) return;
        
        const loadModels = async () => {
            if (modelsLoaded) return;
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
            }
        };
        loadModels();
    }, [step, modelsLoaded]);

    // Handle form input
    const handleNameChange = useCallback((e) => {
        setFormData(prev => ({ ...prev, name: e.target.value }));
    }, []);

    const handleEmailChange = useCallback((e) => {
        setFormData(prev => ({ ...prev, email: e.target.value }));
    }, []);

    const handleUniversityChange = useCallback((e) => {
        setFormData(prev => ({ ...prev, university: e.target.value }));
    }, []);

    const handlePasswordChange = useCallback((e) => {
        setFormData(prev => ({ ...prev, password: e.target.value }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(formData.name, formData.email, formData.password, formData.role, formData.university.trim());
            toast.success("Account created! Set up Face Login now.");
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    }, [formData, register]);

    const handleRegisterFace = useCallback(async () => {
        if (!webcamRef.current) return;
        setFaceProcessing(true);
        try {
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) throw new Error("Webcam not ready");

            const img = await faceapi.fetchImage(imageSrc);
            const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

            if (!detection) {
                toast.error("No face detected. Please position yourself clearly.");
                setFaceProcessing(false);
                return;
            }

            const descriptor = Array.from(detection.descriptor);
            await api.post('/users/face-register', { descriptor });
            toast.success("Face registered! Setup complete.");
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Face registration failed');
        } finally {
            setFaceProcessing(false);
        }
    }, [navigate]);

    const handleSkip = useCallback(() => {
        navigate('/dashboard');
    }, [navigate]);

    const handleGoogleSuccess = useCallback(async (credentialResponse) => {
        try {
            setLoading(true);
            const res = await api.post('/users/google-auth', { token: credentialResponse.credential });
            googleLogin(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Google Signup Failed');
        } finally {
            setLoading(false);
        }
    }, [googleLogin]);

    const roles = useMemo(() => [
        { id: 'student', label: 'Student', icon: User },
        { id: 'recruiter', label: 'Recruiter', icon: Briefcase },
        { id: 'tpo', label: 'TPO', icon: Building },
    ], []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 py-8 sm:py-12 md:py-16">
            <Helmet>
                <title>Register | CPMS</title>
                <meta name="description" content="Create a free CPMS account." />
            </Helmet>

            <div className="max-w-md mx-auto px-4">
                {step === 1 ? (
                    <motion.div initial={FADE_IN} animate={FADE_IN_VISIBLE} transition={{ duration: 0.4 }}>
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                                Join <span className="text-indigo-600">CPMS</span>
                            </h1>
                            <p className="text-slate-600 text-sm">Create account in 2 minutes</p>
                        </div>

                        {/* Form Card */}
                        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-4">
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            {/* Role Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-3">Role</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {roles.map((role) => {
                                        const Icon = role.icon;
                                        const isSelected = formData.role === role.id;
                                        return (
                                            <button
                                                key={role.id}
                                                onClick={() => setFormData({ ...formData, role: role.id })}
                                                className={`p-3 rounded-lg border-2 transition-all text-center ${
                                                    isSelected
                                                        ? 'border-indigo-600 bg-indigo-50'
                                                        : 'border-slate-200 hover:border-indigo-300 bg-white'
                                                }`}
                                            >
                                                <Icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                                                <div className="text-xs font-semibold">{role.label}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Form Fields */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <RegNameField value={formData.name} onChange={handleNameChange} />
                                <RegEmailField value={formData.email} onChange={handleEmailChange} />
                                <RegUniversityField value={formData.university} onChange={handleUniversityChange} />
                                <RegPasswordField value={formData.password} onChange={handlePasswordChange} />

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow disabled:opacity-75 flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <>Continue <ArrowRight size={18} /></>}
                                </button>
                            </form>

                            {/* Google Signup */}
                            {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
                                <>
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-slate-300" />
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="px-3 bg-white text-xs text-slate-600 font-medium">Or continue with</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <GoogleLogin
                                            onSuccess={handleGoogleSuccess}
                                            onError={() => toast.error("Google Signup Failed")}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Sign In Link */}
                            <div className="text-center pt-4 border-t border-slate-200">
                                <p className="text-sm text-slate-700">
                                    Already have an account? <Link to="/login" className="font-semibold text-indigo-600 hover:underline">Sign in</Link>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div initial={FADE_IN} animate={FADE_IN_VISIBLE} transition={{ duration: 0.4 }}>
                        {/* Face Registration Step */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Almost Done!</h1>
                            <p className="text-slate-600 text-sm">Set up Face Recognition (optional)</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                            <div className="bg-slate-900 rounded-lg overflow-hidden h-64 relative">
                                {modelsLoaded ? (
                                    <Webcam
                                        audio={false}
                                        screenshotFormat="image/jpeg"
                                        className="w-full h-full object-cover"
                                        ref={webcamRef}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-white">
                                        <Loader2 className="animate-spin mr-2" />
                                        Loading...
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleRegisterFace}
                                    disabled={faceProcessing || !modelsLoaded}
                                    className="py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-75 flex items-center justify-center gap-2"
                                >
                                    {faceProcessing ? <Loader2 className="animate-spin" size={18} /> : <ScanFace size={18} />}
                                    {faceProcessing ? 'Processing...' : 'Capture'}
                                </button>

                                <button
                                    onClick={handleSkip}
                                    className="py-3 px-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Skip
                                </button>
                            </div>

                            <p className="text-xs text-slate-500 text-center bg-blue-50 p-3 rounded">
                                💡 Face recognition helps you login faster and more securely
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Register;
