import React from 'react';
import { CheckCircle, Zap, Shield, TrendingUp, Users, Layout } from 'lucide-react';

const Services = () => {
    return (
        <div className="bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">Our Services</h1>
                    <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
                        Comprehensive solutions for the entire recruitment lifecycle.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Layout size={40} />,
                            title: "For Students",
                            features: ["Resume Builder", "One-Click Apply", "Mock Interviews", "Application Tracking"]
                        },
                        {
                            icon: <Users size={40} />,
                            title: "For Recruiters",
                            features: ["Job Posting", "Candidate Filtering", "Interview Scheduling", "Offer Management"]
                        },
                        {
                            icon: <TrendingUp size={40} />,
                            title: "For TPOs",
                            features: ["Student Verification", "Placement Analytics", "Drive Management", "Report Generation"]
                        }
                    ].map((service, idx) => (
                        <div key={idx} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:-translate-y-1 transition duration-300">
                            <div className="h-16 w-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                                {service.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">{service.title}</h3>
                            <ul className="space-y-4">
                                {service.features.map((feature, i) => (
                                    <li key={i} className="flex items-center text-slate-600">
                                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mr-3" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;
