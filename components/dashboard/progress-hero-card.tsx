"use client";

import { useRouter } from "next/navigation";
import { CategoryTag } from "@/components/ui/category-tag";
import { CircularProgress } from "@/components/ui/circular-progress";
import { FitButton } from "@/components/ui/fit-button";
import { FitCard } from "@/components/ui/fit-card";
import { useStoreHydrated } from "@/lib/hooks/use-store-hydrated";
import { useFitLogStore } from "@/lib/store/use-fit-log-store";
import { getDominantCategory } from "@/lib/utils/activity";
import { formatDate, todayISO } from "@/lib/utils/date";

const WEEKLY_SET_GOAL = 30;

export function ProgressHeroCard() {
  const router = useRouter();
  const hydrated = useStoreHydrated();
  const getSessionsWithStats = useFitLogStore(
    (state) => state.getSessionsWithStats,
  );
  const getExerciseById = useFitLogStore((state) => state.getExerciseById);
  const sets = useFitLogStore((state) => state.sets);
  const today = todayISO();

  if (!hydrated) {
    return (
      <FitCard variant="dark" className="min-h-[180px] animate-pulse opacity-60">
        <span className="sr-only">Đang tải</span>
      </FitCard>
    );
  }

  const sessions = getSessionsWithStats();
  const todaySession = sessions.find(({ session }) => session.date === today);
  const latest = todaySession ?? sessions[0];

  const progressPercent = latest
    ? Math.min(100, Math.round((latest.stats.setCount / WEEKLY_SET_GOAL) * 100))
    : 0;

  const dominantCategory =
    latest &&
    getDominantCategory(latest.session.id, sets, getExerciseById);

  const ctaLabel = todaySession ? "Tiếp tục tập" : "Bắt đầu tập hôm nay";

  return (
    <FitCard variant="dark">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {dominantCategory ? (
            <CategoryTag category={dominantCategory} className="mb-2" />
          ) : (
            <span className="mb-2 inline-flex rounded-[var(--fit-radius-pill)] bg-white/15 px-2.5 py-0.5 text-xs font-medium text-white">
              Hôm nay
            </span>
          )}
          <h2 className="text-lg font-semibold text-white">
            {latest ? formatDate(latest.session.date) : "Chưa có buổi tập"}
          </h2>
          <p className="mt-1 text-sm text-white/70">
            {latest
              ? `${latest.stats.exerciseCount} bài · ${latest.stats.setCount} set · ${latest.stats.totalVolume.toLocaleString("vi-VN")} kg`
              : "Ghi log buổi tập đầu tiên của bạn"}
          </p>
        </div>
        <CircularProgress value={progressPercent} />
      </div>
      <FitButton
        fullWidth
        className="mt-4 bg-white text-fit-card-dark hover:bg-white/90"
        onClick={() => router.push(`/workout/${today}`)}
      >
        {ctaLabel}
      </FitButton>
    </FitCard>
  );
}
