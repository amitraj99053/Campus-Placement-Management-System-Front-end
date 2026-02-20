import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, User, Mail, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const JobApplications = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [job, setJob] = useState(null);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [appRes, jobRes] = await Promise.all([
                api.get(`/applications/job/${id}`),
                api.get(`/jobs/${id}`)
            ]);
            setApplications(appRes.data);
            setJob(jobRes.data);
        } catch (error) {
            toast.error('Failed to fetch data');
            navigate('/recruiter/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (appId, newStatus) => {
        try {
            await api.put(`/applications/${appId}`, { status: newStatus });
            toast.success(`Application ${newStatus}`);
            setApplications(applications.map(app =>
                app._id === appId ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading applications...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/recruiter/dashboard')}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Applications for {job?.title}</h2>
                    <p className="text-gray-500">{job?.company} • {applications.length} Applicants</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {applications.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        No applications received yet for this position.
                                    </td>
                                </tr>
                            ) : (
                                applications.map((app) => (
                                    <tr key={app._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                                    <User size={20} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{app.student.name}</div>
                                                    <div className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Mail size={12} /> {app.student.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${app.status === 'Shortlisted' ? 'bg-green-100 text-green-800' :
                                                    app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-blue-100 text-blue-800'}`}
                                            >
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-2">
                                                {app.resume && (
                                                    <a
                                                        href={app.resume}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"
                                                        title="View Resume"
                                                    >
                                                        <FileText size={18} />
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => handleStatusUpdate(app._id, 'Shortlisted')}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded"
                                                    title="Shortlist"
                                                    disabled={app.status === 'Shortlisted'}
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                    title="Reject"
                                                    disabled={app.status === 'Rejected'}
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default JobApplications;
