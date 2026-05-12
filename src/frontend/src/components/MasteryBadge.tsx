interface MasteryBadgeProps {
  masteredCount: number;
  totalCount: number;
  size?: "sm" | "md";
}

export function MasteryBadge({
  masteredCount,
  totalCount,
  size = "sm",
}: MasteryBadgeProps) {
  if (totalCount === 0) return null;

  const isMastered = masteredCount === totalCount;
  const sizeClass =
    size === "md" ? "text-xs px-2.5 py-1" : "text-xs px-1.5 py-0.5";

  if (isMastered) {
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold rounded-full bg-accent/15 text-accent border border-accent/30 ${sizeClass}`}
        data-ocid="mastery_badge.mastered"
        title="All questions mastered"
      >
        🏆 Mastered
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full bg-secondary/40 text-secondary-foreground border border-secondary/30 ${sizeClass}`}
      data-ocid="mastery_badge.progress"
      title={`${masteredCount} of ${totalCount} questions mastered`}
    >
      📈 {masteredCount} / {totalCount}
    </span>
  );
}
