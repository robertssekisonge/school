import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  return (
    <section id="contact" className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Have questions about admissions, programs, or want to schedule a visit? 
            We'd love to hear from you and help you discover HARVANA SCHOOLS.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 group">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-2 rounded-lg shadow-md">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-base mb-1">Address</h4>
                  <p className="text-slate-600 text-sm">123 Education Street<br />Kampala, Uganda</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 group">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-2 rounded-lg shadow-md">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-base mb-1">Phone</h4>
                  <p className="text-slate-600 text-sm">+256 123 456 789</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all duration-300 group">
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 text-white p-2 rounded-lg shadow-md">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-base mb-1">Email</h4>
                  <p className="text-slate-600 text-sm">info@harvanaschools.edu</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-rose-50 hover:to-orange-50 transition-all duration-300 group">
                <div className="bg-gradient-to-br from-rose-500 to-orange-600 text-white p-2 rounded-lg shadow-md">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-base mb-1">Office Hours</h4>
                  <p className="text-slate-600 text-sm">
                    Monday - Friday: 8:00 AM - 5:00 PM<br />
                    Saturday: 9:00 AM - 2:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-6">
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg h-48 flex items-center justify-center border border-slate-300/30">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-2 w-10 h-10 mx-auto mb-2 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-slate-500 text-sm font-medium">Interactive Map Coming Soon</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Send us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="+256 123 456 789"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  >
                    <option value="">Select a subject</option>
                    <option value="admission">Admission Inquiry</option>
                    <option value="tour">School Tour Request</option>
                    <option value="programs">Academic Programs</option>
                    <option value="scholarships">Scholarships</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none bg-white/50 backdrop-blur-sm"
                  placeholder="Tell us how we can help you..."
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </button>
              
              {submitStatus === 'success' && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg font-medium text-sm">
                  Thank you! Your message has been sent successfully. We'll get back to you soon.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg font-medium text-sm">
                  Sorry, there was an error sending your message. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;