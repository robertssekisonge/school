import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle, Shield, User, Mail, HelpCircle } from 'lucide-react';
import { API_BASE_URL } from '../lib/api';

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // First-time login password reset states
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Password reset link states
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [showResetNewPassword, setShowResetNewPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);
  
  // Locked account states
  const [showLockedMessage, setShowLockedMessage] = useState(false);
  const [lockedUntil, setLockedUntil] = useState<string | null>(null);
  const [lockCountdown, setLockCountdown] = useState<number>(0);
  
  // Profile picture states
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [profileImage, setProfileImage] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showImageUpload, setShowImageUpload] = useState(false);

  // Add new state for background image
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  // Check for reset token in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');
    
    if (token && email) {
      setResetToken(token);
      setResetEmail(email);
      setShowResetForm(true);
    }
  }, []);

  // Check for logout success message
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const logoutSuccess = urlParams.get('logout');
    
    if (logoutSuccess === 'success') {
      setSuccess('You have been successfully logged out. Please sign in again to continue.');
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Countdown timer for locked accounts
  useEffect(() => {
    if (!lockedUntil || lockCountdown <= 0) return;

    const interval = setInterval(() => {
      setLockCountdown(prev => {
        if (prev <= 1) {
          // Auto-refresh page when countdown reaches zero
          window.location.reload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lockedUntil, lockCountdown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
              const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.firstTimeLogin) {
          // First-time login - show password reset form
          setShowPasswordReset(true);
          setSuccess('Please set a new password for your account.');
        } else {
          // Normal login
          const loginSuccess = await login(email, password);
          if (loginSuccess) {
            setSuccess('Login successful!');
            // Redirect to admin dashboard using React Router
            navigate('/admin');
          } else {
            setError('Login failed. Please check your credentials.');
          }
        }
      } else if (response.status === 423) {
        // Account is locked
        console.log('Lock response data:', data); // Debug log
        if (data.permanentlyLocked) {
          setError('Account permanently locked due to multiple failed attempts. Please contact an administrator.');
        } else if (data.accountLocked) {
          setError('Access Denied: Your account has been locked by an administrator. Please contact support.');
        } else if (data.lockedUntil) {
          // Temporary lock with remaining time
          setShowLockedMessage(true);
          setLockedUntil(data.lockedUntil);
          setLockCountdown(data.remainingTime || 0);
          setError(data.message || 'Access Denied: Account is temporarily locked.');
        } else if (data.remainingTime) {
          setLockCountdown(data.remainingTime);
          setError(`Account temporarily locked. Please wait ${data.remainingTime} seconds before trying again.`);
        } else {
          setShowLockedMessage(true);
          setLockedUntil(data.lockedUntil);
          setError(data.message || 'Access Denied: Account is locked.');
        }
      } else if (response.status === 401) {
        // Invalid credentials with attempt tracking
        if (data.attemptsRemaining) {
          setError(`${data.message} (${data.attemptsRemaining} attempts remaining)`);
        } else {
          setError(data.error || 'Login failed');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setIsLoading(false);
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error);
      setIsLoading(false);
      return;
    }

    try {
      // First, get the user ID by logging in again
              const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: oldPassword }),
      });

      if (!loginResponse.ok) {
        setError('Current password is incorrect');
        setIsLoading(false);
        return;
      }

      const userData = await loginResponse.json();
      const userId = userData.id;

              const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          oldPassword,
          newPassword,
          confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password changed successfully! Please log in with your new password.');
        setShowPasswordReset(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setEmail('');
        setPassword('');
        // Do not log in automatically; show Back to Login button
      } else {
        setError(data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Password validation function
  const validatePassword = (password: string): { isValid: boolean; error: string } => {
    if (password.length < 4) {
      return { isValid: false, error: 'Password must be at least 4 characters long' };
    }
    const symbolRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/;
    if (!symbolRegex.test(password)) {
      return { isValid: false, error: 'Password must contain at least one symbol (!@#$%^&*()_+-=[]{}|;:,.<>?)' };
    }
    return { isValid: true, error: '' };
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (resetNewPassword !== resetConfirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const passwordValidation = validatePassword(resetNewPassword);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.error);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: resetToken,
          email: resetEmail,
          newPassword: resetNewPassword,
          confirmPassword: resetConfirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password reset successfully! You can now login with your new password.');
        setShowResetForm(false);
        setResetToken('');
        setResetEmail('');
        setResetNewPassword('');
        setResetConfirmPassword('');
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        // Clear the form for fresh login
        setEmail('');
        setPassword('');
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError('Network error. Please try again.');
    } finally {
    setIsLoading(false);
    }
  };

  const handleRequestUnlock = () => {
    setSuccess('Unlock request sent to administrator. You will be notified when your account is unlocked.');
    // In a real app, this would send a notification to admin
  };

  const formatCountdown = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Profile picture upload handler
  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleProfileImageClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => handleProfileImageUpload(e as React.ChangeEvent<HTMLInputElement>);
    input.click();
  };

  // Handler for background image upload
  const handleBackgroundImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler for clicking the background area
  const handleBackgroundAreaClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        handleBackgroundImageUpload({ target } as React.ChangeEvent<HTMLInputElement>);
      }
    };
    input.click();
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setError('');
    setSuccess('');

    if (!forgotPasswordEmail) {
      setError('Please enter your email address');
      setForgotPasswordLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password reset request sent! An administrator will be notified and can reset your password.');
        setShowForgotPassword(false);
        setForgotPasswordEmail('');
      } else {
        setError(data.error || 'Failed to send password reset request');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('Network error. Please try again.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  if (showResetForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-purple-600 animate-shield-vibrate" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Reset Your Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your new password below
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handlePasswordReset}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <div className="relative">
                  <input
                    type={showResetNewPassword ? 'text' : 'password'}
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    required
                    minLength={8}
                    tabIndex={1}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowResetNewPassword(!showResetNewPassword)}
                    tabIndex={-1}
                  >
                    {showResetNewPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters and contain at least one symbol (!@#$%^&*()_+-=[]{}|;:,.)
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showResetConfirmPassword ? 'text' : 'password'}
                    value={resetConfirmPassword}
                    onChange={(e) => setResetConfirmPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    required
                    minLength={8}
                    tabIndex={2}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showResetConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-md">
                <CheckCircle className="h-5 w-5" />
                <span>{success}</span>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowResetForm(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                tabIndex={3}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                tabIndex={4}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
            
            {success && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowResetForm(false);
                    setSuccess('');
                    setError('');
                    setEmail('');
                    setPassword('');
                  }}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  tabIndex={5}
                >
                  Back to Login
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  if (showPasswordReset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Set Your Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please set a new password for your account
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handlePasswordChange}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                  tabIndex={1}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    required
                    minLength={8}
                    tabIndex={2}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    required
                    minLength={8}
                    tabIndex={3}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-md">
                <CheckCircle className="h-5 w-5" />
                <span>{success}</span>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowPasswordReset(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                tabIndex={4}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                tabIndex={5}
              >
                {isLoading ? 'Setting...' : 'Set Password'}
              </button>
            </div>
            
            {success && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordReset(false);
                    setSuccess('');
                    setError('');
                    setEmail('');
                    setPassword('');
                  }}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  tabIndex={6}
                >
                  Back to Login
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  if (showLockedMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Account Locked
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Your account has been locked by an administrator.
            </p>
            {lockedUntil && (
              <p className="mt-2 text-center text-sm text-gray-500">
                Locked until: {new Date(lockedUntil).toLocaleString()}
                {lockCountdown > 0 && (
                  <span className="block mt-1 font-bold text-red-600">
                    ⏰ Auto-unlock in: {formatCountdown(lockCountdown)}
                  </span>
                )}
              </p>
            )}
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Account Access Restricted
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Please contact an administrator to unlock your account.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowLockedMessage(false)}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Back to Login
            </button>
            <button
              onClick={handleRequestUnlock}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Request Unlock
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <HelpCircle className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Forgot Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email address and we'll notify an administrator to reset your password
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
            <div>
              <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-md">
                <CheckCircle className="h-5 w-5" />
                <span>{success}</span>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Back to Login
              </button>
              <button
                type="submit"
                disabled={forgotPasswordLoading}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {forgotPasswordLoading ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 py-2 sm:py-4 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-lg opacity-90 animate-blob shadow-2xl shadow-purple-500/50"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-lg opacity-90 animate-blob animation-delay-2000 shadow-2xl shadow-blue-500/50"></div>
        <div className="absolute top-40 left-40 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-lg opacity-90 animate-blob animation-delay-4000 shadow-2xl shadow-pink-500/50"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-lg opacity-80 animate-blob animation-delay-1000 shadow-2xl shadow-yellow-500/50"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply filter blur-lg opacity-80 animate-blob animation-delay-3000 shadow-2xl shadow-yellow-500/50"></div>
      </div>
      
      <div className="max-w-sm w-full bg-gradient-to-br from-slate-200 via-white to-slate-100 rounded-2xl shadow-2xl border-4 border-purple-400 p-4 sm:p-6 space-y-4 sm:space-y-6 hover:shadow-3xl hover:scale-105 transition-all duration-500 relative z-10 backdrop-blur-md bg-white/95 shadow-purple-500/20">
        <div className="text-center hover:scale-105 transition-transform duration-300">
          <div className="mx-auto h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center hover:bg-purple-200 transition-colors duration-200">
            <Shield className="h-5 w-5 text-purple-600 animate-shield-vibrate" />
          </div>
          {/* Custom Title */}
          <div className="mt-2 text-sm font-bold text-purple-400 tracking-wide" style={{letterSpacing: '0.04em'}}>
            Son Of A Black Woman
          </div>
          <h2 className="mt-3 text-center text-2xl font-extrabold text-gray-900 hover:text-purple-700 transition-colors duration-200">
            Welcomes You Back
          </h2>
          <p className="mt-1 text-center text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200">
            School Management System
          </p>
          
          {/* Profile Picture Circle with blurry rectangle background upload */}
          <div className="mt-4 flex flex-col items-center hover:scale-105 transition-transform duration-300">
            <div className="relative flex items-center justify-center w-full">
              {/* Blurry rectangle background photo area */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-24 rounded-xl overflow-hidden cursor-pointer z-0 shadow-md border border-purple-100"
                style={{ filter: backgroundImage ? 'blur(14px) brightness(0.9)' : undefined, background: backgroundImage ? `url(${backgroundImage}) center/cover no-repeat` : 'linear-gradient(135deg, #ede9fe, #dbeafe)', transition: 'background 0.3s' }}
                onClick={handleBackgroundAreaClick}
                title="Click to upload background photo"
              ></div>
              {/* Profile circle (always above background) */}
              <div className="relative w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          <div className="space-y-3">
            <div className="hover:scale-105 transition-transform duration-200">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 hover:text-purple-700 transition-colors duration-200">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-1.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 hover:border-purple-300 hover:shadow-md transition-all duration-200"
                  placeholder="Enter your email"
                  tabIndex={1}
                />
              </div>
            </div>
            
            <div className="hover:scale-105 transition-transform duration-200">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 hover:text-purple-700 transition-colors duration-200">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-1.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 hover:border-purple-300 hover:shadow-md transition-all duration-200"
                  placeholder="Enter your password"
                  tabIndex={2}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-purple-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-purple-600" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-5 w-5" />
              <div className="flex-1">
                <span>{error}</span>
                {lockCountdown > 0 && (
                  <div className="text-sm font-bold mt-1">
                    ⏰ Auto-unlock in: {formatCountdown(lockCountdown)}
                </div>
                )}
              </div>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-md">
              <CheckCircle className="h-5 w-5" />
              <span>{success}</span>
            </div>
          )}

          <div className="hover:scale-105 transition-transform duration-200">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-1.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-300"
              tabIndex={3}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
