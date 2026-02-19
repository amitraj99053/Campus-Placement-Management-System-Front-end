import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';
import { Plus, Users, Edit, Trash } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const RecruiterDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newJob, setNewJob] = useState({
        title: '', company: '', description: '', requirements: '', location: '',
        type: 'Full-time', salaryRange: '', deadline: ''
    });

    useEffect(() => {
        fetchMyJobs();
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

    const handleCreateJob = async (e) => {
        e.preventDefault();
        try {
            await api.post('/jobs', newJob);
            toast.success('Job posted successfully');
            setIsModalOpen(false);
            fetchMyJobs();
            setNewJob({
                title: '', company: '', description: '', requirements: '', location: '',
                type: 'Full-time', salaryRange: '', deadline: ''
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to post job');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Manage Jobs</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                >
                    <Plus size={20} />
                    Post New Job
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                                    <button className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit size={18} /></button>
                                    <button className="text-red-600 hover:text-red-900"><Trash size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Post New Job">
                <form onSubmit={handleCreateJob} className="space-y-4 max-h-[70vh] overflow-y-auto">
                    <input type="text" placeholder="Job Title" className="w-full p-2 border rounded" required
                        onChange={e => setNewJob({ ...newJob, title: e.target.value })} />
                    <input type="text" placeholder="Company Name" className="w-full p-2 border rounded" required
                        onChange={e => setNewJob({ ...newJob, company: e.target.value })} />
                    <textarea placeholder="Description" className="w-full p-2 border rounded" required
                        onChange={e => setNewJob({ ...newJob, description: e.target.value })} />
                    <textarea placeholder="Requirements (comma separated)" className="w-full p-2 border rounded"
                        onChange={e => setNewJob({ ...newJob, requirements: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Location" className="w-full p-2 border rounded" required
                            onChange={e => setNewJob({ ...newJob, location: e.target.value })} />
                        <select className="w-full p-2 border rounded"
                            onChange={e => setNewJob({ ...newJob, type: e.target.value })}>
                            <option value="Full-time">Full-time</option>
                            <option value="Internship">Internship</option>
                            <option value="Part-time">Part-time</option>
                        </select>
                    </div>
                    <input type="text" placeholder="Salary Range" className="w-full p-2 border rounded"
                        onChange={e => setNewJob({ ...newJob, salaryRange: e.target.value })} />
                    <input type="date" className="w-full p-2 border rounded" required
                        onChange={e => setNewJob({ ...newJob, deadline: e.target.value })} />
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">Post Job</button>
                </form>
            </Modal>
        </div>
    );
};

export default RecruiterDashboard;
