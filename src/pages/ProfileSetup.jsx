import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SkillTag from "../components/SkillTag";
import {
  CheckBadgeIcon,
  SparklesIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  PlusIcon,
  MapPinIcon,
} from "../components/Icons";

const POPULAR_TEACH = [
  "Python", "React", "Data Structures", "JavaScript", "UI/UX",
  "Figma", "Tailwind CSS", "Git", "CAD Modeling", "Public Speaking"
];

const POPULAR_LEARN = [
  "Machine Learning", "Cloud Computing", "Video Editing", "Docker",
  "Photography", "Marketing", "Robotics", "SQL", "Communication"
];

export default function ProfileSetup() {
  const { profile, updateCurrentUserProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // Step 1: Intro
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  // Step 2: Skills
  const [teachingSkills, setTeachingSkills] = useState([]);
  const [learningSkills, setLearningSkills] = useState([]);
  const [teachInput, setTeachInput] = useState("");
  const [learnInput, setLearnInput] = useState("");
  const [availability, setAvailability] = useState("Weekdays after 5 PM & Weekends");
  const [learningMode, setLearningMode] = useState("Both");

  // Step 3: Certifications & Experience
  const [certifications, setCertifications] = useState([]);
  const [certName, setCertName] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certUrl, setCertUrl] = useState("");

  const [experiences, setExperiences] = useState([]);
  const [expTitle, setExpTitle] = useState("");
  const [expOrg, setExpOrg] = useState("");
  const [expDates, setExpDates] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!profile) return;
    setName(profile.name || "");
    setHeadline(
      profile.headline ||
        `${profile.department || "Student"} @ ${profile.college || "Campus"} | Peer Mentor`
    );
    setCollege(profile.college || "Tech Institute of Engineering");
    setDepartment(profile.department || "Computer Science");
    setYear(profile.year || "3rd Year");
    setLocation(profile.location || "Bengaluru, Karnataka, India");
    setBio(profile.bio || "");
    setTeachingSkills(profile.teachingSkills || ["Python", "React"]);
    setLearningSkills(profile.learningSkills || ["UI/UX", "Figma"]);
    setAvailability(profile.availability || "Weekdays after 5 PM & Weekends");
    setLearningMode(profile.learningMode || "Both");
    setCertifications(profile.certifications || []);
    setExperiences(profile.experiences || []);
  }, [profile]);

  function handleAddSkill(list, setList, inputVal, setInputVal) {
    const val = inputVal.trim();
    if (!val) return;
    if (list.map((s) => s.toLowerCase()).includes(val.toLowerCase())) {
      setError("That skill is already added.");
      return;
    }
    setList([...list, val]);
    setInputVal("");
    setError("");
  }

  function handleAddCert() {
    if (!certName.trim() || !certIssuer.trim()) return;
    setCertifications([
      ...certifications,
      {
        id: "cert_" + Date.now(),
        name: certName.trim(),
        issuer: certIssuer.trim(),
        issueDate: "Recent",
        expirationDate: "No Expiration",
        credentialId: `ID-${Math.floor(100000 + Math.random() * 900000)}`,
        credentialUrl: certUrl.trim() || "#",
      },
    ]);
    setCertName("");
    setCertIssuer("");
    setCertUrl("");
  }

  function handleAddExp() {
    if (!expTitle.trim() || !expOrg.trim()) return;
    setExperiences([
      ...experiences,
      {
        id: "exp_" + Date.now(),
        title: expTitle.trim(),
        organization: expOrg.trim(),
        location: "Campus",
        startDate: expDates.trim() || "2024",
        endDate: "Present",
        current: true,
        description: "Active contributor and peer mentor.",
      },
    ]);
    setExpTitle("");
    setExpOrg("");
    setExpDates("");
  }

  async function handleFinish(e) {
    e?.preventDefault?.();
    setSaving(true);
    try {
      await updateCurrentUserProfile({
        name: name.trim(),
        headline: headline.trim(),
        college: college.trim(),
        department: department.trim(),
        year: year.trim(),
        location: location.trim(),
        bio: bio.trim(),
        teachingSkills,
        learningSkills,
        availability,
        learningMode,
        certifications,
        experiences,
      });

      navigate("/profile");
    } catch (err) {
      console.error("Profile save error:", err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f2f0] text-[#191919] py-8 sm:py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0a66c2] text-xs font-bold mb-3">
            <CheckBadgeIcon className="w-4 h-4 text-[#0a66c2]" />
            <span>LinkedIn-Style Campus Profile Setup</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Create Your Campus Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
            Set up your headline, teaching skills, certificates, and experience to connect with peers.
          </p>
        </div>

        {/* Multi-Step Indicator */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between text-xs font-semibold">
            {[
              { num: 1, label: "Intro & Headline" },
              { num: 2, label: "Skills Exchange" },
              { num: 3, label: "Certificates & Roles" },
              { num: 4, label: "Review & Finish" },
            ].map(({ num, label }) => (
              <button
                key={num}
                onClick={() => setStep(num)}
                className={`flex items-center gap-1.5 transition-colors ${
                  step === num
                    ? "text-[#0a66c2] font-bold"
                    : step > num
                    ? "text-emerald-600 font-semibold"
                    : "text-slate-400"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === num
                      ? "bg-[#0a66c2] text-white"
                      : step > num
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {step > num ? "✓" : num}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-[#0a66c2] h-1.5 transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Step 1: Intro & Headline */}
        {step === 1 && (
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-sm space-y-4 text-xs animate-in fade-in">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Step 1: Personal Intro & Headline
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Campus Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, Karnataka, India"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                LinkedIn Headline *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Computer Science Undergrad @ Tech Institute | React & Python Mentor"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Appears prominently beneath your name on cards and search results.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  College / University
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3rd Year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                About / Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share a short introduction about your passions, learning goals, and what you're excited to collaborate on..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-full bg-[#0a66c2] text-white font-semibold text-sm hover:bg-[#004182] shadow-sm"
              >
                Next: Add Skills →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Skills Exchange */}
        {step === 2 && (
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-sm space-y-5 text-xs animate-in fade-in">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Step 2: Skills You Can Teach & Learn
            </h2>

            {/* Teaching Skills */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Skills You Can Teach
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add skill (e.g. React, Python, UI/UX)..."
                  value={teachInput}
                  onChange={(e) => setTeachInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill(teachingSkills, setTeachingSkills, teachInput, setTeachInput);
                    }
                  }}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleAddSkill(teachingSkills, setTeachingSkills, teachInput, setTeachInput)
                  }
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-semibold rounded-lg text-slate-700"
                >
                  Add
                </button>
              </div>

              {/* Popular suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                <span className="text-[11px] text-slate-400 font-bold uppercase">Popular:</span>
                {POPULAR_TEACH.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      if (!teachingSkills.includes(s)) setTeachingSkills([...teachingSkills, s]);
                    }}
                    className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px]"
                  >
                    + {s}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {teachingSkills.map((sk) => (
                  <SkillTag
                    key={sk}
                    tone="teach"
                    onRemove={() =>
                      setTeachingSkills(teachingSkills.filter((s) => s !== sk))
                    }
                  >
                    {sk}
                  </SkillTag>
                ))}
              </div>
            </div>

            {/* Learning Skills */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Skills You Want to Learn
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add skill (e.g. Figma, Machine Learning)..."
                  value={learnInput}
                  onChange={(e) => setLearnInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill(learningSkills, setLearningSkills, learnInput, setLearnInput);
                    }
                  }}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleAddSkill(learningSkills, setLearningSkills, learnInput, setLearnInput)
                  }
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-semibold rounded-lg text-slate-700"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                <span className="text-[11px] text-slate-400 font-bold uppercase">Popular:</span>
                {POPULAR_LEARN.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      if (!learningSkills.includes(s)) setLearningSkills([...learningSkills, s]);
                    }}
                    className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px]"
                  >
                    + {s}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {learningSkills.map((sk) => (
                  <SkillTag
                    key={sk}
                    tone="learn"
                    onRemove={() =>
                      setLearningSkills(learningSkills.filter((s) => s !== sk))
                    }
                  >
                    {sk}
                  </SkillTag>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2 rounded-full border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-full bg-[#0a66c2] text-white font-semibold text-sm hover:bg-[#004182] shadow-sm"
              >
                Next: Add Credentials →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Certifications & Experience */}
        {step === 3 && (
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-sm space-y-6 text-xs animate-in fade-in">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Step 3: Certifications & Campus Roles
            </h2>

            {/* Quick Add Certification */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <span>📜</span>
                  <span>Add a License or Certification</span>
                </p>
                <span className="text-[11px] text-slate-400">Optional</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Certificate Name (e.g. AWS Cloud Practitioner, Meta React)"
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0a66c2]"
                />
                <input
                  type="text"
                  placeholder="Issuer (e.g. Coursera, AWS, Google Cloud)"
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0a66c2]"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Verification Link / Credential URL (optional)"
                  value={certUrl}
                  onChange={(e) => setCertUrl(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0a66c2]"
                />
                <button
                  type="button"
                  onClick={handleAddCert}
                  className="px-4 py-2 rounded-lg bg-[#0a66c2] text-white font-semibold hover:bg-[#004182]"
                >
                  + Add
                </button>
              </div>

              {certifications.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <p className="font-bold text-slate-600 text-[11px]">Added Certifications:</p>
                  {certifications.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200"
                    >
                      <span className="font-semibold text-slate-800">
                        {c.name} • <span className="text-slate-500 font-normal">{c.issuer}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setCertifications(certifications.filter((item) => item.id !== c.id))
                        }
                        className="text-slate-400 hover:text-rose-600 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Add Experience */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <BriefcaseIcon className="w-4 h-4 text-[#0a66c2]" />
                  <span>Add an Experience or Leadership Role</span>
                </p>
                <span className="text-[11px] text-slate-400">Optional</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Title / Role (e.g. Peer Mentor, Code Club Lead)"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0a66c2]"
                />
                <input
                  type="text"
                  placeholder="Organization / Department (e.g. Coding Club)"
                  value={expOrg}
                  onChange={(e) => setExpOrg(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0a66c2]"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Date range (e.g. Aug 2024 - Present)"
                  value={expDates}
                  onChange={(e) => setExpDates(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-[#0a66c2]"
                />
                <button
                  type="button"
                  onClick={handleAddExp}
                  className="px-4 py-2 rounded-lg bg-[#0a66c2] text-white font-semibold hover:bg-[#004182]"
                >
                  + Add
                </button>
              </div>

              {experiences.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <p className="font-bold text-slate-600 text-[11px]">Added Roles:</p>
                  {experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200"
                    >
                      <span className="font-semibold text-slate-800">
                        {exp.title} •{" "}
                        <span className="text-slate-500 font-normal">{exp.organization}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setExperiences(experiences.filter((item) => item.id !== exp.id))
                        }
                        className="text-slate-400 hover:text-rose-600 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2 rounded-full border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-full bg-[#0a66c2] text-white font-semibold text-sm hover:bg-[#004182] shadow-sm"
              >
                Next: Review Profile →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Finish */}
        {step === 4 && (
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-sm space-y-6 text-xs animate-in fade-in">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Step 4: Preview Your LinkedIn Profile Card
            </h2>

            {/* Profile Preview Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-[#0a66c2] text-white font-bold text-2xl flex items-center justify-center shrink-0 shadow-md ring-2 ring-white">
                  {name.charAt(0) || "U"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{name || "Your Name"}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0a66c2] text-[10px] font-bold border border-blue-200">
                      Campus Verified ✓
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium mt-0.5">{headline}</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {college} • {department} ({year}) • {location}
                  </p>
                </div>
              </div>

              {bio && (
                <div className="pt-3 border-t border-slate-200/80">
                  <p className="font-bold text-slate-700 mb-1">About:</p>
                  <p className="text-slate-600 leading-relaxed italic">"{bio}"</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200/80">
                <div>
                  <p className="font-bold text-slate-700 mb-1">Can Teach ({teachingSkills.length}):</p>
                  <div className="flex flex-wrap gap-1">
                    {teachingSkills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[11px] font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-bold text-slate-700 mb-1">Wants to Learn ({learningSkills.length}):</p>
                  <div className="flex flex-wrap gap-1">
                    {learningSkills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0a66c2] text-[11px] font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {certifications.length > 0 && (
                <div className="pt-3 border-t border-slate-200/80">
                  <p className="font-bold text-slate-700 mb-1">Certifications ({certifications.length}):</p>
                  <div className="space-y-1 text-[11px] text-slate-700">
                    {certifications.map((c) => (
                      <p key={c.id}>📜 <span className="font-semibold">{c.name}</span> ({c.issuer})</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2 rounded-full border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
              >
                ← Back to Edit
              </button>
              <button
                type="button"
                onClick={handleFinish}
                disabled={saving}
                className="px-7 py-2.5 rounded-full bg-[#0a66c2] text-white font-semibold text-sm hover:bg-[#004182] shadow-md flex items-center gap-2"
              >
                <SparklesIcon className="w-4 h-4" />
                <span>{saving ? "Publishing Profile..." : "Publish & Open LinkedIn Profile"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
