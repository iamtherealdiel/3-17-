import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {}, [user]); // Add user to dependency array
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-slate-300">Loading... </p>
        </div>
      </div>
    );
  }
  if (!user && location.pathname === "/purple") {
    return <Navigate to="/purple-login" state={{ from: location }} replace />;
  }
  if (!user) {
    // Remove toast call here to avoid duplicate notifications
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
