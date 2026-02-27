import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Briefcase, Building, MapPin, Calendar, Clock, CheckCircle, XCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import ApplicationProgress from '../../components/ApplicationProgress';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const { data } = await api.get('/applications/my');
                setApplications(data);
            } catch (error) {
                console.error('Failed to fetch applications', error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const getStatusConfig = (status) => {
        switch (status) {
            case 'Applied': return { color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock, label: 'Under Review' };
            case 'Shortlisted': return { color: 'text-amber-600', bg: 'bg-amber-50', icon: CheckCircle, label: 'Shortlisted' };
            case 'Interview Scheduled': return { color: 'text-purple-600', bg: 'bg-purple-50', icon: Calendar, label: 'Interview' };
            case 'Selected': return { color: 'text-green-600', bg: 'bg-green-50', icon: Briefcase, label: 'Hired' };
            case 'Rejected': return { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle, label: 'Not Selected' };
            default: return { color: 'text-gray-600', bg: 'bg-gray-50', icon: AlertCircle, label: status };
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-900">My Applications</h2>
                <p className="text-slate-500 mt-1">Track the progress of your job applications.</p>
            </div>

            {applications.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
                    <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">No applications yet</h3>
                    <p className="text-slate-500 mt-2 max-w-md mx-auto">Start your career journey by exploring open positions and applying to your dream companies.</p>
                    <Link to="/jobs" className="mt-6 inline-flex items-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                        Browse Jobs
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {applications.map((app) => {
                        const statusConfig = getStatusConfig(app.status);
                        const StatusIcon = statusConfig.icon;

                        return (
                            <div key={app._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex gap-4">
                                        <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 font-bold text-2xl border border-gray-200">
                                            {app.job?.company?.charAt(0) || 'C'}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">{app.job?.title || 'Unknown Job'}</h3>
                                            <div className="flex items-center text-slate-500 font-medium mt-1">
                                                <Building size={16} className="mr-2" />
                                                {app.job?.company || 'Unknown Company'}
                                            </div>
                                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                                <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                                                    <MapPin size={14} /> {app.job?.location || 'N/A'}
                                                </span>
                                                <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                                                    <Calendar size={14} /> Applied: {new Date(app.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end justify-between">
                                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${statusConfig.bg} ${statusConfig.color}`}>
                                            <StatusIcon size={18} />
                                            {statusConfig.label}
                                        </div>

                                        <Link
                                            to={`/jobs/${app.job?._id}`}
                                            className="mt-4 text-indigo-600 hover:text-indigo-800 font-semibold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            View Job Details <Clock size={14} />
                                        </Link>
                                    </div>
                                </div>

                                {/* Simple Progress Bar */}
                                <div className="mt-4">
                                    <ApplicationProgress status={app.status} />
                                </div>

                                {/* Recruiter Feedback / Message Box */}
                                {app.feedback && (
                                    <div className="mt-5 bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex gap-3 items-start">
                                        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 flex-shrink-0 mt-0.5">
                                            <MessageSquare size={16} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-indigo-900 mb-1">Message from Recruiter</h4>
                                            <p className="text-sm text-indigo-800 leading-relaxed whitespace-pre-wrap">
                                                {app.feedback}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyApplications;
