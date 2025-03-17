import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced validation with detailed error messages
if (!supabaseUrl) {
  const error = 'Missing Supabase URL. Please check your .env configuration.';
  console.error('Supabase URL is missing');
  toast.error(error);
  throw new Error(error);
}

if (!supabaseAnonKey) {
  const error =
    'Missing Supabase Anon Key. Please check your .env configuration.';
  console.error('Supabase Anon Key is missing');
  toast.error(error);
  throw new Error(error);
}

// Create Supabase client with enhanced options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Use PKCE flow for better security
    // Disable the built-in throttling to allow multiple requests
    dangerouslyAllowBrowserRememberMe: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'mediatiger-web',
    },
  },
});

// Enhanced connection test with detailed error reporting

// Utility function to check if error is CORS-related
export const isCORSError = (error: any) => {
  return (
    error.message?.includes('CORS') ||
    error.code === 'CORS_ERROR' ||
    (error.name === 'TypeError' && error.message === 'Failed to fetch')
  );
};

// Run initial connection test
console.log('Initializing Supabase connection...');
