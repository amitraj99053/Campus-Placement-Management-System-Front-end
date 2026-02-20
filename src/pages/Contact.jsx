import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'react-toastify';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        toast.success(`Thank you, ${formData.name}! We have received your message.`);
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">Get in Touch</h1>
                    <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
                        Have questions? We'd love to hear from you.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-indigo-600 mb-4">Contact Information</h3>
                            <p className="text-slate-600 mb-8">
                                Whether you're a student looking for help or a company interested in partnering with us, our team is here to assist.
                            </p>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-lg text-indigo-600">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-slate-900">Email</h4>
                                <p className="text-slate-600">support@cpms.edu</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-lg text-indigo-600">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-slate-900">Phone</h4>
                                <p className="text-slate-600">+91 98765 43210</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-lg text-indigo-600">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-slate-900">Office</h4>
                                <p className="text-slate-600">
                                    Gamma 2,<br />
                                    Greater Noida,<br />
                                    Uttar Pradesh, India
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-slate-50 p-8 rounded-2xl border border-gray-100 shadow-lg">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    rows="4"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition font-medium"
                            >
                                <Send size={18} className="mr-2" /> Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
