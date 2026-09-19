import { useState } from "react";

export default function AddSkillModal({ isOpen, onClose, onAdd }) {
  if (!isOpen) return null;

  const [skillName, setSkillName] = useState("");
  const [skillType, setSkillType] = useState("teach"); // "teach" or "learn"

  function handleSubmit(e) {
    e.preventDefault();
    if (!skillName.trim()) return;

    onAdd(skillName.trim(), skillType);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Add Skill</h2>
            <p className="text-xs text-slate-500">Add a skill to teach peers or learn in exchange</p>
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
              Skill Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. React, Python, Cloud Computing, UI/UX, Docker"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-[#0a66c2]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">
              Exchange Intent *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  skillType === "teach"
                    ? "border-[#0a66c2] bg-blue-50/50 text-[#0a66c2] font-bold ring-2 ring-[#0a66c2]/20"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="skillType"
                  value="teach"
                  checked={skillType === "teach"}
                  onChange={() => setSkillType("teach")}
                  className="sr-only"
                />
                <span className="text-sm">🎓 I can teach this</span>
                <span className="text-[11px] text-slate-500 font-normal mt-0.5">Offer for peer mentoring</span>
              </label>

              <label
                className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  skillType === "learn"
                    ? "border-[#0a66c2] bg-blue-50/50 text-[#0a66c2] font-bold ring-2 ring-[#0a66c2]/20"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="skillType"
                  value="learn"
                  checked={skillType === "learn"}
                  onChange={() => setSkillType("learn")}
                  className="sr-only"
                />
                <span className="text-sm">💡 I want to learn</span>
                <span className="text-[11px] text-slate-500 font-normal mt-0.5">Seek campus peers</span>
              </label>
            </div>
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
              Add Skill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
