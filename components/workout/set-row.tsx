"use client";

import { Block, Button, ListInput } from "konsta/react";
import { useEffect, useState } from "react";
import { DuplicateSetButton } from "@/components/workout/duplicate-set-button";
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
    setLocal(String(value));
  }, [value]);

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

  return (
    <Block strong inset className="!my-2">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold">
            {exercise?.name ?? "Bài tập đã xóa"}
          </div>
          <div className="text-xs text-black/50 dark:text-white/50">
            Set #{set.order + 1}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <DuplicateSetButton onClick={() => duplicateSet(set.id)} />
          <Button
            clear
            className="!min-h-11 !min-w-11 text-red-500"
            aria-label="Xóa set"
            onClick={() => deleteSet(set.id)}
          >
            ✕
          </Button>
        </div>
      </div>
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
    </Block>
  );
}
