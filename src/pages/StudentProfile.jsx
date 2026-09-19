import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  fetchStudentById,
  createExchangeRequest,
  fetchReviewsForTeacher,
  reportUser,
} from "../utils/dataService";
import SkillTag from "../components/SkillTag";
import { StarIcon, ShieldCheckIcon, SparklesIcon } from "../components/Icons";

export default function StudentProfile() {
  const { id } = useParams();
  const { currentUser, profile } = useAuth();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [skillWanted, setSkillWanted] = useState("");
  const [skillOffered, setSkillOffered] = useState("");
  const [message, setMessage] = useState("");
  const [requestStatus, setRequestStatus] = useState({ type: "", text: "" });

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [st, revs] = await Promise.all([
        fetchStudentById(id),
        fetchReviewsForTeacher(id),
      ]);
      setStudent(st);
      setReviews(revs);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSendRequest(e) {
    e.preventDefault();
    if (!skillWanted || !skillOffered) {
      setRequestStatus({
        type: "error",
        text: "Please select what you want to learn and what you will teach.",
      });
      return;
    }

    try {
      await createExchangeRequest({
        fromId: currentUser.uid,
        fromName: profile?.name || "Peer Student",
        toId: student.id,
        toName: student.name,
        skillWanted,
        skillOffered,
        message: message.trim(),
        status: "pending",
        createdAt: Date.now(),
      });

      setRequestStatus({ type: "success", text: "Skill exchange request sent! 🎉" });
      setTimeout(() => navigate("/requests"), 1000);
    } catch (err) {
      setRequestStatus({
        type: "error",
        text: "Could not send the request. Please try again.",
      });
    }
  }

  async function handleReportSubmit(e) {
    e.preventDefault();
    if (!reportReason.trim()) return;

    await reportUser({
      reportedUserId: student.id,
      reportedUserName: student.name,
      reporterId: currentUser.uid,
      reason: reportReason.trim(),
    });

    setReportSuccess(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSuccess(false);
      setReportReason("");
    }, 1500);
  }

  if (loading) {
    return <div className="text-center py-20 text-ink/50">Loading student profile...</div>;
  }
  if (!student) {
    return (
      <div className="text-center py-20 text-ink/50">
        <p>Student not found.</p>
        <Link to="/discover" className="text-coral font-medium mt-2 inline-block">
          Return to Discover
        </Link>
      </div>
    );
  }

  const initials = student.name
    ? student.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-mist p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-ink text-white flex items-center justify-center font-display font-black text-2xl shrink-0 shadow-md">
              {initials}
            </div>
            <div>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink">
                {student.name}
              </h1>
              <p className="text-sm font-medium text-ink/65 mt-0.5">
                {student.college} · {student.department} · Year {student.year}
              </p>
              {student.rating && (
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="flex text-amber-500">
                    <StarIcon className="w-4 h-4" filled />
                  </div>
                  <span className="text-xs font-bold text-ink">
                    {Number(student.rating).toFixed(1)} / 5.0
                  </span>
                  <span className="text-xs text-ink/40">
                    ({student.reviewCount || reviews.length} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick stats / Points */}
          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-full bg-sun/30 border border-sun text-ink font-bold text-xs flex items-center gap-1">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>{student.points || 0} Points</span>
            </span>
            <button
              onClick={() => setShowReportModal(true)}
              className="text-[11px] text-ink/40 hover:text-red-600"
            >
              🚩 Report / Moderate
            </button>
          </div>
        </div>

        {student.bio && (
          <p className="mt-6 text-sm sm:text-base text-ink/80 leading-relaxed bg-sand/30 p-4 rounded-2xl border border-mist/60">
            {student.bio}
          </p>
        )}

        {/* Badges */}
        {student.badges && student.badges.length > 0 && (
          <div className="mt-6">
            <p className="text-xs uppercase font-bold tracking-wider text-ink/40 mb-2">
              Earned Badges
            </p>
            <div className="flex flex-wrap gap-2">
              {student.badges.map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1 rounded-full bg-sand text-ink text-xs font-semibold border border-mist flex items-center gap-1"
                >
                  <span>🏅</span>
                  <span>{badge}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skills Grid */}
        <div className="grid sm:grid-cols-2 gap-6 mt-8 pt-6 border-t border-mist/80">
          <div>
            <p className="text-xs uppercase font-bold tracking-wider text-ink/40 mb-2">
              Skills {student.name.split(" ")[0]} Can Teach
            </p>
            <div className="flex flex-wrap gap-2">
              {(student.teachingSkills || []).map((s) => (
                <SkillTag key={s} tone="teach">{s}</SkillTag>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase font-bold tracking-wider text-ink/40 mb-2">
              Skills {student.name.split(" ")[0]} Wants to Learn
            </p>
            <div className="flex flex-wrap gap-2">
              {(student.learningSkills || []).map((s) => (
                <SkillTag key={s} tone="learn">{s}</SkillTag>
              ))}
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-mist/60 text-xs text-ink/80">
          <div>
            <span className="font-bold text-ink block">Skill Level:</span>
            <span>{student.skillLevel || "Intermediate"}</span>
          </div>
          <div>
            <span className="font-bold text-ink block">Learning Mode:</span>
            <span>{student.learningMode || "Both"}</span>
          </div>
          <div>
            <span className="font-bold text-ink block">Availability:</span>
            <span>{student.availability || "Flexible on weekends"}</span>
          </div>
        </div>

        {/* Send Request Call to Action */}
        {!showForm ? (
          <div className="mt-8 pt-6 border-t border-mist flex justify-start">
            <button
              onClick={() => setShowForm(true)}
              className="px-7 py-3 rounded-full bg-coral text-white font-semibold text-sm hover:bg-coral/90 shadow-sm"
            >
              Send Skill Exchange Request
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSendRequest}
            className="mt-8 pt-6 border-t border-mist bg-sand/30 p-6 rounded-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-ink">
                Send Skill Exchange Request
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-xs text-ink/50 hover:text-ink"
              >
                ✕ Cancel
              </button>
            </div>

            <label className="block">
              <span className="text-xs font-bold uppercase text-ink/60">
                What do you want to learn from {student.name}?
              </span>
              <select
                value={skillWanted}
                onChange={(e) => setSkillWanted(e.target.value)}
                required
                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-mist bg-white text-sm"
              >
                <option value="">Select a skill...</option>
                {(student.teachingSkills || []).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase text-ink/60">
                What skill will you teach {student.name} in return?
              </span>
              {(profile?.teachingSkills || []).length > 0 ? (
                <select
                  value={skillOffered}
                  onChange={(e) => setSkillOffered(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-2.5 rounded-xl border border-mist bg-white text-sm"
                >
                  <option value="">Select a skill from your profile...</option>
                  {(profile?.teachingSkills || []).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <div className="mt-1 text-xs text-coral font-medium">
                  You haven't listed any teaching skills in your profile yet.{" "}
                  <Link to="/profile" className="underline font-bold">
                    Add skills now
                  </Link>
                </div>
              )}
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase text-ink/60">
                Personal message
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder={`Hi ${student.name.split(" ")[0]}, I would love to learn from you...`}
                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-mist bg-white text-sm"
              />
            </label>

            {requestStatus.text && (
              <p
                className={`text-xs font-semibold rounded-lg px-3 py-2 border ${
                  requestStatus.type === "error"
                    ? "text-red-600 bg-red-50 border-red-200"
                    : "text-green-700 bg-green-50 border-green-200"
                }`}
              >
                {requestStatus.text}
              </p>
            )}

            <button
              type="submit"
              disabled={!(profile?.teachingSkills || []).length}
              className="px-6 py-2.5 rounded-full bg-ink text-white font-medium text-xs hover:bg-ink/90 disabled:opacity-50"
            >
              Confirm & Send Request
            </button>
          </form>
        )}
      </div>

      {/* Reviews Section */}
      <div className="mt-10 bg-white rounded-3xl border border-mist p-6 sm:p-8 shadow-sm">
        <h3 className="font-display font-bold text-xl text-ink mb-1">
          Reviews & Recommendations ({reviews.length})
        </h3>
        <p className="text-xs text-ink/60 mb-6">
          Ratings from campus students who completed exchanges with {student.name}.
        </p>

        {reviews.length === 0 ? (
          <p className="text-xs text-ink/50 py-4 text-center bg-sand/30 rounded-xl">
            No written reviews yet. Be the first to exchange skills and leave feedback!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl border border-mist/70 bg-sand/20">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-xs text-ink">{r.reviewerName}</span>
                  <div className="flex text-amber-400">
                    {Array.from({ length: r.rating || 5 }).map((_, i) => (
                      <StarIcon key={i} className="w-3.5 h-3.5" filled />
                    ))}
                  </div>
                </div>
                {r.skill && (
                  <span className="text-[11px] font-semibold text-coral block mb-1">
                    Learned: {r.skill}
                  </span>
                )}
                <p className="text-xs text-ink/80 leading-relaxed italic">"{r.comment}"</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-mist">
            <h3 className="font-display font-bold text-lg text-ink mb-2">
              Report Student Profile
            </h3>
            <p className="text-xs text-ink/60 mb-4">
              Help keep our campus learning community safe and respectful.
            </p>

            {reportSuccess ? (
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-semibold">
                Report submitted to campus moderators. Thank you.
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3">
                <textarea
                  required
                  rows={3}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Describe the issue (inappropriate content, spam, ghosting)..."
                  className="w-full p-3 rounded-xl border border-mist text-xs"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 rounded-full border border-mist text-xs text-ink"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
