import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SkillTag from "../components/SkillTag";

const POPULAR_SKILLS = [
  "Python", "React", "UI/UX", "Figma", "Machine Learning",
  "Photography", "Video Editing", "Tailwind CSS", "JavaScript",
  "Public Speaking", "Data Structures", "Marketing"
];

export default function ProfileSetup() {
  const { profile, updateCurrentUserProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [bio, setBio] = useState("");
  const [teachingSkills, setTeachingSkills] = useState([]);
  const [learningSkills, setLearningSkills] = useState([]);
  const [teachInput, setTeachInput] = useState("");
  const [learnInput, setLearnInput] = useState("");
  const [skillLevel, setSkillLevel] = useState("Intermediate");
  const [availability, setAvailability] = useState("Weekdays after 5 PM & Weekends");
  const [learningMode, setLearningMode] = useState("Both");

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setName(profile.name || "");
    setCollege(profile.college || "Tech Institute of Engineering");
    setDepartment(profile.department || "Computer Science");
    setYear(profile.year || "3rd Year");
    setBio(profile.bio || "");
    setTeachingSkills(profile.teachingSkills || []);
    setLearningSkills(profile.learningSkills || []);
    setSkillLevel(profile.skillLevel || "Intermediate");
    setAvailability(profile.availability || "Weekdays after 5 PM & Weekends");
    setLearningMode(profile.learningMode || "Both");
  }, [profile]);

  function addSkill(list, setList, inputVal, setInputVal) {
    const value = inputVal.trim();
    if (!value) return;
    if (list.map((s) => s.toLowerCase()).includes(value.toLowerCase())) {
      setError("That skill is already added.");
      return;
    }
    setList([...list, value]);
    setInputVal("");
    setError("");
  }

  function removeSkill(list, setList, skillToRemove) {
    setList(list.filter((s) => s !== skillToRemove));
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (teachingSkills.length === 0 || learningSkills.length === 0) {
      setError("Please add at least one skill you can teach and one skill you want to learn.");
      return;
    }

    setSubmitting(true);
    try {
      await updateCurrentUserProfile({
        name: name.trim(),
        college: college.trim(),
        department: department.trim(),
        year: year.trim(),
        bio: bio.trim(),
        teachingSkills,
        learningSkills,
        skillLevel,
        availability: availability.trim(),
        learningMode,
      });

      setSaved(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setError("Couldn't save profile. Please verify your connection.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-ink">
          {profile?.teachingSkills?.length ? "Edit Profile" : "Set Up Your Profile"}
        </h1>
        <p className="text-sm text-ink/65 mt-1">
          Tell fellow campus students what you can teach and what you're excited to learn.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 bg-white rounded-3xl border border-mist p-6 sm:p-8 shadow-sm">
        {/* Basic info */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-ink/60 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-mist text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-ink/60 mb-1">College / Campus</label>
            <input
              type="text"
              required
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-mist text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-ink/60 mb-1">Department</label>
            <input
              type="text"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-mist text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-ink/60 mb-1">Year of Study</label>
            <input
              type="text"
              required
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-mist text-sm"
            />
          </div>
        </div>

        {/* Short bio */}
        <div>
          <label className="block text-xs font-bold uppercase text-ink/60 mb-1">Short Bio</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell students about your interests, study goals, or project experience..."
            className="w-full px-4 py-2.5 rounded-xl border border-mist text-sm"
          />
        </div>

        {/* Skills I Can Teach */}
        <div>
          <SkillInputGroup
            label="Skills I Can Teach"
            tone="teach"
            skills={teachingSkills}
            input={teachInput}
            setInput={setTeachInput}
            onAdd={() => addSkill(teachingSkills, setTeachingSkills, teachInput, setTeachInput)}
            onRemove={(s) => removeSkill(teachingSkills, setTeachingSkills, s)}
          />
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-ink/60">
            <span className="font-semibold text-[11px] text-ink/40">Suggestions:</span>
            {POPULAR_SKILLS.slice(0, 6).map((pop) => (
              <button
                type="button"
                key={pop}
                onClick={() => addSkill(teachingSkills, setTeachingSkills, pop, setTeachInput)}
                className="px-2 py-0.5 rounded-md bg-sand hover:bg-mist/70 text-ink/80 text-[11px]"
              >
                + {pop}
              </button>
            ))}
          </div>
        </div>

        {/* Skills I Want to Learn */}
        <div>
          <SkillInputGroup
            label="Skills I Want to Learn"
            tone="learn"
            skills={learningSkills}
            input={learnInput}
            setInput={setLearnInput}
            onAdd={() => addSkill(learningSkills, setLearningSkills, learnInput, setLearnInput)}
            onRemove={(s) => removeSkill(learningSkills, setLearningSkills, s)}
          />
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-ink/60">
            <span className="font-semibold text-[11px] text-ink/40">Suggestions:</span>
            {POPULAR_SKILLS.slice(6).map((pop) => (
              <button
                type="button"
                key={pop}
                onClick={() => addSkill(learningSkills, setLearningSkills, pop, setLearnInput)}
                className="px-2 py-0.5 rounded-md bg-sand hover:bg-mist/70 text-ink/80 text-[11px]"
              >
                + {pop}
              </button>
            ))}
          </div>
        </div>

        {/* Skill level & Learning mode */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-ink/60 mb-1">Your Skill Level</label>
            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-mist text-sm bg-white"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-ink/60 mb-1">Preferred Learning Mode</label>
            <select
              value={learningMode}
              onChange={(e) => setLearningMode(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-mist text-sm bg-white"
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline (On Campus)</option>
              <option value="Both">Both Online & Offline</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-ink/60 mb-1">Availability</label>
          <input
            type="text"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            placeholder="e.g. Weekday evenings & Saturday afternoons"
            className="w-full px-4 py-2.5 rounded-xl border border-mist text-sm"
          />
        </div>

        {error && (
          <div className="p-3.5 rounded-xl text-xs font-semibold bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}
        {saved && (
          <div className="p-3.5 rounded-xl text-xs font-semibold bg-green-50 border border-green-200 text-green-800">
            Profile saved successfully! Redirecting to Dashboard...
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-full bg-ink text-white font-semibold text-sm hover:bg-ink/90 disabled:opacity-50 transition-colors shadow-sm"
        >
          {submitting ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

function SkillInputGroup({ label, tone, skills, input, setInput, onAdd, onRemove }) {
  return (
    <div>
      <span className="block text-xs font-bold uppercase text-ink/60 mb-1.5">{label}</span>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }
          }}
          placeholder="Type a skill and press Enter..."
          className="flex-1 px-4 py-2 rounded-xl border border-mist text-sm"
        />
        <button
          type="button"
          onClick={onAdd}
          className="px-4 py-2 rounded-xl border border-mist bg-sand hover:bg-mist/80 text-xs font-bold text-ink"
        >
          + Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3 min-h-[32px]">
        {skills.length > 0 ? (
          skills.map((s) => (
            <SkillTag key={s} tone={tone} onRemove={() => onRemove(s)}>
              {s}
            </SkillTag>
          ))
        ) : (
          <span className="text-xs text-ink/40 italic">No skills added yet.</span>
        )}
      </div>
    </div>
  );
}
