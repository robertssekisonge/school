import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { formsAPI } from '../../lib/api';

interface SponsorshipApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sponsorshipLevel?: string;
}

const SponsorshipApplicationModal: React.FC<SponsorshipApplicationModalProps> = ({
  isOpen,
  onClose,
  sponsorshipLevel = 'Full Scholarship'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sponsorship_level: sponsorshipLevel,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await formsAPI.submitSponsorshipApplication(formData);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        sponsorship_level: sponsorshipLevel,
        message: ''
      });
      
      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-2xl shadow-2xl border border-emerald-100 max-w-sm w-full max-h-[88vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 rounded-t-2xl bg-gradient-to-r from-emerald-600 to-teal-600">
          <h2 className="text-xl font-bold text-white">Apply for Sponsorship</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Application Submitted!
            </h3>
            <p className="text-gray-600 text-center">
              Thank you for your interest in our sponsorship program. We'll contact you soon with next steps.
            </p>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Submission Failed
            </h3>
            <p className="text-red-600 text-center mb-4">
              {errorMessage}
            </p>
            <button
              onClick={() => setSubmitStatus('idle')}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Form */}
        {submitStatus === 'idle' && (
          <form onSubmit={handleSubmit} className="p-4 space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                placeholder="+256 123 456 789"
              />
            </div>

            <div>
              <label htmlFor="sponsorship_level" className="block text-sm font-medium text-gray-700 mb-2">
                Sponsorship Level *
              </label>
              <select
                id="sponsorship_level"
                name="sponsorship_level"
                required
                value={formData.sponsorship_level}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              >
                <option value="Full Scholarship">Full Scholarship</option>
                <option value="Partial Scholarship">Partial Scholarship</option>
                <option value="Book & Uniform">Book & Uniform</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Tell us why you're interested in sponsoring a child..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2.5 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SponsorshipApplicationModal;
