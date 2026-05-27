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
        🏋️
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
