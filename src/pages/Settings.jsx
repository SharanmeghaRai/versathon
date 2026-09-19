import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateStudentProfile } from "../utils/dataService";
import { useTheme } from "../context/ThemeContext";
import ChangePhotoModal from "../components/profile/ChangePhotoModal";
import ChangeBannerModal from "../components/profile/ChangeBannerModal";
import {
  ShieldCheckIcon,
  CogIcon,
  CameraIcon,
  PencilIcon,
  CheckBadgeIcon,
  SparklesIcon,
  LinkIcon,
} from "../components/Icons";

const TABS = [
  { id: "profile", label: "Account & Profile", icon: "👤", desc: "Name, headline, photos & campus info" },
  { id: "appearance", label: "Display & Theme", icon: "🌓", desc: "Dark mode, light mode & appearance" },
  { id: "security", label: "Sign in & Security", icon: "🔒", desc: "Email, password & session security" },
  { id: "visibility", label: "Visibility & Privacy", icon: "👁️", desc: "Profile viewing options & contact visibility" },
  { id: "notifications", label: "Communications", icon: "🔔", desc: "Exchange requests, messages & reminders" },
  { id: "safety", label: "Data Privacy & Safety", icon: "🛡️", desc: "Blocked accounts & data export" },
];

const PRONOUN_OPTIONS = [
  "they/them",
  "she/her",
  "he/him",
  "prefer not to say",
  "Custom",
];

const YEAR_OPTIONS = [
  "1st Year (Freshman)",
  "2nd Year (Sophomore)",
  "3rd Year (Junior)",
  "4th Year (Senior)",
  "Graduate / Masters",
  "PhD Scholar",
];

const LEARNING_MODES = [
  "Both (In-person & Virtual)",
  "In-person on campus",
  "Virtual / Online video",
];

