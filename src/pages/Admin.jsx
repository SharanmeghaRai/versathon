import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchAllStudents,
  fetchAllReports,
  seedFirestoreWithSamples,
} from "../utils/dataService";
import { SKILL_CATEGORIES } from "../data/sampleStudents";
import { ShieldCheckIcon, SparklesIcon } from "../components/Icons";

export default function Admin() {
  const [students, setStudents] = useState([]);
  const [reports, setReports] = useState([]);
  const [categories, setCategories] = useState(SKILL_CATEGORIES.filter((c) => c !== "All"));
  const [newCat, setNewCat] = useState("");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState({ text: "", type: "" });

  async function loadData() {
    setLoading(true);
    const [allStudents, allReports] = await Promise.all([
      fetchAllStudents(""),
      fetchAllReports(),
    ]);
    setStudents(allStudents);
    setReports(allReports);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleRemoveUser(id, name) {
    if (!window.confirm(`Are you sure you want to remove user "${name}" from the campus directory?`)) {
      return;
    }
    const filtered = students.filter((s) => s.id !== id);
    setStudents(filtered);
    localStorage.setItem("campus_demo_students", JSON.stringify(filtered));
    setNotice({ text: `Student ${name} was removed from campus registry.`, type: "success" });
  }

  function handleAddCategory(e) {
    e.preventDefault();
    if (!newCat.trim()) return;
    if (categories.includes(newCat.trim())) {
      setNotice({ text: "Category already exists.", type: "error" });
      return;
    }
    setCategories([...categories, newCat.trim()]);
    setNewCat("");
    setNotice({ text: `Category "${newCat.trim()}" added.`, type: "success" });
  }

  function handleRemoveCategory(cat) {
    setCategories(categories.filter((c) => c !== cat));
  }

  async function handleSeedSamples() {
    const ok = await seedFirestoreWithSamples();
    if (ok) {
      setNotice({ text: "Sample campus students seeded to Firestore! Refreshing...", type: "success" });
    } else {
      setNotice({ text: "Sample campus students loaded locally into browser storage!", type: "success" });
    }
    loadData();
  }

  const totalExchanges = 14;
  const completedSessions = 9;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink text-white text-xs font-semibold mb-2">
            <ShieldCheckIcon className="w-3.5 h-3.5 text-coral" />
            <span>Campus Staff & Admin Portal</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-ink">Admin Dashboard</h1>
          <p className="text-sm text-ink/60">
            Monitor campus adoption, moderate reported users, and manage skill taxonomies.
          </p>
        </div>
        <button
          onClick={handleSeedSamples}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sun/30 hover:bg-sun/40 text-ink text-xs font-bold border border-sun/60 transition-colors"
        >
          <SparklesIcon className="w-4 h-4 text-ink" />
          <span>Reload Sample Campus Data</span>
        </button>
      </div>

      {notice.text && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm font-medium border ${
            notice.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {notice.text}
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Students" value={students.length} />
        <StatCard label="Active Students" value={Math.max(students.length - 1, 1)} />
        <StatCard label="Categories" value={categories.length} />
        <StatCard label="Skill Exchanges" value={totalExchanges} highlight />
        <StatCard label="Completed Sessions" value={completedSessions} />
      </div>

      {/* Reports Section */}
      <div className="bg-white rounded-2xl border border-mist p-6 shadow-sm mb-8">
        <h2 className="font-display font-bold text-xl text-ink mb-1">
          Safety Reports ({reports.length})
        </h2>
        <p className="text-xs text-ink/60 mb-4">
          Community reports submitted by students requesting staff moderation.
        </p>

        {reports.length === 0 ? (
          <div className="p-6 rounded-xl bg-sand/30 text-center text-sm text-ink/50">
            No pending safety reports. The campus community is healthy! 👍
          </div>
        ) : (
          <div className="divide-y divide-mist">
            {reports.map((rep, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-ink">
                    Report against: <span className="text-coral">{rep.reportedUserName || rep.reportedUserId}</span>
                  </p>
                  <p className="text-xs text-ink/60">Reason: {rep.reason}</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold uppercase">
                  Pending Review
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Students Directory Management */}
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-mist p-6 shadow-sm">
          <h2 className="font-display font-bold text-xl text-ink mb-4">
            Registered Campus Students ({students.length})
          </h2>

          {loading ? (
            <p className="text-ink/40 text-sm">Loading users...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-mist text-xs uppercase font-semibold text-ink/50">
                    <th className="pb-3">Student</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3">Points</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist/60">
                  {students.map((st) => (
                    <tr key={st.id} className="hover:bg-sand/30">
                      <td className="py-3.5 pr-3">
                        <Link to={`/student/${st.id}`} className="font-semibold text-ink hover:text-coral">
                          {st.name}
                        </Link>
                        <span className="block text-xs text-ink/40">{st.email}</span>
                      </td>
                      <td className="py-3.5 text-xs text-ink/70">
                        {st.department} · {st.year}
                      </td>
                      <td className="py-3.5 text-xs font-bold text-ink">
                        {st.points || 0} pts
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => handleRemoveUser(st.id, st.name)}
                          className="text-xs px-3 py-1 rounded-full border border-red-200 text-red-600 hover:bg-red-50 font-medium"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Categories Manager */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-mist p-6 shadow-sm">
          <h2 className="font-display font-bold text-lg text-ink mb-2">Skill Categories</h2>
          <p className="text-xs text-ink/60 mb-4">
            Categories displayed in the Landing & Discover filters.
          </p>

          <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="New category..."
              className="flex-1 px-3 py-1.5 rounded-xl border border-mist text-xs"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-ink text-white text-xs font-medium hover:bg-ink/90"
            >
              Add
            </button>
          </form>

          <div className="flex flex-wrap gap-1.5 max-h-[350px] overflow-y-auto">
            {categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand text-xs font-medium text-ink border border-mist"
              >
                <span>{cat}</span>
                <button
                  onClick={() => handleRemoveCategory(cat)}
                  className="text-ink/40 hover:text-red-600 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight }) {
  return (
    <div className={`rounded-2xl border p-4 ${highlight ? "bg-sun/20 border-sun/40" : "bg-white border-mist"}`}>
      <p className="text-2xl sm:text-3xl font-display font-bold text-ink">{value}</p>
      <p className="text-xs text-ink/60 mt-1">{label}</p>
    </div>
  );
}
