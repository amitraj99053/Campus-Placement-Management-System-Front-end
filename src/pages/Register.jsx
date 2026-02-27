import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, Briefcase, Building, Mail, Lock, ArrowRight, Loader2, ScanFace } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const { register, googleLogin } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Multi-step state
    const [step, setStep] = useState(1); // 1: Details, 2: Face ID
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [faceProcessing, setFaceProcessing] = useState(false);
    const webcamRef = React.useRef(null);

    // Load models on mount (optimized)
    React.useEffect(() => {
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
            }
        };
        loadModels();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            toast.success("Account created! Set up Face Login now.");
            setStep(2); // Move to Face ID step
        } catch (err) {
            console.error("Registration failed:", err);
            setError(err.response?.data?.message || 'Registration failed. Please check your network connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterFace = async () => {
        if (!webcamRef.current) {
            console.error("Webcam reference is null");
            return;
        }
        setFaceProcessing(true);
        try {
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) {
                console.error("Failed to get screenshot from webcam");
                throw new Error("Webcam not ready or permission denied");
            }

            console.log("Capturing face for registration...");
            const img = await faceapi.fetchImage(imageSrc);
            const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

            if (!detection) {
                toast.error("No face detected. Please position yourself clearly.");
                setFaceProcessing(false);
                return;
            }

            const descriptor = Array.from(detection.descriptor);

            // Add descriptor
            await api.post('/users/face-register', { descriptor });
            toast.success("Face registered! Setup complete.");
            navigate('/dashboard'); // Or wherever appropriate
        } catch (error) {
            console.error("Face registration error:", error);
            if (error.response) {
                toast.error(`Server Error: ${error.response.data.message || 'Unknown error'}`);
            } else if (error.request) {
                toast.error("Network Error: Unable to reach server.");
            } else {
                toast.error(`Error: ${error.message}`);
            }
        } finally {
            setFaceProcessing(false);
        }
    };

    const handleSkip = () => {
        navigate('/dashboard'); // Or login
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setLoading(true);
            const res = await api.post('/users/google-auth', { token: credentialResponse.credential });
            googleLogin(res.data);
        } catch (err) {
            console.error('Google Signup Failed:', err);
            setError(err.response?.data?.message || 'Google Signup Failed');
        } finally {
            setLoading(false);
        }
    };

    const roles = [
        { id: 'student', label: 'Student', icon: User, desc: 'Find jobs & track applications' },
        { id: 'recruiter', label: 'Recruiter', icon: Briefcase, desc: 'Post jobs & hire talent' },
        { id: 'tpo', label: 'TPO', icon: Building, desc: 'Manage campus placements' },
    ];

    if (step === 2) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                    <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/50 text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <User className="h-6 w-6 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
                        <p className="text-sm text-gray-600 mb-6">Setup Face Login for faster access (Optional)</p>

                        <div className="bg-black rounded-lg overflow-hidden h-64 relative mb-6">
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

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleRegisterFace}
                                disabled={faceProcessing || !modelsLoaded}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
                            >
                                {faceProcessing ? <Loader2 className="animate-spin mr-2" /> : 'Capture & Register Face'}
                            </button>
                            <button
                                onClick={handleSkip}
                                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all API"
                            >
                                Skip for Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            <Helmet>
                <title>Register | CPMS</title>
                <meta name="description" content="Create a free CPMS account to build your profile, post jobs, or manage campus recruiting." />
            </Helmet>
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Join the CPMS platform today
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
                <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/50">

                    {/* Role Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3 text-center">I am registering as a...</label>
                        <div className="grid grid-cols-3 gap-3">
                            {roles.map((type) => {
                                const Icon = type.icon;
                                const isSelected = formData.role === type.id;
                                return (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: type.id })}
                                        className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${isSelected
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md'
                                            : 'border-gray-200 hover:border-indigo-200 hover:bg-white text-gray-500'
                                            }`}
                                    >
                                        <Icon size={24} className={isSelected ? 'text-indigo-600' : 'text-gray-400'} />
                                        <span className="mt-2 text-xs font-bold">{type.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-center text-gray-500 mt-2 italic">
                            {roles.find(r => r.id === formData.role)?.desc}
                        </p>
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

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-3"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
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
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
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
                            {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                        </button>
                    </form>

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
                                    toast.error("Google Signup Failed");
                                }}
                            />
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 inline-flex items-center">
                                Sign in <ArrowRight size={14} className="ml-1" />
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
