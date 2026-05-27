import type { Exercise, WorkoutSet } from "./type";

export function normalizeExerciseName(name: string): string {
  return name.trim().toLowerCase();
}

export function isExerciseNameTaken(
  exercises: Exercise[],
  name: string,
  excludeId?: string,
): boolean {
  const normalized = normalizeExerciseName(name);
  return exercises.some(
    (exercise) =>
      !exercise.deletedAt &&
      exercise.id !== excludeId &&
      normalizeExerciseName(exercise.name) === normalized,
  );
}

export function reindexSessionSets(
  sets: WorkoutSet[],
  sessionId: string,
): WorkoutSet[] {
  const sessionSets = sets
    .filter((set) => set.sessionId === sessionId)
    .sort((a, b) => a.order - b.order)
    .map((set, index) => ({ ...set, order: index }));

  const otherSets = sets.filter((set) => set.sessionId !== sessionId);
  return [...otherSets, ...sessionSets];
}

export function getNextOrder(sets: WorkoutSet[], sessionId: string): number {
  const sessionSets = sets.filter((set) => set.sessionId === sessionId);
  if (sessionSets.length === 0) {
    return 0;
  }
  return Math.max(...sessionSets.map((set) => set.order)) + 1;
}
