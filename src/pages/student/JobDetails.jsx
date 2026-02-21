import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Briefcase, MapPin, DollarSign, Calendar, Building, Clock, ArrowLeft, CheckCircle, Info } from 'lucide-react';
import { toast } from 'react-toastify';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await api.get(`/jobs/${id}`);
                setJob(data);
            } catch (error) {
                console.error('Failed to fetch job details', error);
                toast.error('Failed to load job details');
                navigate('/jobs');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id, navigate]);

    const handleApply = async () => {
        if (!confirm('Are you sure you want to apply for this position?')) return;

        setApplying(true);
        try {
            await api.post('/applications', { jobId: id });
            toast.success('Application submitted successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to apply');
        } finally {
            setApplying(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (!job) return <div className="text-center py-20">Job not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition"
            >
                <ArrowLeft size={20} /> Back to Openings
            </button>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 md:p-12 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-3xl shadow-inner">
                                {job.company.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{job.title}</h1>
                                <p className="text-indigo-100 text-lg font-medium mt-1 flex items-center gap-2">
                                    <Building size={20} /> {job.company}
                                </p>
                            </div>
                        </div>
                        <span className="px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-bold tracking-wider uppercase backdrop-blur-sm border border-white/30">
                            {job.type}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-10 border-t border-white/20">
                        <div className="space-y-1">
                            <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Location</p>
                            <div className="flex items-center gap-2 font-semibold">
                                <MapPin size={16} /> {job.location}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Salary</p>
                            <div className="flex items-center gap-2 font-semibold">
                                <DollarSign size={16} /> {job.salaryRange || 'Not disclosed'}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Deadline</p>
                            <div className="flex items-center gap-2 font-semibold">
                                <Calendar size={16} /> {new Date(job.deadline).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Posted On</p>
                            <div className="flex items-center gap-2 font-semibold">
                                <Clock size={16} /> {new Date(job.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-12 space-y-10">
                    <div className="grid md:grid-cols-3 gap-10">
                        <div className="md:col-span-2 space-y-8">
                            <section>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Info className="text-indigo-600" size={24} /> Job Description
                                </h3>
                                <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {job.description}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <CheckCircle className="text-indigo-600" size={24} /> Requirements
                                </h3>
                                <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {job.requirements}
                                </div>
                            </section>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-widest">Ready to apply?</h4>
                                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                                    Ensure your profile is complete and your resume is updated before submitting.
                                </p>
                                <button
                                    onClick={handleApply}
                                    disabled={applying}
                                    className={`w-full py-4 rounded-xl text-white font-bold shadow-xl shadow-indigo-200 transition-all active:scale-95 ${applying
                                        ? 'bg-indigo-400 cursor-wait'
                                        : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-300'
                                        }`}
                                >
                                    {applying ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Submitting...
                                        </span>
                                    ) : 'Apply Now'}
                                </button>
                            </div>

                            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                                <h4 className="font-bold text-indigo-900 mb-2 text-sm">Need Help?</h4>
                                <p className="text-xs text-indigo-700 leading-relaxed">
                                    Contact the TPO office if you encounter any issues during the application process.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
