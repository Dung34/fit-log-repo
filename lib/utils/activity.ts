import type { Exercise, ExerciseCategory, WorkoutSet } from "@/lib/store/type";
import { addDays, todayISO } from "@/lib/utils/date";
import { calcTotalVolume } from "@/lib/utils/volume";

export const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"] as const;

export function getLast7DaysISO(): string[] {
  const today = todayISO();
  return Array.from({ length: 7 }, (_, index) => addDays(today, index - 6));
}

export function getWeekdayIndex(iso: string): number {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const jsDay = date.getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

export interface DayVolume {
  date: string;
  label: string;
  volume: number;
  isToday: boolean;
}

export function getWeeklyVolumeByDay(
  sessions: { id: string; date: string }[],
  sets: WorkoutSet[],
): DayVolume[] {
  const today = todayISO();
  const days = getLast7DaysISO();

  return days.map((date) => {
    const session = sessions.find((item) => item.date === date);
    const sessionSets = session
      ? sets.filter((set) => set.sessionId === session.id)
      : [];

    return {
      date,
      label: WEEKDAY_LABELS[getWeekdayIndex(date)],
      volume: calcTotalVolume(sessionSets),
      isToday: date === today,
    };
  });
}

export function countSessionsThisWeek(
  sessions: { id: string; date: string }[],
  sets: WorkoutSet[],
): number {
  const days = new Set(getLast7DaysISO());
  return sessions.filter((session) => {
    if (!days.has(session.date)) {
      return false;
    }
    return sets.some((set) => set.sessionId === session.id);
  }).length;
}

export function getDominantCategory(
  sessionId: string,
  sets: WorkoutSet[],
  getExerciseById: (id: string) => Exercise | undefined,
): ExerciseCategory | null {
  const sessionSets = sets.filter((set) => set.sessionId === sessionId);
  const counts: Record<ExerciseCategory, number> = {
    gym: 0,
    calisthenics: 0,
    cardio: 0,
  };

  for (const set of sessionSets) {
    const exercise = getExerciseById(set.exerciseId);
    if (exercise) {
      counts[exercise.category] += 1;
    }
  }

  if (counts.gym === 0 && counts.calisthenics === 0) {
    return null;
  }

  return counts.gym >= counts.calisthenics ? "gym" : "calisthenics";
}
