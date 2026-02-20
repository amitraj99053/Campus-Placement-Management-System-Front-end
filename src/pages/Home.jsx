import React from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    CheckCircle,
    Users,
    Briefcase,
    Award,
    Zap,
    Shield,
    Quote,
    TrendingUp,
    Layout,
    HelpCircle,
    Star,
    ChevronDown,
    Globe
} from 'lucide-react';

const Home = () => {
    return (
        <div className="space-y-0 pb-0 bg-slate-50">
            {/* Hero Section */}
            <section className="relative bg-white pt-24 pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center px-4 py-2 rounded-full border border-indigo-100 bg-indigo-50 text-indigo-700 text-sm font-medium mb-8">
                        <span className="flex h-2 w-2 relative mr-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        #1 Campus Placement Platform
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
                        The Future of <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Campus Recruitment</span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
                        CPMS bridges the gap between talent and opportunity. A unified platform for Universities,
                        Recruiters, and Students to automate, manage, and accelerate the hiring process.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1">
                            Get Started Now <ArrowRight className="ml-2" size={20} />
                        </Link>
                        <Link to="/login" className="inline-flex items-center justify-center px-8 py-4 border border-slate-200 text-lg font-semibold rounded-full text-slate-700 bg-white hover:bg-slate-50 transition shadow-sm hover:shadow-md">
                            Existing User? Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-16 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: '500+', label: 'Companies Hiring', icon: <Briefcase className="text-indigo-600" size={32} /> },
                            { value: '10k+', label: 'Students Placed', icon: <Users className="text-purple-600" size={32} /> },
                            { value: '50+', label: 'Partner Universities', icon: <Globe className="text-blue-600" size={32} /> },
                            { value: '95%', label: 'Placement Success', icon: <TrendingUp className="text-green-600" size={32} /> },
                        ].map((stat, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition duration-300 group">
                                <div className="mb-4 p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition duration-300">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                                <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works - Step by Step */}
            <section className="bg-slate-50 py-24 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-50"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <span className="text-indigo-600 font-semibold tracking-wider uppercase text-sm">Simple Process</span>
                        <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                            How It Works
                        </h2>
                        <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
                            A seamless journey from registration to offer letter.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-24 left-0 w-full h-1 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 rounded-full -z-10"></div>

                        <div className="grid md:grid-cols-4 gap-8">
                            {[
                                { step: '01', title: 'Register & Profile', desc: 'Create your account and build a standardized professional profile with resume.' },
                                { step: '02', title: 'Explore & Apply', desc: 'Browse curated job listings and apply with a single click.' },
                                { step: '03', title: 'Interview & Prep', desc: 'Get shortlisted, schedule interviews, and use our mock interview tools.' },
                                { step: '04', title: 'Get Hired', desc: 'Track your application status in real-time and accept offers.' }
                            ].map((item, idx) => (
                                <div key={idx} className="relative group">
                                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center relative z-10 h-full hover:-translate-y-2 transition duration-300">
                                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-6 shadow-lg transform -rotate-3 group-hover:rotate-0 transition duration-300">
                                            {item.step}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Features by Role */}
            <section className="bg-white py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Unified Ecosystem</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            Tailored for Every Stakeholder
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 ">
                        {/* Student Card */}
                        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 hover:shadow-2xl hover:-translate-y-1 transition duration-300 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 bg-blue-50 w-32 h-32 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition duration-500"></div>

                            <div className="h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-8 shadow-sm">
                                <Award size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">For Students</h3>
                            <ul className="space-y-4">
                                {[
                                    'Build a standardized professional resume',
                                    'One-click application to multiple drives',
                                    'Real-time status tracking & notifications',
                                    'Access to Mock Interviews'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start text-slate-600">
                                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Recruiter Card */}
                        <div className="bg-slate-900 rounded-3xl shadow-xl border border-slate-800 p-8 hover:shadow-2xl hover:-translate-y-1 transition duration-300 overflow-hidden relative group text-white transform md:-mt-8 md:mb-8">
                            <div className="absolute top-0 right-0 bg-indigo-500/10 w-32 h-32 rounded-bl-full -mr-8 -mt-8 group-hover:scale-110 transition duration-500"></div>

                            <div className="h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-indigo-500/30">
                                <Briefcase size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-6">For Recruiters</h3>
                            <ul className="space-y-4">
                                {[
                                    'Post jobs and internships instantly',
                                    'Advanced candidate filtering & search',
                                    'Automated interview scheduling',
                                    'Direct communication with TPOs'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start text-slate-300">
                                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-indigo-400 mr-3 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* TPO Card */}
                        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 hover:shadow-2xl hover:-translate-y-1 transition duration-300 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 bg-purple-50 w-32 h-32 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition duration-500"></div>

                            <div className="h-16 w-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-8 shadow-sm">
                                <Users size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">For TPOs</h3>
                            <ul className="space-y-4">
                                {[
                                    'Centralized dashboard for all activities',
                                    'Verify student profiles and recruiters',
                                    'Generate detailed placement reports',
                                    'Manage campus drives end-to-end'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start text-slate-600">
                                        <CheckCircle className="flex-shrink-0 h-5 w-5 text-purple-500 mr-3 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="relative pt-32 pb-24 overflow-hidden bg-slate-900">
                {/* Curved Background Shape (Top Wave) */}
                <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[100px] fill-white">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                    </svg>
                </div>

                {/* Background Decorations */}
                <div className="absolute inset-0 top-[100px]">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                    <div className="text-center mb-16">
                        <span className="text-indigo-400 font-semibold tracking-wider uppercase text-sm">Real Impact</span>
                        <h2 className="mt-2 text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                            Success Stories
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-300">
                            See how CPMS is transforming careers and campus recruitment.
                        </p>
                    </div>

                    {/* Scrollable Container */}
                    <div className="relative">
                        <div className="flex overflow-x-auto pb-12 gap-6 snap-x snap-mandatory scrollbar-hide items-stretch" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {[
                                {
                                    quote: "CPMS made my placement process stress-free. I applied to 5 companies and got placed in my dream firm within 2 weeks!",
                                    author: "Aditi S.",
                                    role: "Computer Science Student",
                                    initial: "A",
                                    gradient: "from-pink-500 to-rose-500"
                                },
                                {
                                    quote: "As a recruiter, filtering hundreds of resumes was a nightmare. CPMS automated it perfectly. Highly recommended.",
                                    author: "Rajesh K.",
                                    role: "HR Manager, TechCorp",
                                    initial: "R",
                                    gradient: "from-purple-500 to-indigo-500"
                                },
                                {
                                    quote: "Detailed analytics helped us identify skill gaps and improve our training programs. The TPO dashboard is a game changer.",
                                    author: "Dr. Sharma",
                                    role: "Placement Officer",
                                    initial: "S",
                                    gradient: "from-cyan-500 to-blue-500"
                                },
                                {
                                    quote: "I never missed an interview thanks to the real-time WhatsApp-like notifications. Got placed at Amazon!",
                                    author: "Vikram R.",
                                    role: "IT Student",
                                    initial: "V",
                                    gradient: "from-emerald-500 to-teal-500"
                                },
                                {
                                    quote: "The mock interview feature gave me the confidence I needed to crack my technical rounds.",
                                    author: "Sneha P.",
                                    role: "ECE Student",
                                    initial: "S",
                                    gradient: "from-orange-500 to-amber-500"
                                },
                                {
                                    quote: "Managing 500+ students was impossible with Excel sheets. CPMS streamlined everything for our university.",
                                    author: "Prof. Mehta",
                                    role: "Dean of Student Affairs",
                                    initial: "M",
                                    gradient: "from-indigo-500 to-violet-500"
                                },
                                {
                                    quote: "Posting jobs and Shortlisting candidates happens in seconds now. The UI is incredibly intuitive.",
                                    author: "Sarah L.",
                                    role: "Talent Acquisition",
                                    initial: "S",
                                    gradient: "from-fuchsia-500 to-pink-500"
                                }
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl relative flex-shrink-0 snap-center hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 flex flex-col group h-auto"
                                >
                                    <div className="absolute top-6 right-6 text-white/10 group-hover:text-white/20 transition-colors">
                                        <Quote size={24} />
                                    </div>

                                    <div className="flex-grow pt-8">
                                        <p className="text-slate-300 italic mb-6 mt-4 relative z-10 text-lg leading-relaxed font-light">"{item.quote}"</p>
                                    </div>

                                    <div className="flex items-center pt-6 border-t border-white/10 mt-auto">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-xl mr-4 shadow-lg bg-gradient-to-br ${item.gradient}`}>
                                            {item.initial}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-lg">{item.author}</h4>
                                            <p className="text-sm text-indigo-300 font-medium">{item.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Scroll hint gradient */}
                        <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-indigo-900 to-transparent pointer-events-none md:hidden"></div>
                    </div>
                    <p className="text-center text-indigo-300 text-sm mt-4 md:hidden">Swipe to see more stories &rarr;</p>
                </div>
            </section>

            {/* Why Choose CPMS */}
            <section className="bg-slate-50 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-indigo-600 font-semibold tracking-wider uppercase text-sm">Features</span>
                        <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                            Why Users Trust Us
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Zap size={24} />,
                                title: 'Real-Time Updates',
                                desc: 'Instant notifications via Socket.io ensure you never miss an update.'
                            },
                            {
                                icon: <Shield size={24} />,
                                title: 'Secure & Reliable',
                                desc: 'Enterprise-grade security with JWT authentication and RBAC.'
                            },
                            {
                                icon: <TrendingUp size={24} />,
                                title: 'Analytics Driven',
                                desc: 'Visual insights and reports to track placement performance.'
                            },
                            {
                                icon: <Layout size={24} />,
                                title: 'Modern UI/UX',
                                desc: 'Responsive, clean, and intuitive interface built with React & Tailwind.'
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition duration-300 border border-slate-100 group">
                                <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition duration-300">
                                    {feature.icon}
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h4>
                                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                        Frequently Asked Questions
                    </h2>
                </div>
                <div className="space-y-6">
                    {[
                        { q: "Is CPMS free for students?", a: "Yes! Students can register, build profiles, and apply to unlimited jobs completely free of cost." },
                        { q: "How do I verify my company account?", a: "After registration, your profile is sent to the Training & Placement Officer (TPO) for verification. You'll be notified via email once approved." },
                        { q: "Can I edit my resume after uploading?", a: "Absolutely. You can update your resume and profile details at any time from your Student Dashboard." },
                        { q: "Is my data secure?", a: "We use industry-standard encryption and role-based access control to ensure your data is safe and only visible to authorized personnel." }
                    ].map((faq, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300">
                            <h3 className="text-lg font-bold text-slate-900 flex justify-between items-center cursor-pointer">
                                {faq.q}
                                <ChevronDown className="text-gray-400" size={20} />
                            </h3>
                            <p className="mt-3 text-slate-600 leading-relaxed">
                                {faq.a}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Call to Action */}
            <section className="relative py-24 bg-white overflow-hidden">
                <div className="absolute inset-0 bg-slate-50 skew-y-3 origin-bottom-right transform translate-y-24"></div>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[2.5rem] p-12 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight">Ready to Transform Your <br /> Placement Process?</h2>
                            <p className="text-indigo-100 mb-10 max-w-2xl mx-auto text-lg md:text-xl">
                                Join thousands of students and recruiters already using CPMS to streamline their future.
                            </p>
                            <Link to="/register" className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-bold rounded-full text-indigo-700 bg-white hover:bg-indigo-50 transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                                Create Your Free Account
                            </Link>
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute top-0 left-0 -mt-20 -ml-20 w-80 h-80 bg-indigo-500 rounded-full opacity-20 filter blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 -mb-20 -mr-20 w-80 h-80 bg-purple-500 rounded-full opacity-20 filter blur-3xl"></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
