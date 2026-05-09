interface SectionProgressBarProps {
  sectionName: string;
  answered: number;
  total: number;
  className?: string;
}

export function SectionProgressBar({
  sectionName,
  answered,
  total,
  className = "",
}: SectionProgressBarProps) {
  const pct =
    total > 0 ? Math.min(100, Math.round((answered / total) * 100)) : 0;

  return (
    <div className={`space-y-1 ${className}`} data-ocid="test.section_progress">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-foreground truncate max-w-[60%]">
          {sectionName}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className="question-count-badge"
            style={{
              height: "1.25rem",
              minWidth: "1.25rem",
              fontSize: "0.625rem",
              padding: "0 0.375rem",
            }}
            title={`${total} question${total !== 1 ? "s" : ""} in section`}
            data-ocid="test.section_progress.question_count"
          >
            {total}&thinsp;Q
          </span>
          <span className="text-xs font-mono tabular-nums text-muted-foreground">
            {answered}/{total}
          </span>
        </div>
      </div>
      <div
        className="section-progress-bar"
        role="progressbar"
        tabIndex={0}
        aria-valuenow={answered}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${sectionName}: ${answered} of ${total} answered`}
      >
        <div
          className="section-progress-bar-fill h-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
