import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  ArrowLeft, 
  Play, 
  RefreshCw, 
  Settings,
  TrendingUp,
  Eye,
  ChevronRight,
  Youtube,
  ExternalLink,
  BarChart2,
  User
} from 'lucide-react';

interface Channel {
  url: string;
  views: number;
  monthlyViews: number;
  subscribers: number;
  growth: number;
}

export default function ChannelManagement() {
  const { user } = useAuth();
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchChannels = async () => {
      try {
        // Get user's linked channels
        const { data: requestData, error: requestError } = await supabase
          .from('user_requests')
          .select('youtube_links')
          .eq('user_id', user.id)
          .single();

        if (requestError) throw requestError;

        if (!requestData?.youtube_links?.length) {
          setError('No channels linked to your account');
          setIsLoading(false);
          return;
        }

        // Get views data for each channel
        const { data: viewsData, error: viewsError } = await supabase
          .from('channel_views')
          .select('*')
          .eq('user_id', user.id)
          .order('month', { ascending: false });

        if (viewsError) throw viewsError;

        // Transform data
        const channelList = (requestData?.youtube_links || []).map((url: string) => {
          const channelViews = viewsData?.filter(v => v.channel_id === url) || [];
          const currentMonthViews = channelViews[0]?.views || 0;
          const lastMonthViews = channelViews[1]?.views || 0;
          const growth = lastMonthViews ? ((currentMonthViews - lastMonthViews) / lastMonthViews) * 100 : 0;

          return {
            url,
            views: channelViews.reduce((sum, v) => sum + v.views, 0),
            monthlyViews: currentMonthViews,
            subscribers: Math.floor(Math.random() * 1000000), // Mock data
            growth
          };
        });

        setChannels(channelList);
        if (channelList.length > 0 && !selectedChannel) {
          setSelectedChannel(channelList[0]);
        }
      } catch (error) {
        console.error('Error fetching channels:', error);
        setError('Failed to load channel data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannels();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-slate-300">Loading your channels...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-4">
            <Youtube className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">{error}</h3>
          <p className="text-slate-400 mb-6">
            Please link your YouTube channels through the onboarding process to view analytics.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Channels List */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-slate-800 rounded-xl p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Your Channels</h2>
                <button 
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                  onClick={() => {
                    setIsLoading(true);
                    window.location.reload();
                  }}
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {channels.map((channel) => (
                  <button
                    key={channel.url}
                    onClick={() => setSelectedChannel(channel)}
                    className={`w-full p-4 rounded-xl transition-all duration-300 ${
                      selectedChannel?.url === channel.url
                        ? 'bg-indigo-600 shadow-lg shadow-indigo-500/20'
                        : 'bg-slate-700/50 hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-slate-600 flex items-center justify-center">
                        <Youtube className="h-5 w-5 text-white" />
                      </div> 
                      <div className="ml-3 text-left">
                        <p className="text-white font-medium truncate max-w-[180px]">
                          {channel.url.replace(/^https?:\/\/(www\.)?(youtube\.com\/|youtu\.be\/)/, '')}
                        </p>
                        <p className="text-sm text-slate-400">
                          {channel.monthlyViews.toLocaleString()} views this month
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Channel Analytics */}
          <div className="flex-1">
            {selectedChannel ? (
              <div className="space-y-6">
                {/* Channel Header */}
                <div className="bg-slate-800 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-indigo-600/20 flex items-center justify-center">
                        <Youtube className="h-6 w-6 text-indigo-400" /> 
                      </div>
                      <div className="ml-4">
                        <h2 className="text-xl font-semibold text-white">
                          {selectedChannel.url.replace(/^https?:\/\/(www\.)?(youtube\.com\/|youtu\.be\/)/, '')}
                        </h2>
                        <a 
                          href={selectedChannel.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center mt-1"
                        >
                          View Channel
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      </div>
                    </div>
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <Settings className="h-5 w-5" />
                      </button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700/80 transition-colors">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-blue-500/20">
                        <Eye className="h-6 w-6 text-blue-400" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-slate-400">Total Views</p>
                        <p className="text-2xl font-semibold text-white">
                          {selectedChannel.views.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700/80 transition-colors">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-green-500/20">
                        <BarChart2 className="h-6 w-6 text-green-400" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-slate-400">Monthly Views</p>
                        <p className="text-2xl font-semibold text-white">
                          {selectedChannel.monthlyViews.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700/80 transition-colors">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-purple-500/20">
                        <User className="h-6 w-6 text-purple-400" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-slate-400">Subscribers</p>
                        <p className="text-2xl font-semibold text-white">
                          {selectedChannel.subscribers.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700/80 transition-colors">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-indigo-500/20">
                        <TrendingUp className="h-6 w-6 text-indigo-400" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-slate-400">Growth</p>
                        <p className="text-2xl font-semibold text-white">
                          {selectedChannel.growth.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytics Chart */}
                <div className="bg-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Views Over Time</h3>
                  <div className="h-64 flex items-center justify-center text-slate-400 bg-slate-700/50 rounded-lg">
                    <p className="text-center">
                      <span className="block text-lg mb-2">📊 Analytics Coming Soon</span>
                      <span className="text-sm text-slate-500">Detailed channel analytics will be available here</span>
                    </p>
                  </div>
                </div>

                {/* Recent Videos */}
                <div className="bg-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Videos</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="flex items-center p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer">
                        <div className="w-32 h-20 bg-slate-600 rounded-lg flex items-center justify-center">
                          <Play className="h-8 w-8 text-slate-400" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="text-white font-medium">Video Title {i + 1}</h4>
                          <p className="text-sm text-slate-400 mt-1">
                            {Math.floor(Math.random() * 10000).toLocaleString()} views • {Math.floor(Math.random() * 24)} hours ago
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400 transform transition-transform group-hover:translate-x-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800 rounded-xl p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-4">
                  <Youtube className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Channel Selected</h3>
                <p className="text-slate-400">
                  Select a channel from the list to view its analytics
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}