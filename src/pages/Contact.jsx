import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquareText, HelpCircle, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        toast.success(`Thank you, ${formData.name}! We will get back to you shortly.`);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -mt-40 -mr-40 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl -mb-20 -ml-20 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <span className="text-indigo-400 font-bold tracking-wider uppercase text-sm mb-4 block">We're Here for You</span>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
                        Get in Touch
                    </h1>
                    <p className="mt-4 max-w-2xl text-xl text-indigo-100 mx-auto leading-relaxed">
                        Have a question, need assistance, or want to partner with us? Reach out today, and our dedicated team will be delighted to help you.
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">

                    {/* Left Column - Contact Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Contact Information</h3>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                Feel free to reach out via your preferred channel. We usually respond within 24 hours.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-5 group">
                                    <div className="flex-shrink-0 bg-indigo-50 p-4 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Email Us</h4>
                                        <p className="text-indigo-600 font-medium text-lg mt-1">support@cpms.edu</p>
                                        <p className="text-sm text-slate-500 mt-1">For general inquiries and support.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5 group">
                                    <div className="flex-shrink-0 bg-purple-50 p-4 rounded-2xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Call Us</h4>
                                        <p className="text-purple-600 font-medium text-lg mt-1">+91 98765 43210</p>
                                        <p className="text-sm text-slate-500 mt-1">Mon-Fri from 9am to 6pm IST.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-5 group">
                                    <div className="flex-shrink-0 bg-teal-50 p-4 rounded-2xl text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Visit Us</h4>
                                        <p className="text-teal-600 font-medium text-lg mt-1 leading-snug">
                                            Gamma 2, Greater Noida,<br />
                                            Uttar Pradesh, India
                                        </p>
                                        <p className="text-sm text-slate-500 mt-1">Come say hello at our main campus office.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Help Desk Mini Card */}
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
                            <HelpCircle className="absolute right-[-20px] bottom-[-20px] w-48 h-48 opacity-10" />
                            <h4 className="text-xl font-bold mb-3 relative z-10">Need Immediate Help?</h4>
                            <p className="text-indigo-100 mb-6 relative z-10 text-sm leading-relaxed">
                                Browse our comprehensive frequently asked questions section to find quick solutions to common issues.
                            </p>
                            <Link to="/faq" className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-xl font-semibold transition backdrop-blur-sm relative z-10 text-sm">
                                Visit FAQ <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* Right Column - Contact Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-3xl p-10 lg:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 h-full">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-slate-100 rounded-xl text-slate-700">
                                    <MessageSquareText size={24} />
                                </div>
                                <h3 className="text-3xl font-extrabold text-slate-900">Send a Message</h3>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="John Doe"
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition font-medium text-slate-900 placeholder-slate-400"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="john@example.com"
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition font-medium text-slate-900 placeholder-slate-400"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Subject <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="How can we help you?"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition font-medium text-slate-900 placeholder-slate-400"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Message <span className="text-red-500">*</span></label>
                                    <textarea
                                        rows="6"
                                        required
                                        placeholder="Please describe your inquiry in detail..."
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition font-medium text-slate-900 placeholder-slate-400 resize-none"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition duration-300 font-bold text-lg shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
                                >
                                    <Send size={20} /> Send Your Message
                                </button>
                                <p className="text-center text-slate-500 text-sm mt-4">
                                    By submitting this form, you agree to our privacy policy.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
