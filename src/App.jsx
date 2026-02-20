import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { SocketProvider } from './context/SocketContext';
import { Loader2 } from 'lucide-react';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const RecruiterDashboard = lazy(() => import('./pages/recruiter/Dashboard'));
const JobApplications = lazy(() => import('./pages/recruiter/JobApplications'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const Profile = lazy(() => import('./pages/student/Profile'));
const JobBoard = lazy(() => import('./pages/student/JobBoard'));
const MyApplications = lazy(() => import('./pages/student/MyApplications'));
const MockInterviews = lazy(() => import('./pages/student/MockInterviews'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));

// Loading Fallback
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
    </div>
);

function App() {
    return (
        <SocketProvider>
            <Layout>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

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
                        <Route path="/recruiter/jobs/:id/applications" element={
                            <ProtectedRoute roles={['recruiter']}>
                                <JobApplications />
                            </ProtectedRoute>
                        } />

                        {/* Admin Routes */}
                        <Route path="/admin/dashboard" element={
                            <ProtectedRoute roles={['admin', 'tpo']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </Suspense>
            </Layout>
        </SocketProvider>
    );
}

export default App;
