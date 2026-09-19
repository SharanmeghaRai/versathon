export default function SkillTag({ children, tone = "teach", onRemove }) {
  const styles =
    tone === "teach"
      ? "bg-coral/10 text-coral border border-coral/30"
      : "bg-ink/5 text-ink border border-ink/20";

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${styles}`}>
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 text-xs opacity-60 hover:opacity-100"
          aria-label={`Remove ${children}`}
        >
          ✕
        </button>
      )}
    </span>
  );
}
