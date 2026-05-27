import { Card } from "konsta/react";
import { formatDate } from "@/lib/utils/date";
import type { SessionStats } from "@/lib/utils/volume";

interface SessionSummaryCardProps {
  date: string;
  stats: SessionStats;
}

export function SessionSummaryCard({ date, stats }: SessionSummaryCardProps) {
  return (
    <Card outline className="active:opacity-80">
      <div className="font-semibold">{formatDate(date)}</div>
      <div className="mt-1 text-sm text-black/60 dark:text-white/60">
        {stats.exerciseCount} bài · {stats.setCount} set ·{" "}
        {stats.totalVolume.toLocaleString("vi-VN")} kg
      </div>
    </Card>
  );
}
