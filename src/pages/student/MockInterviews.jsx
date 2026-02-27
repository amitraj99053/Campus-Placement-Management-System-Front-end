import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';
import { toast } from 'react-toastify';
import { Calendar, MessageSquare, Video, BookOpen, UserCheck, Star, Clock, ExternalLink, Code, FileText, Layout, Users } from 'lucide-react';

const MockInterviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newInterview, setNewInterview] = useState({
        topic: 'General HR',
        dateDay: '',
        dateMonth: '',
        dateYear: '',
        time: '',
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
            const day = newInterview.dateDay.padStart(2, '0');
            const month = newInterview.dateMonth.padStart(2, '0');
            const scheduledAt = new Date(`${newInterview.dateYear}-${month}-${day}T${newInterview.time}`);

            await api.post('/mock-interviews', {
                topic: newInterview.topic,
                scheduledAt: scheduledAt.toISOString()
            });
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
                                    <div className="flex-grow">
                                        <p className="text-sm font-semibold text-blue-900">Upcoming Session</p>
                                        <p className="text-xs text-blue-700">Prepare your camera and microphone.</p>
                                    </div>
                                    {interview.meetingLink && (
                                        <a
                                            href={interview.meetingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition shadow-md whitespace-nowrap flex items-center gap-2"
                                        >
                                            <Video size={16} /> Join Now
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Mock Interview">
                <form onSubmit={handleSchedule} className="space-y-6">
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <h4 className="font-semibold text-indigo-900 flex items-center gap-2">
                            <BookOpen size={18} /> Interview Details
                        </h4>
                        <p className="text-xs text-indigo-700 mt-1">Select your preferred topic and a date (DD/MM/YYYY) for the mock session.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Interview Topic</label>
                        <select
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 font-medium"
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
                        <label className="block text-sm font-bold text-gray-700 mb-2">Date (DD / MM / YYYY)</label>
                        <div className="grid grid-cols-3 gap-3">
                            <input
                                type="text"
                                placeholder="DD"
                                maxLength="2"
                                pattern="\d{1,2}"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 font-medium text-center"
                                required
                                value={newInterview.dateDay}
                                onChange={(e) => setNewInterview({ ...newInterview, dateDay: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="MM"
                                maxLength="2"
                                pattern="\d{1,2}"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 font-medium text-center"
                                required
                                value={newInterview.dateMonth}
                                onChange={(e) => setNewInterview({ ...newInterview, dateMonth: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="YYYY"
                                maxLength="4"
                                pattern="\d{4}"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 font-medium text-center"
                                required
                                value={newInterview.dateYear}
                                onChange={(e) => setNewInterview({ ...newInterview, dateYear: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Time</label>
                        <input
                            type="time"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 font-medium"
                            required
                            value={newInterview.time}
                            onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-xl mt-2 flex justify-center items-center gap-2">
                        <Calendar size={18} /> Confirm Interview Request
                    </button>
                </form>
            </Modal>

            {/* Preparation Zone */}
            <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-8 md:p-12 rounded-3xl text-white relative overflow-hidden shadow-2xl">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500 opacity-10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

                <div className="relative z-10 mb-10">
                    <h3 className="text-3xl font-bold flex items-center gap-3">
                        <BookOpen className="text-indigo-400" size={32} /> Interview Preparation Zone
                    </h3>
                    <p className="text-indigo-200 mt-2 max-w-2xl text-lg">Curated resources and tools to help you ace your next campus placement interview.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative z-10">

                    {/* Technical Resources */}
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition duration-300">
                        <div className="bg-gradient-to-br from-indigo-400 to-blue-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
                            <Code size={28} className="text-white" />
                        </div>
                        <h4 className="font-bold text-xl mb-4 text-white">Technical Rounds</h4>
                        <div className="space-y-3">
                            <a href="https://leetcode.com/problem-list/top-interview-questions/" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white/10 transition">
                                <FileText size={18} className="text-indigo-300 mt-0.5 group-hover:text-indigo-200" />
                                <div>
                                    <p className="font-semibold text-sm text-indigo-50 group-hover:text-white">Top 50 DSA Questions</p>
                                    <p className="text-xs text-indigo-300/80 mt-0.5">Most frequently asked arrays & strings.</p>
                                </div>
                            </a>
                            <a href="https://github.com/donnemartin/system-design-primer" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white/10 transition">
                                <Layout size={18} className="text-indigo-300 mt-0.5 group-hover:text-indigo-200" />
                                <div>
                                    <p className="font-semibold text-sm text-indigo-50 group-hover:text-white">System Design Primer</p>
                                    <p className="text-xs text-indigo-300/80 mt-0.5">Learn how to design scalable systems.</p>
                                </div>
                            </a>
                            <a href="https://www.geeksforgeeks.org/sql-tutorial/" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white/10 transition">
                                <Code size={18} className="text-indigo-300 mt-0.5 group-hover:text-indigo-200" />
                                <div>
                                    <p className="font-semibold text-sm text-indigo-50 group-hover:text-white">Database SQL Cheatsheet</p>
                                    <p className="text-xs text-indigo-300/80 mt-0.5">Joins, indexes, and normal forms.</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* HR & Behavioral */}
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition duration-300">
                        <div className="bg-gradient-to-br from-purple-400 to-pink-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                            <Users size={28} className="text-white" />
                        </div>
                        <h4 className="font-bold text-xl mb-4 text-white">HR & Behavioral</h4>
                        <div className="space-y-3">
                            <a href="https://hbr.org/2021/11/how-to-answer-tell-me-about-yourself-in-an-interview" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white/10 transition">
                                <MessageSquare size={18} className="text-purple-300 mt-0.5 group-hover:text-purple-200" />
                                <div>
                                    <p className="font-semibold text-sm text-purple-50 group-hover:text-white">"Tell me about yourself"</p>
                                    <p className="text-xs text-purple-300/80 mt-0.5">The perfect framework for introductions.</p>
                                </div>
                            </a>
                            <a href="https://www.themuse.com/advice/star-interview-method" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white/10 transition">
                                <Star size={18} className="text-purple-300 mt-0.5 group-hover:text-purple-200" />
                                <div>
                                    <p className="font-semibold text-sm text-purple-50 group-hover:text-white">STAR Method Mastery</p>
                                    <p className="text-xs text-purple-300/80 mt-0.5">Situation, Task, Action, Result.</p>
                                </div>
                            </a>
                            <a href="https://www.themuse.com/advice/51-interview-questions-you-should-be-asking" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white/10 transition">
                                <UserCheck size={18} className="text-purple-300 mt-0.5 group-hover:text-purple-200" />
                                <div>
                                    <p className="font-semibold text-sm text-purple-50 group-hover:text-white">Questions to Ask Them</p>
                                    <p className="text-xs text-purple-300/80 mt-0.5">Show interest and culture fit.</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* External Practice Platforms */}
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition duration-300">
                        <div className="bg-gradient-to-br from-rose-400 to-orange-500 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-rose-500/30">
                            <ExternalLink size={28} className="text-white" />
                        </div>
                        <h4 className="font-bold text-xl mb-4 text-white">External Practice</h4>
                        <div className="space-y-3">
                            <a href="https://leetcode.com/" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/15 transition border border-white/5 hover:border-white/20">
                                <div>
                                    <p className="font-bold text-white flex items-center gap-2">LeetCode <ExternalLink size={14} className="opacity-50" /></p>
                                </div>
                            </a>
                            <a href="https://www.pramp.com/" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/15 transition border border-white/5 hover:border-white/20">
                                <div>
                                    <p className="font-bold text-white flex items-center gap-2">Pramp (Peer Mocks) <ExternalLink size={14} className="opacity-50" /></p>
                                </div>
                            </a>
                            <a href="https://resumeworded.com/" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/15 transition border border-white/5 hover:border-white/20">
                                <div>
                                    <p className="font-bold text-white flex items-center gap-2">Resume Worded <ExternalLink size={14} className="opacity-50" /></p>
                                </div>
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MockInterviews;
