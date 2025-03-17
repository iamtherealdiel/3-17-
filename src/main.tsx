import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <App />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                className: '!rounded-xl !p-4 !bg-opacity-95 backdrop-blur-sm shadow-lg',
                success: {
                  className: '!bg-green-600 !text-white !rounded-xl',
                  iconTheme: {
                    primary: 'white',
                    secondary: 'green',
                  },
                },
                error: {
                  className: '!bg-red-600 !text-white !rounded-xl',
                  iconTheme: {
                    primary: 'white',
                    secondary: 'red',
                  },
                },
                style: {
                  borderRadius: '0.75rem',
                  background: '#475569',
                  color: '#fff',
                  padding: '1rem',
                  animation: 'custom-enter 0.5s cubic-bezier(0.21, 1.02, 0.73, 1)'
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);