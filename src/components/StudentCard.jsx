import { Link } from "react-router-dom";
import SkillTag from "./SkillTag";
import { StarIcon } from "./Icons";

export default function StudentCard({ student, isMatch }) {
  if (!student) return null;

  const initials = student.name
    ? student.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="bg-white rounded-2xl border border-mist p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-full bg-ink text-white flex items-center justify-center font-display font-bold text-base shrink-0 group-hover:scale-105 transition-transform">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-ink truncate">{student.name}</p>
              <p className="text-xs text-ink/60 truncate">
                {student.department} {student.year ? `· ${student.year}` : ""}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            {isMatch && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sun/40 text-ink whitespace-nowrap border border-sun">
                ⚡ Great Match!
              </span>
            )}
            {student.rating && (
              <div className="flex items-center gap-1 text-xs font-bold text-ink/80 bg-sand/80 px-2 py-0.5 rounded-md">
                <StarIcon className="w-3.5 h-3.5 text-amber-500" filled />
                <span>{Number(student.rating).toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Badges & Mode Chips */}
        <div className="flex flex-wrap gap-1.5 mt-3 text-[11px]">
          {student.learningMode && (
            <span className="px-2 py-0.5 rounded-full bg-sand text-ink/70 font-medium">
              📍 {student.learningMode}
            </span>
          )}
          {student.skillLevel && (
            <span className="px-2 py-0.5 rounded-full bg-sand text-ink/70 font-medium">
              🎯 {student.skillLevel}
            </span>
          )}
          {student.points ? (
            <span className="px-2 py-0.5 rounded-full bg-sand text-coral font-semibold">
              🏆 {student.points} pts
            </span>
          ) : null}
        </div>

        {/* Skills Section */}
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider font-semibold text-ink/40 mb-1.5">
              Can Teach
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(student.teachingSkills || []).slice(0, 3).map((s) => (
                <SkillTag key={s} tone="teach">{s}</SkillTag>
              ))}
              {(student.teachingSkills || []).length > 3 && (
                <span className="text-[11px] text-ink/40 self-center">
                  +{(student.teachingSkills || []).length - 3} more
                </span>
              )}
            </div>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-wider font-semibold text-ink/40 mb-1.5">
              Wants to Learn
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(student.learningSkills || []).slice(0, 3).map((s) => (
                <SkillTag key={s} tone="learn">{s}</SkillTag>
              ))}
              {(student.learningSkills || []).length > 3 && (
                <span className="text-[11px] text-ink/40 self-center">
                  +{(student.learningSkills || []).length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Button */}
      <Link
        to={`/student/${student.id}`}
        className="mt-5 block w-full text-center py-2.5 rounded-full bg-ink text-white text-xs font-semibold hover:bg-ink/90 transition-colors shadow-sm"
      >
        View Profile & Connect →
      </Link>
    </div>
  );
}
