import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { formatRelativeTime } from "../utils/dateUtils";
import {
  LogOut,
  Settings,
  User,
  Eye,
  MessageSquare,
  Bell,
  BarChart3,
  Play,
  Shield,
  Globe,
  Menu,
  X,
  UserCircle,
  Mail,
  Calendar,
  Clock,
  Youtube,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  BarChart2,
} from "lucide-react";
import OnboardingPopup from "../components/OnboardingPopup";
import Swal from "sweetalert2";

interface Channel {
  url: string;
  views: number;
  monthlyViews: number;
  subscribers: number;
  growth: number;
}

export default function Dashboard() {
  const { user, signOut, showOnboarding, setShowOnboarding } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [monthlyViews, setMonthlyViews] = useState(0);
  const [linkedChannels, setLinkedChannels] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeSection, setActiveSection] = useState("overview");
  const navigate = useNavigate();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.user_metadata?.avatar_url || null
  );
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files?.[0];
      if (!file || !user) return;

      setUploadingImage(true);

      // Upload image to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `/${user.id}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("profile-pictures")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });

      if (updateError) throw updateError;

      setProfileImage(publicUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploadingImage(false);
    }
  };
  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        // Get current month's views
        const { data: viewsData, error: viewsError } = await supabase.rpc(
          "get_total_monthly_views",
          {
            p_user_id: user.id,
            p_month: new Date().toISOString().slice(0, 10),
          }
        );

        if (viewsError) throw viewsError;
        setMonthlyViews(viewsData || 0);

        // Get linked channels count
        const { data: requestData, error: requestError } = await supabase
          .from("user_requests")
          .select("youtube_links")
          .eq("user_id", user.id)
          .single();

        if (requestError) throw requestError;
        setLinkedChannels(requestData?.youtube_links?.length || 0);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();

    // Set up interval to check stats every hour
    const interval = setInterval(fetchStats, 3600000);
    return () => clearInterval(interval);
  }, [user]);

  // Effect to fetch and subscribe to notifications
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
        return;
      }

      setNotifications(
        data.map((notification) => ({
          id: notification.id,
          title: notification.title,
          content: notification.content,
          time: formatRelativeTime(notification.created_at),
          read: notification.read,
        }))
      );
    };

    fetchNotifications();

    // Subscribe to new notifications
    const subscription = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const newNotification = {
              id: payload.new.id,
              title: payload.new.title,
              content: payload.new.content,
              time: formatRelativeTime(payload.new.created_at),
              read: payload.new.read,
            };

            setNotifications((prev) => [newNotification, ...prev]);
            setHasNewNotification(true);

            // Play notification sound
            const audio = new Audio("/notification.mp3");
            audio.play().catch(() => {}); // Ignore errors if sound can't play
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Effect to check for unread messages
  useEffect(() => {
    if (!user) return;

    const checkUnreadMessages = async () => {
      const { data: messages, error } = await supabase
        .from("messages")
        .select("*")
        .eq("receiver_id", user.id)
        .is("read_at", null);

      if (error) {
        console.error("Error checking unread messages:", error);
        return;
      }

      setHasUnreadMessages(messages && messages.length > 0);
    };

    checkUnreadMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${user.id}`,
        },
        () => {
          checkUnreadMessages();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Effect to handle notification animation
  useEffect(() => {
    if (notifications.some((n) => !n.read)) {
      setHasNewNotification(true);
      // Reset the animation after it plays
      const timer = setTimeout(() => {
        setHasNewNotification(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);
  /*   useEffect(() => {
    if (activeSection === "channels") {
      const getChannels = async () => {
        const { data, error } = await supabase
          .from("channel")
          .select("*")
          .eq("user_id", user?.id);

        if (error) {
          console.error("Error fetching channels:", error);
          return;
        }

        setChannels(data || []);
      };

      getChannels();
    }
  }, [activeSection]); */
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const clearNotifications = () => {
    // Update notifications as read in database
    if (!user) return;

    const updateNotifications = async () => {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id);

      if (error) {
        console.error("Error clearing notifications:", error);
        return;
      }

      setNotifications([]);
      setHasNewNotification(false);
    };

    updateNotifications();
  };

  const markAllAsRead = () => {
    // Mark all notifications as read in database
    if (!user) return;

    const updateNotifications = async () => {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id);

      if (error) {
        console.error("Error marking notifications as read:", error);
        return;
      }

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setHasNewNotification(false);
    };

    updateNotifications();
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".notifications-dropdown") &&
        !target.closest(".notifications-button")
      ) {
        setShowNotifications(false);
      }
      if (
        !target.closest(".settings-dropdown") &&
        !target.closest(".settings-button")
      ) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (user?.user_metadata?.role === "admin") {
      navigate("/purple");
      setIsLoading(false);
      return;
    }
    if (user && !user.user_metadata?.onboarding_complete) {
      setShowOnboarding(true);
    }
    setIsLoading(false);
  }, [user, setShowOnboarding, navigate]);

  const navigationItems = [
    {
      name: "Overview",
      section: "overview",
      icon: <Eye className="h-5 w-5" />,
    },
    {
      name: "Analytics",
      section: "analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      count: "12",
    },
    {
      name: "Channel Management",
      section: "channels",
      icon: <Play className="h-5 w-5" />,
    },
    {
      name: "Digital Rights",
      section: "rights",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      name: "Global Distribution",
      section: "distribution",
      icon: <Globe className="h-5 w-5" />,
    },
  ];

  const userStats = {
    joinDate: new Date(user?.created_at || Date.now()).toLocaleDateString(),
    lastLogin: new Date(
      user?.last_sign_in_at || Date.now()
    ).toLocaleDateString(),
    accountType: "Pro User",
    contentCount: 156,
  };
  useEffect(() => {
    if (!user) return;

    // Subscribe to notifications
    console.log(user);
    supabase.channel("notifications").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "notifications",
      },
      (payload) => {
        // Handle notification changes
        console.log(payload);
      }
    );
  }, [user]);

  const showNotification = (notification) => {
    Swal.fire({
      title: notification.title,

      text: notification.content,

      icon: "info",
      confirmButtonText: "Okay",
    });
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-2"></div>
          <span className="text-white text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Onboarding Popup */}
      {showOnboarding && user && (
        <OnboardingPopup
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          userId={user.id}
          userEmail={user.email || ""}
        />
      )}

      {/* Sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-slate-800">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            {/* User Profile Summary */}
            <div className="px-6 py-8 text-center">
              <div className="relative group">
                <div className="h-24 w-24 rounded-full bg-indigo-600 mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold relative overflow-hidden">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user?.user_metadata?.full_name?.[0]?.toUpperCase() || (
                      <UserCircle className="h-16 w-16" />
                    )
                  )}

                  {/* Upload overlay */}
                  <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                    {uploadingImage ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                    ) : (
                      <span className="text-white text-sm">Update</span>
                    )}
                  </label>
                </div>

                {/* Existing effects */}
              </div>

              <h2 className="text-xl font-bold text-white mb-1">
                Welcome,{" "}
                {user?.user_metadata?.full_name?.split(" ")[0] || "User"}!
              </h2>
            </div>

            <nav className="mt-5 flex-1 space-y-2 px-4">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveSection(item.section)}
                  className="group flex items-center px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-300 relative overflow-hidden hover:shadow-lg hover:shadow-indigo-500/10 hover:scale-[1.02] hover:-translate-y-0.5"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center">
                    <span className="transform transition-transform duration-300 group-hover:scale-110">
                      {item.icon}
                    </span>
                    <span className="ml-3 transform transition-transform duration-300 group-hover:translate-x-1">
                      {item.name}
                    </span>
                  </div>
                  {item.count && (
                    <span className="relative z-10 ml-auto bg-slate-900 py-0.5 px-2 rounded-full text-xs transform transition-all duration-300 group-hover:bg-indigo-900 group-hover:text-white">
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="fixed inset-0 z-40 flex">
          <div
            className={`fixed inset-0 bg-slate-600 bg-opacity-75 transition-opacity ease-in-out duration-300 ${
              isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div
            className={`relative flex w-full max-w-xs flex-1 flex-col bg-slate-800 pt-5 pb-4 transform transition ease-in-out duration-300 ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="absolute top-1 right-0 -mr-14 p-1">
              <button
                type="button"
                className={`h-12 w-12 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white ${
                  isMobileMenuOpen ? "" : "hidden"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="flex-shrink-0 flex items-center px-4">
              <img
                src="https://dlveiezovfooqbbfzfmo.supabase.co/storage/v1/object/public/Images//mtiger.png"
                alt="MediaTiger Logo"
                className="h-8 w-8"
              />
              <span className="ml-2 text-xl font-bold text-white">
                MediaTiger
              </span>
            </div>

            {/* Mobile User Profile Summary */}
            <div className="px-4 py-6 text-center">
              <div className="h-20 w-20 rounded-full bg-indigo-600 mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                {user?.user_metadata?.full_name?.[0]?.toUpperCase() || (
                  <UserCircle className="h-12 w-12" />
                )}
              </div>
              <h2 className="text-lg font-bold text-white mb-1">
                Welcome,{" "}
                {user?.user_metadata?.full_name?.split(" ")[0] || "User"}!
              </h2>
              <p className="text-sm text-slate-400 mb-4">
                {userStats.accountType}
              </p>
            </div>

            <div className="mt-5 flex-1 h-0 overflow-y-auto">
              <nav className="px-2 space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-slate-300 hover:bg-slate-700 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                    {item.count && (
                      <span className="ml-auto bg-slate-900 py-0.5 px-2 rounded-full text-xs">
                        {item.count}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 bg-slate-800 pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <main className="flex-1">
          <div className="py-6">
            {/* Background gradient effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-slate-500/5 pointer-events-none"></div>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 space-y-8">
              <div className="flex items-center justify-between">
                <h1
                  onMouseEnter={() => {
                    setShowNotifications(false);
                    setShowSettings(false);
                  }}
                  className="text-2xl font-semibold text-white w-full"
                >
                  {activeSection === "overview"
                    ? "Dashboard"
                    : activeSection === "channels"
                    ? "Channel Management"
                    : activeSection === "analytics"
                    ? "Analytics"
                    : activeSection === "rights"
                    ? "Digital Rights"
                    : "Global Distribution"}
                </h1>
                <div className="flex items-center relative z-50">
                  {/* Added relative positioning and z-50 */}
                  <div
                    className="notifications-button mx-2 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200 hover:scale-110 relative"
                    data-popover-target="notifications-popover"
                  >
                    <Bell
                      onClick={() => {
                        setShowNotifications((prev) => !prev);
                        setShowSettings(false); // Close settings when opening notifications
                      }}
                      className={`h-6 w-6 transition-all duration-300 ${
                        notifications.some((n) => !n.read)
                          ? "text-white animate-pulse filter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                          : "text-slate-400"
                      }`}
                    />

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                      <div className="dropdown absolute right-0 top-full mt-2 w-96 bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700/50 transform transition-all duration-300 animate-custom-enter">
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                          <h3 className="text-white font-semibold">
                            Notifications
                          </h3>
                          <div className="flex gap-2">
                            <button
                              onClick={markAllAsRead}
                              className="text-xs text-slate-400 hover:text-white transition-colors"
                            >
                              Mark all as read
                            </button>
                            <button
                              onClick={clearNotifications}
                              className="text-xs text-slate-400 hover:text-white transition-colors"
                            >
                              Clear all
                            </button>
                          </div>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-center text-slate-400">
                              No notifications
                            </div>
                          ) : (
                            notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-4 border-b border-slate-700 hover:bg-slate-700/50 transition-all duration-300 ${
                                  !notification.read ? "bg-indigo-500/5" : ""
                                }`}
                              >
                                <h4 className="text-white font-medium">
                                  {notification.title}
                                </h4>
                                <p className="text-slate-400 text-sm mt-1">
                                  {notification.content}
                                </p>
                                <p className="text-slate-500 text-xs mt-2">
                                  {notification.time}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    className="settings-button p-2 mr-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200 hover:scale-110 relative"
                    onMouseEnter={() => {
                      setShowNotifications(false);
                    }}
                    onClick={() => {
                      setShowSettings(!showSettings);
                      setShowNotifications(false);
                    }}
                  >
                    <Settings className="h-6 w-6" />

                    {/* Settings Dropdown */}
                    {showSettings && (
                      <div className="settings-dropdown absolute right-0 top-full mt-2 w-80 bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-xl border border-slate-700">
                        <div className="p-4 border-b border-slate-700">
                          <h3 className="text-white font-semibold">Settings</h3>
                        </div>
                        <div className="p-4 space-y-4">
                          {/* Profile Section */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Name</span>
                              <span className="text-white">
                                {user?.user_metadata?.full_name}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Email</span>
                              <span className="text-white">{user?.email}</span>
                            </div>
                            <button className="w-full text-left text-indigo-400 hover:text-indigo-300 transition-colors">
                              Change Password
                            </button>
                          </div>

                          <div className="border-t border-slate-700 pt-4">
                            <h4 className="text-white font-medium mb-3">
                              Security
                            </h4>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">
                                Two-Factor Authentication
                              </span>
                              <button className="text-indigo-400 hover:text-indigo-300 transition-colors">
                                Enable
                              </button>
                            </div>
                          </div>

                          <div className="border-t border-slate-700 pt-4">
                            <h4 className="text-white font-medium mb-3">
                              Preferences
                            </h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400">Language</span>
                                <select className="bg-slate-700 text-white rounded-md px-2 py-1 text-sm">
                                  <option>English</option>
                                  <option>Spanish</option>
                                  <option>French</option>
                                </select>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400">Timezone</span>
                                <select className="bg-slate-700 text-white rounded-md px-2 py-1 text-sm">
                                  <option>UTC</option>
                                  <option>EST</option>
                                  <option>PST</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-slate-700 pt-4">
                            <button
                              onClick={handleSignOut}
                              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <LogOut className="h-4 w-4 mr-2" />
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <Link
                    onMouseEnter={() => {
                      setShowNotifications(false);
                      setShowSettings(false);
                    }}
                    to="/messages"
                    className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200 hover:scale-110"
                  >
                    <MessageSquare
                      className={`h-6 w-6 transition-all duration-300 ${
                        hasUnreadMessages
                          ? "text-white animate-pulse filter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                          : "text-slate-400"
                      }`}
                    />
                  </Link>
                </div>
              </div>

              {/* Main Content Area */}
              {activeSection === "overview" && (
                <div className="cards-dashboard grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 relative z-[1]">
                  {/* Views Card */}
                  <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl hover:shadow-indigo-500/10 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                        <Eye className="h-8 w-8 text-indigo-500" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-slate-400">
                          {new Date().toLocaleString("default", {
                            month: "long",
                          })}{" "}
                          Views
                        </p>
                        <p className="text-2xl font-semibold text-white">
                          {monthlyViews.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Channels Card */}
                  <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl hover:shadow-green-500/10 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all duration-300">
                        <Play className="h-8 w-8 text-green-500" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-slate-400">
                          Active Channels
                        </p>
                        <p className="text-2xl font-semibold text-white">
                          {linkedChannels}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rights Card */}
                  <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl hover:shadow-purple-500/10 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                        <Shield className="h-8 w-8 text-purple-500" />
                      </div>
                      <div className="ml-4 min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-400">
                          Revenue
                        </p>
                        <p className="text-2xl font-semibold text-white whitespace-nowrap">
                          $156K
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Distribution Card */}
                  <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 shadow-xl hover:shadow-blue-500/10 transform hover:scale-105 transition-all duration-300">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all duration-300">
                        <Globe className="h-8 w-8 text-blue-500" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-slate-400">
                          Global Reach
                        </p>
                        <p className="text-2xl font-semibold text-white">48M</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeSection === "channels" && (
                <div className="space-y-6">
                  {/* Channel List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {channels.map((channel) => (
                      <button
                        key={channel.url}
                        onClick={() => setSelectedChannel(channel)}
                        className={`w-full p-6 rounded-xl transition-all duration-300 ${
                          selectedChannel?.url === channel.url
                            ? "bg-indigo-600 shadow-lg shadow-indigo-500/20"
                            : "bg-slate-800 hover:bg-slate-700"
                        }`}
                      >
                        <div className="flex items-center mb-4">
                          <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center">
                            <Youtube className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-3 text-left">
                            <p className="text-white font-medium truncate">
                              {channel.url.replace("https://youtube.com/", "")}
                            </p>
                            <a
                              href={channel.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center mt-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View Channel
                              <ExternalLink className="h-4 w-4 ml-1" />
                            </a>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-slate-400">
                              Monthly Views
                            </p>
                            <p className="text-lg font-semibold text-white">
                              {channel.monthlyViews.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-400">Growth</p>
                            <p className="text-lg font-semibold text-white">
                              {channel.growth.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Selected Channel Analytics */}
                  {selectedChannel && (
                    <div className="bg-slate-800 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Channel Analytics
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-slate-700/50 rounded-xl p-4">
                          <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-500/20">
                              <Eye className="h-6 w-6 text-blue-400" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm text-slate-400">
                                Total Views
                              </p>
                              <p className="text-xl font-semibold text-white">
                                {selectedChannel.views.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-700/50 rounded-xl p-4">
                          <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-500/20">
                              <BarChart2 className="h-6 w-6 text-green-400" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm text-slate-400">
                                Monthly Views
                              </p>
                              <p className="text-xl font-semibold text-white">
                                {selectedChannel.monthlyViews.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-700/50 rounded-xl p-4">
                          <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-500/20">
                              <User className="h-6 w-6 text-purple-400" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm text-slate-400">
                                Subscribers
                              </p>
                              <p className="text-xl font-semibold text-white">
                                {selectedChannel.subscribers.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-700/50 rounded-xl p-4">
                          <div className="flex items-center">
                            <div className="p-3 rounded-full bg-indigo-500/20">
                              <TrendingUp className="h-6 w-6 text-indigo-400" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm text-slate-400">Growth</p>
                              <p className="text-xl font-semibold text-white">
                                {selectedChannel.growth.toFixed(1)}%
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeSection !== "overview" && activeSection !== "channels" && (
                <div className="bg-slate-800 rounded-xl p-12 text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Coming Soon
                  </h3>
                  <p className="text-slate-400">
                    This section is currently under development
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
