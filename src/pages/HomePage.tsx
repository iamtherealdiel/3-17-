import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Shield, ArrowRight, Users, Building2, Menu, X, DollarSign, GraduationCap, Award, Star, Lock } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import toast from 'react-hot-toast';
import { submitForm } from '../api/submitForm';

export default function HomePage() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  }, []);

  useEffect(() => {
    // Check if user has already visited the home page
    const hasVisitedHomePage = sessionStorage.getItem('hasVisitedHomePage') === 'true';
    
    if (hasVisitedHomePage) {
      // Skip animation for returning visitors
      setIsPageLoaded(true);
    } else {
      // Set page as loaded to trigger animations with a slight delay for first-time visitors
      const loadTimer = setTimeout(() => {
        setIsPageLoaded(true);
        // Mark that user has visited the home page
        sessionStorage.setItem('hasVisitedHomePage', 'true');
      }, 100);
      
      return () => {
        clearTimeout(loadTimer);
      };
    }
  }, []);

  const features = [
    {
      icon: <Play className="h-8 w-8 text-indigo-500" />,
      title: "Channel Management",
      description: "Streamline your content distribution across multiple channels with our advanced management system.",
      path: "/features/channel-management"
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-500" />,
      title: "Digital Rights",
      description: "Protect your intellectual property with our comprehensive digital rights management solution.",
      path: "/features/digital-rights"
    },
    {
      icon: <DollarSign className="h-8 w-8 text-indigo-500" />,
      title: "Boutique Monetization",
      description: "Maximize your revenue potential with personalized, innovative monetization strategies tailored to your content.",
      path: "/features/boutique-monetization"
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-indigo-500" />,
      title: "Creator School",
      description: "Are you a beginner that wants to start creating and making money but don't know where to start? MediaTiger can help guide you from start to finish.",
      path: "/features/channel-management",
      comingSoon: true
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors = {
      name: '',
      email: '',
      message: ''
    };
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
      }
    }

    // Message validation
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit the form data to our Supabase function
      const result = await submitForm({
        name: formData.name,
        email: formData.email,
        message: formData.message
      });
      
      if (result.success) {
        toast.success(result.message);
        
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          message: ''
        });
        
        // Also send an email notification for immediate feedback
        const subject = encodeURIComponent(`Website Contact Form - ${formData.name}`);
        const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`);
        
        // Wait a moment before redirecting to email
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.href = `mailto:info@mediatiger.co?subject=${subject}&body=${body}`;
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error('Failed to send your message. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img 
                src="https://dlveiezovfooqbbfzfmo.supabase.co/storage/v1/object/public/Images//mtiger.png" 
                alt="Media Tiger Logo" 
                className="h-8 w-8 mr-2"
              />
              <span className="text-xl font-bold text-slate-900 dark:text-white">MediaTiger</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
              <a href="#about" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">About</a>
              <a href="#contact" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Contact</a>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <div className="flex items-center space-x-2">
                  <span className="text-slate-600 dark:text-slate-400">Already a user?</span>
                  <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">Log in</Link>
                </div>
                <Link
                  to="/signup"
                  className="relative px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300
                    before:absolute before:inset-0 before:rounded-md before:bg-indigo-600 before:z-[-1]
                    before:animate-pulse before:blur-lg
                    after:absolute after:inset-0 after:rounded-md after:bg-gradient-to-r 
                    after:from-indigo-600 after:via-purple-600 after:to-indigo-600
                    after:z-[-1] after:blur-xl after:animate-pulse
                    shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#features"
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#about"
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </a>
              <a
                href="#contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </a>
              <div className="pt-4 pb-3 border-t border-slate-200 dark:border-slate-700">
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 relative
                      before:absolute before:inset-0 before:rounded-md before:bg-indigo-600 before:z-[-1]
                      before:animate-pulse before:blur-lg
                      after:absolute after:inset-0 after:rounded-md after:bg-gradient-to-r 
                      after:from-indigo-600 after:via-purple-600 after:to-indigo-600
                      after:z-[-1] after:blur-xl after:animate-pulse
                      shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header/Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -left-24 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-40 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          
          {/* Animated grid lines */}
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full bg-[linear-gradient(to_right,#6366f180_1px,transparent_1px),linear-gradient(to_bottom,#6366f180_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          </div>
        </div>
        
        <div
          className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-20 text-center z-10 transition-opacity duration-800 ease-in-out ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="relative">
            <h1 
              className={`text-5xl md:text-7xl font-bold mb-6 relative transition-all duration-700 ease-out ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: '200ms' }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400">
                The Ultimate Media Hub
              </span>
              <br />
              <span className="text-slate-900 dark:text-white">For Creators</span>
              
              {/* Animated checkmark */}
              <div className="absolute -top-10 -left-10 w-20 h-20 text-indigo-500/20 dark:text-indigo-400/20 transform rotate-12">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    strokeDasharray="75"
                    strokeDashoffset="75"
                    className={`${isPageLoaded ? 'animate-[dash_2s_ease-out_forwards]' : ''}`}
                  />
                  <path 
                    d="M8.5 12.5L10.5 14.5L15.5 9.5" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    strokeDasharray="20"
                    strokeDashoffset="20"
                    className={`${isPageLoaded ? 'animate-[dash_2s_ease-out_0.7s_forwards]' : ''}`}
                  />
                </svg>
              </div>
              
              {/* Animated cube */}
              <div className="absolute -bottom-5 -right-10 w-16 h-16 text-purple-500/20 dark:text-purple-400/20 transform -rotate-12">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M21 7.5L12 2L3 7.5" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    strokeDasharray="30"
                    strokeDashoffset="30"
                    className={`${isPageLoaded ? 'animate-[dash_1.5s_ease-in-out_0.2s_forwards]' : ''}`}
                  />
                  <path 
                    d="M21 7.5V16.5L12 22" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    strokeDasharray="30"
                    strokeDashoffset="30"
                    className={`${isPageLoaded ? 'animate-[dash_1.5s_ease-in-out_0.5s_forwards]' : ''}`}
                  />
                  <path 
                    d="M12 22L3 16.5V7.5" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    strokeDasharray="30"
                    strokeDashoffset="30"
                    className={`${isPageLoaded ? 'animate-[dash_1.5s_ease-in-out_0.8s_forwards]' : ''}`}
                  />
                  <path 
                    d="M21 7.5L12 13M12 13L3 7.5M12 13V22" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    strokeDasharray="40"
                    strokeDashoffset="40"
                    className={`${isPageLoaded ? 'animate-[dash_1.5s_ease-in-out_1.1s_forwards]' : ''}`}
                  />
                </svg>
              </div>
            </h1>
            
            <p 
              className={`text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed transition-all duration-700 ease-out ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: '400ms' }}
            >
              <span className="relative inline-block">
                Starting out on your journey 
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/50 to-purple-500/50 transform scale-x-0 group-hover:scale-x-100"></span>
              </span>{" "}
              or already a{" "}
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">seasoned veteran</span>?{" "}
              MediaTiger provides and elevates creators with{" "}
              <span className="relative">
                <span className="relative z-10">exceptional tools</span>
                <span className="absolute bottom-0 left-0 w-full h-2 bg-indigo-500/30 dark:bg-indigo-400/30 transform -rotate-1"></span>
              </span>{" "}
              along with{" "}
              <span className="relative">
                <span className="relative z-10">unmatched quality</span>
                <span className="absolute bottom-0 left-0 w-full h-2 bg-purple-500/30 dark:bg-purple-400/30 transform rotate-1"></span>
              </span>.
            </p>
            
            <div 
              className={`mt-10 flex flex-col md:flex-row items-center justify-center transition-all duration-700 ease-out ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: '600ms' }}
            >
              <Link
                to="/signup"
                className="relative inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300
                  before:absolute before:inset-0 before:rounded-md before:bg-indigo-600 before:z-[-1]
                  before:animate-pulse before:blur-lg
                  after:absolute after:inset-0 after:rounded-md after:bg-gradient-to-r 
                  after:from-indigo-600 after:via-purple-600 after:to-indigo-600
                  after:z-[-1] after:blur-xl after:animate-pulse
                  shadow-[0_0_20px_rgba(99,102,241,0.6)] hover:shadow-[0_0_30px_rgba(99,102,241,0.8)]
                  scale-105 group mb-4 md:mb-0"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Stats counter */}
            <div 
              className={`mt-20 flex flex-wrap justify-center gap-8 md:gap-12 transition-all duration-700 ease-out ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: '800ms' }}
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">50+</div>
                <div className="text-slate-600 dark:text-slate-400 mt-1">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">10K+</div>
                <div className="text-slate-600 dark:text-slate-400 mt-1">Creators</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">1M+</div>
                <div className="text-slate-600 dark:text-slate-400 mt-1">Content Items</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">$10M+</div>
                <div className="text-slate-600 dark:text-slate-400 mt-1">Paid Out</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-16">
        <div className="text-center mb-8">
          <p className="relative inline-block text-sm text-slate-600 dark:text-slate-400 px-4 py-2 rounded-full
            before:absolute before:inset-0 before:rounded-full before:bg-slate-200 dark:before:bg-slate-700 before:z-[-1]
            before:animate-pulse before:blur-sm
            after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-r 
            after:from-slate-200 after:to-slate-300 dark:after:from-slate-700 dark:after:to-slate-600
            after:z-[-1] after:blur-md after:animate-pulse
            shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            Click on any feature to learn more
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => !feature.comingSoon && navigate(feature.path)}
              className={`relative bg-slate-100 dark:bg-slate-800 p-6 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 ${!feature.comingSoon ? 'cursor-pointer' : ''} group
                before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r
                before:from-slate-100/80 before:to-slate-200/80 dark:before:from-slate-800/80 dark:before:to-slate-700/80
                before:z-[-1] before:animate-pulse before:blur-sm
                after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-r
                after:from-indigo-500/20 after:via-purple-500/20 after:to-indigo-500/20
                after:z-[-1] after:blur-xl after:animate-pulse
                shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:shadow-[0_0_30px_rgba(79,70,229,0.4)]
                transform hover:scale-105 hover:rotate-1`}
            >
              <div className="mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
                {feature.title}
                {feature.comingSoon ? (
                  <span className="text-xs font-medium bg-amber-500/20 text-amber-500 py-1 px-2 rounded-full">Coming Soon</span>
                ) : (
                  <ArrowRight className="h-5 w-5 text-indigo-600 dark:text-indigo-400 transform group-hover:translate-x-1 transition-transform" />
                )}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="bg-white dark:bg-slate-900 py-20 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="relative inline-block text-3xl font-bold text-slate-900 dark:text-white mb-4 px-6 py-2
              before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r
              before:from-indigo-500/10 before:via-purple-500/10 before:to-indigo-500/10
              before:z-[-1] before:animate-pulse before:blur-lg
              after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-r
              after:from-indigo-500/5 after:via-purple-500/5 after:to-indigo-500/5
              after:z-[-1] after:blur-xl after:animate-pulse">
              About Us
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We're a team of passionate individuals dedicated to revolutionizing media management for creators worldwide.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative bg-slate-100 dark:bg-slate-800 p-6 rounded-lg group
              hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300
              before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r
              before:from-slate-100/80 before:to-slate-200/80 dark:before:from-slate-800/80 dark:before:to-slate-700/80
              before:z-[-1] before:animate-pulse before:blur-sm
              after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-r
              after:from-indigo-500/20 after:via-purple-500/20 after:to-indigo-500/20
              after:z-[-1] after:blur-xl after:animate-pulse
              shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:shadow-[0_0_30px_rgba(79,70,229,0.4)]
              transform hover:scale-105 hover:rotate-1">
              <Users className="h-12 w-12 text-indigo-500 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Our Team</h3>
              <p className="text-slate-600 dark:text-slate-300">
                A diverse group of experts in media, technology, and content creation, working together to build the future of digital media management.
              </p>
            </div>
            <div className="relative bg-slate-100 dark:bg-slate-800 p-6 rounded-lg group
              hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300
              before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r
              before:from-slate-100/80 before:to-slate-200/80 dark:before:from-slate-800/80 dark:before:to-slate-700/80
              before:z-[-1] before:animate-pulse before:blur-sm
              after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-r
              after:from-indigo-500/20 after:via-purple-500/20 after:to-indigo-500/20
              after:z-[-1] after:blur-xl after:animate-pulse
              shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:shadow-[0_0_30px_rgba(79,70,229,0.4)]
              transform hover:scale-105 hover:rotate-1">
              <Building2 className="h-12 w-12 text-indigo-500 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Our Mission</h3>
              <p className="text-slate-600 dark:text-slate-300">
                To empower creators with cutting-edge tools and technology, making media management seamless and efficient.
              </p>
            </div>
            <div className="relative bg-slate-100 dark:bg-slate-800 p-6 rounded-lg group
              hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300
              before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r
              before:from-slate-100/80 before:to-slate-200/80 dark:before:from-slate-800/80 dark:before:to-slate-700/80
              before:z-[-1] before:animate-pulse before:blur-sm
              after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-r
              after:from-indigo-500/20 after:via-purple-500/20 after:to-indigo-500/20
              after:z-[-1] after:blur-xl after:animate-pulse
              shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:shadow-[0_0_30px_rgba(79,70,229,0.4)]
              transform hover:scale-105 hover:rotate-1">
              <Users className="h-12 w-12 text-indigo-500 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Global Impact</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Supporting creators across 50+ countries, helping them reach wider audiences and achieve their creative goals.
              </p>
            </div>
            <div className="relative bg-slate-100 dark:bg-slate-800 p-6 rounded-lg group
              hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300
              before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r
              before:from-slate-100/80 before:to-slate-200/80 dark:before:from-slate-800/80 dark:before:to-slate-700/80
              before:z-[-1] before:animate-pulse before:blur-sm
              after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-r
              after:from-indigo-500/20 after:via-purple-500/20 after:to-indigo-500/20
              after:z-[-1] after:blur-xl after:animate-pulse
              shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:shadow-[0_0_30px_rgba(79,70,229,0.4)]
              transform hover:scale-105 hover:rotate-1">
              <Star className="h-12 w-12 text-indigo-500 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Why Choose MediaTiger?</h3>
              <p className="text-slate-600 dark:text-slate-300">
                At MediaTiger, the team goes up and beyond to give unique benefits found nowhere else.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="bg-white dark:bg-slate-900 py-20 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="relative inline-block text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400 mb-4 px-6 py-2
              before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r
              before:from-indigo-500/10 before:via-purple-500/10 before:to-indigo-500/10
              before:z-[-1] before:animate-pulse before:blur-lg
              after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-r
              after:from-indigo-500/5 after:via-purple-500/5 after:to-indigo-500/5
              after:z-[-1] after:blur-xl after:animate-pulse">
              Contact Us
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Have questions? We're here to help. Reach out to our team by filling out the form below.
            </p>
            <p className="mt-6 inline-flex items-center px-6 py-3 rounded-full bg-slate-100 dark:bg-slate-800 text-lg text-slate-600 dark:text-slate-300 shadow-lg hover:shadow-xl transition-shadow">
              <svg className="w-5 h-5 mr-2 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="mr-2">Email us directly at</span>
              <a href="mailto:support@mediatiger.co" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                support@mediatiger.co
              </a>
            </p>
          </div>
          
          {/* Contact Form */}
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-slate-100 dark:bg-slate-800 p-8 rounded-2xl
              before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r
              before:from-slate-100/80 before:to-slate-200/80 dark:before:from-slate-800/80 dark:before:to-slate-700/80
              before:z-[-1] before:animate-pulse before:blur-sm
              after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-r
              after:from-indigo-500/20 after:via-purple-500/20 after:to-indigo-500/20
              after:z-[-1] after:blur-xl after:animate-pulse
              shadow-[0_0_30px_rgba(79,70,229,0.2)] hover:shadow-[0_0_40px_rgba(79,70,229,0.3)] transition-shadow duration-500">
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-700 border ${
                      formErrors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-white hover:border-indigo-500 dark:hover:border-indigo-500`}
                    placeholder="John Doe"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-700 border ${
                      formErrors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-white hover:border-indigo-500 dark:hover:border-indigo-500`}
                    placeholder="your.email@example.com"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-700 border ${
                      formErrors.message ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-white hover:border-indigo-500 dark:hover:border-indigo-500 resize-none`}
                    placeholder="How can we help you?"
                  ></textarea>
                  {formErrors.message && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.message}</p>
                  )}
                </div>
                
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-500
                      before:absolute before:inset-0 before:rounded-md before:bg-indigo-600 before:z-[-1]
                      before:animate-pulse before:blur-lg
                      after:absolute after:inset-0 after:rounded-md after:bg-gradient-to-r 
                      after:from-indigo-600 after:via-purple-600 after:to-indigo-600
                      after:z-[-1] after:blur-xl after:animate-pulse
                      shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]
                      disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <span className="relative z-10 flex items-center">
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </span>
                  </button>
                </div>
                
                <div className="text-xs text-center space-y-2">
                  <p className="text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-700/50 p-3 rounded-lg">
                    By submitting this form, you agree to our privacy policy and terms of service.
                    Your information will be used solely to respond to your inquiry.
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-700/50 p-3 rounded-lg">
                    You can also use this form to send feedback about our user support experiences.
                    We value your input and continuously work to improve our services.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-100 dark:bg-slate-800 py-8 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            © MediaTiger 2025 All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}