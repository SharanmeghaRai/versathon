import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchNotifications } from "../utils/dataService";
import { BellIcon, ChatIcon, CalendarIcon, ShieldCheckIcon } from "./Icons";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { currentUser, profile, logout, isFirebaseConfigured } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function checkNotifs() {
      if (!currentUser) return;
      const notifs = await fetchNotifications(currentUser.uid);
      setUnreadCount(notifs.filter((n) => !n.read).length);
    }
    checkNotifs();
    const interval = setInterval(checkNotifs, 5000);
    return () => clearInterval(interval);
  }, [currentUser]);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  const navLinks = currentUser
    ? [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/discover", label: "Discover" },
        { to: "/requests", label: "Requests" },
        { to: "/chat", label: "Chat" },
        { to: "/sessions", label: "Sessions" },
      ]
    : [];

  return (
    <header className="bg-sand/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-mist dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link to="/" className="font-display font-black text-xl tracking-tight text-ink dark:text-white flex items-center gap-1">
            <span>Campus</span>
            <span className="text-coral">Skill</span>
            <span>Exchange</span>
          </Link>
          {!isFirebaseConfigured && (
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sun/30 dark:bg-amber-950/50 border border-sun dark:border-amber-600/60 text-ink/80 dark:text-amber-300">
              Demo Mode
            </span>
          )}
        </div>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map(({ to, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`text-sm font-medium transition-colors ${
                  isActive ? "text-coral font-bold" : "text-ink/75 hover:text-ink dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {currentUser ? (
            <>
              {/* Notification Bell */}
              <Link
                to="/notifications"
                className="relative p-2 rounded-full hover:bg-white dark:hover:bg-slate-800 text-ink/70 hover:text-ink dark:text-slate-300 dark:hover:text-white transition-colors"
                title="Notifications"
              >
                <BellIcon className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-coral text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>

              {/* Admin Link */}
              <Link
                to="/admin"
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-sand dark:bg-slate-800 border border-mist dark:border-slate-700 text-ink dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 flex items-center gap-1 transition-colors"
                title="Admin Dashboard"
              >
                <ShieldCheckIcon className="w-3.5 h-3.5 text-coral" />
                <span>Admin</span>
              </Link>

              {/* Profile Link */}
              <Link
                to="/profile"
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-mist dark:border-slate-700 text-xs font-semibold text-ink dark:text-slate-200 hover:border-coral transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-coral text-white flex items-center justify-center text-[11px] font-bold">
                  {profile?.name?.[0]?.toUpperCase() || "U"}
                </span>
                <span className="max-w-[100px] truncate">{profile?.name || "Profile"}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-ink dark:bg-slate-800 text-white text-xs font-medium hover:bg-ink/90 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700 shadow-sm transition-colors cursor-pointer"
              >
                Log out
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-semibold text-ink dark:text-slate-200 hover:text-coral transition-colors">
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 rounded-full bg-coral text-white text-sm font-semibold hover:bg-coral/90 shadow-sm transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          {currentUser && unreadCount > 0 && (
            <Link to="/notifications" className="relative p-2 text-coral">
              <BellIcon className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-coral"></span>
            </Link>
          )}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-2 text-ink dark:text-slate-200 rounded-lg focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="lg:hidden px-6 py-4 bg-sand dark:bg-slate-900 border-t border-mist dark:border-slate-800 flex flex-col gap-3 shadow-lg transition-colors">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="py-2 text-sm font-semibold text-ink dark:text-slate-200 border-b border-mist/50 dark:border-slate-800"
            >
              {label}
            </Link>
          ))}

          {currentUser ? (
            <>
              <Link
                to="/notifications"
                onClick={() => setMenuOpen(false)}
                className="py-2 text-sm font-semibold text-ink dark:text-slate-200 flex items-center justify-between"
              >
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-coral text-white text-xs font-bold">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="py-2 text-sm font-semibold text-ink dark:text-slate-200"
              >
                Edit My Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setMenuOpen(false)}
                className="py-2 text-sm font-semibold text-ink dark:text-slate-200"
              >
                Settings & Safety
              </Link>
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="py-2 text-sm font-semibold text-coral"
              >
                Admin Dashboard
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="mt-2 w-full py-2.5 rounded-full bg-ink dark:bg-slate-800 text-white text-sm font-medium border border-transparent dark:border-slate-700"
              >
                Log out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="py-2 text-sm font-semibold text-ink dark:text-slate-200"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="py-2 text-sm font-semibold text-coral"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
