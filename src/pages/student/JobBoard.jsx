import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Briefcase, MapPin, DollarSign, Calendar, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const JobBoard = () => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [applyingJobId, setApplyingJobId] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await api.get('/jobs');
                setJobs(data);
                setFilteredJobs(data);
            } catch (error) {
                console.error('Failed to fetch jobs', error);
                toast.error('Failed to load jobs');
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        let result = jobs;

        if (searchTerm) {
            result = result.filter(job =>
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterType !== 'All') {
            result = result.filter(job => job.type === filterType);
        }

        setFilteredJobs(result);
    }, [searchTerm, filterType, jobs]);

    const handleApply = async (jobId) => {
        if (!confirm('Are you sure you want to apply for this position?')) return;

        setApplyingJobId(jobId);
        try {
            await api.post('/applications', { jobId });
            toast.success('Application submitted successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to apply');
        } finally {
            setApplyingJobId(null);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Job Openings</h2>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by title, company, or keywords..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-gray-500" size={20} />
                    <select
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Internship">Internship</option>
                        <option value="Part-time">Part-time</option>
                    </select>
                </div>
            </div>

            {/* Jobs List */}
            <div className="grid gap-6">
                {filteredJobs.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
                        <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-4 text-gray-500">No jobs found matching your criteria.</p>
                    </div>
                ) : (
                    filteredJobs.map((job) => (
                        <div key={job._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                                    <p className="text-indigo-600 font-medium">{job.company}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${job.type === 'Internship' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                    {job.type}
                                </span>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <MapPin size={16} className="mr-1" />
                                    {job.location}
                                </div>
                                <div className="flex items-center">
                                    <DollarSign size={16} className="mr-1" />
                                    {job.salaryRange || 'Not disclosed'}
                                </div>
                                <div className="flex items-center">
                                    <Calendar size={16} className="mr-1" />
                                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-gray-600 line-clamp-3">{job.description}</p>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => handleApply(job._id)}
                                    disabled={applyingJobId === job._id}
                                    className={`px-4 py-2 rounded-md text-white transition ${applyingJobId === job._id
                                            ? 'bg-indigo-400 cursor-wait'
                                            : 'bg-indigo-600 hover:bg-indigo-700'
                                        }`}
                                >
                                    {applyingJobId === job._id ? 'Applying...' : 'Quick Apply'}
                                </button>
                                <Link
                                    to={`/jobs/${job._id}`}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default JobBoard;
