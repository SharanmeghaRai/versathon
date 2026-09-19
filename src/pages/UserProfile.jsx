import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  fetchStudentById,
  fetchAllStudents,
  createExchangeRequest,
  fetchReviewsForTeacher,
  reportUser,
  updateStudentProfile,
} from "../utils/dataService";
import SkillTag from "../components/SkillTag";
import EditProfileModal from "../components/EditProfileModal";
import AddCertificationModal from "../components/profile/AddCertificationModal";
import AddExperienceModal from "../components/profile/AddExperienceModal";
import AddEducationModal from "../components/profile/AddEducationModal";
import AddProjectModal from "../components/profile/AddProjectModal";
import AddSkillModal from "../components/profile/AddSkillModal";
import AddSectionModal from "../components/profile/AddSectionModal";
import ChangePhotoModal from "../components/profile/ChangePhotoModal";
import ChangeBannerModal from "../components/profile/ChangeBannerModal";
import {
  StarIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ChatIcon,
  PencilIcon,
  CameraIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  EyeIcon,
  ShareIcon,
  LinkIcon,
  CheckBadgeIcon,
  ThumbsUpIcon,
  PlusIcon,
  MapPinIcon,
  EllipsisHorizontalIcon,
  BuildingLibraryIcon,
} from "../components/Icons";

const BANNER_THEMES = [
  { id: "navy", name: "Classic Navy", style: "from-[#0a66c2] via-[#004182] to-[#002244]" },
  { id: "coral", name: "Campus Coral", style: "from-[#ff5a5f] via-[#e04047] to-[#8c1d22]" },
  { id: "emerald", name: "Tech Emerald", style: "from-[#057642] via-[#045d34] to-[#01351d]" },
  { id: "purple", name: "Cyber Violet", style: "from-[#7015a8] via-[#4c1d95] to-[#1e1b4b]" },
  { id: "slate", name: "Minimal Slate", style: "from-[#334155] via-[#1e293b] to-[#0f172a]" },
];

