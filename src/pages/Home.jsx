import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Home = () => {
    return (
        <div className="space-y-16 py-10">
            {/* Hero Section */}
            <section className="text-center space-y-6">
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
                    Streamline Your <span className="text-indigo-600">Campus Placement</span> Journey
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-slate-600">
                    A comprehensive platform for students, TPOs, and recruiters to manage the entire recruitment lifecycle seamlessly.
                </p>
                <div className="flex justify-center gap-4 pt-4">
                    <Link to="/register" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg transition">
                        Get Started <ArrowRight className="ml-2" size={20} />
                    </Link>
                    <Link to="/login" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:text-lg transition">
                        Sign In
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-3 gap-8 px-4">
                {[
                    { title: 'For Students', desc: 'Build profiles, apply for jobs, and track applications in real-time.' },
                    { title: 'For TPOs', desc: 'Manage unlimited job postings, schedule interviews, and track analytics.' },
                    { title: 'For Recruiters', desc: 'Post jobs, shortlist candidates, and conduct interviews efficiently.' },
                ].map((feature, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                            <CheckCircle size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                        <p className="text-slate-600">{feature.desc}</p>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Home;
