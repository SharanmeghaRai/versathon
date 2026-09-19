import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProfileSetup from "./pages/ProfileSetup";
import Discover from "./pages/Discover";
import StudentProfile from "./pages/StudentProfile";
import Requests from "./pages/Requests";
import Chat from "./pages/Chat";
import Sessions from "./pages/Sessions";
import Notifications from "./pages/Notifications";
import Reviews from "./pages/Reviews";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-sand text-ink selection:bg-coral selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Pages (require logged-in user or demo mode) */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfileSetup /></ProtectedRoute>} />
          <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
          <Route path="/student/:id" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        </Routes>
      </main>

      <footer className="border-t border-mist bg-white/70 py-6 text-center text-xs text-ink/50">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Campus Skill Exchange. Peer-to-peer campus learning.</p>
          <div className="flex gap-4">
            <a href="/discover" className="hover:text-coral">Discover</a>
            <a href="/settings" className="hover:text-coral">Privacy & Safety</a>
            <a href="/admin" className="hover:text-coral">Admin</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
