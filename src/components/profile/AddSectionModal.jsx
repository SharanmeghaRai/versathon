import {
  AcademicCapIcon,
  BriefcaseIcon,
  SparklesIcon,
} from "../Icons";

export default function AddSectionModal({
  isOpen,
  onClose,
  onOpenCertModal,
  onOpenExpModal,
  onOpenEduModal,
  onOpenProjModal,
  onOpenSkillModal,
}) {
  if (!isOpen) return null;

  const sections = [
    {
      category: "Core Sections",
      items: [
        {
          id: "education",
          title: "Add education",
          desc: "School, college, degrees, CGPA, and societies",
          icon: <AcademicCapIcon className="w-5 h-5 text-[#0a66c2]" />,
          action: () => {
            onClose();
            onOpenEduModal();
          },
        },
        {
          id: "experience",
          title: "Add position / role",
          desc: "Club leadership, peer mentoring, teaching assistantship",
          icon: <BriefcaseIcon className="w-5 h-5 text-[#0a66c2]" />,
          action: () => {
            onClose();
            onOpenExpModal();
          },
        },
        {
          id: "skills",
          title: "Add skills",
          desc: "Skills you can teach or skills you want to learn",
          icon: <SparklesIcon className="w-5 h-5 text-[#0a66c2]" />,
          action: () => {
            onClose();
            onOpenSkillModal();
          },
        },
      ],
    },
    {
      category: "Recommended Sections",
      items: [
        {
          id: "certifications",
          title: "Add licenses & certifications",
          desc: "Verified course certificates, AWS/Google certs, hackathons",
          icon: (
            <span className="w-5 h-5 flex items-center justify-center font-bold text-amber-600">
              📜
            </span>
          ),
          action: () => {
            onClose();
            onOpenCertModal();
          },
        },
        {
          id: "projects",
          title: "Add projects",
          desc: "Showcase technical repositories, hackathon apps, or design portfolios",
          icon: (
            <span className="w-5 h-5 flex items-center justify-center font-bold text-[#0a66c2]">
              🚀
            </span>
          ),
          action: () => {
            onClose();
            onOpenProjModal();
          },
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Add to Profile</h2>
            <p className="text-xs text-slate-500">Enhance your LinkedIn profile with new sections</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {sections.map((sec) => (
            <div key={sec.category}>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                {sec.category}
              </h3>
              <div className="space-y-2">
                {sec.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="w-full text-left p-3.5 rounded-xl border border-slate-200/80 hover:border-[#0a66c2] hover:bg-blue-50/40 flex items-start gap-3 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-white flex items-center justify-center shrink-0 shadow-xs border border-slate-200/60">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-[#0a66c2] flex items-center justify-between">
                        <span>{item.title}</span>
                        <span className="text-slate-400 group-hover:text-[#0a66c2] text-xs">→</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
