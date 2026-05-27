import { CategoryTag } from "@/components/ui/category-tag";
import { FitCard } from "@/components/ui/fit-card";
import type { ExerciseCategory } from "@/lib/store/type";
import { formatDate } from "@/lib/utils/date";
import type { SessionStats } from "@/lib/utils/volume";

interface SessionSummaryCardProps {
  date: string;
  stats: SessionStats;
  category?: ExerciseCategory | null;
}

export function SessionSummaryCard({
  date,
  stats,
  category,
}: SessionSummaryCardProps) {
  return (
    <FitCard className="flex items-center gap-3 !p-3">
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-fit-bg-muted text-2xl"
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 9v6" />
          <path d="M19 9v6" />
          <path d="M9 9v6" />
          <path d="M15 9v6" />
          <path d="M7 12h10" />
          <path d="M5 10h4" />
          <path d="M15 14h4" />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate font-semibold text-fit-text">
            {formatDate(date)}
          </p>
          {category && <CategoryTag category={category} />}
        </div>
        <p className="fit-caption mt-0.5">
          {stats.exerciseCount} bài · {stats.setCount} set ·{" "}
          {stats.totalVolume.toLocaleString("vi-VN")} kg
        </p>
      </div>
    </FitCard>
  );
}