export default function UserProfile() {
  const { id } = useParams();
  const { currentUser, profile: authProfile, updateCurrentUserProfile } = useAuth();
  const navigate = useNavigate();

  const isSelf = !id || id === currentUser?.uid || id === authProfile?.id || id === "demo_rahul";
  const activeId = isSelf ? (currentUser?.uid || authProfile?.id || "demo_rahul") : id;

  const [student, setStudent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [suggestedPeers, setSuggestedPeers] = useState([]);
  const [loading, setLoading] = useState(true);

  // LinkedIn banner theme state
  const [bannerTheme, setBannerTheme] = useState(() => {
    return localStorage.getItem(`profile_banner_${activeId}`) || "navy";
  });
  const [showBannerMenu, setShowBannerMenu] = useState(false);

  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showExpModal, setShowExpModal] = useState(false);
  const [showEduModal, setShowEduModal] = useState(false);
  const [showProjModal, setShowProjModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);

  // About expand toggle
  const [bioExpanded, setBioExpanded] = useState(false);

  // Endorsement interactive state
  const [endorsements, setEndorsements] = useState({});

  // Exchange Request modal state (for peer view)
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [skillWanted, setSkillWanted] = useState("");
  const [skillOffered, setSkillOffered] = useState("");
  const [exchangeMsg, setExchangeMsg] = useState("");
  const [exchangeStatus, setExchangeStatus] = useState({ type: "", text: "" });

  // Report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState("");

  // Activity filter
  const [activityFilter, setActivityFilter] = useState("all");

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        let currentData = null;
        if (isSelf) {
          currentData = authProfile || (await fetchStudentById(activeId));
        } else {
          currentData = await fetchStudentById(activeId);
        }

        const [revs, peers] = await Promise.all([
          fetchReviewsForTeacher(activeId),
          fetchAllStudents(activeId),
        ]);

        setStudent(currentData);
        setReviews(revs || []);
        setSuggestedPeers((peers || []).slice(0, 5));

        // Initialize endorsements
        const initialEndorsements = {};
        (currentData?.teachingSkills || []).forEach((sk, idx) => {
          initialEndorsements[sk] = {
            count: 4 + ((idx * 5) % 11),
            userEndorsed: false,
          };
        });
        setEndorsements(initialEndorsements);
      } catch (err) {
        console.error("Error loading user profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [activeId, isSelf, authProfile]);

  function showToastMessage(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function handleBannerSelect(themeId) {
    setBannerTheme(themeId);
    localStorage.setItem(`profile_banner_${activeId}`, themeId);
    setShowBannerMenu(false);
    showToastMessage("Cover photo theme updated!");
  }

  function handleEndorse(skill) {
    setEndorsements((prev) => {
      const current = prev[skill] || { count: 0, userEndorsed: false };
      const nextEndorsed = !current.userEndorsed;
      const nextCount = nextEndorsed ? current.count + 1 : current.count - 1;

      showToastMessage(
        nextEndorsed
          ? `You endorsed ${student?.name || "this student"} for ${skill}! 🎉`
          : `Removed endorsement for ${skill}`
      );

      return {
        ...prev,
        [skill]: { count: nextCount, userEndorsed: nextEndorsed },
      };
    });
  }

  async function persistUpdates(updatedFields) {
    try {
      if (isSelf && updateCurrentUserProfile) {
        await updateCurrentUserProfile(updatedFields);
      } else {
        await updateStudentProfile(activeId, updatedFields);
      }
      setStudent((prev) => ({ ...prev, ...updatedFields }));
    } catch (err) {
      console.error("Save profile error:", err);
    }
  }

  async function handleProfileSave(updatedFields) {
    await persistUpdates(updatedFields);
    showToastMessage("Profile successfully updated!");
  }

  async function handleSavePhoto(newPhotoUrl) {
    await persistUpdates({ profileImage: newPhotoUrl });
    showToastMessage(newPhotoUrl ? "Profile photo updated! 📸" : "Profile photo removed.");
  }

  async function handleSaveBanner(newBannerUrl) {
    await persistUpdates({ bannerImage: newBannerUrl });
    showToastMessage(newBannerUrl ? "Cover photo updated! 🎨" : "Cover reset to default theme.");
  }

  // --- CERTIFICATIONS ---
  async function handleAddCertification(newCert) {
    const list = [newCert, ...(student?.certifications || [])];
    await persistUpdates({ certifications: list });
    showToastMessage(`Certification "${newCert.name}" added to your profile! 📜`);
  }

  async function handleDeleteCertification(certId) {
    const list = (student?.certifications || []).filter((c) => c.id !== certId);
    await persistUpdates({ certifications: list });
    showToastMessage("Certification removed.");
  }

  // --- EXPERIENCES ---
  async function handleAddExperience(newExp) {
    const list = [newExp, ...(student?.experiences || [])];
    await persistUpdates({ experiences: list });
    showToastMessage(`Experience "${newExp.title}" added to your profile! 💼`);
  }

  async function handleDeleteExperience(expId) {
    const list = (student?.experiences || []).filter((e) => e.id !== expId);
    await persistUpdates({ experiences: list });
    showToastMessage("Experience removed.");
  }

  // --- EDUCATION ---
  async function handleAddEducation(newEdu) {
    const list = [newEdu, ...(student?.educations || [])];
    await persistUpdates({ educations: list });
    showToastMessage(`Education at "${newEdu.school}" added to your profile! 🎓`);
  }

  async function handleDeleteEducation(eduId) {
    const list = (student?.educations || []).filter((e) => e.id !== eduId);
    await persistUpdates({ educations: list });
    showToastMessage("Education removed.");
  }

  // --- PROJECTS ---
  async function handleAddProject(newProj) {
    const list = [newProj, ...(student?.projects || [])];
    await persistUpdates({ projects: list });
    showToastMessage(`Project "${newProj.title}" added to your profile! 🚀`);
  }

  async function handleDeleteProject(projId) {
    const list = (student?.projects || []).filter((p) => p.id !== projId);
    await persistUpdates({ projects: list });
    showToastMessage("Project removed.");
  }

  // --- SKILLS ---
  async function handleAddSkill(skillName, skillType) {
    const key = skillType === "teach" ? "teachingSkills" : "learningSkills";
    const currentList = student?.[key] || [];
    if (currentList.map((s) => s.toLowerCase()).includes(skillName.toLowerCase())) {
      showToastMessage(`Skill "${skillName}" is already in your profile!`);
      return;
    }
    const updated = [...currentList, skillName];
    await persistUpdates({ [key]: updated });

    if (skillType === "teach") {
      setEndorsements((prev) => ({
        ...prev,
        [skillName]: { count: 1, userEndorsed: false },
      }));
    }
    showToastMessage(`Added "${skillName}" to ${skillType === "teach" ? "teaching" : "learning"} skills! 💡`);
  }

  async function handleDeleteSkill(skillName, skillType) {
    const key = skillType === "teach" ? "teachingSkills" : "learningSkills";
    const updated = (student?.[key] || []).filter((s) => s !== skillName);
    await persistUpdates({ [key]: updated });
    showToastMessage(`Removed "${skillName}" from skills.`);
  }

  // --- EXCHANGE & REPORT ---
  async function handleSendExchange(e) {
    e.preventDefault();
    if (!skillWanted || !skillOffered) {
      setExchangeStatus({
        type: "error",
        text: "Please select what you want to learn and what you will teach.",
      });
      return;
    }

    try {
      await createExchangeRequest({
        fromId: currentUser?.uid || "demo_rahul",
        fromName: authProfile?.name || "Peer Student",
        toId: student.id,
        toName: student.name,
        skillWanted,
        skillOffered,
        message: exchangeMsg.trim(),
        status: "pending",
        createdAt: Date.now(),
      });

      setExchangeStatus({ type: "success", text: "Skill exchange request sent! 🎉" });
      setTimeout(() => {
        setShowExchangeModal(false);
        setExchangeStatus({ type: "", text: "" });
        navigate("/requests");
      }, 1000);
    } catch (err) {
      setExchangeStatus({
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
      reporterId: currentUser?.uid || "anonymous",
      reason: reportReason.trim(),
    });

    setReportSuccess(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSuccess(false);
      setReportReason("");
      showToastMessage("Report submitted to campus moderation.");
    }, 1500);
  }

  function handleCopyProfileUrl() {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    showToastMessage("LinkedIn profile link copied to clipboard!");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f2f0] py-12 px-4 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#0a66c2] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-semibold text-slate-600">Loading LinkedIn profile...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-[#f3f2f0] py-12 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-lg font-bold text-slate-800 mb-2">Student Profile Not Found</p>
          <p className="text-xs text-slate-500 mb-4">
            The profile you are trying to view does not exist or has been removed.
          </p>
          <Link
            to="/discover"
            className="inline-block px-5 py-2 rounded-full bg-[#0a66c2] text-white text-sm font-semibold hover:bg-[#004182]"
          >
            Back to Campus Directory
          </Link>
        </div>
      </div>
    );
  }

  const activeBanner =
    BANNER_THEMES.find((t) => t.id === bannerTheme) || BANNER_THEMES[0];

  const studentName = student.name || "Campus Student";
  const studentHeadline =
    student.headline ||
    `${student.department || "Computer Science"} @ ${student.college || "Tech Institute of Engineering"} | Open to Skill Exchange`;
  const studentLocation = student.location || "Bengaluru, Karnataka, India";
  const studentPronouns = student.pronouns || (isSelf ? "he/him" : "peer");
  const studentRating = Number(student.rating || 4.9).toFixed(1);
  const studentReviewCount = student.reviewCount || reviews.length || 6;
  const studentPoints = student.points || 140;

  // Calculate Profile Strength (LinkedIn All-Star Gamification)
  const certsCount = (student.certifications || []).length;
  const expsCount = (student.experiences || []).length;
  const edusCount = (student.educations || []).length;
  const projsCount = (student.projects || []).length;
  const skillsCount = (student.teachingSkills || []).length + (student.learningSkills || []).length;

  let strengthScore = 30; // base score
  if (student.bio) strengthScore += 15;
  if (skillsCount >= 4) strengthScore += 15;
  if (certsCount >= 1) strengthScore += 15;
  if (expsCount >= 1) strengthScore += 15;
  if (projsCount >= 1) strengthScore += 10;
  strengthScore = Math.min(strengthScore, 100);

  const strengthLevel =
    strengthScore >= 85 ? "All-Star ⭐" : strengthScore >= 60 ? "Intermediate" : "Beginner";

  return (
    <div className="min-h-screen bg-[#f3f2f0] text-[#191919] font-sans pb-16">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#191919] text-white px-5 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
          <SparklesIcon className="w-4 h-4 text-[#0a66c2]" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Container: LinkedIn 2-Column Responsive Layout */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ============================================================ */}
          {/* LEFT / MAIN COLUMN (8 of 12 columns on desktop)             */}
          {/* ============================================================ */}
          <div className="lg:col-span-8 space-y-3 sm:space-y-4">
            {/* ------------------------------------------------------------ */}
            {/* CARD 1: LINKEDIN HERO / INTRO CARD                          */}
            {/* ------------------------------------------------------------ */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden relative">
              {/* Cover Photo / Banner */}
              <div
                className={`h-36 sm:h-52 w-full relative transition-all duration-300 overflow-hidden ${
                  !student?.bannerImage ? `bg-gradient-to-r ${activeBanner.style}` : "bg-slate-900"
                }`}
              >
                {student?.bannerImage ? (
                  <img
                    src={student.bannerImage}
                    alt="Cover banner"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="absolute inset-0 opacity-15"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                )}

                {/* Banner Customization Trigger */}
                {isSelf && (
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowBannerModal(true);
                      }}
                      className="cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 bg-white/95 hover:bg-white text-slate-800 text-xs font-semibold rounded-full shadow-md backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
                      title="Upload or Change Cover Photo"
                    >
                      <CameraIcon className="w-4 h-4 text-[#0a66c2]" />
                      <span>Change Cover</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowBannerMenu((prev) => !prev);
                      }}
                      className="cursor-pointer flex items-center gap-1 px-2.5 py-1.5 bg-white/95 hover:bg-white text-slate-700 text-xs font-semibold rounded-full shadow-md backdrop-blur-sm transition-all"
                      title="Quick Gradient Themes"
                    >
                      <span className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" />
                      <span className="hidden sm:inline">Theme</span>
                    </button>

                    {/* Banner Theme Dropdown */}
                    {showBannerMenu && (
                      <div className="absolute right-0 top-10 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95">
                        <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Cover Banner Themes
                        </div>
                        {BANNER_THEMES.map((theme) => (
                          <button
                            key={theme.id}
                            type="button"
                            onClick={() => {
                              handleBannerSelect(theme.id);
                              // Clear custom banner to show gradient
                              if (student?.bannerImage) {
                                handleSaveBanner("");
                              }
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 flex items-center gap-2"
                          >
                            <span
                              className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${theme.style}`}
                            />
                            <span>{theme.name}</span>
                            {theme.id === bannerTheme && !student?.bannerImage && (
                              <span className="ml-auto text-[#0a66c2] font-bold">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Avatar & Action Pen Row */}
              <div className="px-4 sm:px-6 relative">
                <div className="flex justify-between items-end">
                  {/* Floating Circular Avatar */}
                  <div className="-mt-16 sm:-mt-24 relative group z-10">
                    <div
                      onClick={() => isSelf && setShowPhotoModal(true)}
                      className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white p-1 shadow-lg ring-4 ring-white relative overflow-hidden ${
                        isSelf ? "cursor-pointer" : ""
                      }`}
                      title={isSelf ? "Click to change profile photo" : studentName}
                    >
                      {student.profileImage ? (
                        <img
                          src={student.profileImage}
                          alt={studentName}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-[#0a66c2] text-white flex items-center justify-center font-bold text-4xl sm:text-5xl uppercase select-none">
                          {studentName.charAt(0)}
                        </div>
                      )}

                      {/* Interactive Hover Overlay for Self */}
                      {isSelf && (
                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[11px] font-semibold transition-opacity backdrop-blur-[2px]">
                          <CameraIcon className="w-5 h-5 mb-0.5 text-white" />
                          <span>Change</span>
                        </div>
                      )}
                    </div>

                    {/* Online Presence Indicator */}
                    <span
                      className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-white shadow-sm z-10 pointer-events-none"
                      title="Active on Campus"
                    />

                    {/* Camera Edit Badge for Self */}
                    {isSelf && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPhotoModal(true);
                        }}
                        className="cursor-pointer absolute bottom-1 left-1 p-2 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 shadow-md z-20 transition-transform hover:scale-110"
                        title="Update Photo"
                      >
                        <CameraIcon className="w-3.5 h-3.5 text-[#0a66c2]" />
                      </button>
                    )}
                  </div>

                  {/* Top Right Quick Actions */}
                  <div className="flex items-center gap-2 pb-2">
                    {isSelf ? (
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                        title="Edit Intro"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowReportModal(true)}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-rose-600 text-xs font-semibold flex items-center gap-1"
                        title="Report this student"
                      >
                        <EllipsisHorizontalIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Identity Header & Headline */}
                <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                  <div className="sm:col-span-8">
                    {/* Name + Badges */}
                    <div className="flex items-center flex-wrap gap-2">
                      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                        {studentName}
                      </h1>
                      <span className="text-xs text-slate-500 font-medium">
                        ({studentPronouns})
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-[#0a66c2] text-[11px] font-bold border border-blue-200">
                        <CheckBadgeIcon className="w-3.5 h-3.5 text-[#0a66c2]" />
                        <span>Campus Verified</span>
                      </span>
                    </div>

                    {/* Headline */}
                    <p className="text-sm sm:text-base text-slate-800 font-normal mt-1 leading-snug">
                      {studentHeadline}
                    </p>

                    {/* Location & Contact Info */}
                    <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="w-3.5 h-3.5 text-slate-400" />
                        {studentLocation}
                      </span>
                      <span>•</span>
                      <button
                        onClick={handleCopyProfileUrl}
                        className="text-[#0a66c2] font-semibold hover:underline"
                      >
                        Contact info
                      </button>
                    </div>

                    {/* Connections & Exchange Counter */}
                    <div className="flex items-center gap-3 text-xs text-slate-600 mt-2 font-medium">
                      <span className="text-[#0a66c2] font-bold hover:underline cursor-pointer">
                        500+ connections
                      </span>
                      <span>•</span>
                      <span className="text-slate-700 font-semibold">
                        {student.exchangeCount || 48} Skill Exchanges
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                        <StarIcon className="w-3.5 h-3.5 text-amber-500" filled={true} />
                        {studentRating} ({studentReviewCount} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Institution Badge on Right Side */}
                  <div className="sm:col-span-4 flex items-center sm:justify-end gap-2 text-xs text-slate-800 font-semibold mt-1 sm:mt-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[#0a66c2] shrink-0">
                      <AcademicCapIcon className="w-5 h-5" />
                    </div>
                    <div className="leading-tight">
                      <p className="text-slate-900 font-bold">{student.college || "Tech Institute"}</p>
                      <p className="text-[11px] text-slate-500">{student.department || "Computer Science"}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="mt-4 pb-5 flex flex-wrap items-center gap-2.5">
                  {isSelf ? (
                    <>
                      {/* Pill: Open to */}
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="px-4 py-1.5 rounded-full bg-[#0a66c2] text-white text-sm font-semibold hover:bg-[#004182] shadow-sm transition-colors"
                      >
                        Open to Teach & Learn
                      </button>

                      {/* Pill: Add profile section (Master LinkedIn Drawer) */}
                      <button
                        onClick={() => setShowAddSectionModal(true)}
                        className="px-4 py-1.5 rounded-full border border-[#0a66c2] text-[#0a66c2] text-sm font-semibold hover:bg-blue-50/50 transition-colors flex items-center gap-1.5"
                      >
                        <PlusIcon className="w-3.5 h-3.5" />
                        <span>Add Profile Section</span>
                      </button>

                      {/* Pill: Enhance Profile */}
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="px-4 py-1.5 rounded-full border border-slate-400 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                      >
                        Enhance Profile
                      </button>

                      {/* Pill: More */}
                      <button
                        onClick={handleCopyProfileUrl}
                        className="px-3 py-1.5 rounded-full border border-slate-400 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1"
                        title="Share profile link"
                      >
                        <ShareIcon className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Primary: Request Skill Exchange */}
                      <button
                        onClick={() => setShowExchangeModal(true)}
                        className="px-5 py-2 rounded-full bg-[#0a66c2] text-white text-sm font-semibold hover:bg-[#004182] shadow-sm flex items-center gap-2 transition-all"
                      >
                        <SparklesIcon className="w-4 h-4" />
                        <span>Request Skill Exchange</span>
                      </button>

                      {/* Secondary: Message */}
                      <button
                        onClick={() => navigate("/chat")}
                        className="px-5 py-2 rounded-full border border-[#0a66c2] text-[#0a66c2] text-sm font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
                      >
                        <ChatIcon className="w-4 h-4" />
                        <span>Message</span>
                      </button>

                      {/* Tertiary: Endorse */}
                      <a
                        href="#skills-section"
                        className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                      >
                        <ThumbsUpIcon className="w-4 h-4 text-[#0a66c2]" />
                        <span>Endorse Skills</span>
                      </a>

                      {/* More: Share */}
                      <button
                        onClick={handleCopyProfileUrl}
                        className="px-3.5 py-2 rounded-full border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1"
                      >
                        <ShareIcon className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* "Open to" Callout Box (Signature LinkedIn Component) */}
                <div className="mb-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        <span>Open to Peer Skill Exchange</span>
                      </p>
                      <div className="mt-1 text-slate-700 space-y-0.5">
                        <p>
                          <span className="font-semibold text-slate-900">Teaching:</span>{" "}
                          {(student.teachingSkills || []).join(", ") || "Python, React, UI/UX"}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-900">Learning:</span>{" "}
                          {(student.learningSkills || []).join(", ") || "Machine Learning, Figma"}
                        </p>
                        <p className="text-slate-500">
                          <span className="font-semibold text-slate-700">Format:</span>{" "}
                          {student.learningMode || "Both Online & In-Person"} •{" "}
                          {student.availability || "Flexible Evenings & Weekends"}
                        </p>
                      </div>
                    </div>
                    {isSelf && (
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded"
                        title="Edit preferences"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* CARD 2: PROFILE STRENGTH METER (LinkedIn Signature)         */}
            {/* ------------------------------------------------------------ */}
            {isSelf && (
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-sm text-xs">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">Profile Strength:</span>
                      <span className="font-bold text-[#0a66c2] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                        {strengthLevel} ({strengthScore}%)
                      </span>
                    </div>
                    <p className="text-slate-500 mt-0.5">
                      {strengthScore >= 85
                        ? "Great job! Your profile is complete and stands out to peers on campus."
                        : "Add your latest certifications, experience, or projects to reach All-Star level!"}
                    </p>
                  </div>
                  {strengthScore < 85 && (
                    <button
                      onClick={() => setShowAddSectionModal(true)}
                      className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700"
                    >
                      <PlusIcon className="w-3.5 h-3.5" />
                      <span>Add Section</span>
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mt-2">
                  <div
                    className="bg-[#0a66c2] h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${strengthScore}%` }}
                  />
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* CARD 3: ANALYTICS ("Private to you")                        */}
            {/* ------------------------------------------------------------ */}
            {isSelf && (
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Analytics</h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <EyeIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>Private to you</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                  <div className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition-colors">
                    <p className="text-xl sm:text-2xl font-bold text-slate-900">142</p>
                    <p className="text-xs text-slate-600 font-medium">Profile views</p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">↑ 18% past 7 days</p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition-colors">
                    <p className="text-xl sm:text-2xl font-bold text-[#0a66c2]">
                      {student.exchangeCount || 48}
                    </p>
                    <p className="text-xs text-slate-600 font-medium">Completed exchanges</p>
                    <p className="text-[11px] text-slate-500 mt-1">Peer certified</p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition-colors">
                    <p className="text-xl sm:text-2xl font-bold text-slate-900">52</p>
                    <p className="text-xs text-slate-600 font-medium">Search appearances</p>
                    <p className="text-[11px] text-slate-500 mt-1">Keywords: React, Python</p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition-colors">
                    <p className="text-xl sm:text-2xl font-bold text-amber-500 flex items-center gap-1">
                      ⭐ {studentRating}
                    </p>
                    <p className="text-xs text-slate-600 font-medium">Peer rating score</p>
                    <p className="text-[11px] text-slate-500 mt-1">{studentReviewCount} reviews</p>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* CARD 4: ABOUT                                               */}
            {/* ------------------------------------------------------------ */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-bold text-slate-900">About</h2>
                {isSelf && (
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-full"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="text-sm text-slate-700 leading-relaxed space-y-2">
                <p className={!bioExpanded ? "line-clamp-3" : ""}>
                  {student.bio ||
                    "Passionate student eager to collaborate, share programming fundamentals, and explore modern engineering design systems. Active in campus coding clubs and open to mutual learning sessions."}
                </p>

                {(student.bio?.length || 0) > 160 && (
                  <button
                    onClick={() => setBioExpanded((prev) => !prev)}
                    className="text-xs font-semibold text-[#0a66c2] hover:underline"
                  >
                    {bioExpanded ? "see less" : "...see more"}
                  </button>
                )}
              </div>

              {/* Top Skills highlight */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center flex-wrap gap-2 text-xs">
                <span className="font-bold text-slate-700">Top skills:</span>
                {(student.teachingSkills || []).slice(0, 3).map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* CARD 5: LICENSES & CERTIFICATIONS (Dedicated LinkedIn Card) */}
            {/* ------------------------------------------------------------ */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Licenses & Certifications</h2>
                  <p className="text-xs text-slate-500">
                    {(student.certifications || []).length} verified credentials
                  </p>
                </div>
                {isSelf && (
                  <button
                    onClick={() => setShowCertModal(true)}
                    className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-full flex items-center gap-1 text-xs font-semibold"
                    title="Add certification"
                  >
                    <PlusIcon className="w-5 h-5 text-[#0a66c2]" />
                  </button>
                )}
              </div>

              {(student.certifications || []).length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="font-semibold text-slate-700">No certifications added yet</p>
                  <p className="mt-1">
                    Showcase course completions, hackathon credentials, AWS, Meta, or Google Cloud certificates.
                  </p>
                  {isSelf && (
                    <button
                      onClick={() => setShowCertModal(true)}
                      className="mt-3 px-4 py-1.5 rounded-full bg-[#0a66c2] text-white font-semibold hover:bg-[#004182]"
                    >
                      + Add certification
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {(student.certifications || []).map((cert, idx) => (
                    <div
                      key={cert.id || idx}
                      className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-lg shrink-0">
                          📜
                        </div>
                        <div className="text-xs">
                          <p className="text-sm font-bold text-slate-900 leading-tight">
                            {cert.name}
                          </p>
                          <p className="text-slate-700 font-medium mt-0.5">{cert.issuer}</p>
                          <p className="text-slate-400 mt-0.5">
                            Issued {cert.issueDate} • Expires {cert.expirationDate}
                          </p>
                          {cert.credentialId && (
                            <p className="text-slate-500 font-mono text-[11px] mt-0.5">
                              Credential ID: {cert.credentialId}
                            </p>
                          )}

                          {cert.credentialUrl && cert.credentialUrl !== "#" && (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-300 hover:border-slate-600 text-slate-700 font-semibold text-[11px] hover:bg-slate-50 transition-colors"
                            >
                              <span>Show credential</span>
                              <span className="text-xs">↗</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {isSelf && (
                        <button
                          onClick={() => handleDeleteCertification(cert.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 text-xs"
                          title="Remove certification"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ------------------------------------------------------------ */}
            {/* CARD 6: PROJECTS (Dedicated LinkedIn Card)                  */}
            {/* ------------------------------------------------------------ */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Projects</h2>
                  <p className="text-xs text-slate-500">
                    {(student.projects || []).length} technical builds & applications
                  </p>
                </div>
                {isSelf && (
                  <button
                    onClick={() => setShowProjModal(true)}
                    className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-full"
                    title="Add project"
                  >
                    <PlusIcon className="w-5 h-5 text-[#0a66c2]" />
                  </button>
                )}
              </div>

              {(student.projects || []).length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="font-semibold text-slate-700">No projects listed yet</p>
                  <p className="mt-1">Add your hackathon entries, course projects, or GitHub repositories.</p>
                  {isSelf && (
                    <button
                      onClick={() => setShowProjModal(true)}
                      className="mt-3 px-4 py-1.5 rounded-full bg-[#0a66c2] text-white font-semibold hover:bg-[#004182]"
                    >
                      + Add project
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {(student.projects || []).map((proj, idx) => (
                    <div
                      key={proj.id || idx}
                      className="pb-4 border-b border-slate-100 last:border-b-0 last:pb-0 text-xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{proj.title}</p>
                          <p className="text-slate-400 text-[11px] mt-0.5">
                            {proj.startDate} - {proj.endDate}
                          </p>
                        </div>
                        {isSelf && (
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                            title="Remove project"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {proj.description && (
                        <p className="text-slate-700 mt-2 leading-relaxed">{proj.description}</p>
                      )}

                      {proj.skills && proj.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {proj.skills.map((sk) => (
                            <span
                              key={sk}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      )}

                      {proj.projectUrl && proj.projectUrl !== "#" && (
                        <a
                          href={proj.projectUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-300 hover:border-slate-600 text-slate-700 font-semibold text-[11px] hover:bg-slate-50 transition-colors"
                        >
                          <LinkIcon className="w-3.5 h-3.5" />
                          <span>Show project</span>
                          <span className="text-xs">↗</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ------------------------------------------------------------ */}
            {/* CARD 7: EXPERIENCE & CAMPUS ROLES                           */}
            {/* ------------------------------------------------------------ */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Experience & Campus Roles</h2>
                  <p className="text-xs text-slate-500">
                    {(student.experiences || []).length} positions held
                  </p>
                </div>
                {isSelf && (
                  <button
                    onClick={() => setShowExpModal(true)}
                    className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-full"
                    title="Add experience"
                  >
                    <PlusIcon className="w-5 h-5 text-[#0a66c2]" />
                  </button>
                )}
              </div>

              {(student.experiences || []).length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="font-semibold text-slate-700">No experience added yet</p>
                  <p className="mt-1">Add campus mentoring roles, internships, or student club positions.</p>
                  {isSelf && (
                    <button
                      onClick={() => setShowExpModal(true)}
                      className="mt-3 px-4 py-1.5 rounded-full bg-[#0a66c2] text-white font-semibold hover:bg-[#004182]"
                    >
                      + Add position
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {(student.experiences || []).map((exp, idx) => (
                    <div
                      key={exp.id || idx}
                      className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                          <BriefcaseIcon className="w-5 h-5 text-[#0a66c2]" />
                        </div>
                        <div className="text-xs">
                          <p className="text-sm font-bold text-slate-900 leading-tight">
                            {exp.title}
                          </p>
                          <p className="text-slate-700 font-medium mt-0.5">
                            {exp.organization} • {exp.location || "Campus"}
                          </p>
                          <p className="text-slate-400 mt-0.5">
                            {exp.startDate} - {exp.endDate}
                          </p>
                          {exp.description && (
                            <p className="text-slate-600 mt-1.5 leading-relaxed">{exp.description}</p>
                          )}
                        </div>
                      </div>

                      {isSelf && (
                        <button
                          onClick={() => handleDeleteExperience(exp.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 text-xs"
                          title="Remove experience"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ------------------------------------------------------------ */}
            {/* CARD 8: EDUCATION                                           */}
            {/* ------------------------------------------------------------ */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Education</h2>
                  <p className="text-xs text-slate-500">
                    {(student.educations || []).length} institutions
                  </p>
                </div>
                {isSelf && (
                  <button
                    onClick={() => setShowEduModal(true)}
                    className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-full"
                    title="Add education"
                  >
                    <PlusIcon className="w-5 h-5 text-[#0a66c2]" />
                  </button>
                )}
              </div>

              {(student.educations || []).length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="font-semibold text-slate-700">No education listed yet</p>
                  {isSelf && (
                    <button
                      onClick={() => setShowEduModal(true)}
                      className="mt-3 px-4 py-1.5 rounded-full bg-[#0a66c2] text-white font-semibold hover:bg-[#004182]"
                    >
                      + Add education
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {(student.educations || []).map((edu, idx) => (
                    <div
                      key={edu.id || idx}
                      className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                          <AcademicCapIcon className="w-6 h-6 text-[#0a66c2]" />
                        </div>
                        <div className="text-xs">
                          <p className="text-sm font-bold text-slate-900 leading-tight">
                            {edu.school}
                          </p>
                          <p className="text-slate-700 font-medium mt-0.5">
                            {edu.degree}, {edu.fieldOfStudy}
                          </p>
                          <p className="text-slate-400 mt-0.5">
                            {edu.startDate} - {edu.endDate}
                          </p>
                          {edu.grade && (
                            <p className="text-slate-700 font-semibold mt-0.5">Grade: {edu.grade}</p>
                          )}
                          {edu.activities && (
                            <p className="text-slate-600 mt-1">
                              <span className="font-semibold text-slate-800">Activities:</span>{" "}
                              {edu.activities}
                            </p>
                          )}
                        </div>
                      </div>

                      {isSelf && (
                        <button
                          onClick={() => handleDeleteEducation(edu.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 text-xs"
                          title="Remove education"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ------------------------------------------------------------ */}
            {/* CARD 9: SKILLS & ENDORSEMENTS                               */}
            {/* ------------------------------------------------------------ */}
            <div id="skills-section" className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Skills & Endorsements</h2>
                  <p className="text-xs text-slate-500">
                    {skillsCount} skills verified by campus peers
                  </p>
                </div>
                {isSelf && (
                  <button
                    onClick={() => setShowSkillModal(true)}
                    className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-full flex items-center gap-1 text-xs font-semibold"
                    title="Add skill"
                  >
                    <PlusIcon className="w-5 h-5 text-[#0a66c2]" />
                  </button>
                )}
              </div>

              {/* Skills to Teach */}
              <div className="mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Skills Available to Teach ({student.teachingSkills?.length || 0})
                </p>
                <div className="space-y-3">
                  {(student.teachingSkills || []).map((skill) => {
                    const endorsement = endorsements[skill] || { count: 4, userEndorsed: false };
                    return (
                      <div
                        key={skill}
                        className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 flex items-center justify-between transition-all"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-900">{skill}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <span className="font-semibold text-[#0a66c2]">
                              {endorsement.count} endorsements
                            </span>
                            <span>•</span>
                            <span>Endorsed by campus peers</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Interactive Endorse Button */}
                          <button
                            onClick={() => handleEndorse(skill)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                              endorsement.userEndorsed
                                ? "bg-[#0a66c2] text-white shadow-sm"
                                : "border border-[#0a66c2] text-[#0a66c2] hover:bg-blue-50"
                            }`}
                          >
                            <ThumbsUpIcon className="w-3.5 h-3.5" />
                            <span>{endorsement.userEndorsed ? "Endorsed ✓" : "+ Endorse"}</span>
                          </button>

                          {isSelf && (
                            <button
                              onClick={() => handleDeleteSkill(skill, "teach")}
                              className="text-slate-400 hover:text-rose-600 p-1 text-xs"
                              title="Remove skill"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Skills Eager to Learn */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Skills Eager to Learn ({student.learningSkills?.length || 0})
                </p>
                <div className="flex flex-wrap gap-2">
                  {(student.learningSkills || []).map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2"
                    >
                      <SparklesIcon className="w-3.5 h-3.5 text-amber-500" />
                      <span>{skill}</span>
                      {isSelf && (
                        <button
                          onClick={() => handleDeleteSkill(skill, "learn")}
                          className="text-slate-400 hover:text-rose-600 text-xs"
                          title="Remove"
                        >
                          ✕
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* CARD 10: RECOMMENDATIONS & REVIEWS                         */}
            {/* ------------------------------------------------------------ */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Recommendations & Reviews</h2>
                  <p className="text-xs text-slate-500">{reviews.length} peer testimonials</p>
                </div>
                {!isSelf && (
                  <button
                    onClick={() => navigate("/reviews")}
                    className="px-3 py-1 rounded-full border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                  >
                    Write a Review
                  </button>
                )}
              </div>

              {reviews.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                  No peer reviews received yet. Complete skill exchange sessions to earn reviews!
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev.id || Math.random()} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-[#0a66c2] text-white font-bold flex items-center justify-center text-[11px]">
                            {rev.reviewerName?.charAt(0) || "P"}
                          </span>
                          <div>
                            <p className="font-bold text-slate-900">{rev.reviewerName || "Campus Peer"}</p>
                            <p className="text-[10px] text-slate-400">Verified Peer Exchange</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <StarIcon
                              key={i}
                              className="w-3.5 h-3.5"
                              filled={i < (rev.rating || 5)}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-700 leading-relaxed italic">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT SIDEBAR COLUMN (4 of 12 columns on desktop)           */}
          {/* ============================================================ */}
          <div className="lg:col-span-4 space-y-4">
            {/* Sidebar Card 1: Profile Language & Public URL */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-sm text-xs">
              <div className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Profile Language</p>
                    <p className="text-slate-500">English</p>
                  </div>
                  {isSelf && <PencilIcon className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              <div className="pt-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-slate-900">Public Profile & URL</p>
                  {isSelf && <PencilIcon className="w-4 h-4 text-slate-400" />}
                </div>
                <p className="text-slate-500 truncate mb-2 font-mono text-[11px]">
                  campus.exchange/in/{(student.name || "user").toLowerCase().replace(/\s+/g, "-")}
                </p>
                <button
                  onClick={handleCopyProfileUrl}
                  className="w-full py-1.5 px-3 rounded-full border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Copy Public Profile Link</span>
                </button>
              </div>
            </div>

            {/* Sidebar Card 2: Campus Peers You May Know */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-sm text-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Campus Peers You May Know</h3>
              <div className="space-y-3.5">
                {suggestedPeers.map((peer) => (
                  <div key={peer.id} className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#0a66c2] text-white font-bold flex items-center justify-center text-xs shrink-0">
                        {peer.name?.charAt(0) || "S"}
                      </div>
                      <div>
                        <Link
                          to={`/student/${peer.id}`}
                          className="font-bold text-slate-900 hover:text-[#0a66c2] hover:underline block leading-tight"
                        >
                          {peer.name}
                        </Link>
                        <p className="text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-1">
                          {peer.department} • {peer.year}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Teaches: {(peer.teachingSkills || []).slice(0, 2).join(", ")}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/student/${peer.id}`}
                      className="px-2.5 py-1 rounded-full border border-slate-400 text-slate-700 hover:border-slate-800 font-semibold text-[11px] shrink-0"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Card 3: Skill Points & Campus Level Widget */}
            <div className="bg-gradient-to-br from-[#0a66c2] to-[#004182] rounded-xl p-4 text-white shadow-md text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold uppercase tracking-wider text-[10px] text-blue-200">
                  Campus Contributor
                </span>
                <SparklesIcon className="w-4 h-4 text-amber-300" />
              </div>
              <p className="text-2xl font-black text-white">{studentPoints} pts</p>
              <p className="text-[11px] text-blue-100 mt-0.5">
                Level 3 Contributor • 60 pts to Level 4
              </p>
              <div className="w-full bg-blue-900/50 rounded-full h-2 mt-3 overflow-hidden">
                <div className="bg-amber-300 h-2 rounded-full" style={{ width: "70%" }} />
              </div>

              <div className="mt-4 pt-3 border-t border-blue-400/30 flex items-center justify-between text-[11px]">
                <span>+20 pts for teaching</span>
                <span className="font-bold text-amber-300">Level Master</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Intro Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        profile={student}
        onSave={handleProfileSave}
      />

      {/* Master Add Section Modal (LinkedIn Drawer) */}
      <AddSectionModal
        isOpen={showAddSectionModal}
        onClose={() => setShowAddSectionModal(false)}
        onOpenCertModal={() => setShowCertModal(true)}
        onOpenExpModal={() => setShowExpModal(true)}
        onOpenEduModal={() => setShowEduModal(true)}
        onOpenProjModal={() => setShowProjModal(true)}
        onOpenSkillModal={() => setShowSkillModal(true)}
      />

      {/* Add Certification Modal */}
      <AddCertificationModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        onAdd={handleAddCertification}
      />

      {/* Add Experience Modal */}
      <AddExperienceModal
        isOpen={showExpModal}
        onClose={() => setShowExpModal(false)}
        onAdd={handleAddExperience}
      />

      {/* Add Education Modal */}
      <AddEducationModal
        isOpen={showEduModal}
        onClose={() => setShowEduModal(false)}
        onAdd={handleAddEducation}
      />

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={showProjModal}
        onClose={() => setShowProjModal(false)}
        onAdd={handleAddProject}
      />

      {/* Add Skill Modal */}
      <AddSkillModal
        isOpen={showSkillModal}
        onClose={() => setShowSkillModal(false)}
        onAdd={handleAddSkill}
      />

      {/* Peer Exchange Request Modal (when viewing other students) */}
      {showExchangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Request Skill Exchange with {studentName}
              </h3>
              <button
                onClick={() => setShowExchangeModal(false)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendExchange} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  What skill do you want to learn from {studentName}? *
                </label>
                <select
                  value={skillWanted}
                  onChange={(e) => setSkillWanted(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
                >
                  <option value="">Select a skill...</option>
                  {(student.teachingSkills || []).map((sk) => (
                    <option key={sk} value={sk}>
                      {sk}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  What skill will you teach in return? *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Python, UI/UX, Figma..."
                  value={skillOffered}
                  onChange={(e) => setSkillOffered(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Introductory Proposal Message
                </label>
                <textarea
                  rows={3}
                  value={exchangeMsg}
                  onChange={(e) => setExchangeMsg(e.target.value)}
                  placeholder="Hi! I noticed your expertise in React. I can help you with Python fundamentals in return..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
                />
              </div>

              {exchangeStatus.text && (
                <div
                  className={`p-2.5 rounded-lg text-xs font-semibold ${
                    exchangeStatus.type === "success"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  {exchangeStatus.text}
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowExchangeModal(false)}
                  className="px-4 py-2 rounded-full border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#0a66c2] text-white font-semibold hover:bg-[#004182]"
                >
                  Send Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Safety Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-2">Report Profile to Moderation</h3>
            <p className="text-xs text-slate-500 mb-4">
              Help keep our campus learning community safe and respectful.
            </p>

            <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
              <textarea
                rows={3}
                required
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Describe the issue (inappropriate content, harassment, impersonation)..."
                className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:border-rose-500"
              />

              {reportSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 font-semibold">
                  Report submitted successfully.
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-full border border-slate-300 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-rose-600 text-white font-semibold hover:bg-rose-700"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Profile Photo Modal */}
      {showPhotoModal && (
        <ChangePhotoModal
          isOpen={true}
          currentPhoto={student?.profileImage || ""}
          studentName={studentName}
          onSave={handleSavePhoto}
          onClose={() => setShowPhotoModal(false)}
        />
      )}

      {/* Change Cover Banner Modal */}
      {showBannerModal && (
        <ChangeBannerModal
          isOpen={true}
          currentBanner={student?.bannerImage || ""}
          onSave={handleSaveBanner}
          onClose={() => setShowBannerModal(false)}
        />
      )}
    </div>
  );
}
