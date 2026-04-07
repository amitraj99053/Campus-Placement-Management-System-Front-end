import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    ChevronDown,
    Globe,
    Rocket
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const Home = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const elem = document.getElementById(location.hash.slice(1));
            if (elem) {
                setTimeout(() => {
                    elem.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [location]);

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' }
        })
    };

    // Bounce animation
    const bounce = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.6,
                type: 'spring',
                stiffness: 100
            }
        })
    };

    // Rotate animation
    const rotateIn = {
        hidden: { opacity: 0, rotate: -10 },
        visible: (i) => ({
            opacity: 1,
            rotate: 0,
            transition: { delay: i * 0.1, duration: 0.7, ease: 'easeOut' }
        })
    };

    // Slide from sides
    const slideFromLeft = {
        hidden: { opacity: 0, x: -60 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } }
    };

    const slideFromRight = {
        hidden: { opacity: 0, x: 60 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } }
    };

    // Pulse scale
    const pulseScale = {
        scale: [1, 1.05, 1],
        transition: { duration: 2, repeat: Infinity }
    };

    // Floating animation
    const floating = {
        y: [0, -20, 0],
        transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
    };

    // Animation variants (scaleIn is used for more scalable animations)
    // Other variants are built into fadeInUp

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    // List container animation
    const listContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    const listItem = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="space-y-0 pb-0 bg-slate-50">
            <Helmet>
                <title>Home | Campus Placement Management System</title>
                <meta name="description" content="CPMS bridges the gap between talent and opportunity. A unified platform for Universities, Recruiters, and Students to automate campus recruitment." />
                <meta name="keywords" content="campus placement, recruitment, jobs, internships, university placement" />
            </Helmet>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-white via-blue-50 to-indigo-50 pt-24 pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
                    <motion.div
                        className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
                        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
                        transition={{ duration: 8, repeat: Infinity }}
                    ></motion.div>
                    <motion.div
                        className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
                        animate={{ scale: [1.1, 1, 1.1], x: [20, 0, 20] }}
                        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                    ></motion.div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        className="inline-flex items-center px-4 py-2 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 text-sm font-semibold mb-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <motion.span className="flex h-2 w-2 relative mr-3" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                            <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </motion.span>
                        #1 Campus Placement Platform
                    </motion.div>

                    <motion.h1
                        className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight"
                        initial={fadeInUp.hidden}
                        animate={fadeInUp.visible}
                        custom={0}
                    >
                        The Future of <br className="hidden md:block" />
                        <motion.span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600"
                            animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                            transition={{ duration: 6, repeat: Infinity }}
                        >
                            Campus Recruitment
                        </motion.span>
                    </motion.h1>

                    <motion.p
                        className="max-w-3xl mx-auto text-xl text-slate-600 mb-12 leading-relaxed"
                        initial={fadeInUp.hidden}
                        animate={fadeInUp.visible}
                        custom={1}
                    >
                        CPMS bridges the gap between talent and opportunity. A unified platform for Universities, Recruiters, and Students to automate, manage, and accelerate the hiring process.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
                        initial={fadeInUp.hidden}
                        animate={fadeInUp.visible}
                        custom={2}
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                            <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition shadow-lg hover:shadow-indigo-500/40 transform">
                                Get Started Now <ArrowRight className="ml-2" size={20} />
                            </Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                            <Link to="/login" className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-300 text-lg font-semibold rounded-full text-slate-700 bg-white hover:bg-slate-50 transition shadow-sm hover:shadow-md">
                                Sign In
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div 
                        className="flex justify-center mt-16"
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <motion.div 
                            className="flex flex-col items-center cursor-pointer"
                            whileHover={{ scale: 1.1 }}
                            onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
                        >
                            <span className="text-slate-500 text-sm font-medium mb-2">Scroll to explore</span>
                            <motion.svg 
                                className="w-6 h-6 text-indigo-600"
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                                animate={{ y: [0, 4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </motion.svg>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-20 bg-gradient-to-b from-white to-slate-50 border-y border-slate-100 relative overflow-hidden">
                <motion.div
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                    variants={container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {[
                            { value: '500+', label: 'Companies Hiring', icon: <Briefcase className="text-indigo-600" size={32} />, color: 'indigo' },
                            { value: '10k+', label: 'Students Placed', icon: <Users className="text-purple-600" size={32} />, color: 'purple' },
                            { value: '50+', label: 'Partner Universities', icon: <Globe className="text-blue-600" size={32} />, color: 'blue' },
                            { value: '95%', label: 'Placement Success', icon: <TrendingUp className="text-green-600" size={32} />, color: 'green' },
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                className="group"
                                variants={fadeInUp}
                                custom={idx}
                            >
                                <motion.div
                                    className="flex flex-col items-center text-center p-6 md:p-8 bg-white rounded-2xl hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 shadow-sm hover:shadow-xl transition duration-300 border border-slate-100 hover:border-slate-200 h-full"
                                    whileHover={{ y: -8 }}
                                >
                                    <motion.div
                                        className="mb-4 p-3 bg-gradient-to-br from-slate-100 to-slate-50 rounded-full shadow-sm group-hover:shadow-md"
                                        whileHover={{ scale: 1.15, rotate: 5 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                    >
                                        {stat.icon}
                                    </motion.div>
                                    <motion.div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                                        {stat.value}
                                    </motion.div>
                                    <div className="text-xs md:text-sm font-semibold text-slate-600 uppercase tracking-wider">{stat.label}</div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* How It Works - Step by Step */}
            <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-28 relative overflow-hidden">
                <motion.div
                    className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-40"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 6, repeat: Infinity }}
                ></motion.div>
                <motion.div
                    className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-40"
                    animate={{ scale: [1.05, 1, 1.05] }}
                    transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                ></motion.div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.span className="text-indigo-600 font-bold tracking-wider uppercase text-sm block mb-3">Simple Process</motion.span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                            How It Works
                        </h2>
                        <p className="mt-6 max-w-2xl text-lg text-slate-600 mx-auto">
                            A seamless journey from registration to your dream job offer.
                        </p>
                    </motion.div>

                    <div className="relative">
                        {/* Animated Connecting Line (Desktop) */}
                        <motion.div
                            className="hidden md:block absolute top-24 left-0 w-full h-1 bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300 rounded-full"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3 }}
                            style={{ originX: 0 }}
                        ></motion.div>

                        <motion.div
                            className="grid md:grid-cols-4 gap-6 md:gap-8"
                            variants={container}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            {[
                                { step: '01', title: 'Register & Profile', desc: 'Create your account and build a professional profile with resume.' },
                                { step: '02', title: 'Explore & Apply', desc: 'Browse opportunity and apply with a single click to multiple companies.' },
                                { step: '03', title: 'Interview & Prep', desc: 'Get shortlisted, schedule interviews, and prep with mock interviews.' },
                                { step: '04', title: 'Get Hired', desc: 'Track status in real-time and accept exciting job offers.' }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    className="relative group"
                                    variants={bounce}
                                    custom={idx}
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-300"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    ></motion.div>

                                    <motion.div
                                        className="bg-white p-8 rounded-3xl shadow-lg border-2 border-slate-100 text-center relative z-10 h-full hover:border-indigo-300 transition duration-300"
                                        whileHover={{ 
                                            y: -12,
                                            boxShadow: "0 20px 40px rgba(99, 102, 241, 0.15)"
                                        }}
                                    >
                                        <motion.div
                                            className="relative w-16 h-16 mx-auto mb-6"
                                        >
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg"
                                                whileHover={{ scale: 1.15, rotate: 10 }}
                                                animate={{ y: [0, -2, 0] }}
                                                transition={{ type: 'spring', stiffness: 400, duration: 2, repeat: Infinity }}
                                            >
                                                {item.step}
                                            </motion.div>
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl"
                                                opacity={0.2}
                                                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0, 0.2] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            ></motion.div>
                                        </motion.div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                                        <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Features by Role */}
            <section className="bg-white py-28 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-40 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-3xl opacity-20"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm">Unified Ecosystem</span>
                        <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                            Tailored for Every Stakeholder
                        </h2>
                        <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600">
                            Custom dashboards and features designed specifically for students, recruiters, and academic institutions.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-3 gap-8"
                        variants={container}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        {/* Student Card */}
                        <motion.div
                            className="group"
                            variants={fadeInUp}
                            custom={0}
                        >
                            <motion.div
                                className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-xl border-2 border-blue-100 p-8 hover:border-blue-300 transition duration-300 overflow-hidden relative h-full"
                                whileHover={{ 
                                    y: -12,
                                    boxShadow: "0 25px 50px rgba(59, 130, 246, 0.15)"
                                }}
                            >
                                <motion.div className="absolute top-0 right-0 bg-blue-500/10 w-32 h-32 rounded-bl-full -mr-8 -mt-8 group-hover:scale-125 transition duration-500"></motion.div>

                                <motion.div
                                    className="h-16 w-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 shadow-sm border border-blue-200"
                                    whileHover={{ scale: 1.15, rotate: -5 }}
                                >
                                    <Award size={32} />
                                </motion.div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-8">For Students</h3>
                                <motion.ul className="space-y-4" variants={container} initial="hidden" animate="visible">
                                    {[
                                        'Professional resume builder',
                                        'One-click applications',
                                        'Real-time status tracking',
                                        'Mock interview prep'
                                    ].map((item, i) => (
                                        <motion.li key={i} className="flex items-start text-slate-700 group/item" variants={fadeInUp} custom={i}>
                                            <motion.div whileHover={{ scale: 1.2 }} className="flex-shrink-0">
                                                <CheckCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                                            </motion.div>
                                            <span className="font-medium">{item}</span>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            </motion.div>
                        </motion.div>

                        {/* Recruiter Card */}
                        <motion.div
                            className="group"
                            variants={fadeInUp}
                            custom={1}
                        >
                            <motion.div
                                className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-3xl shadow-2xl border-2 border-indigo-700 p-8 hover:border-indigo-500 transition duration-300 overflow-hidden relative text-white h-full md:scale-105"
                                whileHover={{ 
                                    y: -12,
                                    boxShadow: "0 25px 50px rgba(99, 102, 241, 0.25)"
                                }}
                            >
                                <motion.div className="absolute top-0 right-0 bg-indigo-500/20 w-32 h-32 rounded-bl-full -mr-8 -mt-8 group-hover:scale-125 transition duration-500"></motion.div>

                                <motion.div
                                    className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg"
                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                >
                                    <Briefcase size={32} />
                                </motion.div>

                                <h3 className="text-2xl font-bold text-white mb-8">For Recruiters</h3>
                                <motion.ul className="space-y-4" variants={container} initial="hidden" animate="visible">
                                    {[
                                        'Post jobs instantly',
                                        'Smart candidate filtering',
                                        'Interview automation',
                                        'Direct TPO communication'
                                    ].map((item, i) => (
                                        <motion.li key={i} className="flex items-start text-indigo-100 group/item" variants={fadeInUp} custom={i}>
                                            <motion.div whileHover={{ scale: 1.2 }} className="flex-shrink-0">
                                                <CheckCircle className="h-5 w-5 text-indigo-300 mr-3 mt-0.5" />
                                            </motion.div>
                                            <span className="font-medium">{item}</span>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            </motion.div>
                        </motion.div>

                        {/* TPO Card */}
                        <motion.div
                            className="group"
                            variants={fadeInUp}
                            custom={2}
                        >
                            <motion.div
                                className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-xl border-2 border-purple-100 p-8 hover:border-purple-300 transition duration-300 overflow-hidden relative h-full"
                                whileHover={{ 
                                    y: -12,
                                    boxShadow: "0 25px 50px rgba(168, 85, 247, 0.15)"
                                }}
                            >
                                <motion.div className="absolute top-0 right-0 bg-purple-500/10 w-32 h-32 rounded-bl-full -mr-8 -mt-8 group-hover:scale-125 transition duration-500"></motion.div>

                                <motion.div
                                    className="h-16 w-16 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-8 shadow-sm border border-purple-200"
                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                >
                                    <Users size={32} />
                                </motion.div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-8">For TPOs</h3>
                                <motion.ul className="space-y-4" variants={container} initial="hidden" animate="visible">
                                    {[
                                        'Centralized control panel',
                                        'Profile verification',
                                        'Analytics & reports',
                                        'End-to-end management'
                                    ].map((item, i) => (
                                        <motion.li key={i} className="flex items-start text-slate-700 group/item" variants={fadeInUp} custom={i}>
                                            <motion.div whileHover={{ scale: 1.2 }} className="flex-shrink-0">
                                                <CheckCircle className="h-5 w-5 text-purple-500 mr-3 mt-0.5" />
                                            </motion.div>
                                            <span className="font-medium">{item}</span>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-slate-900">
                {/* Curved Background Shape (Top Wave) */}
                <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[100px] fill-white">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                    </svg>
                </div>

                {/* Background Decorations */}
                <div className="absolute inset-0 top-[100px]">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                    <motion.div
                        className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 8, repeat: Infinity }}
                    ></motion.div>
                    <motion.div
                        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                        animate={{ scale: [1.1, 1, 1.1] }}
                        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                    ></motion.div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-indigo-300 font-bold tracking-wider uppercase text-sm">Real Impact</span>
                        <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                            Success Stories
                        </h2>
                        <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-300">
                            Hear from students, recruiters, and institutions transforming their placement journey.
                        </p>
                    </motion.div>

                    {/* Testimonials Grid */}
                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={container}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        {[
                            {
                                quote: "CPMS made my placement process stress-free. I got placed in my dream firm within 2 weeks!",
                                author: "Aditi S.",
                                role: "Computer Science Student",
                                initial: "A",
                                gradient: "from-pink-500 to-rose-500"
                            },
                            {
                                quote: "Filtering hundreds of resumes was impossible until CPMS. It's a recruiter's dream!",
                                author: "Rajesh K.",
                                role: "HR Manager, TechCorp",
                                initial: "R",
                                gradient: "from-purple-500 to-indigo-500"
                            },
                            {
                                quote: "The analytics dashboard transformed how we manage placements. Highly recommended!",
                                author: "Dr. Sharma",
                                role: "Placement Officer",
                                initial: "S",
                                gradient: "from-cyan-500 to-blue-500"
                            },
                            {
                                quote: "Real-time notifications ensured I never missed a single interview. Got placed at Amazon!",
                                author: "Vikram R.",
                                role: "IT Engineer",
                                initial: "V",
                                gradient: "from-emerald-500 to-teal-500"
                            },
                            {
                                quote: "Mock interviews gave me the confidence to ace my technical rounds. Best feature!",
                                author: "Sneha P.",
                                role: "ECE Student",
                                initial: "S",
                                gradient: "from-orange-500 to-amber-500"
                            },
                            {
                                quote: "We streamlined 500+ students with one platform. Excel sheets are history!",
                                author: "Prof. Mehta",
                                role: "Dean of Student Affairs",
                                initial: "M",
                                gradient: "from-indigo-500 to-violet-500"
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                className="group"
                                variants={rotateIn}
                                custom={idx}
                            >
                                <motion.div
                                    className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl relative flex-shrink-0 hover:border-white/20 transition-all duration-300 flex flex-col h-full overflow-hidden"
                                    whileHover={{ 
                                        y: -8,
                                        boxShadow: "0 20px 40px rgba(99, 102, 241, 0.2)"
                                    }}
                                >
                                    <motion.div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-10"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity }}
                                        style={{
                                            background: `conic-gradient(from 0deg, indigo, purple, pink, indigo)`
                                        }}
                                    />

                                    <motion.div className="absolute top-6 right-6 text-white/10 group-hover:text-white/30 transition-colors">
                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity }}>
                                            <Quote size={24} />
                                        </motion.div>
                                    </motion.div>

                                    <div className="flex-grow pt-8 relative z-10">
                                        <p className="text-slate-200 italic mb-6 mt-4 relative z-10 text-base leading-relaxed font-light">&ldquo;{item.quote}&rdquo;</p>
                                    </div>

                                    <motion.div className="flex items-center pt-6 border-t border-white/10 mt-auto relative z-10">
                                        <motion.div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-xl mr-4 shadow-lg bg-gradient-to-br ${item.gradient}`}
                                            whileHover={{ scale: 1.2, rotate: 360 }}
                                            transition={{ type: 'spring', stiffness: 200 }}
                                            animate={{ y: [0, -2, 0] }}
                                        >
                                            {item.initial}
                                        </motion.div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm">{item.author}</h4>
                                            <p className="text-xs text-indigo-300 font-medium">{item.role}</p>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Why Choose CPMS */}
            <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm">Why Choose Us</span>
                        <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                            Trusted by Thousands
                        </h2>
                        <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600">
                            Built with cutting-edge technology and designed for seamless user experience across all platforms.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                        variants={container}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        {[
                            {
                                icon: <Zap size={28} />,
                                title: 'Real-Time Updates',
                                desc: 'Instant Socket.io notifications ensure you never miss opportunities.',
                                color: 'from-amber-500 to-orange-500'
                            },
                            {
                                icon: <Shield size={28} />,
                                title: 'Secure & Reliable',
                                desc: 'Enterprise-grade security with JWT and role-based access control.',
                                color: 'from-green-500 to-emerald-500'
                            },
                            {
                                icon: <TrendingUp size={28} />,
                                title: 'Analytics Driven',
                                desc: 'Visual insights and detailed reports to track placement metrics.',
                                color: 'from-blue-500 to-cyan-500'
                            },
                            {
                                icon: <Rocket size={28} />,
                                title: 'Modern & Responsive',
                                desc: 'Beautiful UI built with React, Tailwind CSS, and smooth animations.',
                                color: 'from-purple-500 to-indigo-500'
                            }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                className="group"
                                variants={slideFromLeft}
                            >
                                <motion.div
                                    className="bg-white p-8 rounded-3xl shadow-lg border-2 border-slate-100 hover:border-slate-200 transition duration-300 h-full relative overflow-hidden"
                                    whileHover={{ 
                                        y: -8,
                                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
                                    }}
                                >
                                    <motion.div
                                        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 10, repeat: Infinity }}
                                        style={{
                                            background: `conic-gradient(from 0deg, ${feature.color})`
                                        }}
                                    />

                                    <motion.div
                                        className={`h-14 w-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:shadow-xl relative z-10`}
                                        whileHover={{ scale: 1.15, rotate: 360 }}
                                        animate={{ y: [0, -3, 0] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    >
                                        {feature.icon}
                                    </motion.div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-3 relative z-10">{feature.title}</h4>
                                    <p className="text-slate-600 leading-relaxed relative z-10">{feature.desc}</p>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-28 relative">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                        Frequently Asked Questions
                    </h2>
                    <p className="mt-4 text-lg text-slate-600">
                        Everything you need to know about CPMS
                    </p>
                </motion.div>

                <motion.div
                    className="space-y-4"
                    variants={container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {[
                        { q: "Is CPMS free for students?", a: "Yes! Students can register, build profiles, and apply to unlimited jobs completely free. We believe in democratizing campus recruitment." },
                        { q: "How do I verify my company account?", a: "After registration, your profile is sent to the Training & Placement Officer (TPO) for verification. You'll receive an email notification once approved, usually within 24-48 hours." },
                        { q: "Can I edit my resume after uploading?", a: "Absolutely! You can update your resume, profile details, and other information anytime from your dashboard. Changes are reflected immediately." },
                        { q: "Is my data secure on CPMS?", a: "We use industry-standard encryption (HTTPS/SSL), role-based access control, and never share your data with unauthorized sources. Your privacy is our top priority." }
                    ].map((faq, idx) => (
                        <motion.div
                            key={idx}
                            className="group"
                            variants={listItem}
                        >
                            <motion.div
                                className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 hover:border-indigo-300 rounded-2xl p-8 shadow-md hover:shadow-lg transition duration-300 cursor-pointer overflow-hidden relative"
                                whileHover={{ 
                                    y: -6,
                                    backgroundColor: "rgb(240, 246, 255)"
                                }}
                            >
                                <motion.div
                                    className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-600 to-purple-600"
                                    scaleY={0}
                                    whileHover={{ scaleY: 1 }}
                                    transition={{ duration: 0.3, originY: 0 }}
                                />

                                <h3 className="text-lg font-bold text-slate-900 flex justify-between items-center">
                                    <span>{faq.q}</span>
                                    <motion.div
                                        animate={{ rotate: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="group-hover:rotate-180 transition duration-300"
                                    >
                                        <ChevronDown className="text-indigo-600 group-hover:text-indigo-700" size={22} />
                                    </motion.div>
                                </h3>
                                <motion.p
                                    className="mt-4 text-slate-600 leading-relaxed text-base"
                                    initial={{ opacity: 0.8 }}
                                    whileInView={{ opacity: 1 }}
                                >
                                    {faq.a}
                                </motion.p>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Call to Action */}
            <section className="relative py-32 bg-gradient-to-b from-white to-slate-100 overflow-hidden">
                <motion.div
                    className="absolute top-0 right-0 -mr-40 w-[600px] h-[600px] bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full blur-3xl opacity-30"
                    animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
                    transition={{ duration: 10, repeat: Infinity }}
                ></motion.div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden border-2 border-white/20"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        animate={{
                            boxShadow: [
                                "0 0 0 0px rgba(99, 102, 241, 0.4)",
                                "0 0 0 20px rgba(99, 102, 241, 0)"
                            ]
                        }}
                        whileHover={{
                            boxShadow: "0 20px 60px rgba(99, 102, 241, 0.4)"
                        }}
                        transitionBoxShadow={{ duration: 2, repeat: Infinity }}
                    >
                        <motion.div
                            className="absolute inset-0 opacity-0 hover:opacity-20"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity }}
                            style={{
                                background: `conic-gradient(from 0deg, indigo, purple, pink, indigo)`
                            }}
                        />

                        <motion.div className="relative z-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1, duration: 0.6 }}
                            >
                                <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                                    Ready to <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">&ldquo;Transform&rdquo;</span> Your Placement Journey?
                                </h2>
                            </motion.div>

                            <motion.p
                                className="text-indigo-100 mb-12 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                            >
                                Join 10,000+ students and 500+ companies already using CPMS to accelerate their success. Start your journey today&mdash;it&rsquo;s completely free!
                            </motion.p>

                            <motion.div
                                className="flex flex-col sm:flex-row gap-6 justify-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                            >
                                <motion.div 
                                    whileHover={{ scale: 1.08, rotate: 1 }} 
                                    whileTap={{ scale: 0.95 }}
                                    animate={{ y: [0, -3, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    <Link to="/register" className="inline-flex items-center justify-center px-10 py-4 border-2 border-white text-lg font-bold rounded-full text-indigo-600 bg-white hover:bg-primary-50 transition shadow-xl hover:shadow-2xl">
                                        Get Started Free <ArrowRight className="ml-2" size={22} />
                                    </Link>
                                </motion.div>
                                <motion.div 
                                    whileHover={{ scale: 1.08, rotate: -1 }} 
                                    whileTap={{ scale: 0.95 }}
                                    animate={{ y: [0, 3, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: 0.1 }}
                                >
                                    <Link to="/login" className="inline-flex items-center justify-center px-10 py-4 border-2 border-white/40 text-lg font-bold rounded-full text-white hover:border-white hover:bg-white/10 transition">
                                        Sign In to Account
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        {/* Decorative animated circles */}
                        <motion.div
                            className="absolute top-0 left-0 -mt-20 -ml-20 w-80 h-80 bg-indigo-400 rounded-full opacity-20 filter blur-3xl"
                            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180], x: [-10, 10, -10] }}
                            transition={{ duration: 15, repeat: Infinity }}
                        ></motion.div>
                        <motion.div
                            className="absolute bottom-0 right-0 -mb-20 -mr-20 w-80 h-80 bg-purple-400 rounded-full opacity-20 filter blur-3xl"
                            animate={{ scale: [1.2, 1, 1.2], rotate: [180, 90, 0], x: [10, -10, 10] }}
                            transition={{ duration: 15, repeat: Infinity }}
                        ></motion.div>
                        <motion.div
                            className="absolute top-1/2 left-1/2 w-40 h-40 bg-pink-400 rounded-full opacity-10 filter blur-3xl"
                            animate={{ scale: [0.8, 1.2, 0.8], y: [0, 30, 0] }}
                            transition={{ duration: 12, repeat: Infinity }}
                        ></motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
