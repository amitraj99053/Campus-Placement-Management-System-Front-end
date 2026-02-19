import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RecruiterDashboard from './pages/recruiter/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import Profile from './pages/student/Profile';
import JobBoard from './pages/student/JobBoard';
import MyApplications from './pages/student/MyApplications';
import MockInterviews from './pages/student/MockInterviews';
import { SocketProvider } from './context/SocketContext';

function App() {
    return (
        <SocketProvider>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    {/* Student Routes */}
                    <Route path="/student/profile" element={
                        <ProtectedRoute roles={['student']}>
                            <Profile />
                        </ProtectedRoute>
                    } />
                    <Route path="/jobs" element={
                        <ProtectedRoute roles={['student']}>
                            <JobBoard />
                        </ProtectedRoute>
                    } />
                    <Route path="/student/applications" element={
                        <ProtectedRoute roles={['student']}>
                            <MyApplications />
                        </ProtectedRoute>
                    } />
                    <Route path="/student/mock-interviews" element={
                        <ProtectedRoute roles={['student']}>
                            <MockInterviews />
                        </ProtectedRoute>
                    } />

                    {/* Recruiter Routes */}
                    <Route path="/recruiter/dashboard" element={
                        <ProtectedRoute roles={['recruiter']}>
                            <RecruiterDashboard />
                        </ProtectedRoute>
                    } />

                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={
                        <ProtectedRoute roles={['admin', 'tpo']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Layout>
        </SocketProvider>
    );
}

export default App;