export default function Settings() {
  const { currentUser, profile, updateCurrentUserProfile } = useAuth();
  const { theme, isDark, setTheme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");

  // --- Profile Edit Form State ---
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [pronouns, setPronouns] = useState("they/them");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("3rd Year");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [teachingSkills, setTeachingSkills] = useState([]);
  const [learningSkills, setLearningSkills] = useState([]);
  const [teachInput, setTeachInput] = useState("");
  const [learnInput, setLearnInput] = useState("");
  const [availability, setAvailability] = useState("");
  const [learningMode, setLearningMode] = useState("Both (In-person & Virtual)");
  const [customVanityUrl, setCustomVanityUrl] = useState("rahul-sharma-cs");

  // --- Security & Password State ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");

  // --- Privacy & Visibility Settings ---
  const [privacy, setPrivacy] = useState({
    profileVisibility: "campus_verified", // "public" | "campus_verified" | "private"
    hideEmail: true,
    hidePhone: true,
    allowDirectRequests: true,
    showOnlineStatus: true,
    shareProfileUpdates: true,
  });

  // --- Communications / Notifications ---
  const [notifications, setNotifications] = useState({
    emailOnRequest: true,
    emailOnMessage: true,
    emailOnSession: true,
    emailOnEndorse: true,
    inAppSound: true,
    weeklyDigest: false,
  });

  // --- Safety & Blocked Accounts ---
  const [blockedUsers, setBlockedUsers] = useState([
    { id: "blocked_1", name: "SpamBot User", reason: "Automated promotional messages" },
    { id: "blocked_2", name: "Inactive Account", reason: "Repeatedly missed sessions" },
  ]);

  // --- UI Feedback & Modals ---
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);

  const activeUserId = currentUser?.uid || profile?.id || "demo_rahul";

  // Synchronize state with profile data
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setHeadline(
        profile.headline ||
          `${profile.department || "Computer Science"} Student @ ${profile.college || "Tech Institute"} | Passionate Peer Mentor`
      );
      setPronouns(profile.pronouns || "they/them");
      setCollege(profile.college || "Tech Institute of Engineering");
      setDepartment(profile.department || "Computer Science");
      setYear(profile.year || "3rd Year");
      setLocation(profile.location || "Bengaluru, Karnataka, India");
      setBio(profile.bio || "");
      setProfileImage(profile.profileImage || "");
      setBannerImage(profile.bannerImage || "");
      setTeachingSkills(profile.teachingSkills || ["Python", "C++", "Data Structures"]);
      setLearningSkills(profile.learningSkills || ["UI/UX", "React", "Figma"]);
      setAvailability(profile.availability || "Weekdays after 5 PM & Weekends");
      setLearningMode(profile.learningMode || "Both (In-person & Virtual)");
      const safeSlug = (profile.name || "student")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-");
      setCustomVanityUrl(`${safeSlug}-campus`);
    }
  }, [profile]);

  function triggerToast(msg) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  }

  // Handle saving Profile Edits (LinkedIn Style)
  async function handleProfileSave(e) {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const updatedFields = {
        name: name.trim(),
        headline: headline.trim(),
        pronouns: pronouns.trim(),
        college: college.trim(),
        department: department.trim(),
        year: year.trim(),
        location: location.trim(),
        bio: bio.trim(),
        profileImage,
        bannerImage,
        teachingSkills,
        learningSkills,
        availability: availability.trim(),
        learningMode,
      };

      // 1. Update Auth Context & Local Storage
      if (updateCurrentUserProfile) {
        await updateCurrentUserProfile(updatedFields);
      }

      // 2. Persist to Node.js backend / Supabase
      await updateStudentProfile(activeUserId, updatedFields);

      triggerToast("Profile information updated successfully! 🎉");
    } catch (err) {
      console.error("Error saving settings:", err);
      triggerToast("Error saving profile changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // Photo / Banner Handlers
  async function handleSavePhoto(newPhotoUrl) {
    setProfileImage(newPhotoUrl);
    setShowPhotoModal(false);
    try {
      if (updateCurrentUserProfile) {
        await updateCurrentUserProfile({ profileImage: newPhotoUrl });
      }
      await updateStudentProfile(activeUserId, { profileImage: newPhotoUrl });
      triggerToast(newPhotoUrl ? "Profile photo updated! 📸" : "Profile photo removed.");
    } catch (err) {
      console.error("Photo save error:", err);
    }
  }

  async function handleSaveBanner(newBannerUrl) {
    setBannerImage(newBannerUrl);
    setShowBannerModal(false);
    try {
      if (updateCurrentUserProfile) {
        await updateCurrentUserProfile({ bannerImage: newBannerUrl });
      }
      await updateStudentProfile(activeUserId, { bannerImage: newBannerUrl });
      triggerToast(newBannerUrl ? "Cover photo updated! 🎨" : "Cover photo reset to default.");
    } catch (err) {
      console.error("Banner save error:", err);
    }
  }

  // Skills tag helpers
  function handleAddTeachingSkill() {
    const trimmed = teachInput.trim();
    if (!trimmed) return;
    if (!teachingSkills.map((s) => s.toLowerCase()).includes(trimmed.toLowerCase())) {
      setTeachingSkills([...teachingSkills, trimmed]);
    }
    setTeachInput("");
  }

  function handleRemoveTeachingSkill(skill) {
    setTeachingSkills(teachingSkills.filter((s) => s !== skill));
  }

  function handleAddLearningSkill() {
    const trimmed = learnInput.trim();
    if (!trimmed) return;
    if (!learningSkills.map((s) => s.toLowerCase()).includes(trimmed.toLowerCase())) {
      setLearningSkills([...learningSkills, trimmed]);
    }
    setLearnInput("");
  }

  function handleRemoveLearningSkill(skill) {
    setLearningSkills(learningSkills.filter((s) => s !== skill));
  }

  // Password submission
  function handlePasswordChange(e) {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordStatus("Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordStatus("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus("New passwords do not match.");
      return;
    }
    setPasswordStatus("Password changed successfully! ✓");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordStatus(""), 4000);
  }

  // Unblock user
  function unblock(id) {
    setBlockedUsers((prev) => prev.filter((u) => u.id !== id));
    triggerToast("User unblocked.");
  }

  // Download profile data export (JSON)
  function handleExportData() {
    const exportData = {
      user: {
        id: activeUserId,
        name,
        headline,
        email: currentUser?.email || profile?.email,
        college,
        department,
        year,
        location,
        bio,
        teachingSkills,
        learningSkills,
        certifications: profile?.certifications || [],
        experiences: profile?.experiences || [],
        educations: profile?.educations || [],
        projects: profile?.projects || [],
      },
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `campus-skill-profile-${activeUserId}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast("Profile data exported successfully! 📁");
  }

  return (
    <div className="min-h-screen bg-[#f3f2f0] text-[#191919] font-sans pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#191919] text-white px-5 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
          <SparklesIcon className="w-4 h-4 text-[#0a66c2]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Settings Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link to="/profile" className="hover:text-[#0a66c2] hover:underline">
                Profile
              </Link>
              <span>/</span>
              <span className="font-semibold text-slate-800">Settings & Privacy</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Settings & Privacy
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage your personal information, profile photo, security, and student visibility
            </p>
          </div>

          {/* Quick Profile Snippet Button */}
          <Link
            to="/profile"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 shadow-xs transition-all w-fit"
            title="Go to public profile"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden bg-[#0a66c2] text-white flex items-center justify-center text-[11px] font-bold">
              {profileImage ? (
                <img src={profileImage} alt={name} className="w-full h-full object-cover" />
              ) : (
                (name || "U").charAt(0).toUpperCase()
              )}
            </div>
            <span>View Public Profile</span>
            <span className="text-slate-400">↗</span>
          </Link>
        </div>
      </div>

      {/* Two-Column Responsive LinkedIn Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* ============================================================ */}
          {/* LEFT SIDEBAR: LinkedIn Settings Navigation Menu               */}
          {/* ============================================================ */}
          <div className="md:col-span-4 lg:col-span-3 space-y-3">
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden p-2">
              <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Settings Menu
              </div>
              <nav className="space-y-1">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all ${
                        isActive
                          ? "bg-blue-50 text-[#0a66c2] border-l-4 border-[#0a66c2] shadow-xs"
                          : "text-slate-700 hover:bg-slate-100/80"
                      }`}
                    >
                      <span className="text-base">{tab.icon}</span>
                      <div className="flex-1">
                        <p className="leading-tight">{tab.label}</p>
                        <p className="text-[10px] font-normal text-slate-400 leading-tight mt-0.5 truncate">
                          {tab.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* LinkedIn Mini Profile Status Card */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 text-xs space-y-2.5">
              <div className="flex items-center gap-2">
                <CheckBadgeIcon className="w-4 h-4 text-[#0a66c2]" />
                <span className="font-bold text-slate-800">Campus Verified Student</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Your account is connected to {college || "Tech Institute of Engineering"}.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Database Sync:</span>
                <span className="font-semibold text-emerald-600">● Active</span>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: Settings Detail Content & LinkedIn Profile Form */}
          {/* ============================================================ */}
          <div className="md:col-span-8 lg:col-span-9 space-y-5">
            {/* ------------------------------------------------------------ */}
            {/* TAB 1: ACCOUNT & PROFILE EDITING (Similar to LinkedIn)        */}
            {/* ------------------------------------------------------------ */}
            {activeTab === "profile" && (
              <div className="space-y-5">
                {/* 1. Photos & Visual Identity Card */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Profile Photo & Cover Banner
                      </h2>
                      <p className="text-xs text-slate-500">
                        First impressions matter. Customize your LinkedIn campus presence.
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Live Banner & Avatar Preview */}
                    <div className="w-full rounded-xl border border-slate-200 overflow-hidden relative shadow-sm">
                      {/* Cover Photo */}
                      <div className="h-32 sm:h-40 w-full relative bg-gradient-to-r from-[#0a66c2] to-[#002244] overflow-hidden">
                        {bannerImage ? (
                          <img
                            src={bannerImage}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/50 text-xs font-semibold">
                            Default Classic Navy Cover Banner
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => setShowBannerModal(true)}
                          className="absolute top-3 right-3 px-3 py-1.5 bg-white/95 hover:bg-white text-slate-800 text-xs font-semibold rounded-full shadow-md backdrop-blur-sm flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                        >
                          <CameraIcon className="w-4 h-4 text-[#0a66c2]" />
                          <span>Change Cover</span>
                        </button>
                      </div>

                      {/* Floating Avatar & Details in Card */}
                      <div className="px-6 pb-5 pt-0 relative bg-white">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 sm:-mt-16 gap-3">
                          <div className="relative group cursor-pointer w-fit" onClick={() => setShowPhotoModal(true)}>
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1 shadow-lg ring-4 ring-white overflow-hidden">
                              {profileImage ? (
                                <img
                                  src={profileImage}
                                  alt={name}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              ) : (
                                <div className="w-full h-full rounded-full bg-[#0a66c2] text-white flex items-center justify-center font-bold text-3xl uppercase">
                                  {(name || "U").charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-semibold transition-opacity">
                              <CameraIcon className="w-4 h-4 mb-0.5 text-white" />
                              <span>Edit</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setShowPhotoModal(true)}
                              className="px-3.5 py-1.5 rounded-full border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <CameraIcon className="w-3.5 h-3.5 text-[#0a66c2]" />
                              <span>Update Photo</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowBannerModal(true)}
                              className="px-3.5 py-1.5 rounded-full border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <PencilIcon className="w-3.5 h-3.5 text-slate-600" />
                              <span>Customize Banner</span>
                            </button>
                          </div>
                        </div>

                        <div className="mt-3">
                          <h3 className="text-base font-bold text-slate-900">{name || "Your Name"}</h3>
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{headline || "Your Headline"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Personal & Academic Intro Form */}
                <form onSubmit={handleProfileSave} className="space-y-5">
                  <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-4">
                    <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center justify-between">
                      <span>Basic Information</span>
                      <span className="text-xs font-normal text-slate-400">* Required for campus verification</span>
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {/* Full Name */}
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
                        />
                      </div>

                      {/* Pronouns */}
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Pronouns
                        </label>
                        <select
                          value={pronouns}
                          onChange={(e) => setPronouns(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] bg-white"
                        >
                          {PRONOUN_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Headline (LinkedIn Signature) */}
                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">
                          Profile Headline *
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={headline}
                          onChange={(e) => setHeadline(e.target.value)}
                          placeholder="e.g. Computer Science Undergrad @ Tech Institute | React & Python Mentor | Cloud Enthusiast"
                          className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">
                          Appears below your name across the search directory, exchange requests, and messaging.
                        </p>
                      </div>

                      {/* College / University */}
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          College / University *
                        </label>
                        <input
                          type="text"
                          required
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                          placeholder="e.g. Tech Institute of Engineering"
                          className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
                        />
                      </div>

                      {/* Department */}
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Department / Branch *
                        </label>
                        <input
                          type="text"
                          required
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          placeholder="e.g. Computer Science & Engineering"
                          className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
                        />
                      </div>

                      {/* Academic Year */}
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Academic Year
                        </label>
                        <select
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2] bg-white"
                        >
                          {YEAR_OPTIONS.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Bengaluru, Karnataka, India"
                          className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. About / Bio Summary Card */}
                  <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-4">
                    <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200">
                      About Summary
                    </h2>
                    <div className="text-xs">
                      <label className="block font-bold text-slate-700 mb-1">
                        Summary / Bio
                      </label>
                      <textarea
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Write about your peer mentorship goals, current projects, coding background, and what you are looking to learn..."
                        className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        Highlight your technical strengths and preferred teaching style.
                      </p>
                    </div>
                  </div>

                  {/* 4. Skill Exchange Preferences Card */}
                  <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-5">
                    <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center justify-between">
                      <span>Campus Skill Exchange Preferences</span>
                      <span className="text-xs text-[#0a66c2] font-semibold">Matched in Discover</span>
                    </h2>

                    {/* Skills You Teach */}
                    <div className="text-xs space-y-2">
                      <label className="block font-bold text-slate-800">
                        Skills You Can Teach & Mentor
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {teachingSkills.map((sk) => (
                          <span
                            key={sk}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold"
                          >
                            <span>{sk}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTeachingSkill(sk)}
                              className="text-emerald-500 hover:text-emerald-800 font-bold"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          value={teachInput}
                          onChange={(e) => setTeachInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTeachingSkill();
                            }
                          }}
                          placeholder="Add a skill you can teach (e.g. Python, Git, Docker)..."
                          className="flex-1 p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
                        />
                        <button
                          type="button"
                          onClick={handleAddTeachingSkill}
                          className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Skills You Want to Learn */}
                    <div className="text-xs space-y-2 pt-2 border-t border-slate-100">
                      <label className="block font-bold text-slate-800">
                        Skills You Are Looking to Learn
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {learningSkills.map((sk) => (
                          <span
                            key={sk}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0a66c2] border border-blue-200 font-semibold"
                          >
                            <span>{sk}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveLearningSkill(sk)}
                              className="text-[#0a66c2]/70 hover:text-[#0a66c2] font-bold"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          value={learnInput}
                          onChange={(e) => setLearnInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddLearningSkill();
                            }
                          }}
                          placeholder="Add a skill you want to learn (e.g. Figma, React, Cloud)..."
                          className="flex-1 p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
                        />
                        <button
                          type="button"
                          onClick={handleAddLearningSkill}
                          className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Availability & Mode */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          General Availability
                        </label>
                        <input
                          type="text"
                          value={availability}
                          onChange={(e) => setAvailability(e.target.value)}
                          placeholder="e.g. Weekdays after 5 PM & Weekends"
                          className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Preferred Learning Mode
                        </label>
                        <select
                          value={learningMode}
                          onChange={(e) => setLearningMode(e.target.value)}
                          className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2] bg-white"
                        >
                          {LEARNING_MODES.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 5. Custom Public Profile URL (LinkedIn Feature) */}
                  <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-3">
                    <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200 flex items-center justify-between">
                      <span>Public Profile & Custom URL</span>
                      <LinkIcon className="w-4 h-4 text-slate-400" />
                    </h2>
                    <div className="text-xs">
                      <label className="block font-bold text-slate-700 mb-1">
                        Your Personal Vanity URL
                      </label>
                      <div className="flex items-center rounded-lg border border-slate-300 overflow-hidden bg-slate-50">
                        <span className="px-3 py-2 text-slate-500 font-mono text-[11px] border-r border-slate-200">
                          campus.edu/in/
                        </span>
                        <input
                          type="text"
                          value={customVanityUrl}
                          onChange={(e) => setCustomVanityUrl(e.target.value)}
                          className="flex-1 p-2 bg-white focus:outline-none text-slate-800 font-mono text-xs"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Use this direct link to share your campus skill profile on resumes and portfolios.
                      </p>
                    </div>
                  </div>

                  {/* Bottom Save Action Bar */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between shadow-sm sticky bottom-4 z-20">
                    <div className="text-xs text-slate-500 hidden sm:block">
                      Changes are synchronized directly to your public campus profile.
                    </div>
                    <div className="flex items-center gap-3 ml-auto">
                      <Link
                        to="/profile"
                        className="px-5 py-2 rounded-full border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                      >
                        Cancel
                      </Link>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        {saving ? "Saving Changes..." : "Save Profile Settings"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* TAB: DISPLAY & THEME APPEARANCE (Dark Mode / Light Mode)     */}
            {/* ------------------------------------------------------------ */}
            {activeTab === "appearance" && (
              <div className="space-y-5">
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-6">
                  <div className="pb-4 border-b border-slate-200">
                    <h2 className="text-base font-bold text-slate-900">
                      Website Appearance & Color Theme
                    </h2>
                    <p className="text-xs text-slate-500">
                      Choose how Campus Skill Exchange looks for you. Your preference is automatically saved.
                    </p>
                  </div>

                  {/* Theme Mode Selector Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Light Mode Card */}
                    <div
                      onClick={() => {
                        setTheme("light");
                        triggerToast("Switched to Light Mode ☀️");
                      }}
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                        theme === "light"
                          ? "border-[#0a66c2] bg-blue-50/40 ring-2 ring-[#0a66c2]/20 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="h-28 rounded-lg bg-[#F7F5EF] border border-slate-200 p-3 flex flex-col justify-between mb-3 shadow-inner">
                        <div className="flex items-center justify-between">
                          <div className="w-16 h-3 bg-slate-300 rounded" />
                          <div className="w-6 h-6 rounded-full bg-[#0a66c2] text-white flex items-center justify-center text-[10px] font-bold">
                            U
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="w-24 h-2.5 bg-slate-800 rounded" />
                          <div className="w-36 h-2 bg-slate-400 rounded" />
                        </div>
                        <div className="w-16 h-4 bg-emerald-100 rounded-full" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <span>☀️</span>
                            <span>Light Mode</span>
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Classic clean campus aesthetic
                          </p>
                        </div>
                        {theme === "light" && (
                          <span className="text-[#0a66c2] font-bold text-base">✓</span>
                        )}
                      </div>
                    </div>

                    {/* Dark Mode Card */}
                    <div
                      onClick={() => {
                        setTheme("dark");
                        triggerToast("Switched to Dark Mode 🌙");
                      }}
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                        theme === "dark"
                          ? "border-[#38bdf8] bg-slate-800/80 ring-2 ring-[#38bdf8]/30 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="h-28 rounded-lg bg-[#0b1120] border border-slate-700 p-3 flex flex-col justify-between mb-3 shadow-inner">
                        <div className="flex items-center justify-between">
                          <div className="w-16 h-3 bg-slate-700 rounded" />
                          <div className="w-6 h-6 rounded-full bg-[#0a66c2] text-white flex items-center justify-center text-[10px] font-bold">
                            U
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="w-24 h-2.5 bg-slate-100 rounded" />
                          <div className="w-36 h-2 bg-slate-500 rounded" />
                        </div>
                        <div className="w-16 h-4 bg-emerald-950/80 border border-emerald-500/40 rounded-full" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <span>🌙</span>
                            <span>Dark Mode</span>
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            High-contrast sleek night mode
                          </p>
                        </div>
                        {theme === "dark" && (
                          <span className="text-[#38bdf8] font-bold text-base">✓</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Toggle Action */}
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">Toggle Theme Instantly</p>
                      <p className="text-slate-500">
                        Current active theme: <span className="font-bold capitalize">{theme} Mode</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        toggleTheme();
                        triggerToast(`Switched to ${theme === "dark" ? "Light" : "Dark"} Mode!`);
                      }}
                      className="px-4 py-2 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold flex items-center gap-2 cursor-pointer shadow-xs transition-all"
                    >
                      <span>{isDark ? "Switch to ☀️ Light Mode" : "Switch to 🌙 Dark Mode"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* TAB 2: SIGN IN & SECURITY                                    */}
            {/* ------------------------------------------------------------ */}
            {activeTab === "security" && (
              <div className="space-y-5">
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-4">
                  <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200">
                    Account Access & Credentials
                  </h2>

                  {/* Email address */}
                  <div className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">Primary Campus Email</p>
                      <p className="text-slate-500 mt-0.5">
                        {currentUser?.email || profile?.email || "rahul.sharma@campus.edu"}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#0a66c2] text-[11px] font-bold border border-blue-200">
                      Verified
                    </span>
                  </div>

                  {/* Two-Step Verification */}
                  <div className="py-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">Two-Step Verification (2FA)</p>
                      <p className="text-slate-500 mt-0.5">
                        Add an extra layer of security to prevent unauthorized access.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                      Active
                    </span>
                  </div>
                </div>

                {/* Change Password Card */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-4">
                  <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200">
                    Change Account Password
                  </h2>

                  {passwordStatus && (
                    <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                      {passwordStatus}
                    </div>
                  )}

                  <form onSubmit={handlePasswordChange} className="space-y-3 text-xs max-w-md">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
                      />
                    </div>
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-full bg-[#0a66c2] text-white font-semibold hover:bg-[#004182] transition-all cursor-pointer"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>

                {/* Active Sessions */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-3">
                  <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200">
                    Active Signed-In Devices
                  </h2>
                  <div className="text-xs space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div>
                        <p className="font-bold text-slate-800">Chrome on Windows (Current Session)</p>
                        <p className="text-[11px] text-slate-500">Bengaluru, India • Active now</p>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600">● This device</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* TAB 3: VISIBILITY & PRIVACY                                  */}
            {/* ------------------------------------------------------------ */}
            {activeTab === "visibility" && (
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-5">
                <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200">
                  Profile Viewing & Privacy Preferences
                </h2>

                <div className="space-y-4 text-xs divide-y divide-slate-100">
                  {/* Viewing Options */}
                  <div className="pt-2 space-y-2">
                    <p className="font-bold text-slate-800">Profile Visibility Scope</p>
                    <p className="text-slate-500">
                      Choose how your profile appears to other campus students in Discover.
                    </p>
                    <div className="space-y-2 pt-1">
                      {[
                        { val: "campus_verified", label: "Campus Verified Students Only (Recommended)" },
                        { val: "public", label: "Public (All Students & Faculty)" },
                        { val: "private", label: "Private Mode (Hidden from directory browsing)" },
                      ].map((opt) => (
                        <label key={opt.val} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="visibility"
                            value={opt.val}
                            checked={privacy.profileVisibility === opt.val}
                            onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                            className="text-[#0a66c2] focus:ring-[#0a66c2]"
                          />
                          <span className="text-slate-700 font-medium">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Hide Email */}
                  <div className="pt-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">Hide Personal Email Address</p>
                      <p className="text-slate-500">
                        Keep email address hidden until an exchange request is officially accepted.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacy.hideEmail}
                      onChange={(e) => setPrivacy({ ...privacy, hideEmail: e.target.checked })}
                      className="w-4 h-4 text-[#0a66c2] rounded"
                    />
                  </div>

                  {/* Allow Direct Requests */}
                  <div className="pt-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">Accept Incoming Exchange Requests</p>
                      <p className="text-slate-500">
                        Allow peers who want to learn your skills to send proposals.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacy.allowDirectRequests}
                      onChange={(e) => setPrivacy({ ...privacy, allowDirectRequests: e.target.checked })}
                      className="w-4 h-4 text-[#0a66c2] rounded"
                    />
                  </div>

                  {/* Online Status */}
                  <div className="pt-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">Show Online Presence</p>
                      <p className="text-slate-500">
                        Display the green activity dot on your profile avatar when active.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacy.showOnlineStatus}
                      onChange={(e) => setPrivacy({ ...privacy, showOnlineStatus: e.target.checked })}
                      className="w-4 h-4 text-[#0a66c2] rounded"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => triggerToast("Privacy preferences saved!")}
                    className="px-5 py-2 rounded-full bg-[#0a66c2] text-white text-xs font-semibold hover:bg-[#004182] cursor-pointer"
                  >
                    Save Visibility Settings
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* TAB 4: COMMUNICATIONS & NOTIFICATIONS                        */}
            {/* ------------------------------------------------------------ */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-5">
                <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200">
                  Notification & Alert Preferences
                </h2>

                <div className="space-y-4 text-xs divide-y divide-slate-100">
                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">Skill Exchange Requests</p>
                      <p className="text-slate-500">
                        Receive instant notifications when a student requests to learn from you.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailOnRequest}
                      onChange={(e) => setNotifications({ ...notifications, emailOnRequest: e.target.checked })}
                      className="w-4 h-4 text-[#0a66c2] rounded"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">Chat & Messages</p>
                      <p className="text-slate-500">
                        Get alerted when partners send messages during active learning exchanges.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailOnMessage}
                      onChange={(e) => setNotifications({ ...notifications, emailOnMessage: e.target.checked })}
                      className="w-4 h-4 text-[#0a66c2] rounded"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">Session Reminders</p>
                      <p className="text-slate-500">
                        Automated alerts 1 hour before scheduled 1-on-1 tutoring sessions.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailOnSession}
                      onChange={(e) => setNotifications({ ...notifications, emailOnSession: e.target.checked })}
                      className="w-4 h-4 text-[#0a66c2] rounded"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">Skill Endorsements & Peer Reviews</p>
                      <p className="text-slate-500">
                        Get notified when peers endorse your skills or leave 5-star feedback.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailOnEndorse}
                      onChange={(e) => setNotifications({ ...notifications, emailOnEndorse: e.target.checked })}
                      className="w-4 h-4 text-[#0a66c2] rounded"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => triggerToast("Notification settings updated!")}
                    className="px-5 py-2 rounded-full bg-[#0a66c2] text-white text-xs font-semibold hover:bg-[#004182] cursor-pointer"
                  >
                    Save Communication Settings
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* TAB 5: DATA PRIVACY, BLOCKING & SAFETY                       */}
            {/* ------------------------------------------------------------ */}
            {activeTab === "safety" && (
              <div className="space-y-5">
                {/* Blocked Accounts */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-4">
                  <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200">
                    Blocked Accounts
                  </h2>
                  <p className="text-xs text-slate-500">
                    Blocked users cannot view your profile, send you messages, or propose skill exchanges.
                  </p>

                  {blockedUsers.length === 0 ? (
                    <p className="text-xs text-slate-400 py-3">You haven't blocked any users.</p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {blockedUsers.map((b) => (
                        <div key={b.id} className="py-3 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-900">{b.name}</span>
                            <span className="text-slate-400 ml-2">({b.reason})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => unblock(b.id)}
                            className="px-3.5 py-1 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
                          >
                            Unblock
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Data Export & Account Archive */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-3">
                  <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-200">
                    Export Profile Data (GDPR & Campus Data Portability)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Download an archived copy of your campus learning record, certifications, experiences, and skill endorsements.
                  </p>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleExportData}
                      className="px-5 py-2.5 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                    >
                      <span>📥 Download Profile Data (.json)</span>
                    </button>
                  </div>
                </div>

                {/* Infrastructure Connection Status */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <CogIcon className="w-5 h-5 text-slate-600" />
                    <h2 className="text-base font-bold text-slate-900">Database & Backend Status</h2>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <p className="font-bold text-slate-800">
                      Backend Server:{" "}
                      <span className="text-emerald-700">Node.js Express + Prisma PostgreSQL (Port 5000)</span>
                    </p>
                    <p className="text-slate-500">
                      Proxy: <span className="font-mono text-slate-700">http://localhost:5173/api</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Profile Photo Modal */}
      {showPhotoModal && (
        <ChangePhotoModal
          isOpen={true}
          currentPhoto={profileImage}
          studentName={name}
          onSave={handleSavePhoto}
          onClose={() => setShowPhotoModal(false)}
        />
      )}

      {/* Change Cover Banner Modal */}
      {showBannerModal && (
        <ChangeBannerModal
          isOpen={true}
          currentBanner={bannerImage}
          onSave={handleSaveBanner}
          onClose={() => setShowBannerModal(false)}
        />
      )}
    </div>
  );
}
