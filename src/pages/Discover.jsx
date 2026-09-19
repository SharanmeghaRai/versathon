import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchAllStudents } from "../utils/dataService";
import StudentCard from "../components/StudentCard";
import { isGreatMatch } from "../utils/matching";
import { SKILL_CATEGORIES } from "../data/sampleStudents";

export default function Discover() {
  const { currentUser, profile } = useAuth();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedMode, setSelectedMode] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const list = await fetchAllStudents(currentUser?.uid);
      setStudents(list);
      setLoading(false);
    }
    load();
  }, [currentUser]);

  const departments = [
    "All",
    ...Array.from(new Set(students.map((s) => s.department).filter(Boolean))),
  ];

  const filtered = students.filter((s) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const haystack = [
        s.name,
        s.college,
        s.department,
        s.year,
        s.skillLevel,
        s.learningMode,
        ...(s.teachingSkills || []),
        ...(s.learningSkills || []),
      ].join(" ").toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (selectedCategory !== "All") {
      const cat = selectedCategory.toLowerCase();
      const hasSkillInCat = [...(s.teachingSkills || []), ...(s.learningSkills || [])]
        .some((skill) => skill.toLowerCase().includes(cat) || cat.includes(skill.toLowerCase()));
      if (!hasSkillInCat) return false;
    }

    if (selectedDept !== "All" && s.department !== selectedDept) return false;
    if (selectedLevel !== "All" && s.skillLevel !== selectedLevel) return false;
    if (selectedMode !== "All" && s.learningMode !== "Both" && s.learningMode !== selectedMode) {
      return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink tracking-tight">
          Discover Campus Peers
        </h1>
        <p className="text-sm sm:text-base text-ink/65 mt-2 max-w-2xl">
          Search for students willing to teach what you want to learn, or find peers eager to learn your skills.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Try searching 'Python', 'UI/UX', 'Figma', or 'I want to learn React'..."
          className="w-full px-5 py-4 pl-12 rounded-2xl border border-mist bg-white text-ink text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-coral/40"
        />
        <span className="absolute left-4 top-4 text-ink/40 text-lg">🔍</span>
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-4 text-xs font-semibold px-2 py-1 rounded bg-sand text-ink/60 hover:text-ink"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {SKILL_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap ${
                isSelected
                  ? "bg-ink text-white shadow-sm"
                  : "bg-white border border-mist text-ink/70 hover:border-coral/50 hover:text-ink"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 p-4 rounded-2xl bg-white border border-mist text-xs">
        <div>
          <label className="block uppercase font-bold text-ink/40 mb-1">Department</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full p-2 rounded-xl border border-mist/80 bg-sand/30 text-ink font-medium"
          >
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block uppercase font-bold text-ink/40 mb-1">Skill Level</label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full p-2 rounded-xl border border-mist/80 bg-sand/30 text-ink font-medium"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block uppercase font-bold text-ink/40 mb-1">Learning Mode</label>
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="w-full p-2 rounded-xl border border-mist/80 bg-sand/30 text-ink font-medium"
          >
            <option value="All">All Modes</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
              setSelectedDept("All");
              setSelectedLevel("All");
              setSelectedMode("All");
            }}
            className="w-full p-2 rounded-xl border border-mist text-ink/60 hover:text-coral font-semibold"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-20 text-ink/50">Finding peers across campus...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-mist p-12 text-center max-w-md mx-auto">
          <p className="text-3xl mb-2">🔍</p>
          <h3 className="font-display font-bold text-lg text-ink">No students found</h3>
          <p className="text-xs text-ink/60 mt-1 mb-4">
            Try adjusting your search terms or clearing some filters to see more peers.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
              setSelectedDept("All");
            }}
            className="px-5 py-2 rounded-full bg-ink text-white text-xs font-semibold"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-ink/50">
              Showing {filtered.length} Student{filtered.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((s) => (
              <StudentCard
                key={s.id}
                student={s}
                isMatch={isGreatMatch(profile, s)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
