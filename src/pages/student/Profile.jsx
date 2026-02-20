import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { User, Mail, Book, GraduationCap, Github, Linkedin, Globe, FileText, UploadCloud, Save, Plus, Trash2, Calendar, Briefcase, Award, AlertCircle, ScanFace, Loader2, Camera } from 'lucide-react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const Profile = () => {
    const [profile, setProfile] = useState({
        skills: [],
        cgpa: '',
        branch: '',
        batch: '',
        university: '',
        portfolio: '',
        github: '',
        linkedin: '',
        resume: '',
        experience: [],
        certifications: []
    });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [completion, setCompletion] = useState(0);

    // Face Auth State
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [registeringFace, setRegisteringFace] = useState(false);
    const [faceProcessing, setFaceProcessing] = useState(false);
    const webcamRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/student/profile');
                setProfile({
                    ...data,
                    experience: data.experience || [],
                    certifications: data.certifications || []
                });
                calculateCompletion(data);
            } catch (error) {
                if (error.response && error.response.status !== 404) {
                    toast.error('Failed to load profile');
                }
            } finally {
                setLoading(false);
            }
        };

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

        fetchProfile();
        loadModels();
    }, []);

    const calculateCompletion = (data) => {
        let filledFields = 0;
        const baseFields = [
            data.skills?.length > 0,
            !!data.cgpa,
            !!data.branch,
            !!data.batch,
            !!data.university,
            !!data.resume,
            !!data.linkedin
        ];

        filledFields += baseFields.filter(Boolean).length;
        if (data.experience?.length > 0) filledFields++;
        if (data.certifications?.length > 0) filledFields++;

        const totalFields = 9;
        setCompletion(Math.round((filledFields / totalFields) * 100));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleSkillsChange = (e) => {
        const skillsArray = e.target.value.split(',').map(skill => skill.trim());
        setProfile({ ...profile, skills: skillsArray });
    };

    // Experience Handlers
    const addExperience = () => {
        setProfile({
            ...profile,
            experience: [...profile.experience, { title: '', company: '', startDate: '', endDate: '', description: '' }]
        });
    };

    const removeExperience = (index) => {
        const newExperience = profile.experience.filter((_, i) => i !== index);
        setProfile({ ...profile, experience: newExperience });
    };

    const handleExperienceChange = (index, field, value) => {
        const newExperience = [...profile.experience];
        newExperience[index][field] = value;
        setProfile({ ...profile, experience: newExperience });
    };

    // Certifications Handlers
    const addCertification = () => {
        setProfile({
            ...profile,
            certifications: [...profile.certifications, { name: '', issuer: '', date: '', url: '' }]
        });
    };

    const removeCertification = (index) => {
        const newCertifications = profile.certifications.filter((_, i) => i !== index);
        setProfile({ ...profile, certifications: newCertifications });
    };

    const handleCertificationChange = (index, field, value) => {
        const newCertifications = [...profile.certifications];
        newCertifications[index][field] = value;
        setProfile({ ...profile, certifications: newCertifications });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        setUploading(true);

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await api.post('/upload', formData, config);
            const updatedProfile = { ...profile, resume: data };
            setProfile(updatedProfile);
            calculateCompletion(updatedProfile);
            setUploading(false);
            toast.success('Resume uploaded successfully');
        } catch (error) {
            console.error(error);
            setUploading(false);
            toast.error('File upload failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/student/profile', profile);
            calculateCompletion(profile);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    const handleRegisterFace = async () => {
        if (!webcamRef.current) return;
        setFaceProcessing(true);
        try {
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) throw new Error("Webcam not ready");

            console.log("Capturing face for registration...");
            const img = await faceapi.fetchImage(imageSrc);
            const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

            if (!detection) {
                console.warn("No face detected during registration");
                toast.error("No face detected. Please position yourself clearly.");
                setFaceProcessing(false);
                return;
            }

            console.log("Face detected. Descriptor length:", detection.descriptor.length);
            const descriptor = Array.from(detection.descriptor);

            await api.post('/users/face-register', { descriptor });
            toast.success("Face registered successfully! You can now use Face Login.");
            setRegisteringFace(false);
        } catch (error) {
            console.error("Face registration error:", error);
            if (error.response) {
                console.error("Server Response:", error.response.data);
                toast.error(`Server Error: ${error.response.data.message || 'Unknown error'}`);
            } else if (error.request) {
                console.error("No response received:", error.request);
                toast.error("Network Error: Unable to reach the server. Please check your connection.");
            } else {
                console.error("Error setting up request:", error.message);
                toast.error(`Error: ${error.message}`);
            }
        } finally {
            setFaceProcessing(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Quick Info & Completion */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center sticky top-24">
                    <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600 font-bold text-3xl">
                        <User size={40} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Student Profile</h2>
                    <p className="text-slate-500 text-sm mt-1">{profile.branch || 'Branch N/A'} • {profile.batch || 'Batch N/A'}</p>

                    <div className="mt-6">
                        <div className="flex justify-between text-sm font-medium mb-2">
                            <span className="text-slate-700">Profile Completion</span>
                            <span className="text-indigo-600">{completion}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${completion}%` }}></div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-left space-y-3">
                        <h4 className="font-semibold text-slate-800 text-sm">Quick Tips:</h4>
                        <ul className="text-xs text-slate-500 space-y-2 list-disc pl-4">
                            <li>Add internship details to boost visibility.</li>
                            <li>Upload certifications to validate your skills.</li>
                            <li>Keep your resume updated (PDF only).</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-2 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Academic Section */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 text-slate-900 flex items-center gap-2">
                            <GraduationCap className="text-indigo-600" size={24} /> Academic Details
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Branch / Major</label>
                                <input
                                    type="text"
                                    name="branch"
                                    value={profile.branch || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="Computer Science"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Batch (Year)</label>
                                <input
                                    type="text"
                                    name="batch"
                                    value={profile.batch || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="2024"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="cgpa"
                                    value={profile.cgpa || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="8.5"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">University / College</label>
                                <input
                                    type="text"
                                    name="university"
                                    value={profile.university || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="University Name"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 text-slate-900 flex items-center gap-2">
                            <Book className="text-indigo-600" size={24} /> Skills & Expertise
                        </h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                            <textarea
                                name="skills"
                                value={profile.skills?.join(', ') || ''}
                                onChange={handleSkillsChange}
                                placeholder="React, Node.js, Python, Java, SQL..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none h-24 resize-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">Separate each skill with a comma.</p>
                        </div>
                    </div>

                    {/* Experience Section */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Briefcase className="text-indigo-600" size={24} /> Experience
                            </h2>
                            <button
                                type="button"
                                onClick={addExperience}
                                className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition"
                            >
                                <Plus size={16} /> Add Experience
                            </button>
                        </div>

                        {profile.experience.length === 0 ? (
                            <p className="text-gray-500 text-sm italic py-4 text-center border-2 border-dashed border-gray-100 rounded-xl">No experience added yet. Add internships or jobs.</p>
                        ) : (
                            <div className="space-y-6">
                                {profile.experience.map((exp, index) => (
                                    <div key={index} className="p-6 bg-gray-50 rounded-xl relative group border border-gray-100 hover:border-indigo-200 transition">
                                        <button
                                            type="button"
                                            onClick={() => removeExperience(index)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                                            title="Remove"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="col-span-2 md:col-span-1">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Title / Role</label>
                                                <input
                                                    type="text"
                                                    value={exp.title}
                                                    onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                                                    placeholder="Software Intern"
                                                />
                                            </div>
                                            <div className="col-span-2 md:col-span-1">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Company</label>
                                                <input
                                                    type="text"
                                                    value={exp.company}
                                                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                                                    placeholder="Acme Corp"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Start Date</label>
                                                <input
                                                    type="date"
                                                    value={exp.startDate ? exp.startDate.split('T')[0] : ''}
                                                    onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">End Date</label>
                                                <input
                                                    type="date"
                                                    value={exp.endDate ? exp.endDate.split('T')[0] : ''}
                                                    onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</label>
                                                <textarea
                                                    value={exp.description}
                                                    onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm h-20 resize-none"
                                                    placeholder="Describe your responsibilities and achievements..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Certifications Section */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Award className="text-indigo-600" size={24} /> Certifications
                            </h2>
                            <button
                                type="button"
                                onClick={addCertification}
                                className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition"
                            >
                                <Plus size={16} /> Add Certification
                            </button>
                        </div>

                        {profile.certifications.length === 0 ? (
                            <p className="text-gray-500 text-sm italic py-4 text-center border-2 border-dashed border-gray-100 rounded-xl">No certifications added yet.</p>
                        ) : (
                            <div className="space-y-6">
                                {profile.certifications.map((cert, index) => (
                                    <div key={index} className="p-6 bg-gray-50 rounded-xl relative group border border-gray-100 hover:border-indigo-200 transition">
                                        <button
                                            type="button"
                                            onClick={() => removeCertification(index)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                                            title="Remove"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="col-span-2 md:col-span-1">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Certificate Name</label>
                                                <input
                                                    type="text"
                                                    value={cert.name}
                                                    onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                                                    placeholder="AWS Certified Practitioner"
                                                />
                                            </div>
                                            <div className="col-span-2 md:col-span-1">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Issuer / Organization</label>
                                                <input
                                                    type="text"
                                                    value={cert.issuer}
                                                    onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                                                    placeholder="Amazon Web Services"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Issue Date</label>
                                                <input
                                                    type="date"
                                                    value={cert.date ? cert.date.split('T')[0] : ''}
                                                    onChange={(e) => handleCertificationChange(index, 'date', e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Credential URL</label>
                                                <input
                                                    type="url"
                                                    value={cert.url}
                                                    onChange={(e) => handleCertificationChange(index, 'url', e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Social Links Section */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 text-slate-900 flex items-center gap-2">
                            <Globe className="text-indigo-600" size={24} /> Professional Links
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    <Github size={16} /> GitHub Profile
                                </label>
                                <input
                                    type="url"
                                    name="github"
                                    value={profile.github || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="https://github.com/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    <Linkedin size={16} /> LinkedIn Profile
                                </label>
                                <input
                                    type="url"
                                    name="linkedin"
                                    value={profile.linkedin || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    <Globe size={16} /> Portfolio Website
                                </label>
                                <input
                                    type="url"
                                    name="portfolio"
                                    value={profile.portfolio || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="https://myportfolio.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Face ID Section */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <ScanFace className="text-indigo-600" size={24} /> Security Settings (Face ID)
                            </h2>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                            {!registeringFace ? (
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-800">Biometric Login</h3>
                                        <p className="text-xs text-slate-500">Enable face login for faster access.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setRegisteringFace(true)}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2"
                                    >
                                        <Camera size={16} /> Register Face
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-black rounded-lg overflow-hidden h-64 relative max-w-md mx-auto">
                                        {modelsLoaded ? (
                                            <Webcam
                                                audio={false}
                                                ref={webcamRef}
                                                screenshotFormat="image/jpeg"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-white">Loading Face Models...</div>
                                        )}
                                    </div>
                                    <div className="flex justify-center gap-4">
                                        <button
                                            type="button"
                                            onClick={handleRegisterFace}
                                            disabled={faceProcessing || !modelsLoaded}
                                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2"
                                        >
                                            {faceProcessing ? <Loader2 className="animate-spin" /> : <ScanFace size={16} />}
                                            {faceProcessing ? 'Processing...' : 'Capture & Register'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRegisteringFace(false)}
                                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Resume Upload */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 text-slate-900 flex items-center gap-2">
                            <UploadCloud className="text-indigo-600" size={24} /> Resume Upload
                        </h2>
                        <div className="group border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 flex flex-col items-center justify-center transition-all">
                            {profile.resume ? (
                                <div className="text-center w-full">
                                    <div className="bg-green-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                                        <FileText className="text-green-600" size={32} />
                                    </div>
                                    <p className="text-green-800 font-semibold text-lg mb-1">Resume Uploaded Successfully!</p>
                                    <p className="text-green-600 text-sm mb-4 break-all max-w-sm mx-auto">{profile.resume.split('/').pop()}</p>
                                    <a
                                        href={`${import.meta.env.VITE_API_URL.replace('/api', '')}${profile.resume}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:text-indigo-800 underline font-medium text-sm"
                                    >
                                        Preview Current Resume
                                    </a>
                                </div>
                            ) : (
                                <>
                                    <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4 group-hover:text-indigo-400 transition" />
                                    <p className="text-lg font-medium text-gray-700 mb-2">
                                        Drag & drop your resume here
                                    </p>
                                    <p className="text-sm text-gray-500 mb-6">PDF files up to 5MB</p>
                                </>
                            )}

                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                                id="resume-upload"
                                accept=".pdf"
                            />
                            <label
                                htmlFor="resume-upload"
                                className={`mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 border border-transparent rounded-full font-semibold text-sm text-white uppercase tracking-wider hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all cursor-pointer shadow-lg shadow-indigo-200 ${uploading ? 'opacity-75 cursor-wait' : ''}`}
                            >
                                <UploadCloud size={18} />
                                {uploading ? 'Uploading...' : (profile.resume ? 'Update Resume' : 'Select File')}
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            className="w-full md:w-auto flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-xl hover:bg-slate-800 hover:-translate-y-1 transition font-bold shadow-xl text-lg"
                        >
                            <Save size={20} /> Save All Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
