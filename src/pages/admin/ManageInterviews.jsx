import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';
import { toast } from 'react-toastify';
import { Calendar, MessageSquare, User, Clock, Star, CheckCircle, Search, Filter, ArrowRight } from 'lucide-react';

const ManageInterviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [feedbackData, setFeedbackData] = useState({
        feedback: '',
        rating: 5,
        status: 'Completed',
        meetingLink: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            const { data } = await api.get('/mock-interviews');
            setInterviews(data);
        } catch (error) {
            console.error('Error fetching interviews', error);
            toast.error('Failed to load interviews');
        } finally {
            setLoading(false);
        }
    };

    const handleFeedbackClick = (interview) => {
        setSelectedInterview(interview);
        setFeedbackData({
            feedback: interview.feedback || '',
            rating: interview.rating || 5,
            status: interview.status || 'Completed',
            meetingLink: interview.meetingLink || ''
        });
        setIsModalOpen(true);
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/mock-interviews/${selectedInterview._id}/feedback`, feedbackData);
            toast.success('Feedback updated successfully!');
            setIsModalOpen(false);
            fetchInterviews();
        } catch (error) {
            toast.error('Failed to update feedback');
        }
    };

    const filteredInterviews = interviews.filter(interview => {
        const matchesSearch = interview.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            interview.topic.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || interview.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Manage Mock Interviews</h2>
                    <p className="text-slate-500 mt-1">Review requests and provide feedback to students.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search student or topic..."
                        className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative min-w-[180px]">
                    <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <select
                        className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Feedback Given">Feedback Given</option>
                    </select>
                </div>
            </div>

            {/* Content Area */}
            {filteredInterviews.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No interview requests found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your filters or wait for new requests.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {filteredInterviews.map((interview) => (
                        <div key={interview._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="flex gap-4">
                                    <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl border border-indigo-100">
                                        {interview.student?.name.charAt(0)}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-bold text-slate-900">{interview.topic}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase border ${interview.status === 'Completed' || interview.status === 'Feedback Given'
                                                ? 'bg-green-50 text-green-700 border-green-100'
                                                : interview.status === 'Scheduled'
                                                    ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                    : 'bg-amber-50 text-amber-700 border-amber-100'
                                                }`}>
                                                {interview.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-slate-600 text-sm font-medium gap-3">
                                            <span className="flex items-center gap-1"><User size={14} /> {interview.student?.name}</span>
                                            <span className="text-slate-300">•</span>
                                            <span className="flex items-center gap-1"><Clock size={14} /> {new Date(interview.scheduledAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end justify-between">
                                    <button
                                        onClick={() => handleFeedbackClick(interview)}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition font-semibold text-sm"
                                    >
                                        <MessageSquare size={16} /> Manage Interview
                                    </button>
                                </div>
                            </div>

                            {interview.feedback && (
                                <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Feedback Provided</span>
                                        <div className="flex">
                                            {[...Array(10)].map((_, i) => (
                                                <Star key={i} size={12} className={i < interview.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 italic leading-relaxed">"{interview.feedback}"</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Feedback Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Manage Interview: ${selectedInterview?.topic}`}
            >
                <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-widest">Format: {selectedInterview?.student?.name}</p>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Feedback</label>
                        <textarea
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-40 resize-none"
                            placeholder="Share your thoughts on performance, strengths, and areas for improvement..."
                            required={feedbackData.status === 'Feedback Given' || feedbackData.status === 'Completed'}
                            value={feedbackData.feedback}
                            onChange={(e) => setFeedbackData({ ...feedbackData, feedback: e.target.value })}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Rating (1-10)</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    value={feedbackData.rating}
                                    onChange={(e) => setFeedbackData({ ...feedbackData, rating: parseInt(e.target.value) })}
                                />
                                <span className="text-xl font-bold text-indigo-600 min-w-[2ch]">{feedbackData.rating}</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Update Status</label>
                            <select
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={feedbackData.status}
                                onChange={(e) => setFeedbackData({ ...feedbackData, status: e.target.value })}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Scheduled">Scheduled</option>
                                <option value="Completed">Completed</option>
                                <option value="Feedback Given">Feedback Given</option>
                            </select>
                        </div>
                    </div>

                    {feedbackData.status === 'Scheduled' && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Meeting Link</label>
                            <input
                                type="url"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="https://meet.google.com/..."
                                required={feedbackData.status === 'Scheduled'}
                                value={feedbackData.meetingLink}
                                onChange={(e) => setFeedbackData({ ...feedbackData, meetingLink: e.target.value })}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
                    >
                        <CheckCircle size={20} /> Save Changes & Notify Student
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default ManageInterviews;
