import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { validateEmail } from "../utils/validation"; // Remove this line
import { supabase } from "../lib/supabase";

// Utility to prevent duplicate toasts
const shownToasts = new Set<string>();
const showUniqueToast = (
  message: string,
  type: "success" | "error",
  id?: string
) => {
  const toastId = id || message;
  if (!shownToasts.has(toastId)) {
    shownToasts.add(toastId);

    if (type === "success") {
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

export default function PurpleLogin() {
  // Change email to username
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Update errors to track username instead of email
  const [errors, setErrors] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  async function getEmailFromUsername(username: string) {
    const { data, error } = await supabase.rpc("get_email_from_user_name", {
      input_user_name: username,
    });

    if (error) {
      console.error("Error retrieving email:", error.message);
    } else {
      return data;
    }
  }
  // Get the redirect path from location state, default to dashboard
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/dashboard";

  const validateForm = (): boolean => {
    const newErrors = { username: "", password: "" };
    let isValid = true;

    if (!username) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Update to use username instead of email
      if (username.includes("@")) {
        return toast.error("You should enter a valid username!");
      }
      const email = await getEmailFromUsername(username);
      if (email === null) {
        setErrors({
          username: "Invalid credentials",
          password: "Invalid credentials",
        });
        return;
      }

      await signIn(email, password);
      // Note: Success toast is now handled in AuthContext to avoid duplicates
      // Redirect to the originally requested page
      navigate(from, { replace: true });
    } catch (error: any) {
      const errorMessage = error.message || "Invalid username or password";
      if (errorMessage.includes("credentials")) {
        setErrors({
          username: "Invalid credentials",
          password: "Invalid credentials",
        });
      } else {
        showUniqueToast(errorMessage, "error", "login-error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-slate-800 p-8 rounded-xl shadow-lg">
        <div>
          <Link
            to="/"
            className="inline-flex items-center text-slate-400 hover:text-white mb-8"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to home
          </Link>
          <div className="flex items-center justify-center">
            <img
              src="https://dlveiezovfooqbbfzfmo.supabase.co/storage/v1/object/public/Images//mtiger.png"
              alt="MediaTiger Logo"
              className="h-20 w-20"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in as Admin
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-300"
              >
                Admin Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors((prev) => ({ ...prev, username: "" }));
                }}
                className={`mt-1 block w-full px-3 py-2 bg-slate-700 border ${
                  errors.username ? "border-red-500" : "border-slate-600"
                } rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                placeholder="Enter admin username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
                className={`mt-1 block w-full px-3 py-2 bg-slate-700 border ${
                  errors.password ? "border-red-500" : "border-slate-600"
                } rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-600 rounded bg-slate-700"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-slate-300"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm"></div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
