"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { parseDate } from "@/lib/utils/date";
import { generateId } from "@/lib/utils/id";
import {
  calcTotalVolume as calcVolumeFromSets,
  getSessionsWithStats as buildSessionsWithStats,
} from "@/lib/utils/volume";
import {
  getNextOrder,
  isExerciseNameTaken,
  reindexSessionSets,
} from "./helpers";
import { createDefaultExercises } from "./seed/default-exercises";
import type { Exercise, FitLogState, WorkoutSession, WorkoutSet } from "./type";

function seedExercisesIfEmpty(exercises: Exercise[]): Exercise[] {
  if (exercises.length === 0) {
    return createDefaultExercises();
  }
  return exercises;
}

export const useFitLogStore = create<FitLogState>()(
  persist(
    (set, get) => ({
      exercises: [] as Exercise[],
      sessions: [] as WorkoutSession[],
      sets: [] as WorkoutSet[],

      addExercise: (exercise) => {
        const trimmedName = exercise.name.trim();
        if (!trimmedName) {
          throw new Error("Exercise name cannot be empty");
        }
        if (isExerciseNameTaken(get().exercises, trimmedName)) {
          throw new Error(`Exercise name already exists: ${trimmedName}`);
        }

        const newExercise: Exercise = {
          ...exercise,
          id: generateId(),
          name: trimmedName,
          isCustom: exercise.isCustom ?? true,
        };

        set({ exercises: [...get().exercises, newExercise] });
        return newExercise;
      },

      updateExercise: (id, data) => {
        const exercises = get().exercises;
        const existing = exercises.find((exercise) => exercise.id === id);
        if (!existing) {
          throw new Error(`Exercise not found: ${id}`);
        }
        if (existing.deletedAt) {
          throw new Error(`Cannot update deleted exercise: ${id}`);
        }

        const nextName =
          data.name !== undefined ? data.name.trim() : existing.name;
        if (!nextName) {
          throw new Error("Exercise name cannot be empty");
        }
        if (isExerciseNameTaken(exercises, nextName, id)) {
          throw new Error(`Exercise name already exists: ${nextName}`);
        }

        set({
          exercises: exercises.map((exercise) =>
            exercise.id === id
              ? {
                  ...exercise,
                  ...data,
                  name: nextName,
                }
              : exercise,
          ),
        });
      },

      deleteExercise: (id) => {
        const existing = get().exercises.find((exercise) => exercise.id === id);
        if (!existing) {
          throw new Error(`Exercise not found: ${id}`);
        }
        if (existing.deletedAt) {
          return;
        }

        set({
          exercises: get().exercises.map((exercise) =>
            exercise.id === id
              ? { ...exercise, deletedAt: new Date().toISOString() }
              : exercise,
          ),
        });
      },

      getOrCreateSession: (date) => {
        const validDate = parseDate(date);
        const existing = get().sessions.find(
          (session) => session.date === validDate,
        );
        if (existing) {
          return existing;
        }

        const session: WorkoutSession = {
          id: generateId(),
          date: validDate,
        };
        set({ sessions: [...get().sessions, session] });
        return session;
      },

      updateSessionNotes: (sessionId, notes) => {
        const session = get().sessions.find((item) => item.id === sessionId);
        if (!session) {
          throw new Error(`Session not found: ${sessionId}`);
        }

        set({
          sessions: get().sessions.map((item) =>
            item.id === sessionId ? { ...item, notes } : item,
          ),
        });
      },

      addSet: (sessionId, exerciseId) => {
        const session = get().sessions.find((item) => item.id === sessionId);
        if (!session) {
          throw new Error(`Session not found: ${sessionId}`);
        }
        const exercise = get().exercises.find((item) => item.id === exerciseId);
        if (!exercise) {
          throw new Error(`Exercise not found: ${exerciseId}`);
        }

        const newSet: WorkoutSet = {
          id: generateId(),
          sessionId,
          exerciseId,
          weight: 0,
          reps: 0,
          order: getNextOrder(get().sets, sessionId),
        };

        set({ sets: [...get().sets, newSet] });
        return newSet;
      },

      updateSet: (setId, data) => {
        const target = get().sets.find((set) => set.id === setId);
        if (!target) {
          throw new Error(`Set not found: ${setId}`);
        }

        set({
          sets: get().sets.map((set) =>
            set.id === setId ? { ...set, ...data } : set,
          ),
        });
      },

      deleteSet: (setId) => {
        const target = get().sets.find((set) => set.id === setId);
        if (!target) {
          throw new Error(`Set not found: ${setId}`);
        }

        const remaining = get().sets.filter((set) => set.id !== setId);
        set({ sets: reindexSessionSets(remaining, target.sessionId) });
      },

      duplicateSet: (setId) => {
        const source = get().sets.find((set) => set.id === setId);
        if (!source) {
          throw new Error(`Set not found: ${setId}`);
        }

        const newSet: WorkoutSet = {
          id: generateId(),
          sessionId: source.sessionId,
          exerciseId: source.exerciseId,
          weight: source.weight,
          reps: source.reps,
          order: source.order + 1,
        };

        const shiftedSets = get().sets.map((set) => {
          if (set.sessionId !== source.sessionId) {
            return set;
          }
          if (set.order > source.order) {
            return { ...set, order: set.order + 1 };
          }
          return set;
        });

        set({ sets: [...shiftedSets, newSet] });
        return newSet;
      },

      getExerciseById: (id) => get().exercises.find((exercise) => exercise.id === id),

      getActiveExercises: () =>
        get().exercises.filter((exercise) => !exercise.deletedAt),

      getSetsBySession: (sessionId) =>
        get()
          .sets.filter((set) => set.sessionId === sessionId)
          .sort((a, b) => a.order - b.order),

      getSessionsWithStats: () =>
        buildSessionsWithStats(get().sessions, get().sets),

      calcTotalVolume: (sessionId) =>
        calcVolumeFromSets(
          get().sets.filter((set) => set.sessionId === sessionId),
        ),
    }),
    {
      name: "fitlog-storage",
      partialize: (state) => ({
        exercises: state.exercises,
        sessions: state.sessions,
        sets: state.sets,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return;
        }
        const seeded = seedExercisesIfEmpty(state.exercises);
        if (seeded !== state.exercises) {
          useFitLogStore.setState({ exercises: seeded });
        }
      },
    },
  ),
);

if (typeof window !== "undefined") {
  useFitLogStore.persist.onFinishHydration(() => {
    const { exercises } = useFitLogStore.getState();
    if (exercises.length === 0) {
      useFitLogStore.setState({ exercises: createDefaultExercises() });
    }
  });
}
