import { useState } from "react";

export default function AddEducationModal({ isOpen, onClose, onAdd }) {
  if (!isOpen) return null;

  const [school, setSchool] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [grade, setGrade] = useState("");
  const [activities, setActivities] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!school.trim()) return;

    onAdd({
      id: "edu_" + Date.now(),
      school: school.trim(),
      degree: degree.trim() || "Bachelor of Technology - BTech",
      fieldOfStudy: fieldOfStudy.trim() || "Computer Science",
      startDate: startDate.trim() || "2023",
      endDate: endDate.trim() || "2027",
      grade: grade.trim() || "Good Standing",
      activities: activities.trim(),
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Add Education</h2>
            <p className="text-xs text-slate-500">Add your college, degree, and campus societies</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              School / University *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tech Institute of Engineering, Indian Institute of Technology"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Degree
              </label>
              <input
                type="text"
                placeholder="e.g. Bachelor of Technology - BTech"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Field of Study / Department
              </label>
              <input
                type="text"
                placeholder="e.g. Computer Science, Information Tech"
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Start Year
              </label>
              <input
                type="text"
                placeholder="2023"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                End Year (or Expected)
              </label>
              <input
                type="text"
                placeholder="2027"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Grade / CGPA
              </label>
              <input
                type="text"
                placeholder="e.g. 9.2 CGPA"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Activities and Societies
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Coding Club Lead, IEEE Student Member, Robotics Guild"
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#0a66c2] text-white font-semibold hover:bg-[#004182] shadow-sm"
            >
              Save Education
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
