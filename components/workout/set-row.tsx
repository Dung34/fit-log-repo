"use client";

import { ListInput } from "konsta/react";
import { useEffect, useState } from "react";
import { DuplicateSetButton } from "@/components/workout/duplicate-set-button";
import { FitCard } from "@/components/ui/fit-card";
import { useFitLogStore } from "@/lib/store/use-fit-log-store";
import type { WorkoutSet } from "@/lib/store/type";

interface SetRowProps {
  set: WorkoutSet;
}

function useDebouncedNumber(
  value: number,
  onCommit: (next: number) => void,
  delay = 300,
) {
  const [local, setLocal] = useState(String(value));

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const parsed = Number(local);
      const next = Number.isFinite(parsed) ? parsed : 0;
      if (next !== value) {
        onCommit(next);
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [local, value, onCommit, delay]);

  return [local, setLocal] as const;
}

export function SetRow({ set }: SetRowProps) {
  const exercise = useFitLogStore((state) => state.getExerciseById(set.exerciseId));
  const updateSet = useFitLogStore((state) => state.updateSet);
  const deleteSet = useFitLogStore((state) => state.deleteSet);
  const duplicateSet = useFitLogStore((state) => state.duplicateSet);

  const [weightText, setWeightText] = useDebouncedNumber(
    set.weight,
    (weight) => updateSet(set.id, { weight }),
  );

  const [repsText, setRepsText] = useDebouncedNumber(
    set.reps,
    (reps) => updateSet(set.id, { reps: Math.max(0, Math.round(reps)) }),
  );

  const [durationText, setDurationText] = useDebouncedNumber(
    set.duration ?? 0,
    (duration) => updateSet(set.id, { duration: Math.max(0, duration) }),
  );

  const [distanceText, setDistanceText] = useDebouncedNumber(
    set.distance ?? 0,
    (distance) => updateSet(set.id, { distance: Math.max(0, distance) }),
  );

  const [inclineText, setInclineText] = useDebouncedNumber(
    set.incline ?? 0,
    (incline) => updateSet(set.id, { incline: Math.max(0, incline) }),
  );

  return (
    <FitCard className="!p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-fit-text">
            {exercise?.name ?? "Bài tập đã xóa"}
          </div>
          <div className="fit-caption">Set #{set.order + 1}</div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <DuplicateSetButton onClick={() => duplicateSet(set.id)} />
          <button
            type="button"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-red-500 active:bg-red-50"
            aria-label="Xóa set"
            onClick={() => deleteSet(set.id)}
          >
            ✕
          </button>
        </div>
      </div>
      {exercise?.category === "cardio" ? (
        <div className="grid grid-cols-3 gap-2">
          <ListInput
            label="Phút"
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={durationText}
            onInput={(event) => setDurationText(event.target.value)}
          />
          <ListInput
            label="Km"
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={distanceText}
            onInput={(event) => setDistanceText(event.target.value)}
          />
          <ListInput
            label="Độ dốc"
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={inclineText}
            onInput={(event) => setInclineText(event.target.value)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <ListInput
            label="Tạ (kg)"
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={weightText}
            onInput={(event) => setWeightText(event.target.value)}
          />
          <ListInput
            label="Reps"
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={repsText}
            onInput={(event) => setRepsText(event.target.value)}
          />
        </div>
      )}
    </FitCard>
  );
}
