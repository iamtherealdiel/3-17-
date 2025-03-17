import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, FileSearch, Bell, TrendingUp } from 'lucide-react';

export default function DigitalRights() {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to home
        </Link>
        
        <div className="bg-slate-800 rounded-lg p-8">
          <div className="flex items-center mb-6">
            <Shield className="h-12 w-12 text-indigo-500 mr-4" />
            <h1 className="text-4xl font-bold text-white">Digital Rights Management</h1>
          </div>
          
          <p className="text-xl text-slate-300 mb-8">
            Protect your intellectual property with our comprehensive digital rights management solution.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-slate-700 p-6 rounded-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              <Lock className="h-8 w-8 text-indigo-400 mb-4 relative z-10" />
              <h3 className="text-xl font-semibold text-white mb-2 relative z-10">Content Protection</h3>
              <p className="text-slate-300 relative z-10">Are you a big creator who wants to earn an extra stream of incoming by monetizing unauthorized reuploads? MediaTiger does all of the intensive labor for you while you sit back and earn.</p>
            </div>
            <div className="bg-slate-700 p-6 rounded-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              <FileSearch className="h-8 w-8 text-indigo-400 mb-4 relative z-10" />
              <h3 className="text-xl font-semibold text-white mb-2 relative z-10">Usage Tracking</h3>
              <p className="text-slate-300 relative z-10">Monitor where and how your content is being used across the internet.</p>
            </div>
            <div className="bg-slate-700 p-6 rounded-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              <TrendingUp className="h-8 w-8 text-indigo-400 mb-4 relative z-10" />
              <h3 className="text-xl font-semibold text-white mb-2 relative z-10">Strategic Growth</h3>
              <p className="text-slate-300 relative z-10">Not only can MediaTiger help you earn more, but it can strategically partner up with channels who reupload content to push out high quality shorts, boosting your overall image and brand in a positive way.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}