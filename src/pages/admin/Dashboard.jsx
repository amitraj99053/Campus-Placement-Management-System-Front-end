import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Briefcase, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { toast } from 'react-toastify';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [unverifiedUsers, setUnverifiedUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, usersRes] = await Promise.all([
                api.get('/analytics'),
                api.get('/users/unverified')
            ]);
            setStats(statsRes.data);
            setUnverifiedUsers(usersRes.data);
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
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const userDistributionData = {
        labels: ['Students', 'Recruiters'],
        datasets: [
            {
                label: 'User Base',
                data: [stats?.users?.students || 0, stats?.users?.recruiters || 0],
                backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(54, 162, 235, 0.5)'],
            }
        ]
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-900">Admin Analytics Dashboard</h2>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 font-medium">Students</p>
                        <h3 className="text-3xl font-bold text-indigo-600">{stats?.users?.students}</h3>
                    </div>
                    <div className="h-12 w-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                        <Users size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 font-medium">Recruiters</p>
                        <h3 className="text-3xl font-bold text-blue-600">{stats?.users?.recruiters}</h3>
                    </div>
                    <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                        <Briefcase size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 font-medium">Active Jobs</p>
                        <h3 className="text-3xl font-bold text-green-600">{stats?.jobs?.active}</h3>
                    </div>
                    <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                        <FileText size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 font-medium">Placed</p>
                        <h3 className="text-3xl font-bold text-purple-600">{stats?.applications?.placed}</h3>
                    </div>
                    <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                        <CheckCircle size={24} />
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg mb-4 text-center">Application Status Distribution</h3>
                    <div className="h-64 flex justify-center">
                        <Pie data={applicationStatusData} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg mb-4 text-center">User Distribution</h3>
                    <div className="h-64 flex justify-center">
                        <Bar
                            data={userDistributionData}
                            options={{
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Verification Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <CheckCircle className="text-orange-500" />
                    Pending Approvals ({unverifiedUsers.length})
                </h3>

                {unverifiedUsers.length === 0 ? (
                    <p className="text-gray-500">No pending approvals.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {unverifiedUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap capitalize">{user.role}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleVerifyUser(user._id)}
                                                className="text-green-600 hover:text-green-900 font-semibold"
                                            >
                                                Approve
                                            </button>
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
