import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Music, 
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
  UserPlus
} from 'lucide-react';

export default function LabelGrowth() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-20 -left-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-40 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
          
          {/* Animated grid lines */}
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full bg-[linear-gradient(to_right,#8b5cf680_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf680_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="relative z-10 py-10">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400">
                Achieve the best growth for artists and music
              </span>
              <br />
              <span className="text-white">using organic short form videos</span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto text-center mb-12">
              Amplify your artists' reach and engagement with our proven strategies for TikTok, Instagram Reels, and YouTube Shorts that is monumentally more effective than traditional ads or marketing. We bridge the gap between music artists and creators, allowing creators to earn from revenue splits while helping artists get their music heard by a broader, newer audience. It's a win win.
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
                      <div className="relative flex-1 bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-pink-500/20 animate-pulse">
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
                          <div className="w-10 h-10 rounded-full bg-purple-500/20"></div>
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium truncate">Creator</p>
                            <p className="text-slate-300 text-xs truncate">Song Title</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Interaction Buttons */}
                      <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                            <ThumbsUp className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-white text-xs mt-1">245K</span>
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
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl"></div>
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
              <div className="w-24 h-24 mb-6 rounded-full bg-purple-500/20 flex items-center justify-center transform transition-all duration-300 hover:scale-110">
                <Eye className="h-12 w-12 text-purple-400" />
              </div>
              <p className="text-4xl font-bold text-purple-400 mb-2">2B+</p>
              <p className="text-slate-300">Monthly Views</p>
            </div>
            
            {/* Likes */}
            <div className="text-center flex flex-col items-center">
              <div className="w-24 h-24 mb-6 rounded-full bg-pink-500/20 flex items-center justify-center transform transition-all duration-300 hover:scale-110">
                <ThumbsUp className="h-12 w-12 text-pink-400" />
              </div>
              <p className="text-4xl font-bold text-pink-400 mb-2">200M+</p>
              <p className="text-slate-300">Likes</p>
            </div>
            
            {/* Followers */}
            <div className="text-center flex flex-col items-center">
              <div className="w-24 h-24 mb-6 rounded-full bg-indigo-500/20 flex items-center justify-center transform transition-all duration-300 hover:scale-110">
                <UserPlus className="h-12 w-12 text-indigo-400" />
              </div>
              <p className="text-4xl font-bold text-indigo-400 mb-2">10M+</p>
              <p className="text-slate-300">Followers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 mb-6 relative">
              Why Labels Choose MediaTiger
            </h2>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed relative">
              People don't like forced marketing or paid ads. Especially the younger generation where short form content is the most dominant way to connect with artists and songs. Times have shifted.
            </p>
            <div className="text-slate-300 max-w-4xl mx-auto text-left space-y-8 relative backdrop-blur-sm bg-slate-800/30 p-8 rounded-xl border border-slate-700/50">
              <p className="text-lg leading-relaxed">
                In an era dominated by traditional and often impersonal marketing tactics, our approach offers a refreshing and impactful alternative for artists. By leveraging short-form content created and shared across the diverse channels in our catalog, we help artists gain authentic visibility and build meaningful connections with their audience. Whether it's through the seamless integration of a song into a video or direct promotion of the artist, our methods have consistently driven unparalleled success.
              </p>
              <p className="text-lg leading-relaxed">
                Our strategy revolves around fostering organic growth, sidestepping the need for forced or cold marketing techniques. Instead of relying on intrusive ads or formulaic promotions, our content resonates naturally with viewers. This authenticity not only captures attention but also fosters genuine engagement, as fans are drawn to the music or artist in a way that feels unprompted and personal.
              </p>
              <p className="text-lg leading-relaxed">
                By aligning artistry with the power of organic, user-driven content, we're helping to reshape the way music is discovered and shared, enabling artists to achieve sustainable success while staying true to their creative vision.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-slate-800 p-6 rounded-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              <Music className="h-10 w-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Studying Behavioral Patterns</h3>
              <p className="text-slate-300">
                The team at MediaTiger has extensive knowledge on the psychological behaviors of the target audiences, allowing to use that information to formulate the best possible actions to get a song or an artist popular.
              </p>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              <TrendingUp className="h-10 w-10 text-pink-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Proven Results</h3>
              <p className="text-slate-300">
                Our short form content by the channels in our catalog using the song in their video or directly promoting the artist has helped artists achieve millions of streams and fans organically, and not through forced means like traditional or cold marketing.
              </p>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              <BarChart2 className="h-10 w-10 text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Versatility</h3>
              <p className="text-slate-300">
                Any genre of music and artist can be elevated simply because of the sheer number of content creators and styles we have in our catalog.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-slate-800/30" id="get-started">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How We Elevate Your Artists</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Our comprehensive approach ensures your music gets the attention it deserves.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative">
              <div className="bg-slate-800 p-6 rounded-lg h-full border border-slate-700 hover:border-purple-500/50 transition-colors duration-300">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/20">1</div>
                <PlayCircle className="h-10 w-10 text-purple-400 mb-4 mt-2" />
                <h3 className="text-xl font-semibold text-white mb-2">Content Creation</h3>
                <p className="text-slate-300">
                  We craft engaging short-form videos that showcase your artists' music in authentic and trending formats.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-slate-800 p-6 rounded-lg h-full border border-slate-700 hover:border-pink-500/50 transition-colors duration-300">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-pink-500/20">2</div>
                <Share2 className="h-10 w-10 text-pink-400 mb-4 mt-2" />
                <h3 className="text-xl font-semibold text-white mb-2">Strategic Distribution</h3>
                <p className="text-slate-300">
                  Our network of influencers and content creators helps amplify your music to the right audiences at the right time.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-slate-800 p-6 rounded-lg h-full border border-slate-700 hover:border-indigo-500/50 transition-colors duration-300">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">3</div>
                <Award className="h-10 w-10 text-indigo-400 mb-4 mt-2" />
                <h3 className="text-xl font-semibold text-white mb-2">Trend Optimization</h3>
                <p className="text-slate-300">
                  We identify, leverage, and create viral trends to maximize visibility and engagement for your artists' content.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-slate-800 p-6 rounded-lg h-full border border-slate-700 hover:border-blue-500/50 transition-colors duration-300">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">4</div>
                <Users className="h-10 w-10 text-blue-400 mb-4 mt-2" />
                <h3 className="text-xl font-semibold text-white mb-2">Community Building</h3>
                <p className="text-slate-300">
                  We don't just drive temporary views—we help build lasting fan communities around your artists.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-slate-800 p-6 rounded-lg h-full border border-slate-700 hover:border-emerald-500/50 transition-colors duration-300">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20">5</div>
                <Users className="h-10 w-10 text-emerald-400 mb-4 mt-2" />
                <h3 className="text-xl font-semibold text-white mb-2">Create Fan Pages</h3>
                <p className="text-slate-300">
                  We can create fan pages of the desired artist, creating a much more intimate relationship with viewers in a much more organic way.
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