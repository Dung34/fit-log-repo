import type { WorkoutSession, WorkoutSet } from "@/lib/store/type";

export interface SessionStats {
  exerciseCount: number;
  setCount: number;
  totalVolume: number;
}

export function calcTotalVolume(sets: WorkoutSet[]): number {
  return sets.reduce((total, set) => total + set.weight * set.reps, 0);
}

export function calcSessionStats(
  sessionId: string,
  sets: WorkoutSet[],
): SessionStats {
  const sessionSets = sets.filter((set) => set.sessionId === sessionId);
  const exerciseIds = new Set(sessionSets.map((set) => set.exerciseId));

  return {
    exerciseCount: exerciseIds.size,
    setCount: sessionSets.length,
    totalVolume: calcTotalVolume(sessionSets),
  };
}

export interface SessionWithStats {
  session: WorkoutSession;
  stats: SessionStats;
}

export function getSessionsWithStats(
  sessions: WorkoutSession[],
  sets: WorkoutSet[],
): SessionWithStats[] {
  return [...sessions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((session) => ({
      session,
      stats: calcSessionStats(session.id, sets),
    }))
    .filter(({ stats }) => stats.setCount > 0);
}
