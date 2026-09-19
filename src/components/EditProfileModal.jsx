import { useState, useEffect } from "react";
import SkillTag from "./SkillTag";

export default function EditProfileModal({ isOpen, onClose, profile, onSave }) {
  if (!isOpen) return null;

  const [name, setName] = useState(profile?.name || "");
  const [headline, setHeadline] = useState(
    profile?.headline ||
      `${profile?.department || "Student"} @ ${profile?.college || "Campus"} | Passionate Peer Mentor`
  );
  const [college, setCollege] = useState(profile?.college || "Tech Institute of Engineering");
  const [department, setDepartment] = useState(profile?.department || "Computer Science");
  const [year, setYear] = useState(profile?.year || "3rd Year");
  const [location, setLocation] = useState(profile?.location || "Bengaluru, Karnataka, India");
  const [bio, setBio] = useState(profile?.bio || "");
  const [pronouns, setPronouns] = useState(profile?.pronouns || "they/them");
  const [profileImage, setProfileImage] = useState(profile?.profileImage || "");
  const [bannerImage, setBannerImage] = useState(profile?.bannerImage || "");
  const [teachingSkills, setTeachingSkills] = useState(profile?.teachingSkills || []);
  const [learningSkills, setLearningSkills] = useState(profile?.learningSkills || []);
  const [teachInput, setTeachInput] = useState("");
  const [learnInput, setLearnInput] = useState("");
  const [availability, setAvailability] = useState(profile?.availability || "Weekdays after 5 PM & Weekends");
  const [learningMode, setLearningMode] = useState(profile?.learningMode || "Both");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setHeadline(
        profile.headline ||
          `${profile.department || "Student"} @ ${profile.college || "Campus"} | Passionate Peer Mentor`
      );
      setCollege(profile.college || "Tech Institute of Engineering");
      setDepartment(profile.department || "Computer Science");
      setYear(profile.year || "3rd Year");
      setLocation(profile.location || "Bengaluru, Karnataka, India");
      setBio(profile.bio || "");
      setPronouns(profile.pronouns || "they/them");
      setProfileImage(profile.profileImage || "");
      setBannerImage(profile.bannerImage || "");
      setTeachingSkills(profile.teachingSkills || []);
      setLearningSkills(profile.learningSkills || []);
      setAvailability(profile.availability || "Weekdays after 5 PM & Weekends");
      setLearningMode(profile.learningMode || "Both");
    }
  }, [profile]);

  function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 400;
        let w = img.width;
        let h = img.height;
        if (w > h && w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else if (h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        setProfileImage(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  function handleBannerUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxW = 1200;
        const maxH = 450;
        let w = img.width;
        let h = img.height;
        if (w > maxW) {
          h = Math.round((h * maxW) / w);
          w = maxW;
        }
        if (h > maxH) {
          w = Math.round((w * maxH) / h);
          h = maxH;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        setBannerImage(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  function handleAddSkill(list, setList, val, setVal) {
    const trimmed = val.trim();
    if (!trimmed) return;
    if (!list.map((s) => s.toLowerCase()).includes(trimmed.toLowerCase())) {
      setList([...list, trimmed]);
    }
    setVal("");
  }

  function handleRemoveSkill(list, setList, item) {
    setList(list.filter((s) => s !== item));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        headline: headline.trim(),
        college: college.trim(),
        department: department.trim(),
        year: year.trim(),
        location: location.trim(),
        bio: bio.trim(),
        pronouns: pronouns.trim(),
        profileImage,
        bannerImage,
        teachingSkills,
        learningSkills,
        availability,
        learningMode,
      });
      onClose();
    } catch (err) {
      console.error("Save profile error:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Edit Intro & Profile</h2>
            <p className="text-xs text-slate-500">Update your LinkedIn-style campus profile card</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 font-bold"
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Photos Row */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Profile Photo */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2 text-[11px]">
                Profile Photo
              </label>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-slate-200 border-2 border-white shadow-md overflow-hidden shrink-0">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#0a66c2] text-white flex items-center justify-center font-bold text-lg">
                      {name.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <label className="inline-block px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 cursor-pointer font-semibold text-[11px] text-slate-700 shadow-xs">
                    <span>Upload New Photo</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                  {profileImage && (
                    <button
                      type="button"
                      onClick={() => setProfileImage("")}
                      className="block text-[11px] text-rose-600 hover:underline"
                    >
                      Remove photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Cover / Background Banner */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2 text-[11px]">
                Cover / Background Photo
              </label>
              <div className="space-y-1.5">
                <div className="w-full h-14 rounded-lg bg-gradient-to-r from-[#0a66c2] to-[#002244] overflow-hidden border border-slate-200">
                  {bannerImage && (
                    <img src={bannerImage} alt="Cover" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <label className="inline-block px-3 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 cursor-pointer font-semibold text-[11px] text-slate-700 shadow-xs">
                    <span>Upload Cover</span>
                    <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                  </label>
                  {bannerImage && (
                    <button
                      type="button"
                      onClick={() => setBannerImage("")}
                      className="text-[11px] text-rose-600 hover:underline"
                    >
                      Remove cover
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Pronouns
              </label>
              <input
                type="text"
                placeholder="e.g. she/her, he/him, they/them"
                value={pronouns}
                onChange={(e) => setPronouns(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Headline *
            </label>
            <input
              type="text"
              placeholder="e.g. Computer Science Undergrad @ Tech Institute | React & Python Mentor"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                College / University
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Academic Year
              </label>
              <input
                type="text"
                placeholder="e.g. 3rd Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g. Bengaluru, Karnataka, India"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              About / Summary
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a brief overview of your background, your learning goals, and what skills you love sharing..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2] focus:ring-1 focus:ring-[#0a66c2]"
            />
          </div>

          {/* Teaching Skills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Skills You Can Teach
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add a skill (e.g. React, Python, UI/UX)..."
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
                onClick={() => handleAddSkill(teachingSkills, setTeachingSkills, teachInput, setTeachInput)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {teachingSkills.map((sk) => (
                <SkillTag
                  key={sk}
                  tone="teach"
                  onRemove={() => handleRemoveSkill(teachingSkills, setTeachingSkills, sk)}
                >
                  {sk}
                </SkillTag>
              ))}
            </div>
          </div>

          {/* Learning Skills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Skills You Want to Learn
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add a skill (e.g. Figma, Machine Learning)..."
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
                onClick={() => handleAddSkill(learningSkills, setLearningSkills, learnInput, setLearnInput)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {learningSkills.map((sk) => (
                <SkillTag
                  key={sk}
                  tone="learn"
                  onRemove={() => handleRemoveSkill(learningSkills, setLearningSkills, sk)}
                >
                  {sk}
                </SkillTag>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Availability
              </label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Learning Mode
              </label>
              <select
                value={learningMode}
                onChange={(e) => setLearningMode(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
              >
                <option value="Both">Both Online & In-Person</option>
                <option value="Online">Online Only</option>
                <option value="In-Person">In-Person Only</option>
              </select>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 text-sm font-semibold rounded-full bg-[#0a66c2] text-white hover:bg-[#004182] disabled:opacity-50 shadow-sm"
            >
              {saving ? "Saving Changes..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
