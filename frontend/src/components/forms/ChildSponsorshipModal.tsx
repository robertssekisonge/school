import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, Heart } from 'lucide-react';
import { formsAPI } from '../../lib/api';

interface ChildSponsorshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  sponsorshipType?: string;
  amount?: string;
}

const ChildSponsorshipModal: React.FC<ChildSponsorshipModalProps> = ({
  isOpen,
  onClose,
  sponsorshipType = 'Full Scholarship',
  amount = '500,000'
}) => {
  const [formData, setFormData] = useState({
    sponsor_name: '',
    sponsor_email: '',
    sponsor_phone: '',
    child_name: '',
    sponsorship_type: sponsorshipType,
    amount: parseFloat(amount.replace(/,/g, '')),
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.name === 'amount' ? parseFloat(e.target.value) || 0 : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await formsAPI.submitChildSponsorship(formData);
      setSubmitStatus('success');
      setFormData({
        sponsor_name: '',
        sponsor_email: '',
        sponsor_phone: '',
        child_name: '',
        sponsorship_type: sponsorshipType,
        amount: parseFloat(amount.replace(/,/g, '')),
        message: ''
      });
      
      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit sponsorship request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-2xl shadow-2xl border border-rose-100 max-w-sm w-full max-h-[88vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 rounded-t-2xl bg-gradient-to-r from-rose-600 to-pink-600">
          <div className="flex items-center">
            <Heart className="w-5 h-5 text-white mr-2" />
            <h2 className="text-xl font-bold text-white">Sponsor a Child</h2>
          </div>
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
              <CheckCircle className="w-16 h-16 text-rose-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Sponsorship Request Submitted!
            </h3>
            <p className="text-gray-600 text-center">
              Thank you for your generous offer to sponsor a child. We'll contact you soon to discuss the next steps.
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
              className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-rose-700 hover:to-pink-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Form */}
        {submitStatus === 'idle' && (
          <form onSubmit={handleSubmit} className="p-4 space-y-5">
            <div>
              <label htmlFor="sponsor_name" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="sponsor_name"
                name="sponsor_name"
                required
                value={formData.sponsor_name}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="sponsor_email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="sponsor_email"
                name="sponsor_email"
                required
                value={formData.sponsor_email}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="sponsor_phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="sponsor_phone"
                name="sponsor_phone"
                value={formData.sponsor_phone}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                placeholder="+256 123 456 789"
              />
            </div>

            <div>
              <label htmlFor="child_name" className="block text-sm font-medium text-gray-700 mb-2">
                Child's Name (Optional)
              </label>
              <input
                type="text"
                id="child_name"
                name="child_name"
                value={formData.child_name}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                placeholder="If you have a specific child in mind"
              />
            </div>

            <div>
              <label htmlFor="sponsorship_type" className="block text-sm font-medium text-gray-700 mb-2">
                Sponsorship Type *
              </label>
              <select
                id="sponsorship_type"
                name="sponsorship_type"
                required
                value={formData.sponsorship_type}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
              >
                <option value="Full Scholarship">Full Scholarship</option>
                <option value="Partial Scholarship">Partial Scholarship</option>
                <option value="Book & Uniform">Book & Uniform</option>
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount (UGX) *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                required
                value={formData.amount}
                onChange={handleChange}
                min="0"
                step="1000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="500000"
              />
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
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Tell us about your sponsorship preferences..."
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
                className="flex-1 bg-gradient-to-r from-rose-600 to-pink-600 text-white py-2.5 rounded-lg font-semibold hover:from-rose-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Sponsorship'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChildSponsorshipModal;
