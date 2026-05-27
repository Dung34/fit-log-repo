"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99, y: 0 }}
      transition={{ type: "spring", stiffness: 450, damping: 25 }}
      className="w-full"
    >
      <FitCard 
        variant="dark" 
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-white/5 shadow-xl p-5"
      >
        {/* Decorative gradient orb for deep visual texture */}
        <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-gradient-to-br from-fit-accent-green/10 to-transparent blur-3xl" />
        
        <div className="relative z-10 flex items-center justify-between gap-6">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              {dominantCategory ? (
                <CategoryTag category={dominantCategory} />
              ) : (
                <span className="fit-caption inline-flex rounded-[var(--fit-radius-pill)] bg-white/10 px-2.5 py-0.5 font-bold uppercase tracking-wider text-white/80">
                  Hôm nay
                </span>
              )}
              <span className="fit-caption uppercase tracking-widest font-mono-numbers !text-white/40">
                Mục tiêu: {WEEKLY_SET_GOAL} Sets/tuần
              </span>
            </div>
            <h2 className="fit-title font-extrabold tracking-tight text-white leading-tight">
              {latest ? formatDate(latest.session.date) : "Chưa có buổi tập"}
            </h2>
            
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-white/70">
              <span className="flex items-center gap-1">
                <span className="fit-caption font-normal uppercase tracking-wider !text-white/40">bài</span>
                <span className="fit-body font-mono-numbers text-fit-accent-green">{latest ? latest.stats.exerciseCount : 0}</span>
              </span>
              <span className="h-3 w-[1px] bg-white/10" />
              <span className="flex items-center gap-1">
                <span className="fit-caption font-normal uppercase tracking-wider !text-white/40">set</span>
                <span className="fit-body font-mono-numbers text-fit-accent-blue">{latest ? latest.stats.setCount : 0}</span>
              </span>
              <span className="h-3 w-[1px] bg-white/10" />
              <span className="flex items-center gap-1">
                <span className="fit-caption font-normal uppercase tracking-wider !text-white/40">volume</span>
                <span className="fit-body font-mono-numbers text-white">
                  {latest ? latest.stats.totalVolume.toLocaleString("vi-VN") : 0}
                  <span className="fit-caption !text-white/40 ml-0.5 font-normal">kg</span>
                </span>
              </span>
            </div>
          </div>
          
          <div className="relative flex shrink-0 items-center justify-center">
            {/* Subtle neon glowing light under progress bar */}
            <div className="absolute inset-0 rounded-full bg-fit-accent-green/10 blur-xl animate-pulse" />
            <CircularProgress value={progressPercent} size={84} strokeWidth={9} />
          </div>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        >
          <FitButton
            fullWidth
            variant="ghost"
            className="group mt-5 relative overflow-hidden !bg-white !text-slate-950 hover:!bg-white/95 transition rounded-[var(--fit-radius-pill)] flex items-center justify-center gap-2 font-bold tracking-tight shadow-md border-0"
            onClick={() => router.push(`/workout/${today}`)}
          >
            <span className="!font-bold">{ctaLabel}</span>
            <span className="!font-bold inline-block transition-transform duration-300 group-hover:translate-x-1 font-mono leading-none">
              →
            </span>
          </FitButton>
        </motion.div>
      </FitCard>
    </motion.div>
  );
}
