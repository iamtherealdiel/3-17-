import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart, PieChart, TrendingUp, Target } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to home
        </Link>
        
        <div className="bg-slate-800 rounded-lg p-8">
          <div className="flex items-center mb-6">
            <BarChart className="h-12 w-12 text-indigo-500 mr-4" />
            <h1 className="text-4xl font-bold text-white">Analytics</h1>
          </div>
          
          <p className="text-xl text-slate-300 mb-8">
            Make data-driven decisions with our advanced analytics and reporting tools.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-slate-700 p-6 rounded-lg">
              <PieChart className="h-8 w-8 text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Audience Insights</h3>
              <p className="text-slate-300">Deep understanding of your audience demographics and behavior.</p>
            </div>
            <div className="bg-slate-700 p-6 rounded-lg">
              <TrendingUp className="h-8 w-8 text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Performance Metrics</h3>
              <p className="text-slate-300">Track engagement, revenue, and growth across all channels.</p>
            </div>
            <div className="bg-slate-700 p-6 rounded-lg">
              <Target className="h-8 w-8 text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Custom Reports</h3>
              <p className="text-slate-300">Create tailored reports and dashboards for your specific needs.</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-white mb-4">Key Features</h2>
            <ul className="text-slate-300 space-y-2">
              <li>Real-time analytics dashboard</li>
              <li>Custom report builder</li>
              <li>Automated performance alerts</li>
              <li>Revenue tracking and forecasting</li>
              <li>Audience segmentation</li>
              <li>Export capabilities in multiple formats</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}