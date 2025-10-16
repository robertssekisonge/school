import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { formsAPI } from '../../lib/api';

interface NewsletterSubscriptionProps {
  className?: string;
}

const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({ className = '' }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await formsAPI.subscribeToNewsletter({ email: email.trim(), name: name.trim() });
      setSubmitStatus('success');
      setEmail('');
      setName('');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to subscribe');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white ${className}`}>
      <div className="flex items-center mb-4">
        <Mail className="w-6 h-6 mr-2" />
        <h3 className="text-xl font-bold">Subscribe to Newsletter</h3>
      </div>
      
      <p className="text-blue-100 mb-6">
        Stay updated with the latest news, events, and achievements from Excellence Academy.
      </p>

      {/* Success Message */}
      {submitStatus === 'success' && (
        <div className="flex items-center bg-green-500/20 border border-green-400/30 rounded-lg p-4 mb-4">
          <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-100">Successfully Subscribed!</p>
            <p className="text-blue-100 text-sm">You'll receive our newsletter updates soon.</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {submitStatus === 'error' && (
        <div className="flex items-center bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-4">
          <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-100">Subscription Failed</p>
            <p className="text-red-100 text-sm">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Form */}
      {submitStatus === 'idle' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Your Name (Optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div>
            <input
              type="email"
              placeholder="Email Address *"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || !email.trim()}
            className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
          </button>
        </form>
      )}
    </div>
  );
};

export default NewsletterSubscription;
