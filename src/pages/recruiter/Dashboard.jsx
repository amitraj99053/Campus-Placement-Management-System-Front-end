import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import { Plus, Users, Edit, Trash, MessageSquare, CheckCircle, XCircle, FileText, User, Mail, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import ApplicationProgress from '../../components/ApplicationProgress';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const RecruiterDashboard = () => {
    const { user, refreshUser } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newJob, setNewJob] = useState({
        title: '', company: '', description: '', requirements: '', location: '',
        type: 'Full-time', salaryRange: '', deadline: ''
    });
    const [editingJob, setEditingJob] = useState(null);
    const [stats, setStats] = useState(null);
    const [applications, setApplications] = useState([]);

    // Feedback Modal State
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [feedbackText, setFeedbackText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        refreshUser();
        fetchMyJobs();
        fetchStats();
        fetchApplications();
    }, []);

    const fetchMyJobs = async () => {
        try {
            const { data } = await api.get('/jobs/my');
            setJobs(data);
        } catch (error) {
            console.error('Error fetching jobs', error);
            toast.error('Failed to fetch your jobs');
        }
    };

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/analytics');
            setStats(data.recruiterStats);
        } catch (error) {
            console.error('Error fetching stats', error);
        }
    };

    const fetchApplications = async () => {
        try {
            const { data } = await api.get('/applications/recruiter');
            setApplications(data);
        } catch (error) {
            console.error('Error fetching applications pipeline', error);
        }
    };

    const openFeedbackModal = (app) => {
        setSelectedApp(app);
        setSelectedStatus(app.status === 'Applied' ? 'Shortlisted' : app.status);
        setFeedbackText('');
        setIsFeedbackModalOpen(true);
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
            setIsFeedbackModalOpen(false);
            fetchStats(); // update chart
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setSubmitting(false);
        }
    };

    const chartData = {
        labels: stats?.applicationBreakdown?.map(item => item._id) || ['Applied', 'Shortlisted', 'Selected', 'Rejected'],
        datasets: [
            {
                label: 'Applications',
                data: stats?.applicationBreakdown?.length > 0
                    ? stats.applicationBreakdown.map(item => item.count)
                    : [0, 0, 0, 0],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.6)',
                    'rgba(79, 70, 229, 0.6)',
                    'rgba(16, 185, 129, 0.6)',
                    'rgba(239, 68, 68, 0.6)'
                ],
            },
        ],
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        try {
            if (editingJob) {
                await api.put(`/jobs/${editingJob._id}`, newJob);
                toast.success('Job updated successfully');
            } else {
                await api.post('/jobs', newJob);
                toast.success('Job posted successfully');
            }
            setIsModalOpen(false);
            fetchMyJobs();
            resetForm();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const resetForm = () => {
        setNewJob({
            title: '', company: '', description: '', requirements: '', location: '',
            type: 'Full-time', salaryRange: '', deadline: ''
        });
        setEditingJob(null);
    };

    const handleEditClick = (job) => {
        setEditingJob(job);
        setNewJob({
            title: job.title,
            company: job.company,
            description: job.description,
            requirements: Array.isArray(job.requirements) ? job.requirements.join(', ') : job.requirements,
            location: job.location,
            type: job.type,
            salaryRange: job.salaryRange,
            deadline: job.deadline.split('T')[0] // Format for date input
        });
        setIsModalOpen(true);
    };

    const handleDeleteJob = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job posting?')) {
            try {
                await api.delete(`/jobs/${jobId}`);
                toast.success('Job deleted successfully');
                fetchMyJobs();
            } catch (error) {
                toast.error('Failed to delete job');
            }
        }
    };

    return (
        <div className="space-y-6">
            {!user?.isVerified && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                Your account is pending verification by the Admin/TPO. You cannot post jobs until verified.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Manage Jobs</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={!user?.isVerified}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${user?.isVerified
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    <Plus size={20} />
                    Post New Job
                </button>
            </div>

            {/* Stats Chart */}
            <div className="grid md:grid-cols-3 gap-6 pb-6">
                <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg mb-4 text-slate-800">Application Status Mix</h3>
                    <div className="h-64 flex justify-center">
                        <Pie
                            data={chartData}
                            options={{
                                maintainAspectRatio: false,
                                plugins: { legend: { position: 'right' } }
                            }}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="bg-indigo-600 p-6 rounded-xl shadow-sm text-white flex-1 flex flex-col justify-center">
                        <h3 className="text-indigo-100 font-medium mb-1">Total Impact</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold">{stats?.totalApplicationsReceived || 0}</span>
                            <span className="text-indigo-100 font-medium ml-1">Candidates reached</span>
                        </div>
                        <p className="mt-4 text-indigo-100 text-sm">
                            Across {stats?.jobsPosted || 0} active job postings.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicants</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {jobs.map((job) => (
                                <tr key={job._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{job.title}</div>
                                        <div className="text-sm text-gray-500">{job.company}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {job.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Link to={`/recruiter/jobs/${job._id}/applications`} className="flex items-center gap-1 hover:text-indigo-600">
                                            <Users size={16} />
                                            {job.applicants?.length || 0}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(job.deadline).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEditClick(job)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteJob(job._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Global Applications Pipeline Section */}
            <div className="flex justify-between items-center mt-12 mb-2">
                <h2 className="text-2xl font-bold text-slate-900">Pipeline Tracker</h2>
                <p className="text-slate-500 text-sm">Action candidates across all roles seamlessly</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate & Job</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Progress Tracker</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {applications.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        No applications received yet.
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
                                                    <div className="text-sm font-medium text-gray-900">{app.student?.name}</div>
                                                    <div className="text-xs text-indigo-600 font-semibold">{app.job?.title}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap min-w-[200px]">
                                            <ApplicationProgress status={app.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                {app.resume && (
                                                    <a
                                                        href={app.resume}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition"
                                                        title="View Resume"
                                                    >
                                                        <FileText size={18} />
                                                    </a>
                                                )}
                                                {app.feedback && (
                                                    <div className="p-2 text-gray-400 hover:text-indigo-600 rounded cursor-help group relative transition">
                                                        <MessageSquare size={18} />
                                                        <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10 whitespace-normal">
                                                            {app.feedback}
                                                        </div>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => openFeedbackModal(app)}
                                                    className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 rounded-lg transition"
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

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    resetForm();
                }}
                title={editingJob ? "Edit Job" : "Post New Job"}
            >
                <form onSubmit={handleCreateJob} className="space-y-4 max-h-[70vh] overflow-y-auto">
                    <input type="text" placeholder="Job Title" className="w-full p-2 border rounded" required
                        value={newJob.title}
                        onChange={e => setNewJob({ ...newJob, title: e.target.value })} />
                    <input type="text" placeholder="Company Name" className="w-full p-2 border rounded" required
                        value={newJob.company}
                        onChange={e => setNewJob({ ...newJob, company: e.target.value })} />
                    <textarea placeholder="Description" className="w-full p-2 border rounded" required
                        value={newJob.description}
                        onChange={e => setNewJob({ ...newJob, description: e.target.value })} />
                    <textarea placeholder="Requirements (comma separated)" className="w-full p-2 border rounded"
                        value={newJob.requirements}
                        onChange={e => setNewJob({ ...newJob, requirements: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Location" className="w-full p-2 border rounded" required
                            value={newJob.location}
                            onChange={e => setNewJob({ ...newJob, location: e.target.value })} />
                        <select
                            className="w-full p-2 border rounded"
                            value={newJob.type}
                            onChange={e => setNewJob({ ...newJob, type: e.target.value })}
                        >
                            <option value="Full-time">Full-time</option>
                            <option value="Internship">Internship</option>
                            <option value="Part-time">Part-time</option>
                        </select>
                    </div>
                    <input type="text" placeholder="Salary Range" className="w-full p-2 border rounded"
                        value={newJob.salaryRange}
                        onChange={e => setNewJob({ ...newJob, salaryRange: e.target.value })} />
                    <input type="date" className="w-full p-2 border rounded" required
                        value={newJob.deadline}
                        onChange={e => setNewJob({ ...newJob, deadline: e.target.value })} />
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">
                        {editingJob ? "Update Job" : "Post Job"}
                    </button>
                </form>
            </Modal>
            <Modal
                isOpen={isFeedbackModalOpen}
                onClose={() => setIsFeedbackModalOpen(false)}
                title="Update Candidate Status"
            >
                <div className="space-y-5">
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Candidate</p>
                        <p className="text-gray-900 font-semibold">{selectedApp?.student?.name}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Selection Status
                        </label>
                        <select
                            className="w-full px-4 py-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
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
                                : "Congratulations on moving to the next stage!..."}
                            className="w-full px-4 py-2 border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] resize-y"
                        ></textarea>
                        <p className="text-xs text-gray-500 mt-2">
                            This message will be emailed directly to the student and cc'd to the Placement Office.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            onClick={() => setIsFeedbackModalOpen(false)}
                            disabled={submitting}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleStatusUpdate}
                            disabled={submitting}
                            className={`px-4 py-2 text-sm font-medium text-white rounded transition flex items-center justify-center min-w-[120px] ${selectedStatus === 'Rejected'
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                        >
                            {submitting ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                'Update Status'
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default RecruiterDashboard;
