import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import { Plus, Users, Edit, Trash } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const RecruiterDashboard = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newJob, setNewJob] = useState({
        title: '', company: '', description: '', requirements: '', location: '',
        type: 'Full-time', salaryRange: '', deadline: ''
    });
    const [editingJob, setEditingJob] = useState(null);

    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchMyJobs();
        fetchStats();
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
            requirements: job.requirements,
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
        </div>
    );
};

export default RecruiterDashboard;
