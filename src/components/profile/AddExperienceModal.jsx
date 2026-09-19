import { useState } from "react";

export default function AddExperienceModal({ isOpen, onClose, onAdd }) {
  if (!isOpen) return null;

  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [current, setCurrent] = useState(true);
  const [description, setDescription] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !organization.trim()) return;

    onAdd({
      id: "exp_" + Date.now(),
      title: title.trim(),
      organization: organization.trim(),
      location: location.trim() || "Campus",
      startDate: startDate.trim() || "Recent",
      endDate: current ? "Present" : (endDate.trim() || "Past"),
      current,
      description: description.trim(),
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Add Experience / Campus Role</h2>
            <p className="text-xs text-slate-500">Add leadership, mentoring, or technical positions</p>
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
              Title / Role *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Peer Mentor, Teaching Assistant, Web Developer, Club Lead"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Organization / Department / Club *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Campus Coding Club, Tech Institute, Department of CS"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g. Campus, Remote, Bengaluru"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Start Date
              </label>
              <input
                type="text"
                placeholder="e.g. Aug 2024"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                End Date
              </label>
              <input
                type="text"
                disabled={current}
                placeholder="e.g. Dec 2024"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2] disabled:bg-slate-100 disabled:text-slate-400"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
            <input
              type="checkbox"
              checked={current}
              onChange={(e) => setCurrent(e.target.checked)}
              className="rounded text-[#0a66c2] focus:ring-[#0a66c2]"
            />
            <span>I am currently working in this role</span>
          </label>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description / Key Responsibilities
            </label>
            <textarea
              rows={3}
              placeholder="Describe your achievements, mentorship topics, tools used..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              Save Experience
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
