import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Lock,
  Search,
  AlertCircle,
  User,
  Calendar,
  CheckCircle,
  Eye,
  Clock,
  FileText,
  Database,
  RefreshCw,
  UserCheck,
  UserX,
  FileSpreadsheet,
  MessageSquare,
  Bell,
} from "lucide-react";
import {
  lookupUserBySecureId,
  isValidSecureId,
  getAccessLogs,
} from "../utils/adminService";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
export const adminId = "26c83260-54f6-4dd4-bc65-d21e7e52632b";
type UserLookupData = {
  id: string;
  email: string;
  created_at: string;
  user_metadata: Record<string, any>;
  last_sign_in_at: string | null;
  confirmed_at: string | null;
};

type AccessLogItem = {
  id: string;
  admin_id: string;
  accessed_user_id: string;
  accessed_at: string;
  access_reason: string | null;
  admin: { email: string } | null;
};

type ApplicationData = {
  id: string;
  name: string;
  email: string;
  interests: string[];
  other_interest: string | null;
  youtube_links: string[];
  website: string | null;
  youtube_channel: string | null;
  status: string;
  created_at: string;
  verification_code: string;
};

export default function AdminPanel() {
  const [secureId, setSecureId] = useState("");
  const [lookupReason, setLookupReason] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [userData, setUserData] = useState<UserLookupData | null>(null);
  const [userLookupError, setUserLookupError] = useState("");
  const [accessLogs, setAccessLogs] = useState<AccessLogItem[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [activeTab, setActiveTab] = useState("applications");
  const [applications, setApplications] = useState<ApplicationData[] | null>(
    null
  );

  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const [applicationFilter, setApplicationFilter] = useState("pending");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);
  const { user, signOut, showOnboarding, setShowOnboarding } = useAuth();
  const { user: currentUser } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === "logs") {
      loadAccessLogs();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "applications") {
      loadApplications();
    }
  }, [activeTab, applicationFilter]);

  const loadApplications = async () => {
    setIsLoadingApplications(true);
    try {
      const { data, error } = await supabase
        .from("admin_applications_view")
        .select("*")
        .eq("status", applicationFilter)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error("Error loading applications:", err);
      toast.error("Failed to load applications");
    } finally {
      setIsLoadingApplications(false);
    }
  };

  const handleApplicationStatus = async (
    id: string,
    status: "approved" | "rejected",
    reason?: string
  ) => {
    try {
      const {
        data,
        error,
        status: reqStats,
        count,
      } = await supabase.rpc("update_application_status_with_admin", {
        admin_id: adminId, // First parameter
        application_id: id, // Second parameter
        new_status: status, // Third parameter
        reason: status === "rejected" ? reason : `Application ${status}`, // Fourth parameter
      });

      if (error) throw error;
      console.log(data, reqStats, count);
      toast.success(`Application ${status} successfully`);
      setShowRejectionModal(false);
      setRejectionReason("");
      setSelectedApplicationId(null);
      loadApplications(); // Reload the applications list
    } catch (err) {
      console.error("Error updating application status:", err);
      toast.error("Failed to update application status");
    }
  };

  const handleReject = (id: string) => {
    setSelectedApplicationId(id);
    setShowRejectionModal(true);
  };

  const handleRejectionSubmit = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    if (selectedApplicationId) {
      handleApplicationStatus(
        selectedApplicationId,
        "rejected",
        rejectionReason
      );
    }
  };

  const loadAccessLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const { data, error } = await getAccessLogs();
      if (error) {
        toast.error(error);
      } else {
        setAccessLogs(data);
      }
    } catch (err) {
      console.error("Error loading access logs:", err);
      toast.error("Failed to load access logs");
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleSecureIdLookup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!secureId.trim()) {
      setUserLookupError("Please enter a secure ID");
      return;
    }

    if (!isValidSecureId(secureId)) {
      setUserLookupError(
        "Invalid secure ID format. IDs can only contain numbers, letters, commas, periods, underscores and dashes, with a maximum length of 64 characters."
      );
      return;
    }

    setIsLookingUp(true);
    setUserData(null);
    setUserLookupError("");

    try {
      const { data, error } = await lookupUserBySecureId(
        secureId,
        lookupReason
      );

      if (error) {
        setUserLookupError(error);
      } else if (data) {
        setUserData(data as UserLookupData);
        toast.success("User found successfully");
      } else {
        setUserLookupError("No user found with this secure ID");
      }
    } catch (err: any) {
      console.error("Error looking up secure ID:", err);
      setUserLookupError(
        err.message || "An error occurred while looking up the secure ID"
      );
    } finally {
      setIsLookingUp(false);
    }
  };

  // Admin dashboard
  return (
    <div className="min-h-screen bg-slate-900 p-2 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4 md:mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to home
          </Link>
          <button
            onClick={() => {
              handleSignOut();
            }}
            className="text-red-400 hover:text-red-300 flex items-center"
          >
            <span className="mr-2">Sign Out</span>
            <Lock className="h-4 w-4" />
          </button>
        </div>

        <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-xl border border-slate-700/50 relative overflow-hidden">
          {/* Background gradient effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-slate-500/5"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl"></div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mr-4">
                  <Database className="h-6 w-6 text-indigo-400" />
                </div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">
                  Admin Panel
                </h1>
              </div>

              <div className="ml-auto">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Tab navigation */}
            <div className="flex flex-wrap gap-2 border-b border-slate-700/50 mb-6">
              <button
                onClick={() => setActiveTab("applications")}
                className={`py-2 px-4 md:py-3 md:px-6 font-medium text-sm flex items-center transition-colors relative ${
                  activeTab === "applications"
                    ? "text-indigo-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-indigo-500 after:to-purple-500"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <div className="flex items-center">
                  <FileSpreadsheet className="h-4 w-4 mr-1" />
                  Applications
                </div>
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`py-2 px-4 md:py-3 md:px-6 font-medium text-sm flex items-center transition-colors relative ${
                  activeTab === "notifications"
                    ? "text-indigo-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-indigo-500 after:to-purple-500"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <div className="flex items-center">
                  <Bell className="h-4 w-4 mr-1" />
                  Notifications
                </div>
              </button>
              <Link
                to="/messages"
                className="py-2 px-4 md:py-3 md:px-6 font-medium text-sm flex items-center transition-colors text-slate-400 hover:text-white"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Messages
              </Link>
            </div>

            {/* Applications tab */}
            {activeTab === "applications" && (
              <div>
                <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-3 md:p-6 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <h2 className="text-lg font-semibold text-white flex items-center">
                      <FileSpreadsheet className="h-5 w-5 text-indigo-400 mr-2" />
                      Application Requests
                    </h2>
                    <div className="flex items-center gap-2">
                      <select
                        value={applicationFilter}
                        onChange={(e) => setApplicationFilter(e.target.value)}
                        className="flex-1 md:flex-none bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors hover:border-indigo-500/50"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <button
                        onClick={loadApplications}
                        disabled={isLoadingApplications}
                        className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-slate-700/50 rounded-lg transition-colors"
                      >
                        <RefreshCw
                          className={`h-5 w-5 ${
                            isLoadingApplications ? "animate-spin" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {isLoadingApplications ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                      <p className="text-slate-300">Loading applications...</p>
                    </div>
                  ) : !applications || applications.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <p>No {applicationFilter} applications found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications?.map((app) => (
                        <div
                          key={app.id}
                          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 group"
                        >
                          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                            <div>
                              <h3 className="text-lg font-medium text-white">
                                {app.name}
                              </h3>
                              <p className="text-slate-400">{app.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {app.status === "pending" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleApplicationStatus(
                                        app.id,
                                        "approved"
                                      )
                                    }
                                    className="px-4 py-2 bg-green-600/90 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-lg shadow-green-500/10 hover:shadow-green-500/20"
                                  >
                                    <UserCheck className="h-4 w-4 mr-1" />
                                    Approve
                                  </button>
                                  <button
                                    className="px-4 py-2 bg-red-600/90 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center shadow-lg shadow-red-500/10 hover:shadow-red-500/20"
                                    onClick={() => handleReject(app.id)}
                                  >
                                    <UserX className="h-4 w-4 mr-1" />
                                    Reject
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div>
                              <h4 className="text-sm font-medium text-slate-400 mb-2">
                                Interests
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {app.interests
                                  ?.sort()
                                  .map((interest, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-slate-700 rounded-md text-xs text-slate-300"
                                    >
                                      {interest}
                                    </span>
                                  ))}
                              </div>
                              {app.other_interest && (
                                <p className="mt-2 text-sm text-slate-300">
                                  Other: {app.other_interest}
                                </p>
                              )}
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-slate-400 mb-2">
                                YouTube Channels
                              </h4>
                              <div className="space-y-2">
                                {app.youtube_links?.map(
                                  (link, index) =>
                                    link && (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3 group-hover:bg-slate-700 transition-colors"
                                      >
                                        <a
                                          href={link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm text-indigo-400 hover:text-indigo-300 truncate max-w-full"
                                        >
                                          {link}
                                        </a>
                                      </div>
                                    )
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
                            <span>
                              Submitted:{" "}
                              {new Date(app.created_at).toLocaleString()}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full ${
                                app.status === "pending"
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : app.status === "approved"
                                  ? "bg-green-500/20 text-green-300"
                                  : "bg-red-500/20 text-red-300"
                              }`}
                            >
                              {app.status.charAt(0).toUpperCase() +
                                app.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rejection Modal */}
                {showRejectionModal && (
                  <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700/50 shadow-xl">
                      <h3 className="text-xl font-semibold text-white mb-4">
                        Provide Rejection Reason
                      </h3>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Enter reason for rejection..."
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 h-32 resize-none"
                      />
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => {
                            setShowRejectionModal(false);
                            setRejectionReason("");
                            setSelectedApplicationId(null);
                          }}
                          className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleRejectionSubmit}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notifications tab */}
            {activeTab === "notifications" && (
              <div>
                <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-3 md:p-6 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <h2 className="text-lg font-semibold text-white flex items-center">
                      <Bell className="h-5 w-5 text-indigo-400 mr-2" />
                      Send Notification
                      <span className="ml-2 text-sm font-normal text-slate-400">
                        (Send to individual user or all users)
                      </span>
                    </h2>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const formData = new FormData(form);
                      const sendToAll = formData.get("sendToAll") === "true";

                      try {
                        if (sendToAll) {
                          // Get all users with pending or approved applications
                          const { data: users, error: usersError } =
                            await supabase
                              .from("user_requests")
                              .select("user_id")
                              .in("status", ["pending", "approved"]);

                          if (usersError) throw usersError;

                          // Send notification to each user
                          for (const user of users || []) {
                            await supabase.rpc("create_notification", {
                              p_user_id: user.user_id,
                              p_title: formData.get("title") as string,
                              p_content: formData.get("content") as string,
                              p_type: formData.get("type") as string,
                            });
                          }

                          toast.success("Notifications sent to all users");
                        } else {
                          // Send to single user
                          const { error } = await supabase.rpc(
                            "create_notification",
                            {
                              p_user_id: formData.get("userId") as string,
                              p_title: formData.get("title") as string,
                              p_content: formData.get("content") as string,
                              p_type: formData.get("type") as string,
                            }
                          );

                          if (error) throw error;
                          toast.success("Notification sent successfully");
                        }

                        form.reset();
                      } catch (err) {
                        console.error("Error sending notification:", err);
                        toast.error("Failed to send notification");
                      }
                    }}
                    className="space-y-4"
                  >
                    {/* Send to All Toggle */}
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="sendToAll"
                        name="sendToAll"
                        value="true"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-600 rounded bg-slate-700"
                        onChange={(e) => {
                          const userIdInput = document.getElementById(
                            "userId"
                          ) as HTMLInputElement;
                          if (userIdInput) {
                            userIdInput.disabled = e.target.checked;
                            if (e.target.checked) {
                              userIdInput.value = "";
                            }
                          }
                        }}
                      />
                      <label
                        htmlFor="sendToAll"
                        className="text-sm font-medium text-slate-300"
                      >
                        Send to all users
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        User ID
                      </label>
                      <input
                        id="userId"
                        type="text"
                        name="userId"
                        required
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter user ID"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        required
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Notification title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        Content
                      </label>
                      <textarea
                        name="content"
                        required
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24"
                        placeholder="Notification content"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        Type
                      </label>
                      <select
                        name="type"
                        required
                        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="info">Info</option>
                        <option value="success">Success</option>
                        <option value="warning">Warning</option>
                        <option value="error">Error</option>
                      </select>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                      >
                        <Bell className="h-4 w-4 mr-2" />
                        <span id="submitButtonText">Send Notification</span>
                      </button>
                    </div>
                  </form>

                  {/* Update button text when checkbox changes */}
                  <script
                    dangerouslySetInnerHTML={{
                      __html: `
                      document.getElementById('sendToAll').addEventListener('change', function(e) {
                        const buttonText = document.getElementById('submitButtonText');
                        buttonText.textContent = e.target.checked ? 'Send to All Users' : 'Send Notification';
                      });
                    `,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
