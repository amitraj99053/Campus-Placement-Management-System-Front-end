import React from 'react';

const About = () => {
    return (
        <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">About CPMS</h1>
                    <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
                        Bridging the gap between academia and industry.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-indigo-600 mb-6">Our Mission</h2>
                        <p className="text-slate-600 text-lg leading-relaxed mb-6">
                            Campus Placement Management System (CPMS) was born out of a simple idea:
                            to make the recruitment process seamless, transparent, and efficient for everyone involved.
                        </p>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            We believe that every student deserves a fair chance at their dream job, and every
                            recruiter deserves to find the best talent without the hassle of manual paperwork.
                        </p>
                    </div>
                    <div className="bg-indigo-50 p-8 rounded-2xl">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-indigo-600 mb-2">2026</div>
                                <div className="text-sm text-slate-500">Founded</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-indigo-600 mb-2">50+</div>
                                <div className="text-sm text-slate-500">Universities</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-indigo-600 mb-2">10k+</div>
                                <div className="text-sm text-slate-500">Students</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-indigo-600 mb-2">500+</div>
                                <div className="text-sm text-slate-500">Recruiters</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
