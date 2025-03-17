import React, { useState } from 'react';
import { X, Check, LogOut, Copy, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

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

interface OnboardingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userEmail: string;
}

export default function OnboardingPopup({ isOpen, onClose, userId, userEmail }: OnboardingPopupProps) {
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState({
    channelManagement: false,
    musicPartnerProgram: false,
    digitalRights: false,
    other: false
  });
  const [otherInterest, setOtherInterest] = useState('');
  const [digitalRightsInfo, setDigitalRightsInfo] = useState({
    website: '',
    youtubeChannels: ['']
  });
  const [channelInfo, setChannelInfo] = useState({
    name: '',
    email: userEmail || '',
    youtubeLinks: [''],
    verificationCode: '',
    verifiedChannels: {} as Record<string, boolean>
  });
  const [showChannelPrompt, setShowChannelPrompt] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationCopied, setVerificationCopied] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Generate a random verification code when component mounts
  React.useEffect(() => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    setChannelInfo(prev => ({ ...prev, verificationCode: code }));
  }, []);

  const handleCopyVerification = () => {
    navigator.clipboard.writeText(channelInfo.verificationCode);
    setVerificationCopied(true);
    setTimeout(() => setVerificationCopied(false), 2000);
  };

  const verifyChannel = async (channelUrl: string) => {
    setIsVerifying(true);
    try {
      // First check if channel is already registered
      const { data: existingRequest, error: checkError } = await supabase
        .from('user_requests')
        .select('id')
        .filter('youtube_links', 'cs', `{"${channelUrl}"}`)
        .not('user_id', 'eq', userId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingRequest) {
        showUniqueToast('This YouTube channel is already registered with another account', 'error', 'channel-exists');
        setChannelInfo(prev => ({
          ...prev,
          verifiedChannels: {
            ...prev.verifiedChannels,
            [channelUrl]: false
          }
        }));
        return;
      }

      // Simulate API call to check channel description
      // In production, this would be a real API call to YouTube's API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, randomly verify
      const isVerified = Math.random() > 0.5;
      
      setChannelInfo(prev => ({
        ...prev,
        verifiedChannels: {
          ...prev.verifiedChannels,
          [channelUrl]: isVerified
        }
      }));

      if (isVerified) {
        showUniqueToast('Channel verified successfully!', 'success', 'channel-verified');
      } else {
        showUniqueToast('Verification code not found in channel description', 'error', 'verification-failed');
      }
    } catch (error) {
      showUniqueToast('Failed to verify channel', 'error', 'verification-error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      showUniqueToast('Failed to sign out', 'error', 'signout-error');
    }
  };

  const handleInterestChange = (interest: keyof typeof interests) => {
    setInterests(prev => ({
      ...prev,
      [interest]: !prev[interest]
    }));
    
    // Show channel prompt when Channel Management is selected
    if (interest === 'channelManagement') {
      setShowChannelPrompt(prev => !prev);
    }
  };

  const handleChannelInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('youtubeLink')) {
      const index = parseInt(name.replace('youtubeLink', ''));
      setChannelInfo(prev => ({
        ...prev,
        youtubeLinks: prev.youtubeLinks.map((link, i) => i === index ? value : link)
      }));
    } else {
      setChannelInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addChannelField = () => {
    setChannelInfo(prev => ({
      ...prev,
      youtubeLinks: [...prev.youtubeLinks, '']
    }));
  };

  const removeChannelField = (index: number) => {
    setChannelInfo(prev => ({
      ...prev,
      youtubeLinks: prev.youtubeLinks.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitInterests = async () => {
    // Check if at least one interest is selected
    if (!interests.channelManagement && !interests.musicPartnerProgram && !interests.digitalRights && !interests.other) {
      showUniqueToast('Please select at least one option', 'error', 'interests-required');
      return;
    }

    // If other is selected but no text is provided
    if (interests.other && !otherInterest.trim()) {
      showUniqueToast('Please specify your other interest', 'error', 'other-interest-required');
      return;
    }

    // If Channel Management or Music Partner Program is selected, validate YouTube URLs and verification
    if ((interests.channelManagement || interests.musicPartnerProgram) && !channelInfo.youtubeLinks[0]) {
      showUniqueToast('Please provide your YouTube channel URL', 'error', 'youtube-required');
      return;
    }

    // Check if all channels are verified
    if ((interests.channelManagement || interests.musicPartnerProgram)) {
      const unverifiedChannels = channelInfo.youtubeLinks.filter(link => 
        link.trim() && !channelInfo.verifiedChannels[link]
      );
      
      if (unverifiedChannels.length > 0) {
        showUniqueToast('Please verify all YouTube channels before continuing', 'error', 'unverified-channels');
        return;
      }
    }
    
    // Validate Digital Rights fields if selected
    if (interests.digitalRights) {
      if (!digitalRightsInfo.website.trim()) {
        showUniqueToast('Please provide your website URL', 'error', 'website-required');
        return;
      }
      if (!digitalRightsInfo.youtubeChannels[0]?.trim()) {
        showUniqueToast('Please provide your YouTube channel URL', 'error', 'youtube-required');
        return;
      }
    }

    // Proceed to step 2 for additional info
    if (((interests.channelManagement || interests.musicPartnerProgram) && channelInfo.youtubeLinks[0]) || interests.digitalRights) {
      setStep(2);
    } else {
      // If only "other" is selected, submit directly
      await handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Create submission data
      const selectedInterests = Object.entries(interests)
        .filter(([_, selected]) => selected)
        .map(([interest, _]) => interest);
      
      const { error } = await supabase
        .from('user_requests')
        .insert([
          {
            user_id: userId,
            interests: selectedInterests,
            other_interest: interests.other ? otherInterest : null,
            website: interests.digitalRights ? digitalRightsInfo.website : null,
            youtube_channel: interests.digitalRights ? digitalRightsInfo.youtubeChannels[0] : null,
            name: channelInfo.name || user?.user_metadata?.full_name || '',
            email: channelInfo.email || userEmail,
            youtube_links: channelInfo.youtubeLinks.filter(link => link.trim() !== ''),
            status: 'pending'
          }
        ]);

      if (error) {
        console.error('Error submitting request:', error);
        throw new Error(error.message);
      }

      // Also update user metadata to mark onboarding as complete
      await supabase.auth.updateUser({
        data: {
          onboarding_complete: true
        }
      });

      // Show submission popup
      const popup = document.createElement('div');
      popup.className = 'fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900';
      popup.innerHTML = `
        <div class="bg-slate-800 rounded-xl p-12 max-w-xl w-full text-center shadow-2xl border-2 border-indigo-500/20">
          <div class="w-20 h-20 mx-auto mb-8 rounded-full bg-indigo-600/20 flex items-center justify-center">
            <svg class="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-3xl font-bold text-white mb-6">Application Submitted</h3>
          <div class="mb-8">
            <div class="inline-flex items-center px-4 py-2 rounded-full text-base font-medium bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden shadow-lg" style="background-size: 200% 100%; animation: gradient-wave 3s ease infinite;">
              Pending
            </div>
          </div>
          <p class="text-slate-300 text-lg mb-4">Your application is under review.</p>
          <p class="text-slate-400">You will be automatically redirected to your dashboard once your application is approved.</p>
        </div>
      `;
      document.body.appendChild(popup);

      // Close the onboarding popup after a short delay
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error: any) {
      showUniqueToast(error.message || 'Failed to submit your information. Please try again.', 'error', 'onboarding-error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateStep2 = () => {
    if (!channelInfo.name.trim()) {
      showUniqueToast('Please enter your name', 'error', 'name-required');
      return false;
    }
    if (!channelInfo.email.trim()) {
      showUniqueToast('Please enter your email', 'error', 'email-required');
      return false;
    }
    if (!channelInfo.youtubeLinks[0]?.trim()) {
      showUniqueToast('Please enter your YouTube channel link', 'error', 'youtube-required');
      return false;
    }
    return true;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait"> 
      <div className="fixed inset-0 bg-slate-900 z-50 flex items-center justify-center p-4 overflow-hidden">
        {/* Floating Cubes Background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 bg-indigo-500/10 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
                transform: `rotate(45deg)`,
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-2xl max-w-md w-full flex flex-col border border-slate-700 relative z-10"
        >
          {/* Header */}
          <div className="bg-slate-700 px-6 py-4 flex items-center justify-center border-b border-slate-600">
            <h2 className="text-xl font-bold text-white">
              {step === 1 ? 'Welcome to MediaTiger!' : 'Channel Information'}
            </h2>
          </div>

          {/* Content */}
          <div className="px-6 py-5 overflow-y-auto max-h-[calc(100vh-16rem)]">
            {step === 1 ? (
              <>
                <p className="text-slate-300 mb-5">
                  Thank you for verifying your email. To help us serve you better, please let us know what you're here for:
                </p>
                
                <div className="space-y-3 mb-6">
                  <div 
                    className={`p-3 rounded-lg cursor-pointer flex items-center ${
                      interests.channelManagement 
                        ? 'bg-indigo-600/20 border border-indigo-600/30' 
                        : 'bg-slate-700 border border-slate-600 hover:bg-slate-600'
                    }`}
                    onClick={() => handleInterestChange('channelManagement')}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${
                      interests.channelManagement 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-600'
                    }`}>
                      {interests.channelManagement && <Check className="h-4 w-4" />}
                    </div>
                    <span className="text-white">Channel Management</span>
                  </div>
                  
                  <div 
                    className={`p-3 rounded-lg cursor-pointer flex items-center ${
                      interests.musicPartnerProgram 
                        ? 'bg-indigo-600/20 border border-indigo-600/30' 
                        : 'bg-slate-700 border border-slate-600 hover:bg-slate-600'
                    }`}
                    onClick={() => handleInterestChange('musicPartnerProgram')}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${
                      interests.musicPartnerProgram 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-600'
                    }`}>
                      {interests.musicPartnerProgram && <Check className="h-4 w-4" />}
                    </div>
                    <span className="text-white">Music Partner Program</span>
                  </div>
                  
                  {/* Channel URL Prompt - Show if either program is selected */}
                  {(interests.channelManagement || interests.musicPartnerProgram) && (
                    <div className="mt-2 pl-8 animate-fadeIn">
                      {channelInfo.youtubeLinks.map((link, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            name={`youtubeLink${index}`}
                            value={link}
                            onChange={handleChannelInfoChange}
                            placeholder="Enter your YouTube channel URL"
                            className="flex-1 bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          {index > 0 && (
                            <button
                              onClick={() => removeChannelField(index)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-slate-600 rounded transition-colors"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={addChannelField}
                        type="button"
                        className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 flex items-center"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Add another channel
                      </button>
                    
                      {/* Verification Section */}
                      <div className="mt-4 bg-slate-800/70 rounded-lg p-4 border border-slate-600">
                        <h3 className="text-sm font-medium text-slate-300 mb-2">Verification</h3>
                        <p className="text-xs text-slate-400 mb-4">
                          On the Youtube website, go to View your channel &gt; Customize channel &gt;
                          Scroll down to &quot;Description&quot;, enter the verification code &gt; Publish in the top right corner.
                          This is to ensure that you own the channel you link. You can remove it once your application 
                          has been accepted.
                        </p>
                        
                        <div className="flex items-center space-x-2 bg-slate-700/70 p-2 rounded-md">
                          <code className="text-indigo-400 flex-1 font-mono">
                            {channelInfo.verificationCode}
                          </code>
                          <button
                            onClick={handleCopyVerification}
                            className="p-1 hover:bg-slate-600 rounded transition-colors"
                            title="Copy verification code"
                          >
                            {verificationCopied ? (
                              <CheckCircle className="h-5 w-5 text-green-400" />
                            ) : (
                              <Copy className="h-5 w-5 text-slate-400" />
                            )}
                          </button>
                        </div>
                        
                        {/* Verification Status */}
                        <div className="mt-4 space-y-2">
                          {channelInfo.youtubeLinks.map((link, index) => (
                            link.trim() && (
                              <div key={index} className="flex items-center justify-between bg-slate-700/50 p-2 rounded">
                                <div className="flex items-center space-x-2 flex-1">
                                  {channelInfo.verifiedChannels[link] === false ? (
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-red-500/20 text-red-400">
                                      <X className="h-4 w-4" />
                                    </div>
                                  ) : channelInfo.verifiedChannels[link] === true ? (
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-green-500/20 text-green-400">
                                      <Check className="h-4 w-4" />
                                    </div>
                                  ) : null}
                                  <span className="text-sm text-slate-300 truncate max-w-[200px]">{link}</span>
                                </div>
                                <button
                                  onClick={() => verifyChannel(link)}
                                  disabled={isVerifying}
                                  className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                >
                                  {isVerifying ? 'Checking...' : 'Verify'}
                                </button>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div 
                    className={`p-3 rounded-lg cursor-pointer flex items-center ${
                      interests.digitalRights 
                        ? 'bg-indigo-600/20 border border-indigo-600/30' 
                        : 'bg-slate-700 border border-slate-600 hover:bg-slate-600'
                    }`}
                    onClick={() => handleInterestChange('digitalRights')}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${
                      interests.digitalRights 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-600'
                    }`}>
                      {interests.digitalRights && <Check className="h-4 w-4" />}
                    </div>
                    <span className="text-white">Digital Rights</span>
                  </div>
                  
                  {/* Digital Rights Fields */}
                  {interests.digitalRights && (
                    <div className="mt-2 pl-8 space-y-3 animate-fadeIn">
                      <div>
                        <label htmlFor="website" className="block text-sm font-medium text-slate-300 mb-1">
                          Website URL
                        </label>
                        <input
                          type="text"
                          id="website"
                          value={digitalRightsInfo.website}
                          onChange={(e) => setDigitalRightsInfo(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="https://your-website.com"
                          className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">YouTube Channel URLs</label>
                        {digitalRightsInfo.youtubeChannels.map((channel, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={channel}
                              onChange={(e) => {
                                const newChannels = [...digitalRightsInfo.youtubeChannels];
                                newChannels[index] = e.target.value;
                                setDigitalRightsInfo(prev => ({ ...prev, youtubeChannels: newChannels }));
                              }}
                              placeholder="https://youtube.com/c/yourchannel"
                              className="flex-1 bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {index > 0 && (
                              <button
                                onClick={() => {
                                  setDigitalRightsInfo(prev => ({
                                    ...prev,
                                    youtubeChannels: prev.youtubeChannels.filter((_, i) => i !== index)
                                  }));
                                }}
                                className="p-2 text-red-400 hover:text-red-300 hover:bg-slate-600 rounded transition-colors"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            setDigitalRightsInfo(prev => ({
                              ...prev,
                              youtubeChannels: [...prev.youtubeChannels, '']
                            }));
                          }}
                          type="button"
                          className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 flex items-center"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Add another channel
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div 
                    className={`p-3 rounded-lg cursor-pointer flex items-center ${
                      interests.other 
                        ? 'bg-indigo-600/20 border border-indigo-600/30' 
                        : 'bg-slate-700 border border-slate-600 hover:bg-slate-600'
                    }`}
                    onClick={() => handleInterestChange('other')}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${
                      interests.other 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-600'
                    }`}>
                      {interests.other && <Check className="h-4 w-4" />}
                    </div>
                    <span className="text-white">Other</span>
                  </div>
                  
                  {interests.other && (
                    <div className="mt-2 pl-8">
                      <label htmlFor="otherDescription" className="block text-sm font-medium text-slate-300 mb-1">
                        Please describe what you're interested in
                      </label>
                      <textarea
                        type="text"
                        id="otherDescription"
                        value={otherInterest}
                        onChange={(e) => setOtherInterest(e.target.value)}
                        placeholder="Describe your interests or requirements"
                        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] resize-y"
                      ></textarea>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="text-slate-300 mb-5">
                  Please provide your channel information so we can better assist you:
                </p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={channelInfo.name}
                      onChange={handleChannelInfoChange}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={channelInfo.email}
                      onChange={handleChannelInfoChange}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Your email address"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="youtubeLink" className="block text-sm font-medium text-slate-300 mb-1">
                      Verified YouTube Channels
                    </label>
                    {channelInfo.youtubeLinks.filter(link => channelInfo.verifiedChannels[link]).map((link, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-2 flex-1 bg-slate-700 border border-slate-600 rounded-md px-3 py-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-green-500/20 text-green-400">
                            <Check className="h-4 w-4" />
                          </div>
                          <span className="text-white">{link}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-700 px-6 py-4 flex justify-between items-center border-t border-slate-600 mt-auto">
            <button
              onClick={handleSignOut}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
            {step === 1 ? (
              <button
                onClick={handleSubmitInterests}
                disabled={isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Continue'}
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-500 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (validateStep2()) {
                      handleFinalSubmit();
                    }
                  }}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}