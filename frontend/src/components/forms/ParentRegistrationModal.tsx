import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { formsAPI } from '../../lib/api';

interface ParentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ParentRegistrationModal: React.FC<ParentRegistrationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [formData, setFormData] = useState({
    parent_name: '',
    email: '',
    phone: '',
    child_name: '',
    child_grade: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      await formsAPI.registerParent(formData);
      setSubmitStatus('success');
      setFormData({
        parent_name: '',
        email: '',
        phone: '',
        child_name: '',
        child_grade: ''
      });
      
      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 max-w-sm w-full max-h-[88vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 rounded-t-2xl bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center">
            <Users className="w-6 h-6 text-white mr-2" />
            <h2 className="text-xl font-bold text-white">Parent Portal Registration</h2>
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
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Registration Submitted!
            </h3>
            <p className="text-gray-600 text-center">
              Thank you for registering for the parent portal. We'll contact you soon with login credentials.
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
              Registration Failed
            </h3>
            <p className="text-red-600 text-center mb-4">
              {errorMessage}
            </p>
            <button
              onClick={() => setSubmitStatus('idle')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Form */}
        {submitStatus === 'idle' && (
          <form onSubmit={handleSubmit} className="p-4 space-y-5">
            <div>
              <label htmlFor="parent_name" className="block text-sm font-medium text-gray-700 mb-2">
                Parent Name *
              </label>
              <input
                type="text"
                id="parent_name"
                name="parent_name"
                required
                value={formData.parent_name}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter parent's full name"
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
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="parent.email@example.com"
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
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="+256 123 456 789"
              />
            </div>

            <div>
              <label htmlFor="child_name" className="block text-sm font-medium text-gray-700 mb-2">
                Child's Name
              </label>
              <input
                type="text"
                id="child_name"
                name="child_name"
                value={formData.child_name}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter child's name"
              />
            </div>

            <div>
              <label htmlFor="child_grade" className="block text-sm font-medium text-gray-700 mb-2">
                Child's Grade
              </label>
              <select
                id="child_grade"
                name="child_grade"
                value={formData.child_grade}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select Grade</option>
                <option value="Primary 1">Primary 1</option>
                <option value="Primary 2">Primary 2</option>
                <option value="Primary 3">Primary 3</option>
                <option value="Primary 4">Primary 4</option>
                <option value="Primary 5">Primary 5</option>
                <option value="Primary 6">Primary 6</option>
                <option value="Primary 7">Primary 7</option>
                <option value="Secondary 1">Secondary 1</option>
                <option value="Secondary 2">Secondary 2</option>
                <option value="Secondary 3">Secondary 3</option>
                <option value="Secondary 4">Secondary 4</option>
                <option value="Advanced Level">Advanced Level</option>
              </select>
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
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ParentRegistrationModal;
