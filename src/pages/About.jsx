import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Target, Lightbulb, Users, Globe, Shield, Zap, TrendingUp, Compass, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="bg-slate-50 min-h-screen overflow-x-hidden">
            <Helmet>
                <title>About Us | CPMS</title>
                <meta name="description" content="Learn about the Campus Placement Management System (CPMS), our mission, vision, and the team bridging the gap between academia and industry." />
            </Helmet>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl -mt-40 -mr-40 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl -mb-20 -ml-20 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <span className="text-indigo-400 font-bold tracking-wider uppercase text-sm mb-4 block">The CPMS Story</span>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
                        Empowering the Future Workforce
                    </h1>
                    <p className="mt-4 max-w-3xl text-xl text-indigo-100 mx-auto leading-relaxed">
                        We are on a mission to democratize early-career hiring by bridging the gap between world-class education and top-tier industry opportunities.
                    </p>
                </div>
            </div>

            {/* Platform Stats */}
            <section className="py-12 bg-slate-50 relative -mt-16 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                            {[
                                { number: '2026', label: 'Founded', icon: Lightbulb },
                                { number: '50+', label: 'Partner Universities', icon: Globe },
                                { number: '10k+', label: 'Students Placed', icon: Users },
                                { number: '500+', label: 'Hiring Partners', icon: Target }
                            ].map((stat, idx) => (
                                <div key={idx} className="text-center group">
                                    <div className="w-12 h-12 mx-auto bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition duration-300 transform group-hover:-translate-y-1">
                                        <stat.icon size={24} />
                                    </div>
                                    <h4 className="text-4xl font-extrabold text-slate-900 mb-1">{stat.number}</h4>
                                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 bg-white border-b border-slate-100 overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-purple-50 rounded-3xl transform -rotate-3 scale-105 -z-10"></div>
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                                alt="Team collaborating"
                                className="rounded-3xl shadow-2xl border border-white/50 object-cover w-full h-64 lg:h-[500px]"
                            />
                            {/* Floating Card */}
                            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl font-bold border border-slate-100 animate-bounce-slow hidden md:block">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-3xl">#1</span>
                                <p className="text-slate-600 text-sm">Placement Platform</p>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 space-y-10">
                            <div>
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-sm mb-6">
                                    <Compass size={16} className="mr-2" /> Our Purpose
                                </div>
                                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-6">Redefining the Campus Recruiting Experience.</h2>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    Campus Placement Management System (CPMS) was born out of a simple idea: to make the recruitment process seamless, transparent, and absolutely efficient for everyone involved.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                                        <TrendingUp size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Our Mission</h3>
                                        <p className="text-slate-600 leading-relaxed">To ensure that every hard-working student gets a fair chance at their dream job, and every recruiter can source top-tier talent without the nightmare of manual sorting.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Our Vision</h3>
                                        <p className="text-slate-600 leading-relaxed">Creating a unified, global ecosystem where academic institutions and industry leaders connect effortlessly to build the workforce of tomorrow.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-indigo-600 font-semibold tracking-wider uppercase text-sm">What Drives Us</span>
                        <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Our Core Values</h2>
                        <p className="mt-4 text-xl text-slate-600">The fundamental principles that guide our platform, our team, and our decisions every single day.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Transparency", icon: Zap, desc: "We believe in clear, unhidden processes. From application tracking to interview feedback, everything is visible and honest.", color: "text-amber-500", bg: "bg-amber-50" },
                            { title: "Empowerment", icon: HeartHandshake, desc: "We build tools that empower students to showcase their true potential and give institutions the data they need to succeed.", color: "text-rose-500", bg: "bg-rose-50" },
                            { title: "Innovation", icon: Lightbulb, desc: "We continuously evolve our platform with cutting-edge tech, like real-time sockets and intelligent matching, to stay ahead.", color: "text-cyan-500", bg: "bg-cyan-50" }
                        ].map((value, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className={`w-14 h-14 ${value.bg} ${value.color} rounded-2xl flex items-center justify-center mb-6`}>
                                    <value.icon size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{value.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[2.5rem] p-12 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">Be Part of Our Journey</h2>
                            <p className="text-indigo-100 mb-10 max-w-2xl mx-auto text-lg md:text-xl">
                                Whether you're a student looking to launch your career, or a recruiter searching for the perfect candidate, CPMS is your home.
                            </p>
                            <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-indigo-700 bg-white hover:bg-slate-50 transition shadow-xl hover:-translate-y-1">
                                Get Started Free
                            </Link>
                        </div>
                        {/* Decorative background blur */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white mix-blend-overlay opacity-10 filter blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black mix-blend-overlay opacity-10 filter blur-3xl rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
