import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, User, Mail, FileText, CheckCircle, XCircle, Clock, MessageSquare, X } from 'lucide-react';
import { toast } from 'react-toastify';
import ApplicationProgress from '../../components/ApplicationProgress';

const JobApplications = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [job, setJob] = useState(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [feedbackText, setFeedbackText] = useState('');
    const [submitting, setSubmitting] = useState(false);

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

    const openFeedbackModal = (app) => {
        setSelectedApp(app);
        setSelectedStatus(app.status === 'Applied' ? 'Shortlisted' : app.status);
        setFeedbackText('');
        setIsModalOpen(true);
    };

    const handleStatusUpdate = async () => {
        if (!selectedApp) return;
        setSubmitting(true);
        try {
            await api.put(`/applications/${selectedApp._id}`, {
                status: selectedStatus,
                feedback: feedbackText
            });
            toast.success(`Application ${selectedStatus}`);
            setApplications(applications.map(app =>
                app._id === selectedApp._id ? { ...app, status: selectedStatus, feedback: feedbackText } : app
            ));
            setIsModalOpen(false);
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setSubmitting(false);
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
                                                    <div className="mt-2 w-64">
                                                        <ApplicationProgress status={app.status} />
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
                                                {app.feedback && (
                                                    <div
                                                        className="p-2 text-gray-400 hover:text-gray-600 rounded cursor-help group relative"
                                                    >
                                                        <MessageSquare size={18} />
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10 whitespace-normal">
                                                            {app.feedback}
                                                        </div>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => openFeedbackModal(app)}
                                                    className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 rounded-lg transition"
                                                    title="Update Status"
                                                >
                                                    Process Candidate
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

            {/* Feedback Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900">
                                Update Candidate Status
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-1">Candidate</p>
                                <p className="text-gray-900 font-semibold">{selectedApp?.student?.name}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Selection Status
                                </label>
                                <select
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    <option value="Applied" disabled>Applied (Initial)</option>
                                    <option value="Shortlisted">Shortlisted</option>
                                    <option value="Interview Scheduled">Interview Scheduled</option>
                                    <option value="Selected">Selected</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Message to Candidate & TPO (Optional)
                                </label>
                                <textarea
                                    value={feedbackText}
                                    onChange={(e) => setFeedbackText(e.target.value)}
                                    placeholder={selectedStatus === 'Rejected'
                                        ? "Thank you for your interest. Unfortunately..."
                                        : "Congratulations on moving to the next stage! Here are the next steps..."}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px] resize-y"
                                ></textarea>
                                <p className="text-xs text-gray-500 mt-2">
                                    This message will be emailed directly to the student and cc'd to the Placement Office.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                disabled={submitting}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleStatusUpdate}
                                disabled={submitting}
                                className={`px-5 py-2.5 text-sm font-medium text-white rounded-xl transition flex items-center justify-center min-w-[120px] ${selectedStatus === 'Rejected'
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                                    }`}
                            >
                                {submitting ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    'Update Status & Notify'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobApplications;
