import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Film, 
  TrendingUp, 
  BarChart2, 
  PlayCircle, 
  Share2, 
  Award, 
  Users, 
  Play, 
  ChevronRight,
  Eye,
  ThumbsUp,
  UserPlus,
  Tv,
  Video,
  Monitor,
  Globe,
  Clock,
  Star
} from 'lucide-react';

export default function ShowGrowth() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -left-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-40 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
          
          {/* Animated grid lines */}
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full bg-[linear-gradient(to_right,#38bdf880_1px,transparent_1px),linear-gradient(to_bottom,#38bdf880_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to home
          </Link>
          
          <div className="relative z-10 py-10">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-500 to-indigo-400">
                Achieve the best growth for shows and movies
              </span>
              <br />
              <span className="text-white">using organic short form videos</span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto text-center mb-12">
              Amplify your content's reach and engagement with our proven strategies for TikTok, Instagram Reels, and YouTube Shorts that is monumentally more effective than traditional ads or marketing.
            </p>
            
            {/* iPhone Mockup */}
            <div className="relative max-w-[300px] mx-auto mt-8 mb-12">
              <div className="relative z-10">
                {/* iPhone Frame */}
                <div className="relative w-full pt-[200%] bg-slate-800 rounded-[3rem] border-[14px] border-slate-700 shadow-xl overflow-hidden">
                  {/* Screen Content */}
                  <div className="absolute inset-0 bg-black">
                    {/* YouTube Shorts Interface */}
                    <div className="absolute inset-0 flex flex-col">
                      {/* Video Content */}
                      <div className="relative flex-1 bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-cyan-500/20 animate-pulse">
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                            <Play className="h-8 w-8 text-white" fill="currentColor" />
                          </div>
                        </div>
                      </div>
                      
                      {/* YouTube Shorts Interface Elements */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20"></div>
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium truncate">Show Title</p>
                            <p className="text-slate-300 text-xs truncate">Episode Preview</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Interaction Buttons */}
                      <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                            <ThumbsUp className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-white text-xs mt-1">185K</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                            <Share2 className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-white text-xs mt-1">Share</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* iPhone Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-700 rounded-b-3xl"></div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-cyan-500/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-center items-center gap-16 md:gap-24">
            {/* Monthly Views */}
            <div className="text-center flex flex-col items-center">
              <div className="w-24 h-24 mb-6 rounded-full bg-blue-500/20 flex items-center justify-center transform transition-all duration-300 hover:scale-110">
                <Eye className="h-12 w-12 text-blue-400" />
              </div>
              <p className="text-4xl font-bold text-blue-400 mb-2">650M+</p>
              <p className="text-slate-300">Monthly Views</p>
            </div>
            
            {/* Studios */}
            <div className="text-center flex flex-col items-center">
              <div className="w-24 h-24 mb-6 rounded-full bg-cyan-500/20 flex items-center justify-center transform transition-all duration-300 hover:scale-110">
                <Film className="h-12 w-12 text-cyan-400" />
              </div>
              <p className="text-4xl font-bold text-cyan-400 mb-2">200+</p>
              <p className="text-slate-300">Studios & Creators</p>
            </div>
            
            {/* Growth */}
            <div className="text-center flex flex-col items-center">
              <div className="w-24 h-24 mb-6 rounded-full bg-indigo-500/20 flex items-center justify-center transform transition-all duration-300 hover:scale-110">
                <TrendingUp className="h-12 w-12 text-indigo-400" />
              </div>
              <p className="text-4xl font-bold text-indigo-400 mb-2">8X</p>
              <p className="text-slate-300">Average Growth</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-500 to-indigo-400 mb-6 relative">
              Why Studios Choose MediaTiger
            </h2>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed relative">
              People don't like forced marketing or paid ads. Especially the younger generation where short form content is the most dominant way to connect with shows and movies. Times have shifted.
            </p>
            <div className="text-slate-300 max-w-4xl mx-auto text-left space-y-8 relative backdrop-blur-sm bg-slate-800/30 p-8 rounded-xl border border-slate-700/50">
              <p className="text-lg leading-relaxed">
                In an era dominated by traditional and often impersonal marketing tactics, our approach offers a refreshing and impactful alternative for studios and creators. By leveraging short-form content created and shared across the diverse channels in our catalog, we help shows and movies gain authentic visibility and build meaningful connections with their audience.
              </p>
              <p className="text-lg leading-relaxed">
                Our strategy revolves around fostering organic growth, sidestepping the need for forced or cold marketing techniques. Instead of relying on intrusive ads or formulaic promotions, our content resonates naturally with viewers. This authenticity not only captures attention but also fosters genuine engagement, as fans are drawn to the content in a way that feels unprompted and personal.
              </p>
              <p className="text-lg leading-relaxed">
                By aligning entertainment with the power of organic, user-driven content, we're helping to reshape the way shows and movies are discovered and shared, enabling studios to achieve sustainable success while maximizing their reach.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-slate-800 p-6 rounded-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              <Monitor className="h-10 w-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Platform-Specific Content</h3>
              <p className="text-slate-300">
                We create tailored content optimized for each platform's unique algorithm and audience preferences, maximizing engagement everywhere.
              </p>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              <Globe className="h-10 w-10 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Global Audience Targeting</h3>
              <p className="text-slate-300">
                Our strategies consider cultural nuances and viewing habits across different regions to maximize global appeal.
              </p>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              <Clock className="h-10 w-10 text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Timing Optimization</h3>
              <p className="text-slate-300">
                We identify the optimal release schedule for your short-form videos to align with premiere dates and maintain momentum.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-slate-800/30" id="get-started">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How We Elevate Your Content</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Our comprehensive approach ensures your shows and movies get the attention they deserve.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative">
              <div className="bg-slate-800 p-6 rounded-lg h-full border border-slate-700 hover:border-blue-500/50 transition-colors duration-300">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">1</div>
                <PlayCircle className="h-10 w-10 text-blue-400 mb-4 mt-2" />
                <h3 className="text-xl font-semibold text-white mb-2">Content Creation</h3>
                <p className="text-slate-300">
                  We craft engaging short-form videos that showcase your shows and movies in authentic and trending formats.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-slate-800 p-6 rounded-lg h-full border border-slate-700 hover:border-cyan-500/50 transition-colors duration-300">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/20">2</div>
                <Share2 className="h-10 w-10 text-cyan-400 mb-4 mt-2" />
                <h3 className="text-xl font-semibold text-white mb-2">Strategic Distribution</h3>
                <p className="text-slate-300">
                  Our network of influencers and content creators helps amplify your content to the right audiences at the right time.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-slate-800 p-6 rounded-lg h-full border border-slate-700 hover:border-indigo-500/50 transition-colors duration-300">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">3</div>
                <Award className="h-10 w-10 text-indigo-400 mb-4 mt-2" />
                <h3 className="text-xl font-semibold text-white mb-2">Trend Optimization</h3>
                <p className="text-slate-300">
                  We identify, leverage, and create viral trends to maximize visibility and engagement for your content.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-slate-800 p-6 rounded-lg h-full border border-slate-700 hover:border-blue-500/50 transition-colors duration-300">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">4</div>
                <Users className="h-10 w-10 text-blue-400 mb-4 mt-2" />
                <h3 className="text-xl font-semibold text-white mb-2">Fan Community Building</h3>
                <p className="text-slate-300">
                  We help develop dedicated fan communities that become advocates for your content, driving organic growth and viewer loyalty.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-slate-800 p-6 rounded-lg h-full border border-slate-700 hover:border-emerald-500/50 transition-colors duration-300">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20">5</div>
                <Star className="h-10 w-10 text-emerald-400 mb-4 mt-2" />
                <h3 className="text-xl font-semibold text-white mb-2">Talent Amplification</h3>
                <p className="text-slate-300">
                  Strategic promotion of cast members and directors to leverage their existing fan bases and cross-pollinate audiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400">
            © {new Date().getFullYear()} MediaTiger. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}