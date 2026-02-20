import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Briefcase, MapPin, DollarSign, Calendar, Search, Filter, Building, Clock, CheckCircle } from 'lucide-react';
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

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="space-y-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Job Openings</h2>
                    <p className="text-slate-500 mt-1">Discover and apply to your dream companies.</p>
                </div>
                <div className="text-sm text-slate-400">
                    Showing {filteredJobs.length} jobs
                </div>
            </div>

            {/* Sticky Search Bar */}
            <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-200 transition-all">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by title, company, or keywords..."
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 min-w-[200px]">
                        <div className="relative w-full">
                            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
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
                </div>
            </div>

            {/* Jobs Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                        <div className="bg-gray-50 p-4 rounded-full mb-4">
                            <Search className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
                        <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setFilterType('All'); }}
                            className="mt-6 text-indigo-600 font-medium hover:text-indigo-700 hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    filteredJobs.map((job) => (
                        <div key={job._id} className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl shadow-sm">
                                        {job.company.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 line-clamp-1" title={job.title}>{job.title}</h3>
                                        <p className="text-slate-500 text-sm font-medium">{job.company}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${job.type === 'Internship'
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-green-100 text-green-700'
                                    }`}>
                                    {job.type}
                                </span>
                            </div>

                            <div className="space-y-3 mb-6 relative z-10">
                                <div className="flex items-center text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                                    <MapPin size={16} className="mr-3 text-indigo-400" />
                                    <span className="truncate">{job.location}</span>
                                </div>
                                <div className="flex items-center text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                                    <DollarSign size={16} className="mr-3 text-green-500" />
                                    <span>{job.salaryRange || 'Not disclosed'}</span>
                                </div>
                                <div className="flex items-center text-sm text-slate-500 pl-2">
                                    <Clock size={14} className="mr-3 text-orange-400" />
                                    <span>Expires: {new Date(job.deadline).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                                {job.description}
                            </p>

                            <div className="flex gap-3 pt-4 border-t border-gray-50 mt-auto relative z-10">
                                <Link
                                    to={`/jobs/${job._id}`}
                                    className="flex-1 px-4 py-2.5 border border-indigo-100 rounded-xl text-indigo-600 text-sm font-semibold hover:bg-indigo-50 transition text-center"
                                >
                                    View Details
                                </Link>
                                <button
                                    onClick={() => handleApply(job._id)}
                                    disabled={applyingJobId === job._id}
                                    className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-95 ${applyingJobId === job._id
                                            ? 'bg-indigo-400 cursor-wait'
                                            : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-300'
                                        }`}
                                >
                                    {applyingJobId === job._id ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Applying
                                        </span>
                                    ) : 'Apply Now'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default JobBoard;
