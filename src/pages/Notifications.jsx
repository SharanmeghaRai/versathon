import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchNotifications, markNotificationAsRead } from "../utils/dataService";
import { BellIcon } from "../components/Icons";

export default function Notifications() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!currentUser) return;
    setLoading(true);
    const list = await fetchNotifications(currentUser.uid);
    setNotifications(list);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [currentUser]);

  async function handleMarkRead(id) {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  async function handleMarkAllRead() {
    for (const notif of notifications) {
      if (!notif.read) {
        await markNotificationAsRead(notif.id);
      }
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-ink">Notifications</h1>
          <p className="text-sm text-ink/60 mt-1">
            Stay updated on your exchange requests, session reminders, and reviews.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-semibold px-4 py-2 rounded-full bg-sand border border-mist text-ink hover:bg-white transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-ink/50">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-mist p-12 text-center">
          <BellIcon className="w-12 h-12 mx-auto text-ink/30 mb-3" />
          <h3 className="font-display font-bold text-lg text-ink">All caught up!</h3>
          <p className="text-sm text-ink/60 mt-1">
            You don't have any notifications right now.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const timeAgo = formatTimeAgo(notif.createdAt);
            return (
              <div
                key={notif.id}
                onClick={() => !notif.read && handleMarkRead(notif.id)}
                className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  notif.read
                    ? "bg-white border-mist text-ink/80"
                    : "bg-sand/30 border-coral/30 shadow-sm"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    notif.type === "request"
                      ? "bg-coral/10 text-coral"
                      : notif.type === "accepted"
                      ? "bg-emerald-100 text-emerald-700"
                      : notif.type === "session"
                      ? "bg-sky-100 text-sky-700"
                      : "bg-sun/20 text-ink"
                  }`}
                >
                  <BellIcon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-sm text-ink">{notif.title}</h4>
                    <span className="text-[11px] text-ink/40 whitespace-nowrap">{timeAgo}</span>
                  </div>
                  <p className="text-sm text-ink/70 mt-1 leading-relaxed">{notif.message}</p>
                  {notif.link && (
                    <Link
                      to={notif.link}
                      className="inline-block mt-3 text-xs font-semibold text-coral hover:underline"
                    >
                      View Details →
                    </Link>
                  )}
                </div>

                {!notif.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-coral shrink-0 mt-1.5" title="Unread" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return "Recently";
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
