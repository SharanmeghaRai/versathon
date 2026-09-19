import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  fetchRequests,
  fetchAllStudents,
  fetchSessions,
} from "../utils/dataService";
import StudentCard from "../components/StudentCard";
import SkillTag from "../components/SkillTag";
import { isGreatMatch } from "../utils/matching";
import { SparklesIcon, CalendarIcon, ChatIcon } from "../components/Icons";

export default function Dashboard() {
  const { currentUser, profile } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [matches, setMatches] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!currentUser) return;
      setLoading(true);

      try {
        const [reqs, students, sessions] = await Promise.all([
          fetchRequests(currentUser.uid),
          fetchAllStudents(currentUser.uid),
          fetchSessions(currentUser.uid),
        ]);

        const pend = reqs.received.filter((r) => r.status === "pending").length;
        setPendingCount(pend);

        const completedExchanges = [...reqs.received, ...reqs.sent].filter(
          (r) => r.status === "accepted" || r.status === "completed"
        ).length;
        setCompletedCount(completedExchanges);

        const upcoming = sessions.filter((s) => s.status === "Scheduled");
        setUpcomingSessions(upcoming);

        const matched = students.filter((s) => isGreatMatch(profile, s));
        setMatches(matched.length > 0 ? matched.slice(0, 3) : students.slice(0, 3));
      } catch (err) {
        console.warn("Dashboard loading notice:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUser, profile]);

  const firstName = profile?.name ? profile.name.split(" ")[0] : "Student";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white rounded-3xl border border-mist p-6 sm:p-8 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand text-ink text-xs font-semibold mb-2">
            <span>🎓</span>
            <span>{profile?.college || "Campus Member"}</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
            Welcome back, {firstName}!
          </h1>
          <p className="text-sm sm:text-base text-ink/65 mt-1">
            Ready to exchange skills? You have{" "}
            <span className="font-bold text-coral">{pendingCount} pending</span> request
            {pendingCount === 1 ? "" : "s"} waiting for your attention.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/discover"
            className="px-5 py-2.5 rounded-full bg-coral text-white text-xs sm:text-sm font-semibold hover:bg-coral/90 shadow-sm"
          >
            Find Skill Matches
          </Link>
          <Link
            to="/sessions"
            className="px-4 py-2.5 rounded-full bg-sand border border-mist text-ink text-xs sm:text-sm font-semibold hover:bg-white"
          >
            My Sessions
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        <StatCard
          label="Skills I Teach"
          value={profile?.teachingSkills?.length || 0}
          icon="🎓"
        />
        <StatCard
          label="Skills I Want"
          value={profile?.learningSkills?.length || 0}
          icon="🎒"
        />
        <StatCard
          label="Pending Requests"
          value={pendingCount}
          highlight={pendingCount > 0}
          icon="📬"
          link="/requests"
        />
        <StatCard
          label="Active Exchanges"
          value={completedCount}
          icon="🤝"
        />
        <StatCard
          label="Campus Points"
          value={`${profile?.points || 0} pts`}
          icon="🏆"
        />
      </div>

      {/* Skills Summary & Upcoming Sessions */}
      <div className="grid lg:grid-cols-12 gap-8 mb-12">
        {/* Left: Skills Pill Cards */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-mist rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase font-bold tracking-wider text-ink/40">
                Skills I Can Teach ({profile?.teachingSkills?.length || 0})
              </p>
              <Link to="/profile" className="text-xs font-semibold text-coral hover:underline">
                Edit Skills →
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {(profile?.teachingSkills || []).length > 0 ? (
                profile.teachingSkills.map((s) => (
                  <SkillTag key={s} tone="teach">{s}</SkillTag>
                ))
              ) : (
                <p className="text-xs text-ink/50 py-2">
                  No teaching skills listed yet. Add skills to get matched with campus peers!
                </p>
              )}
            </div>
          </div>

          <div className="bg-white border border-mist rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase font-bold tracking-wider text-ink/40">
                Skills I Want to Learn ({profile?.learningSkills?.length || 0})
              </p>
              <Link to="/profile" className="text-xs font-semibold text-coral hover:underline">
                Edit Skills →
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {(profile?.learningSkills || []).length > 0 ? (
                profile.learningSkills.map((s) => (
                  <SkillTag key={s} tone="learn">{s}</SkillTag>
                ))
              ) : (
                <p className="text-xs text-ink/50 py-2">
                  No learning goals added yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Upcoming Sessions Box */}
        <div className="lg:col-span-5 bg-white border border-mist rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-coral" />
                <h3 className="font-display font-bold text-lg text-ink">Upcoming Sessions</h3>
              </div>
              <Link to="/sessions" className="text-xs text-coral font-semibold hover:underline">
                All Sessions →
              </Link>
            </div>

            {upcomingSessions.length === 0 ? (
              <div className="text-center py-8 text-xs text-ink/50 bg-sand/30 rounded-2xl p-4">
                No upcoming sessions scheduled. Once you accept an exchange request, arrange your first session!
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingSessions.slice(0, 2).map((s) => (
                  <div key={s.id} className="p-3.5 rounded-2xl bg-sand/40 border border-mist/80 text-xs">
                    <p className="font-bold text-sm text-ink">{s.skill}</p>
                    <p className="text-ink/65 mt-0.5">
                      With {s.teacherId === currentUser.uid ? s.learnerName : s.teacherName}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-ink/70">
                      <span>📅 {s.date} at {s.time}</span>
                      <span className="capitalize px-2 py-0.5 rounded-full bg-white border border-mist">
                        {s.mode}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/sessions?new=true"
            className="mt-4 block w-full text-center py-2.5 rounded-full bg-sand hover:bg-mist/60 text-ink text-xs font-semibold border border-mist"
          >
            + Schedule New Session
          </Link>
        </div>
      </div>

      {/* Recommended Skill Matches */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-ink">
              Recommended Skill Matches
            </h2>
            <p className="text-xs sm:text-sm text-ink/60 mt-0.5">
              Peers whose skills complement what you want to learn.
            </p>
          </div>
          <Link
            to="/discover"
            className="text-xs sm:text-sm text-coral font-semibold hover:underline"
          >
            Explore all campus peers →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16 text-ink/50">Finding skill matches...</div>
        ) : matches.length === 0 ? (
          <div className="bg-white rounded-2xl border border-mist p-8 text-center text-xs text-ink/60">
            No matches yet. Try adding more skills to your profile or browse Discover!
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                isMatch={isGreatMatch(profile, student)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight, icon, link }) {
  const content = (
    <div
      className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between ${
        highlight
          ? "bg-sun/20 border-sun/50 shadow-sm"
          : "bg-white border-mist shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between text-xl mb-1">
        <span>{icon}</span>
      </div>
      <div>
        <p className="text-2xl sm:text-3xl font-display font-extrabold text-ink">{value}</p>
        <p className="text-xs text-ink/65 mt-1 font-medium">{label}</p>
      </div>
    </div>
  );

  return link ? <Link to={link}>{content}</Link> : content;
}
