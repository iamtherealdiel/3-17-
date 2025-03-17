import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { validateEmail } from '../utils/validation';

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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  // Get the redirect path from location state, default to dashboard
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const validateForm = (): boolean => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

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
      await signIn(email, password);
      // Note: Success toast is now handled in AuthContext to avoid duplicates
      // Redirect to the originally requested page
      navigate(from, { replace: true });
    } catch (error: any) {
      const errorMessage = error.message || 'Invalid email or password';
      if (errorMessage.includes('credentials')) {
        setErrors({
          email: 'Invalid email or password',
          password: 'Invalid email or password'
        });
      } else {
        showUniqueToast(errorMessage, 'error', 'login-error');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Or{' '}
            <Link to="/signup" className="font-medium text-indigo-400 hover:text-indigo-300">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors(prev => ({ ...prev, password: '' }));
                }}
                className={`mt-1 block w-full px-3 py-2 bg-slate-700 border ${
                  errors.password ? 'border-red-500' : 'border-slate-600'
                } rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-600 rounded bg-slate-700"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-400 hover:text-indigo-300">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}