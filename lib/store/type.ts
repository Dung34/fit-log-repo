import type { SessionWithStats } from "@/lib/utils/volume";

type ExerciseCategory = "gym" | "calisthenics" | "cardio";

interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  isCustom?: boolean;
  /** ISO timestamp — soft-delete hides from picker, keeps history sets intact */
  deletedAt?: string;
}

interface WorkoutSession {
  id: string;
  date: string;
  notes?: string;
}

interface WorkoutSet {
  id: string;
  sessionId: string;
  exerciseId: string;
  weight: number;
  reps: number;
  order: number;
  duration?: number;
  distance?: number;
  incline?: number;
}

interface FitLogState {
  exercises: Exercise[];
  sessions: WorkoutSession[];
  sets: WorkoutSet[];

  addExercise: (exercise: Omit<Exercise, "id" | "deletedAt">) => Exercise;
  updateExercise: (id: string, data: Partial<Exercise>) => void;
  deleteExercise: (id: string) => void;

  getOrCreateSession: (date: string) => WorkoutSession;
  updateSessionNotes: (sessionId: string, notes: string) => void;

  addSet: (sessionId: string, exerciseId: string) => WorkoutSet;
  updateSet: (
    setId: string,
    data: Partial<
      Pick<
        WorkoutSet,
        "weight" | "reps" | "duration" | "distance" | "incline"
      >
    >,
  ) => void;
  deleteSet: (setId: string) => void;
  duplicateSet: (setId: string) => WorkoutSet;

  getExerciseById: (id: string) => Exercise | undefined;
  getActiveExercises: () => Exercise[];
  getSetsBySession: (sessionId: string) => WorkoutSet[];
  getSessionsWithStats: () => SessionWithStats[];
  calcTotalVolume: (sessionId: string) => number;
  calcCardioStats: (sessionId: string) => { duration: number; distance: number };
}

export type {
  ExerciseCategory,
  Exercise,
  WorkoutSession,
  WorkoutSet,
  FitLogState,
};
