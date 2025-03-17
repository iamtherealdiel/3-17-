import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';;

export default function Welcome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract timestamp from URL if present (for email verification tracking)
  const searchParams = new URLSearchParams(location.search);
  const timestamp = searchParams.get('t');

  useEffect(() => {
    // If the user is already logged in and verified, redirect to dashboard
    if (user?.email_confirmed_at) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 relative overflow-hidden">      
      <div className="max-w-md w-full space-y-8 bg-slate-800/80 backdrop-blur-sm p-8 rounded-xl shadow-lg text-center z-10 relative">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-indigo-600/20 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-indigo-400" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            Email Verified!
          </h1>
          
          <p className="text-xl text-slate-300 mb-8">
            Thank you for confirming your email address
          </p>
          
          <div className="bg-slate-700/50 rounded-lg p-6 mb-8 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-white mb-4">
              Your account has been successfully activated!
            </h2>
            <p className="text-slate-300">
              You're now ready to access all the features of MediaTiger. 
              Sign in to your account to get started on your digital media journey.
            </p>
          </div>
          
          <Link
            to="/login"
            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors group"
          >
            Continue to Login
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <div className="mt-6 text-sm text-slate-400">
            <p>If you have any questions or need assistance,</p>
            <p>please contact us at <a href="mailto:support@mediatiger.co" className="text-indigo-400 hover:underline">support@mediatiger.co</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}