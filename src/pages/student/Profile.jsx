import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import axios from 'axios';

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
        resume: ''
    });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/student/profile');
                setProfile(data);
            } catch (error) {
                if (error.response && error.response.status !== 404) {
                    toast.error('Failed to load profile');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleSkillsChange = (e) => {
        const skillsArray = e.target.value.split(',').map(skill => skill.trim());
        setProfile({ ...profile, skills: skillsArray });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            // We use the base axios instance or api instance but need to be careful with headers
            // Since api instance has JSON content type set by default, we override it here or use base axios
            // But we need auth token/cookie. api instance handles credentials.
            // Let's rely on api instance and override Content-Type
            const { data } = await api.post('/upload', formData, config);
            setProfile({ ...profile, resume: data });
            setUploading(false);
            toast.success('File uploaded successfully');
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
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">My Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Resume Upload Section */}
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <label className="block text-sm font-medium text-indigo-900 mb-2">Resume / CV (PDF)</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-100 file:text-indigo-700
                hover:file:bg-indigo-200
              "
                        />
                        {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
                    </div>
                    {profile.resume && (
                        <div className="mt-2 text-sm text-green-600">
                            Resume uploaded: <a href={`http://localhost:5000${profile.resume}`} target="_blank" rel="noopener noreferrer" className="underline">View Resume</a>
                        </div>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                        <input
                            type="text"
                            name="branch"
                            value={profile.branch || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                        <input
                            type="text"
                            name="university"
                            value={profile.university || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                    <input
                        type="text"
                        name="skills"
                        value={profile.skills?.join(', ') || ''}
                        onChange={handleSkillsChange}
                        placeholder="React, Node.js, Python, etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                        <input
                            type="url"
                            name="github"
                            value={profile.github || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                        <input
                            type="url"
                            name="linkedin"
                            value={profile.linkedin || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio URL</label>
                        <input
                            type="url"
                            name="portfolio"
                            value={profile.portfolio || ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
                    >
                        Save Profile
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
