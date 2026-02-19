import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';
import { toast } from 'react-toastify';
import { Calendar, MessageSquare } from 'lucide-react';

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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Mock Interviews</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                >
                    <Calendar size={20} />
                    Request Interview
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {interviews.length === 0 ? (
                    <p className="text-gray-500 col-span-2">No mock interviews scheduled yet.</p>
                ) : (
                    interviews.map((interview) => (
                        <div key={interview._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">{interview.topic}</h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(interview.scheduledAt).toLocaleString()}
                                    </p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                  ${interview.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                        interview.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {interview.status}
                                </span>
                            </div>

                            {interview.feedback && (
                                <div className="bg-gray-50 p-3 rounded-md mt-4">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                                        <MessageSquare size={16} /> Feedback
                                    </div>
                                    <p className="text-sm text-gray-600 italic">"{interview.feedback}"</p>
                                    {interview.rating && (
                                        <div className="mt-2 text-sm font-medium text-indigo-600">
                                            Rating: {interview.rating}/10
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Mock Interview">
                <form onSubmit={handleSchedule} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                        <input
                            type="datetime-local"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                            onChange={(e) => setNewInterview({ ...newInterview, scheduledAt: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                        Confirm Request
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default MockInterviews;
