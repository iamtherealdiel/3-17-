import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { validateEmail, validatePassword } from '../utils/validation';
import { supabase } from '../lib/supabase';

// Utility to prevent duplicate toasts
const shownToasts = new Set<string>();
const showUniqueToast = (message: string, type: 'success' | 'error', id?: string) => {
  const toastId = id || message;
  if (!shownToasts.has(toastId)) {
    shownToasts.add(toastId);
    
    if (type === 'success') {
      toast.success(message, { id: toastId });
    } else {
      toast.error(message, { id: toastId });
    }
    
    // Remove from tracking after some time
    setTimeout(() => {
      shownToasts.delete(toastId);
    }, 5000);
  }
};

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignupComplete, setIsSignupComplete] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const validateForm = (): boolean => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
      isValid = false;
    }

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.message;
        isValid = false;
      }
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, name);
      setIsSignupComplete(true);
      // Toast is handled in signUp function to avoid duplicates
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create account';
      if (errorMessage.includes('credentials')) {
        setErrors(prev => ({ ...prev, email: 'Invalid email or password' }));
      } else {
        showUniqueToast(errorMessage, 'error', 'signup-error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      showUniqueToast('Email is required to resend verification', 'error', 'email-required-resend');
      return;
    }

    setIsResendingEmail(true);
    try {
      // Force a new token generation by using timestamp as a cache buster
      const timestamp = new Date().getTime();
      const currentOrigin = window.location.origin;
      
      // Use the resend method with the signup type to ensure a new verification token
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${currentOrigin}/welcome?t=${timestamp}`,
          // Remove any potential rate limiting by adding a unique identifier
          // This ensures Supabase treats each request as unique
          data: {
            timestamp,
            requestId: `${email}-${timestamp}-${Math.random().toString(36).substring(2, 15)}`
          }
        },
      });

      if (error) {
        // Special handling for rate limiting errors
        if (error.message.includes('rate') || error.message.includes('too many requests')) {
          throw new Error('Please wait a moment before requesting another verification email.');
        }
        throw error;
      }

      showUniqueToast('Verification email has been resent. Please check your inbox.', 'success', 'verification-resent');
    } catch (error: any) {
      showUniqueToast(error.message || 'Failed to resend verification email. Please try again later.', 'error', 'resend-error');
    } finally {
      setIsResendingEmail(false);
    }
  };

  // If signup is complete, show the confirmation message
  if (isSignupComplete) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8 bg-slate-800 p-8 rounded-xl shadow-lg text-center">
          <div>
            <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to home
            </Link>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Verify Your Email
            </h2>
            <div className="mt-8 flex justify-center">
              <div className="h-24 w-24 rounded-full bg-indigo-600/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-lg text-slate-300">
              We've sent a verification link to <span className="font-semibold text-indigo-400">{email}</span>
            </p>
            <p className="text-slate-400">
              Please check your email and click the link to verify your account. After verification, you'll be redirected to continue setting up your profile.
            </p>
            <p className="text-slate-400 text-sm">
              If you don't see the email in your inbox, please check your spam folder.
            </p>
          </div>
          <div className="mt-8 flex flex-col space-y-4">
            <Link
              to="/login"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              Proceed to Login
            </Link>
            <button
              onClick={handleResendVerification}
              disabled={isResendingEmail}
              className="w-full flex justify-center py-2 px-4 border border-indigo-600 rounded-md shadow-sm text-sm font-medium text-indigo-400 bg-transparent hover:bg-indigo-600/10 focus:outline-none"
            >
              {isResendingEmail ? 'Sending...' : 'Resend Verification Email'}
            </button>
            <button
              onClick={() => setIsSignupComplete(false)}
              className="w-full flex justify-center py-2 px-4 border border-slate-600 rounded-md shadow-sm text-sm font-medium text-white bg-transparent hover:bg-slate-700 focus:outline-none"
            >
              Back to Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-slate-800 p-8 rounded-xl shadow-lg">
        <div>
          <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to home
          </Link>
          <div className="flex items-center justify-center">
            <img 
              src="https://dlveiezovfooqbbfzfmo.supabase.co/storage/v1/object/public/Images//mtiger.png" 
              alt="MediaTiger Logo" 
              className="h-20 w-20"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors(prev => ({ ...prev, name: '' }));
                }}
                className={`mt-1 block w-full px-3 py-2 bg-slate-700 border ${
                  errors.name ? 'border-red-500' : 'border-slate-600'
                } rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors(prev => ({ ...prev, email: '' }));
                }}
                className={`mt-1 block w-full px-3 py-2 bg-slate-700 border ${
                  errors.email ? 'border-red-500' : 'border-slate-600'
                } rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors(prev => ({ ...prev, password: '' }));
                }}
                className={`mt-1 block w-full px-3 py-2 bg-slate-700 border ${
                  errors.password ? 'border-red-500' : 'border-slate-600'
                } rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                placeholder="Create a password"
              />
              {errors.password ? (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              ) : (
                <p className="mt-1 text-sm text-slate-400">
                  Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters
                </p>
              )}
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-300">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors(prev => ({ ...prev, confirmPassword: '' }));
                }}
                className={`mt-1 block w-full px-3 py-2 bg-slate-700 border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-slate-600'
                } rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}