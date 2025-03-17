import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, Zap, Map, Settings, Network, Signal, Server, CloudCog, Search } from 'lucide-react';

export default function GlobalDistribution() {
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
            <Globe className="h-12 w-12 text-indigo-500 mr-4" />
            <h1 className="text-4xl font-bold text-white">Global Distribution</h1>
          </div>
          
          <p className="text-xl text-slate-300 mb-8">
            Reach audiences worldwide with our robust content distribution network.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-slate-700 p-6 rounded-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              <Zap className="h-8 w-8 text-indigo-400 mb-4 relative z-10" />
              <h3 className="text-xl font-semibold text-white mb-2 relative z-10">Fast Delivery</h3>
              <p className="text-slate-300 relative z-10">Lightning-fast content delivery through our global CDN infrastructure.</p>
            </div>
            <div className="bg-slate-700 p-6 rounded-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              <Map className="h-8 w-8 text-indigo-400 mb-4 relative z-10" />
              <h3 className="text-xl font-semibold text-white mb-2 relative z-10">Global Reach</h3>
              <p className="text-slate-300 relative z-10">200+ points of presence ensuring optimal content delivery worldwide.</p>
            </div>
            <div className="bg-slate-700 p-6 rounded-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              <Settings className="h-8 w-8 text-indigo-400 mb-4 relative z-10" />
              <h3 className="text-xl font-semibold text-white mb-2 relative z-10">Format Optimization</h3>
              <p className="text-slate-300 relative z-10">Automatic format conversion for different devices and bandwidths.</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-white mb-4">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-slate-700/60 p-4 rounded-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                <Network className="h-5 w-5 text-indigo-400 mb-2 relative z-10" />
                <p className="text-slate-300 font-medium relative z-10">Global CDN with 200+ locations</p>
              </div>
              <div className="bg-slate-700/60 p-4 rounded-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                <Signal className="h-5 w-5 text-indigo-400 mb-2 relative z-10" />
                <p className="text-slate-300 font-medium relative z-10">Automatic region optimization</p>
              </div>
              <div className="bg-slate-700/60 p-4 rounded-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                <Server className="h-5 w-5 text-indigo-400 mb-2 relative z-10" />
                <p className="text-slate-300 font-medium relative z-10">Multi-format video support</p>
              </div>
              <div className="bg-slate-700/60 p-4 rounded-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-amber-500/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                <Zap className="h-5 w-5 text-indigo-400 mb-2 relative z-10" />
                <p className="text-slate-300 font-medium relative z-10">Adaptive bitrate streaming</p>
              </div>
              <div className="bg-slate-700/60 p-4 rounded-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                <Search className="h-5 w-5 text-indigo-400 mb-2 relative z-10" />
                <p className="text-slate-300 font-medium relative z-10">Real-time traffic analytics</p>
              </div>
              <div className="bg-slate-700/60 p-4 rounded-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                <CloudCog className="h-5 w-5 text-indigo-400 mb-2 relative z-10" />
                <p className="text-slate-300 font-medium relative z-10">DDoS protection</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}