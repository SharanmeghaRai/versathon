import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  fetchSessions,
  createLearningSession,
  updateSessionStatus,
  fetchAllStudents,
} from "../utils/dataService";
import { CalendarIcon, SparklesIcon } from "../components/Icons";

export default function Sessions() {
  const { currentUser, profile, updateCurrentUserProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const partnerParam = searchParams.get("partner") || "";
  const skillParam = searchParams.get("skill") || "";
  const showNewParam = searchParams.get("new") === "true";

  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(showNewParam);
  const [activeTab, setActiveTab] = useState("all");

  // Form State
  const [formData, setFormData] = useState({
    skill: skillParam || "",
    role: "teacher", // "teacher" (I teach) or "learner" (I learn)
    partnerId: "",
    partnerName: partnerParam || "",
    date: "",
    time: "16:00",
    mode: "Online",
    location: "Google Meet link or campus library room",
    notes: "",
  });

  const [feedbackMsg, setFeedbackMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    async function init() {
      if (!currentUser) return;
      setLoading(true);
      const [allSessions, allStudents] = await Promise.all([
        fetchSessions(currentUser.uid),
        fetchAllStudents(currentUser.uid),
      ]);
      setSessions(allSessions);
      setStudents(allStudents);
      setLoading(false);
    }
    init();
  }, [currentUser]);

  async function handleCreateSession(e) {
    e.preventDefault();
    if (!formData.skill.trim() || !formData.date) {
      setFeedbackMsg({ text: "Please enter a skill, date, and details.", type: "error" });
      return;
    }

    const isTeaching = formData.role === "teacher";
    const selectedStudent = students.find((s) => s.id === formData.partnerId);
    const partnerDisplayName = selectedStudent ? selectedStudent.name : formData.partnerName || "Campus Peer";

    const payload = {
      skill: formData.skill.trim(),
      teacherId: isTeaching ? currentUser.uid : (selectedStudent ? selectedStudent.id : "peer_id"),
      teacherName: isTeaching ? (profile?.name || "Me") : partnerDisplayName,
      learnerId: isTeaching ? (selectedStudent ? selectedStudent.id : "peer_id") : currentUser.uid,
      learnerName: isTeaching ? partnerDisplayName : (profile?.name || "Me"),
      currentUserId: currentUser.uid,
      date: formData.date,
      time: formData.time,
      mode: formData.mode,
      location: formData.location.trim(),
      notes: formData.notes.trim(),
      status: "Scheduled",
      createdAt: Date.now(),
    };

    await createLearningSession(payload);
    setShowModal(false);
    setFeedbackMsg({ text: "Learning session scheduled successfully!", type: "success" });
    const refreshed = await fetchSessions(currentUser.uid);
    setSessions(refreshed);
  }

  async function handleStatusChange(sessionId, newStatus, session) {
    await updateSessionStatus(sessionId, newStatus);

    // Gamification Points handling upon completion:
    // Teacher gets +20 points, Learner gets +10 points
    if (newStatus === "Completed") {
      const isTeacher = session.teacherId === currentUser.uid;
      const pointsToAdd = isTeacher ? 20 : 10;
      const currentPoints = profile?.points || 0;
      const newPoints = currentPoints + pointsToAdd;

      // Check badges
      const existingBadges = profile?.badges || [];
      const updatedBadges = [...existingBadges];
      if (!updatedBadges.includes("First Exchange")) {
        updatedBadges.push("First Exchange");
      }
      if (newPoints >= 100 && !updatedBadges.includes("10 Sessions")) {
        updatedBadges.push("10 Sessions");
      }

      await updateCurrentUserProfile({
        points: newPoints,
        badges: updatedBadges,
      });

      setFeedbackMsg({
        text: `Session completed! You earned +${pointsToAdd} points! 🌟`,
        type: "success",
      });
    }

    const refreshed = await fetchSessions(currentUser.uid);
    setSessions(refreshed);
  }

  const filteredSessions = sessions.filter((s) => {
    if (activeTab === "all") return true;
    return s.status.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-ink">Learning Sessions</h1>
          <p className="text-sm text-ink/60 mt-1">
            Arrange 1-on-1 teaching and practice sessions with your campus peers.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-coral text-white text-sm font-medium hover:bg-coral/90 transition-all shadow-sm"
        >
          <CalendarIcon className="w-4 h-4" />
          <span>+ Schedule New Session</span>
        </button>
      </div>

      {feedbackMsg.text && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm font-medium border ${
            feedbackMsg.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {feedbackMsg.text}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-mist pb-3 overflow-x-auto">
        {["all", "Scheduled", "Completed", "Cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab.toLowerCase() === tab.toLowerCase()
                ? "bg-ink text-white"
                : "bg-white border border-mist text-ink/60 hover:text-ink"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-ink/50">Loading sessions...</div>
      ) : filteredSessions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-mist p-12 text-center max-w-lg mx-auto">
          <CalendarIcon className="w-12 h-12 mx-auto text-ink/30 mb-3" />
          <h3 className="font-display font-bold text-lg text-ink">No {activeTab} sessions found</h3>
          <p className="text-sm text-ink/60 mt-1 mb-6">
            Ready to exchange skills? Schedule your first practice call or campus meetup!
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2.5 rounded-full bg-ink text-white text-sm font-medium hover:bg-ink/90"
          >
            Schedule a Session
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filteredSessions.map((session) => {
            const isTeacher = session.teacherId === currentUser.uid;
            const partnerName = isTeacher ? session.learnerName : session.teacherName;
            const statusColor =
              session.status === "Completed"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : session.status === "Cancelled"
                ? "bg-rose-50 border-rose-200 text-rose-700"
                : "bg-amber-50 border-amber-200 text-amber-700";

            return (
              <div
                key={session.id}
                className="bg-white rounded-2xl border border-mist p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sand text-ink">
                      {isTeacher ? "🎓 You are Teaching" : "🎒 You are Learning"}
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColor}`}>
                      {session.status}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-ink mb-1">{session.skill}</h3>
                  <p className="text-sm text-ink/70">
                    With: <span className="font-semibold text-ink">{partnerName}</span>
                  </p>

                  <div className="mt-4 pt-4 border-t border-mist/60 space-y-2 text-xs sm:text-sm text-ink/80">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-ink">📅 Date:</span>
                      <span>{session.date} at {session.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-ink">📍 Mode:</span>
                      <span className="capitalize">{session.mode}</span>
                    </div>
                    {session.location && (
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-ink">🔗 Details:</span>
                        <span className="break-all">{session.location}</span>
                      </div>
                    )}
                    {session.notes && (
                      <div className="mt-2 text-xs italic text-ink/60 bg-sand/50 p-2.5 rounded-lg">
                        "{session.notes}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-6 pt-4 border-t border-mist flex flex-wrap items-center gap-2">
                  {session.status === "Scheduled" && (
                    <>
                      <button
                        onClick={() => handleStatusChange(session.id, "Completed", session)}
                        className="px-4 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-colors"
                      >
                        ✓ Mark Completed (+{isTeacher ? "20" : "10"} pts)
                      </button>
                      <button
                        onClick={() => handleStatusChange(session.id, "Cancelled", session)}
                        className="px-3 py-1.5 rounded-full border border-mist text-ink/60 text-xs font-medium hover:bg-sand"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {session.status === "Completed" && !isTeacher && (
                    <Link
                      to={`/reviews?teacherId=${session.teacherId}&teacherName=${encodeURIComponent(session.teacherName)}&skill=${encodeURIComponent(session.skill)}`}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-sun/30 text-ink text-xs font-semibold hover:bg-sun/40 transition-colors"
                    >
                      <SparklesIcon className="w-3.5 h-3.5" />
                      <span>Leave a Review</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Scheduling */}
      {showModal && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-mist max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-xl text-ink">Schedule Learning Session</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-ink/40 hover:text-ink text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-ink/60 mb-1">
                  Skill to focus on
                </label>
                <input
                  type="text"
                  required
                  value={formData.skill}
                  onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                  placeholder="e.g. React Component Architecture, Python Pandas"
                  className="w-full px-4 py-2.5 rounded-xl border border-mist text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-ink/60 mb-1">
                    Your role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-mist text-sm bg-white"
                  >
                    <option value="teacher">I am Teaching</option>
                    <option value="learner">I am Learning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-ink/60 mb-1">
                    Mode
                  </label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-mist text-sm bg-white"
                  >
                    <option value="Online">Online (Meet/Zoom)</option>
                    <option value="Offline">Offline (Campus/Library)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-ink/60 mb-1">
                  Partner Student
                </label>
                {students.length > 0 ? (
                  <select
                    value={formData.partnerId}
                    onChange={(e) => {
                      const sel = students.find((s) => s.id === e.target.value);
                      setFormData({
                        ...formData,
                        partnerId: e.target.value,
                        partnerName: sel ? sel.name : "",
                      });
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-mist text-sm bg-white"
                  >
                    <option value="">Select a student...</option>
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.department})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData.partnerName}
                    onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                    placeholder="Enter peer's name"
                    className="w-full px-4 py-2.5 rounded-xl border border-mist text-sm"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-ink/60 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-mist text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-ink/60 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-mist text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-ink/60 mb-1">
                  Meeting Link or Location Details
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Google Meet link or Campus Library Floor 2"
                  className="w-full px-4 py-2.5 rounded-xl border border-mist text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-ink/60 mb-1">
                  Notes or Agenda (optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="What topics will you cover in this session?"
                  className="w-full px-4 py-2.5 rounded-xl border border-mist text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-full border border-mist text-sm font-medium text-ink hover:bg-sand"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-coral text-white text-sm font-medium hover:bg-coral/90"
                >
                  Confirm Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
