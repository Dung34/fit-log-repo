"use client";

import { ListInput, Preloader } from "konsta/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ExercisePickerSheet } from "@/components/workout/exercise-picker-sheet";
import { SetRow } from "@/components/workout/set-row";
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
  const allSets = useFitLogStore((state) => state.sets);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    const session = getOrCreateSession(date);
    setSessionId(session.id);
  }, [date, getOrCreateSession, hydrated]);

  const sets = useMemo(() => {
    if (!sessionId) {
      return [];
    }
    return getSetsBySession(sessionId);
  }, [getSetsBySession, sessionId, allSets]);

  const totalVolume = sessionId ? calcTotalVolume(sessionId) : 0;
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
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/80 text-lg shadow-sm backdrop-blur"
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
          className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/80 text-lg shadow-sm backdrop-blur"
          aria-label="Danh sách bài tập"
        >
          ⋯
        </button>
      </header>

      <section
        className="relative mx-4 mt-3 flex min-h-[38vh] flex-col justify-end overflow-hidden rounded-[var(--fit-radius-card)] bg-gradient-to-br from-fit-accent-purple/40 via-fit-bg-muted to-fit-accent-green/30 p-6"
      >
        <div className="flex gap-2">
          <FitButton
            variant="outline"
            className="flex-1 !bg-white/90"
            onClick={() => router.push(`/workout/${addDays(date, -1)}`)}
          >
            ← Trước
          </FitButton>
          <FitButton
            variant="outline"
            className="flex-1 !bg-white/90"
            onClick={() => router.push(`/workout/${addDays(date, 1)}`)}
          >
            Sau →
          </FitButton>
        </div>
        <p className="mt-4 text-4xl font-bold text-fit-card-dark">
          {totalVolume.toLocaleString("vi-VN")}
          <span className="ml-1 text-lg font-medium text-fit-text-muted">kg</span>
        </p>
        <p className="fit-caption">Tổng volume buổi tập</p>
      </section>

      <GlassPanel className="relative z-20 -mt-6 flex min-h-[52vh] flex-1 flex-col px-4 pb-6 pt-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="min-w-0 flex-1 rounded-2xl bg-fit-accent-green/25 px-4 py-3">
            <p className="fit-caption">Volume</p>
            <p className="text-2xl font-bold text-fit-card-dark">
              {totalVolume.toLocaleString("vi-VN")} kg
            </p>
          </div>
          {sessionId && (
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-fit-card-dark text-2xl text-white shadow-lg"
              aria-label="Thêm bài tập"
            >
              +
            </button>
          )}
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
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
