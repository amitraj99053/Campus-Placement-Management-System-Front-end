import React from 'react';
import { CheckCircle, Zap, Shield, TrendingUp, Users, Layout, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl -mt-40 -mr-40"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl -mb-20 -ml-20"></div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <span className="text-indigo-400 font-bold tracking-wider uppercase text-sm mb-4 block">Empowering Futures</span>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
                        Comprehensive Recruitment Solutions
                    </h1>
                    <p className="mt-4 max-w-3xl text-xl text-indigo-100 mx-auto leading-relaxed">
                        We bridge the gap between top-tier talent, visionary organizations, and dedicated academic institutions through a unified, intelligent platform.
                    </p>
                </div>
            </div>

            {/* Detailed Services Section */}
            <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                <div className="grid lg:grid-cols-3 gap-10">

                    {/* Student Service Card */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-100 transition duration-500 group flex flex-col">
                        <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                            <Layout size={40} />
                        </div>
                        <h3 className="text-3xl font-extrabold text-slate-900 mb-4">For Students</h3>
                        <p className="text-slate-600 leading-relaxed mb-8 flex-grow">
                            Launch your career with confidence. Our platform provides everything you need to showcase your skills, prepare for interviews, and land your dream job with top employers.
                        </p>

                        <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
                            <ul className="space-y-4">
                                {[
                                    { title: "Smart Resume Builder", desc: "Create ATS-friendly profiles automatically." },
                                    { title: "One-Click Applications", desc: "Apply to multiple drives instantly." },
                                    { title: "Mock Interviews", desc: "Practice with industry experts." },
                                    { title: "Real-time Tracking", desc: "Monitor application status live." }
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start">
                                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-indigo-500 mt-0.5 mr-3" />
                                        <div>
                                            <span className="block font-bold text-slate-900 text-sm">{feature.title}</span>
                                            <span className="block text-slate-500 text-xs mt-0.5">{feature.desc}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Link to="/register" className="mt-auto text-indigo-600 font-bold flex items-center hover:text-indigo-800 transition">
                            Get Started as a Student <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Recruiter Service Card */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-100 transition duration-500 group flex flex-col">
                        <div className="h-20 w-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                            <Users size={40} />
                        </div>
                        <h3 className="text-3xl font-extrabold text-slate-900 mb-4">For Recruiters</h3>
                        <p className="text-slate-600 leading-relaxed mb-8 flex-grow">
                            Streamline your hiring process from sourcing to offering. Access a verified pool of talented graduates and manage all your campus recruitment drives in one organized workspace.
                        </p>

                        <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
                            <ul className="space-y-4">
                                {[
                                    { title: "Targeted Job Posting", desc: "Reach eligible candidates easily." },
                                    { title: "Automated Filtering", desc: "Instantly screen based on CGPA & skills." },
                                    { title: "Seamless Scheduling", desc: "Coordinate interviews effortlessly." },
                                    { title: "Offer Management", desc: "Track roll-outs and acceptances." }
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start">
                                        <Zap className="flex-shrink-0 h-5 w-5 text-purple-500 mt-0.5 mr-3" />
                                        <div>
                                            <span className="block font-bold text-slate-900 text-sm">{feature.title}</span>
                                            <span className="block text-slate-500 text-xs mt-0.5">{feature.desc}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Link to="/contact" className="mt-auto text-purple-600 font-bold flex items-center hover:text-purple-800 transition">
                            Partner With Us <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* TPO Service Card */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-100 transition duration-500 group flex flex-col">
                        <div className="h-20 w-20 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform">
                            <TrendingUp size={40} />
                        </div>
                        <h3 className="text-3xl font-extrabold text-slate-900 mb-4">For TPOs</h3>
                        <p className="text-slate-600 leading-relaxed mb-8 flex-grow">
                            Empower your institution's placement cell with powerful administrative tools. Oversee student readiness, coordinate with companies, and generate comprehensive analytical reports.
                        </p>

                        <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
                            <ul className="space-y-4">
                                {[
                                    { title: "Student Verification", desc: "Ensure authenticity of candidate profiles." },
                                    { title: "Drive Management", desc: "Coordinate multiple company visits." },
                                    { title: "Placement Analytics", desc: "Visualize hiring trends and statistics." },
                                    { title: "Automated Reporting", desc: "Generate NBA/NAAC compliance data." }
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start">
                                        <Shield className="flex-shrink-0 h-5 w-5 text-teal-500 mt-0.5 mr-3" />
                                        <div>
                                            <span className="block font-bold text-slate-900 text-sm">{feature.title}</span>
                                            <span className="block text-slate-500 text-xs mt-0.5">{feature.desc}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Link to="/login" className="mt-auto text-teal-600 font-bold flex items-center hover:text-teal-800 transition">
                            Access Admin Portal <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-32 text-center">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Ready to transform your recruitment experience?</h2>
                <p className="text-slate-600 mb-10 text-lg max-w-2xl mx-auto">Join thousands of students and hundreds of top companies who trust our platform for their hiring needs.</p>
                <Link to="/register" className="inline-block bg-slate-900 text-white font-bold px-10 py-4 rounded-xl hover:bg-slate-800 transition shadow-xl shadow-slate-200">
                    Create Your Account
                </Link>
            </div>
        </div>
    );
};

export default Services;
