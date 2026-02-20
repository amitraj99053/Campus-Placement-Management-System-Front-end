import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';
import { toast } from 'react-toastify';
import { Calendar, MessageSquare, Video, BookOpen, UserCheck, Star, Clock } from 'lucide-react';

const MockInterviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newInterview, setNewInterview] = useState({
        topic: 'General HR',
        scheduledAt: '',
    });

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            const { data } = await api.get('/mock-interviews/my');
            setInterviews(data);
        } catch (error) {
            console.error('Error fetching interviews', error);
        }
    };

    const handleSchedule = async (e) => {
        e.preventDefault();
        try {
            await api.post('/mock-interviews', newInterview);
            toast.success('Interview request sent!');
            setIsModalOpen(false);
            fetchInterviews();
        } catch (error) {
            toast.error('Failed to schedule interview');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Mock Interviews</h2>
                    <p className="text-slate-500 mt-1">Practice with experts and gain confidence.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 font-semibold"
                >
                    <Calendar size={20} />
                    Schedule New Interview
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {interviews.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-dashed border-gray-300">
                        <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Video className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">No interviews scheduled</h3>
                        <p className="text-slate-500 mt-2">Book a session to practice your technical or HR skills.</p>
                    </div>
                ) : (
                    interviews.map((interview) => (
                        <div key={interview._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full -mr-4 -mt-4 opacity-20 ${interview.status === 'Completed' ? 'bg-green-500' :
                                    interview.status === 'Scheduled' ? 'bg-blue-500' : 'bg-gray-500'
                                }`}></div>

                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="font-bold text-xl text-slate-900 mb-1">{interview.topic}</h3>
                                    <div className="flex items-center text-sm text-slate-500">
                                        <Clock size={14} className="mr-2" />
                                        {new Date(interview.scheduledAt).toLocaleString()}
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase 
                                    ${interview.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                        interview.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {interview.status}
                                </span>
                            </div>

                            {interview.feedback ? (
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                        <MessageSquare size={16} className="text-indigo-500" />
                                        Interviewer Feedback
                                    </div>
                                    <p className="text-sm text-slate-600 italic leading-relaxed">"{interview.feedback}"</p>
                                    {interview.rating && (
                                        <div className="mt-3 flex items-center gap-2">
                                            <div className="flex">
                                                {[...Array(10)].map((_, i) => (
                                                    <Star key={i} size={12} className={i < interview.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                                                ))}
                                            </div>
                                            <span className="text-xs font-bold text-slate-700">{interview.rating}/10</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                        <Video size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-blue-900">Upcoming Session</p>
                                        <p className="text-xs text-blue-700">Prepare your camera and microphone.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Mock Interview">
                <form onSubmit={handleSchedule} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Topic</label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            value={newInterview.topic}
                            onChange={(e) => setNewInterview({ ...newInterview, topic: e.target.value })}
                        >
                            <option value="General HR">General HR</option>
                            <option value="Technical - Data Structures">Technical - Data Structures</option>
                            <option value="Technical - System Design">Technical - System Design</option>
                            <option value="Behavioral">Behavioral</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date & Time</label>
                        <input
                            type="datetime-local"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            required
                            onChange={(e) => setNewInterview({ ...newInterview, scheduledAt: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md">
                        Confirm Request
                    </button>
                </form>
            </Modal>

            {/* Preparation Zone */}
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-8 rounded-3xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>

                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 relative z-10">
                    <BookOpen className="text-indigo-300" /> Interview Preparation Zone
                </h3>

                <div className="grid md:grid-cols-3 gap-6 relative z-10">
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/20 transition cursor-pointer group">
                        <div className="bg-indigo-500/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="text-2xl">💻</span>
                        </div>
                        <h4 className="font-bold text-lg mb-2">Technical Resources</h4>
                        <ul className="text-sm text-indigo-100 space-y-2">
                            <li className="hover:text-white transition">• Top 50 Data Structure Questions</li>
                            <li className="hover:text-white transition">• System Design Primer</li>
                            <li className="hover:text-white transition">• Database SQL vs NoSQL</li>
                        </ul>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/20 transition cursor-pointer group">
                        <div className="bg-purple-500/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="text-2xl">🤝</span>
                        </div>
                        <h4 className="font-bold text-lg mb-2">HR Round Tips</h4>
                        <ul className="text-sm text-indigo-100 space-y-2">
                            <li className="hover:text-white transition">• "Tell me about yourself" Guide</li>
                            <li className="hover:text-white transition">• STAR Method for Behavioral QA</li>
                            <li className="hover:text-white transition">• Questions to ask the interviewer</li>
                        </ul>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/20 transition cursor-pointer group">
                        <div className="bg-pink-500/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="text-2xl">🚀</span>
                        </div>
                        <h4 className="font-bold text-lg mb-2">Practice Tools</h4>
                        <ul className="text-sm text-indigo-100 space-y-2">
                            <li className="hover:text-white transition">• LeetCode / HackerRank</li>
                            <li className="hover:text-white transition">• Pramp (Peer Interviews)</li>
                            <li className="hover:text-white transition">• Resume Review Checklist</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MockInterviews;
