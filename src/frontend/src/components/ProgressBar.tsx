interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressBar({
  current,
  total,
  className = "",
}: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">
          Question {current} of {total}
        </span>
        <span className="text-muted-foreground">{pct}% Complete</span>
      </div>
      <div
        className="w-full h-2.5 bg-muted rounded-full overflow-hidden"
        aria-label={`Progress: ${current} of ${total} questions, ${pct}% complete`}
      >
        <div
          className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
