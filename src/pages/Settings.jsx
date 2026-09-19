import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { isFirebaseConfigured } from "../firebase";
import { ShieldCheckIcon, CogIcon } from "../components/Icons";

export default function Settings() {
  const { profile, updateCurrentUserProfile } = useAuth();

  const [privacy, setPrivacy] = useState({
    hideEmail: true,
    campusOnly: true,
    allowDirectRequests: true,
    notifyOnNewMessage: true,
  });

  const [blockedUsers, setBlockedUsers] = useState([
    { id: "blocked_1", name: "SpamBot User", reason: "Irrelevant messages" }
  ]);

  const [saved, setSaved] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function unblock(id) {
    setBlockedUsers((prev) => prev.filter((u) => u.id !== id));
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-ink">Account & Safety Settings</h1>
        <p className="text-sm text-ink/60 mt-1">
          Control your privacy, campus safety options, and system preferences.
        </p>
      </div>

      {saved && (
        <div className="mb-6 p-4 rounded-xl text-sm font-medium bg-green-50 border border-green-200 text-green-800">
          Settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Privacy & Safety */}
        <div className="bg-white rounded-2xl border border-mist p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-ink">
            <ShieldCheckIcon className="w-5 h-5 text-coral" />
            <h2 className="font-display font-bold text-lg">Privacy & Student Safety</h2>
          </div>

          <div className="space-y-4 divide-y divide-mist/60 text-sm">
            <div className="pt-2 flex items-center justify-between">
              <div>
                <p className="font-semibold text-ink">Protect Private Contact Info</p>
                <p className="text-xs text-ink/60">
                  Keep phone numbers and personal emails hidden until a request is accepted.
                </p>
              </div>
              <input
                type="checkbox"
                checked={privacy.hideEmail}
                onChange={(e) => setPrivacy({ ...privacy, hideEmail: e.target.checked })}
                className="w-4 h-4 text-coral rounded focus:ring-coral"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-ink">Campus Only Visibility</p>
                <p className="text-xs text-ink/60">
                  Only show my profile to verified students from {profile?.college || "my college"}.
                </p>
              </div>
              <input
                type="checkbox"
                checked={privacy.campusOnly}
                onChange={(e) => setPrivacy({ ...privacy, campusOnly: e.target.checked })}
                className="w-4 h-4 text-coral rounded focus:ring-coral"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-ink">Accept Incoming Exchange Requests</p>
                <p className="text-xs text-ink/60">
                  Allow students who match your skills to send you exchange invites.
                </p>
              </div>
              <input
                type="checkbox"
                checked={privacy.allowDirectRequests}
                onChange={(e) => setPrivacy({ ...privacy, allowDirectRequests: e.target.checked })}
                className="w-4 h-4 text-coral rounded focus:ring-coral"
              />
            </div>
          </div>
        </div>

        {/* Blocked Users Moderation */}
        <div className="bg-white rounded-2xl border border-mist p-6 shadow-sm">
          <h2 className="font-display font-bold text-lg text-ink mb-1">Blocked Users</h2>
          <p className="text-xs text-ink/60 mb-4">
            Blocked accounts cannot view your profile or send you exchange requests.
          </p>

          {blockedUsers.length === 0 ? (
            <p className="text-xs text-ink/50 py-3">You haven't blocked any users.</p>
          ) : (
            <div className="divide-y divide-mist/60">
              {blockedUsers.map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between text-sm">
                  <div>
                    <span className="font-semibold text-ink">{b.name}</span>
                    <span className="text-xs text-ink/40 ml-2">({b.reason})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => unblock(b.id)}
                    className="text-xs px-3 py-1 rounded-full border border-mist text-ink hover:bg-sand font-medium"
                  >
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System & Connection Status */}
        <div className="bg-white rounded-2xl border border-mist p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <CogIcon className="w-5 h-5 text-ink/70" />
            <h2 className="font-display font-bold text-lg text-ink">Firebase Status</h2>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-sand/40 border border-mist text-sm">
            <div>
              <p className="font-semibold text-ink">
                Database Mode:{" "}
                <span className={isFirebaseConfigured ? "text-emerald-700" : "text-amber-700 font-bold"}>
                  {isFirebaseConfigured ? "Live Firebase Connected" : "Local Demo Storage Mode"}
                </span>
              </p>
              <p className="text-xs text-ink/60 mt-0.5">
                {isFirebaseConfigured
                  ? "Connected to Firestore and Firebase Authentication."
                  : "Using fast local data with realistic student samples. See README.md Step 7 to connect your live Firebase project!"}
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-full bg-ink text-white text-sm font-medium hover:bg-ink/90 transition-colors"
        >
          Save Preferences
        </button>
      </form>
    </div>
  );
}
