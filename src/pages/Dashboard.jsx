import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Briefcase, FileText, Calendar, User, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        applied: 0,
        shortlisted: 0,
        interviews: 0,
        profileCompletion: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            if (user.role === 'recruiter') navigate('/recruiter/dashboard');
            else if (['admin', 'tpo'].includes(user.role)) navigate('/admin/dashboard');
            else fetchDashboardData();
        }
    }, [user, navigate]);

    const fetchDashboardData = async () => {
        try {
            const [applicationsRes, profileRes, interviewsRes] = await Promise.all([
                api.get('/applications/my'),
                api.get('/student/profile'),
                api.get('/mock-interviews/my')
            ]);

            const apps = applicationsRes.data;
            const profile = profileRes.data;
            const interviews = interviewsRes.data;

            // Calculate Profile Completion
            let filledFields = 0;
            const totalFields = 7; // skills, cgpa, branch, batch, university, resume, linkedin
            if (profile.skills?.length > 0) filledFields++;
            if (profile.cgpa) filledFields++;
            if (profile.branch) filledFields++;
            if (profile.batch) filledFields++;
            if (profile.university) filledFields++;
            if (profile.resume) filledFields++;
            if (profile.linkedin) filledFields++;

            setStats({
                applied: apps.length,
                shortlisted: apps.filter(a => a.status === 'Shortlisted').length,
                interviews: interviews.filter(i => i.status === 'Scheduled').length,
                profileCompletion: Math.round((filledFields / totalFields) * 100)
            });
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
                    <p className="text-indigo-100 max-w-xl">
                        You have <span className="font-bold text-white">{stats.interviews} upcoming interviews</span> and <span className="font-bold text-white">{stats.shortlisted} shortlisted applications</span>. Keep up the momentum!
                    </p>
                    <div className="mt-6 flex flex-wrap gap-4">
                        <button onClick={() => navigate('/jobs')} className="bg-white text-indigo-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-50 transition shadow-lg">
                            Browse Jobs
                        </button>
                        <button onClick={() => navigate('/student/profile')} className="bg-indigo-500 bg-opacity-30 text-white px-6 py-2 rounded-full font-semibold hover:bg-opacity-40 transition backdrop-blur-sm">
                            Update Profile
                        </button>
                    </div>
                </div>
                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-purple-400 opacity-20 rounded-full blur-2xl"></div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Briefcase size={24} />
                        </div>
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+2 this week</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{stats.applied}</div>
                    <div className="text-sm text-slate-500 font-medium">Applications Sent</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <CheckCircle size={24} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{stats.shortlisted}</div>
                    <div className="text-sm text-slate-500 font-medium">Shortlisted</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                            <Calendar size={24} />
                        </div>
                        {stats.interviews > 0 && <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Coming Soon</span>}
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{stats.interviews}</div>
                    <div className="text-sm text-slate-500 font-medium">Pending Interviews</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                            <User size={24} />
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stats.profileCompletion === 100 ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50'}`}>
                            {stats.profileCompletion}% Complete
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${stats.profileCompletion}%` }}></div>
                    </div>
                    <div className="text-sm text-slate-500 font-medium">Profile Status</div>
                </div>
            </div>

            {/* Navigation Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div onClick={() => navigate('/jobs')} className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    <h3 className="font-bold text-xl text-slate-900 mb-2 relative z-10">Find Jobs</h3>
                    <p className="text-slate-500 text-sm mb-4 relative z-10">Explore latest campus drives and internship opportunities.</p>
                    <div className="flex items-center text-indigo-600 font-medium text-sm mt-auto relative z-10">
                        Top Companies Hiring <TrendingUp size={16} className="ml-2" />
                    </div>
                </div>

                <div onClick={() => navigate('/student/applications')} className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    <h3 className="font-bold text-xl text-slate-900 mb-2 relative z-10">Track Applications</h3>
                    <p className="text-slate-500 text-sm mb-4 relative z-10">Check status of your applied positions in real-time.</p>
                    <div className="flex items-center text-blue-600 font-medium text-sm mt-auto relative z-10">
                        View Status <Clock size={16} className="ml-2" />
                    </div>
                </div>

                <div onClick={() => navigate('/student/mock-interviews')} className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    <h3 className="font-bold text-xl text-slate-900 mb-2 relative z-10">Mock Interviews</h3>
                    <p className="text-slate-500 text-sm mb-4 relative z-10">Practice with industry experts and get feedback.</p>
                    <div className="flex items-center text-purple-600 font-medium text-sm mt-auto relative z-10">
                        Schedule Now <Calendar size={16} className="ml-2" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
