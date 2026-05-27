"use client";

import { Preloader } from "konsta/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ExercisePickerSheet } from "@/components/workout/exercise-picker-sheet";
import { SetRow } from "@/components/workout/set-row";
import { CalorieEstimator } from "@/components/workout/calorie-estimator";
import { FitButton } from "@/components/ui/fit-button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useStoreHydrated } from "@/lib/hooks/use-store-hydrated";
import { useFitLogStore } from "@/lib/store/use-fit-log-store";
import { addDays, formatDate } from "@/lib/utils/date";

interface WorkoutEditorProps {
  date: string;
}

export function WorkoutEditor({ date }: WorkoutEditorProps) {
  const router = useRouter();
  const hydrated = useStoreHydrated();
  const getOrCreateSession = useFitLogStore((state) => state.getOrCreateSession);
  const getSetsBySession = useFitLogStore((state) => state.getSetsBySession);
  const calcTotalVolume = useFitLogStore((state) => state.calcTotalVolume);
  const calcCardioStats = useFitLogStore((state) => state.calcCardioStats);
  const allSets = useFitLogStore((state) => state.sets);

  const [pickerOpen, setPickerOpen] = useState(false);

  const sessionId = useMemo(() => {
    if (!hydrated) {
      return null;
    }
    return getOrCreateSession(date).id;
  }, [hydrated, date, getOrCreateSession]);

  const sets = useMemo(() => {
    if (!sessionId) {
      return [];
    }
    return getSetsBySession(sessionId);
  }, [getSetsBySession, sessionId, allSets]);

  const totalVolume = sessionId ? calcTotalVolume(sessionId) : 0;
  const cardioStats = sessionId ? calcCardioStats(sessionId) : { duration: 0, distance: 0 };
  const exerciseIds = new Set(sets.map((set) => set.exerciseId));

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-fit-bg-muted">
        <Preloader />
      </div>
    );
  }

  return (
    <div className="fit-workout-pad relative flex min-h-screen flex-col bg-fit-bg-muted">
      <header className="relative z-10 flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/10 border border-white/10 text-white text-lg shadow-sm backdrop-blur active:scale-95 transition cursor-pointer"
          aria-label="Quay lại"
        >
          ←
        </button>
        <div className="text-center">
          <h1 className="fit-h2">{formatDate(date)}</h1>
          <p className="fit-caption">{date}</p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/exercises")}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/10 border border-white/10 text-white text-lg shadow-sm backdrop-blur active:scale-95 transition cursor-pointer"
          aria-label="Danh sách bài tập"
        >
          ⋯
        </button>
      </header>

      <section
        className="relative mx-4 mt-3 flex min-h-[38vh] flex-col justify-end overflow-hidden rounded-[var(--fit-radius-card)] bg-gradient-to-br from-fit-accent-blue/40 via-fit-bg-muted to-fit-accent-green/30 p-6"
      >
        <div className="flex gap-2">
          <FitButton
            variant="ghost"
            className="flex-1 bg-white/10 border border-white/15 text-white hover:bg-white/20 active:scale-[0.98] transition backdrop-blur-sm"
            onClick={() => router.push(`/workout/${addDays(date, -1)}`)}
          >
            ← Trước
          </FitButton>
          <FitButton
            variant="ghost"
            className="flex-1 bg-white/10 border border-white/15 text-white hover:bg-white/20 active:scale-[0.98] transition backdrop-blur-sm"
            onClick={() => router.push(`/workout/${addDays(date, 1)}`)}
          >
            Sau →
          </FitButton>
        </div>
        <p className="mt-4 text-4xl font-bold text-white font-mono-numbers">
          {totalVolume.toLocaleString("vi-VN")}
          <span className="ml-1 text-lg font-medium text-white/60">kg</span>
        </p>
        <p className="fit-caption text-white/70">Tổng volume buổi tập</p>
      </section>

      <GlassPanel className="relative z-20 -mt-6 flex min-h-[52vh] flex-1 flex-col px-4 pb-6 pt-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex gap-3 min-w-0 flex-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {totalVolume > 0 && (
              <div className="min-w-fit rounded-2xl bg-fit-accent-green/10 border border-fit-accent-green/20 px-4 py-3 shrink-0">
                <p className="fit-caption !text-fit-accent-green/80 font-medium">Volume (Tạ)</p>
                <p className="text-2xl font-bold text-fit-accent-green font-mono-numbers">
                  {totalVolume.toLocaleString("vi-VN")}{" "}
                  <span className="text-sm font-normal text-fit-accent-green/75">kg</span>
                </p>
              </div>
            )}
            {cardioStats.duration > 0 && (
              <div className="min-w-fit rounded-2xl bg-fit-accent-orange/10 border border-fit-accent-orange/20 px-4 py-3 shrink-0">
                <p className="fit-caption !text-fit-accent-orange/80 font-medium">Cardio (Phút)</p>
                <p className="text-2xl font-bold text-fit-accent-orange font-mono-numbers">
                  {cardioStats.duration.toLocaleString("vi-VN")}{" "}
                  <span className="text-sm font-normal text-fit-accent-orange/75">phút</span>
                </p>
              </div>
            )}
            {cardioStats.distance > 0 && (
              <div className="min-w-fit rounded-2xl bg-fit-accent-blue/10 border border-fit-accent-blue/20 px-4 py-3 shrink-0">
                <p className="fit-caption !text-fit-accent-blue/80 font-medium">Cardio (Km)</p>
                <p className="text-2xl font-bold text-fit-accent-blue font-mono-numbers">
                  {cardioStats.distance.toLocaleString("vi-VN")}{" "}
                  <span className="text-sm font-normal text-fit-accent-blue/75">km</span>
                </p>
              </div>
            )}
            {totalVolume === 0 && cardioStats.duration === 0 && cardioStats.distance === 0 && (
              <div className="min-w-fit rounded-2xl bg-fit-bg-muted/50 border border-black/5 px-4 py-3 shrink-0 flex-1">
                <p className="fit-caption text-black/50">Volume</p>
                <p className="text-2xl font-bold text-black/30 font-mono-numbers">
                  0 <span className="text-sm font-normal">kg</span>
                </p>
              </div>
            )}
          </div>
          {sessionId && (
            <motion.button
              type="button"
              onClick={() => setPickerOpen(true)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-fit-card-dark text-2xl text-white shadow-lg cursor-pointer"
              aria-label="Thêm bài tập"
            >
              +
            </motion.button>
          )}
        </div>

        {sessionId && <CalorieEstimator sessionId={sessionId} />}

        <div className="my-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-fit-bg-muted px-3 py-2">
            <p className="fit-caption">Sets</p>
            <p className="text-lg font-semibold">{sets.length}</p>
          </div>
          <div className="rounded-2xl bg-fit-bg-muted px-3 py-2">
            <p className="fit-caption">Bài tập</p>
            <p className="text-lg font-semibold">{exerciseIds.size}</p>
          </div>
        </div>

        <h2 className="fit-h2 mb-2">Hiệp tập</h2>
        <div className="flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sets.length === 0 ? (
            <p className="fit-caption py-8 text-center">
              Chưa có set nào. Bấm + để thêm bài tập.
            </p>
          ) : (
            <ul className="space-y-3 pb-4">
              {sets.map((set) => (
                <li key={set.id}>
                  <SetRow set={set} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </GlassPanel>

      {sessionId && (
        <ExercisePickerSheet
          opened={pickerOpen}
          sessionId={sessionId}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
