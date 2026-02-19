import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'student') {
                // Stay here for student home
            } else if (user.role === 'recruiter') {
                navigate('/recruiter/dashboard');
            } else if (user.role === 'admin' || user.role === 'tpo') {
                navigate('/admin/dashboard');
            }
        }
    }, [user, navigate]);

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name}!</h2>
                <p className="text-slate-600">You are logged in as a <span className="font-semibold capitalize text-indigo-600">{user?.role}</span>.</p>
            </div>

            {user?.role === 'student' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer" onClick={() => navigate('/student/profile')}>
                        <h3 className="font-semibold text-lg mb-2">My Profile</h3>
                        <p className="text-gray-500 text-sm">Update your resume, skills, and academic details.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer" onClick={() => navigate('/jobs')}>
                        <h3 className="font-semibold text-lg mb-2">Job Openings</h3>
                        <p className="text-gray-500 text-sm">Browse and apply for latest campus drives.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer" onClick={() => navigate('/student/applications')}>
                        <h3 className="font-semibold text-lg mb-2">My Applications</h3>
                        <p className="text-gray-500 text-sm">Track the status of your applied jobs.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer" onClick={() => navigate('/student/mock-interviews')}>
                        <h3 className="font-semibold text-lg mb-2">Mock Interviews</h3>
                        <p className="text-gray-500 text-sm">Schedule and manage practice interviews.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
