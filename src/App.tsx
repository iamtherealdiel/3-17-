import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import ChannelManagement from "./pages/features/ChannelManagement";
import DigitalRights from "./pages/features/DigitalRights";
import GlobalDistribution from "./pages/features/GlobalDistribution";
import BoutiqueMonetization from "./pages/features/BoutiqueMonetization";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import AdminPanel from "./pages/AdminPanel";
import LabelGrowth from "./pages/LabelGrowth";
import ShowGrowth from "./pages/ShowGrowth";
import Welcome from "./pages/Welcome";
import Messages from "./pages/Messages";
import { setDocumentTitle } from "./utils/titleUtils";
import PurpleLogin from "./pages/PurpleLogin";
function App() {
  const location = useLocation();

  useEffect(() => {
    // Set document title based on current route
    const pathname = location.pathname;

    // Map routes to page titles
    const routeTitles: Record<string, string> = {
      "/": "Home",
      "/login": "Log In",
      "/signup": "Sign Up",
      "/welcome": "Welcome",
      "/dashboard": "Dashboard",
      "/features/channel-management": "Channel Management",
      "/features/digital-rights": "Digital Rights",
      "/features/global-distribution": "Global Distribution",
      "/features/boutique-monetization": "Boutique Monetization",
      "/purple": "Admin Panel",
      "/messages": "Messages",
      "/labelgrowth": "Label Growth",
      "/showgrowth": "Show Growth",
      "/purple-login": "Admin Login",
    };

    // Get the title for the current route or use a default
    const currentTitle = routeTitles[pathname] || "Page Not Found";

    // Set the document title
    setDocumentTitle(currentTitle);
  }, [location]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/features/channel-management"
        element={<ChannelManagement />}
      />
      <Route path="/features/digital-rights" element={<DigitalRights />} />
      <Route
        path="/features/global-distribution"
        element={<GlobalDistribution />}
      />
      <Route
        path="/features/boutique-monetization"
        element={<BoutiqueMonetization />}
      />
      <Route path="/" element={<HomePage />} />
      <Route
        path="/purple"
        element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route path="/purple-login" element={<PurpleLogin />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/labelgrowth" element={<LabelGrowth />} />
      <Route path="/showgrowth" element={<ShowGrowth />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default App;
