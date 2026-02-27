import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Briefcase, FileText, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import ApplicationProgress from '../../components/ApplicationProgress';
import { toast } from 'react-toastify';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [unverifiedUsers, setUnverifiedUsers] = useState([]);
    const [allApplications, setAllApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, usersRes, appsRes] = await Promise.all([
                api.get('/analytics'),
                api.get('/users/unverified'),
                api.get('/applications/all')
            ]);
            setStats(statsRes.data);
            setUnverifiedUsers(usersRes.data);
            setAllApplications(appsRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyUser = async (userId) => {
        try {
            await api.put(`/users/${userId}/verify`);
            toast.success('User verified successfully');
            setUnverifiedUsers(unverifiedUsers.filter(u => u._id !== userId));
        } catch (error) {
            toast.error('Failed to verify user');
        }
    };

    if (loading) return <div>Loading Dashboard...</div>;

    // Chart Data Preparation
    const applicationStatusData = {
        labels: stats?.applications?.breakdown?.map(item => item._id) || [],
        datasets: [
            {
                label: '# of Applications',
                data: stats?.applications?.breakdown?.map(item => item.count) || [],
                backgroundColor: [
                    'rgba(79, 70, 229, 0.6)',
                    'rgba(59, 130, 246, 0.6)',
                    'rgba(16, 185, 129, 0.6)',
                    'rgba(245, 158, 11, 0.6)',
                    'rgba(239, 68, 68, 0.6)',
                ],
                borderColor: [
                    'rgba(79, 70, 229, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const trendData = {
        labels: stats?.trends?.jobs?.map(t => monthNames[t._id - 1]) || [],
        datasets: [
            {
                label: 'Jobs Posted',
                data: stats?.trends?.jobs?.map(t => t.count) || [],
                borderColor: 'rgb(79, 70, 229)',
                backgroundColor: 'rgba(79, 70, 229, 0.5)',
                tension: 0.3
            },
            {
                label: 'Students Placed',
                data: stats?.trends?.placements?.map(t => t.count) || [],
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
                tension: 0.3
            }
        ]
    };

    const topCompaniesData = {
        labels: stats?.topCompanies?.map(c => c._id) || [],
        datasets: [
            {
                label: 'Hired Students',
                data: stats?.topCompanies?.map(c => c.count) || [],
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderRadius: 4,
            }
        ]
    };

    const placementRate = stats?.users?.students > 0
        ? ((stats?.applications?.placed / stats?.users?.students) * 100).toFixed(1)
        : 0;

    return (
        <div className="space-y-8 p-4 md:p-0">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Analytics Overview</h2>
                <div className="text-sm text-slate-500">Live system updates</div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Students</p>
                        <h3 className="text-3xl font-black text-indigo-600">{stats?.users?.students}</h3>
                    </div>
                    <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                        <Users size={28} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Recruiters</p>
                        <h3 className="text-3xl font-black text-blue-600">{stats?.users?.recruiters}</h3>
                    </div>
                    <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                        <Briefcase size={28} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Placement Rate</p>
                        <h3 className="text-3xl font-black text-emerald-600">{placementRate}%</h3>
                    </div>
                    <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                        <CheckCircle size={28} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Active Jobs</p>
                        <h3 className="text-3xl font-black text-amber-600">{stats?.jobs?.active}</h3>
                    </div>
                    <div className="h-14 w-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner">
                        <FileText size={28} />
                    </div>
                </div>
            </div>

            {/* Main Visuals Section */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-xl mb-6 text-slate-800">Placement & Job Trends</h3>
                    <div className="h-80">
                        <Bar
                            data={trendData}
                            options={{
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { position: 'top', align: 'end' }
                                },
                                scales: {
                                    y: { beginAtZero: true, grid: { drawBorder: false } },
                                    x: { grid: { display: false } }
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-xl mb-6 text-slate-800">Application Mix</h3>
                    <div className="h-80 flex items-center justify-center">
                        <Pie data={applicationStatusData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-xl mb-6 text-slate-800">Top Hiring Companies</h3>
                    <div className="h-80">
                        <Bar
                            data={topCompaniesData}
                            options={{
                                indexAxis: 'y',
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    x: { beginAtZero: true },
                                    y: { grid: { display: false } }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Pending Approvals Table moves here if space permits, or keeps its own section */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <h3 className="font-bold text-xl mb-6 text-slate-800 flex items-center gap-2">
                        <Users className="text-orange-500" />
                        Pending Member Approvals
                        <span className="ml-auto bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">{unverifiedUsers.length}</span>
                    </h3>

                    {unverifiedUsers.length === 0 ? (
                        <p className="text-slate-500 text-center py-10 italic">No members awaiting approval.</p>
                    ) : (
                        <div className="mt-4">
                            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50 sticky top-0">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Role</th>
                                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                        {unverifiedUsers.map((user) => (
                                            <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-bold text-slate-900">{user.name}</div>
                                                    <div className="text-xs text-slate-500">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap capitalize">
                                                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${user.role === 'recruiter' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <button
                                                        onClick={() => handleVerifyUser(user._id)}
                                                        className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                                                    >
                                                        Approve
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Hiring Activity */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-8">
                <h3 className="font-bold text-xl mb-6 text-slate-800 flex items-center gap-2">
                    <Briefcase className="text-indigo-500" />
                    Complete Hiring Process Overview
                    <span className="ml-auto bg-indigo-100 text-indigo-600 text-xs px-2 py-1 rounded-full">{allApplications.length} Applications</span>
                </h3>

                {allApplications.length === 0 ? (
                    <p className="text-slate-500 text-center py-10 italic">No applications processed yet.</p>
                ) : (
                    <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Student</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Job Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-widest w-1/3">Progress</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {allApplications.map((app) => (
                                    <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-slate-900">{app.student?.name || 'Unknown'}</div>
                                            <div className="text-xs text-slate-500">{app.student?.email || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-slate-900">{app.job?.company || 'Unknown Company'}</div>
                                            <div className="text-xs text-slate-500">{app.job?.title || 'Unknown Role'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap min-w-[200px]">
                                            <ApplicationProgress status={app.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {app.feedback && (
                                                <div className="inline-block p-1.5 text-slate-400 hover:text-indigo-600 rounded cursor-help group relative transition-colors">
                                                    <MessageSquare size={18} />
                                                    <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 w-64 p-3 bg-slate-900 text-white text-xs rounded shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10 whitespace-normal text-left">
                                                        <p className="font-bold mb-1 text-slate-300">Recruiter Note:</p>
                                                        {app.feedback}
                                                        {/* Arrow */}
                                                        <div className="absolute top-1/2 -translate-y-1/2 -right-1 border-[6px] border-transparent border-l-slate-900"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
