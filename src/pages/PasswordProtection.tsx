import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import StarlightBackground from '../components/StarlightBackground';

export default function PasswordProtection() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('site-access') === 'granted';
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Malima100-') {
      localStorage.setItem('site-access', 'granted');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
      const form = e.currentTarget as HTMLFormElement;
      form.classList.add('animate-shake');
      setTimeout(() => form.classList.remove('animate-shake'), 500);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      <StarlightBackground />
      <div 
        className={`
          relative max-w-md w-full space-y-8 bg-slate-800/80 backdrop-blur-sm p-8 rounded-xl shadow-lg text-center
          transform transition-all duration-500 ease-out
          ${isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}
          before:absolute before:inset-0 before:-z-10 before:rounded-xl before:bg-gradient-to-r before:from-indigo-500/20 before:via-purple-500/20 before:to-pink-500/20 before:animate-pulse before:blur-xl
          after:absolute after:inset-0 after:-z-10 after:rounded-xl after:bg-gradient-to-r after:from-indigo-500/10 after:via-purple-500/10 after:to-pink-500/10 after:blur-2xl after:animate-pulse
        `}
      >
        <div>
          <div className={`
            relative mx-auto h-16 w-16 flex items-center justify-center rounded-full
            bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600
            transform transition-transform duration-700 ease-out
            ${isVisible ? 'rotate-0 scale-100' : 'rotate-180 scale-50'}
            before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-indigo-500 before:to-purple-500 before:animate-pulse before:blur-md
            after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-r after:from-indigo-400 after:to-purple-400 after:animate-pulse after:blur-xl
            shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:shadow-[0_0_50px_rgba(79,70,229,0.7)] transition-shadow duration-300
          `}>
            <Lock className="h-8 w-8 text-white relative z-10" />
          </div>
          <h2 className={`
            mt-6 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200
            transform transition-all duration-500 delay-200
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            Opening Soon
          </h2>
          <p className={`
            mt-2 text-sm text-slate-300
            transform transition-all duration-500 delay-300
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `}>
            Enter the password to access the site
          </p>
        </div>
        <form 
          className={`
            mt-8 space-y-6
            transform transition-all duration-500 delay-400
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `} 
          onSubmit={handleSubmit}
        >
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-slate-600 bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-[0_0_10px_rgba(79,70,229,0.1)] focus:shadow-[0_0_20px_rgba(79,70,229,0.2)]"
              placeholder="Enter password"
            />
            {error && (
              <p className="mt-2 text-sm text-red-500 animate-fadeIn">{error}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
          >
            Enter Site
          </button>
        </form>
      </div>
    </div>
  );
}