import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Briefcase, Building, MapPin, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

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

    const getStatusColor = (status) => {
        switch (status) {
            case 'Applied': return 'bg-blue-100 text-blue-800';
            case 'Shortlisted': return 'bg-yellow-100 text-yellow-800';
            case 'Interview Scheduled': return 'bg-purple-100 text-purple-800';
            case 'Selected': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div>Loading applications...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">My Applications</h2>

            {applications.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
                    <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-gray-500">You haven't applied to any jobs yet.</p>
                    <Link to="/jobs" className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                        Browse Jobs
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {applications.map((app) => (
                        <div key={app._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-xl font-semibold text-slate-900">{app.job?.title || 'Unknown Job'}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                                        {app.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><Building size={16} /> {app.job?.company || 'Unknown Company'}</span>
                                    <span className="flex items-center gap-1"><MapPin size={16} /> {app.job?.location || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <span className="flex items-center gap-1"><Calendar size={14} /> Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div>
                                {/* Future: Add 'Withdraw' button if status is just 'Applied' */}
                                <Link to={`/jobs/${app.job?._id}`} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                                    View Job
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyApplications;
