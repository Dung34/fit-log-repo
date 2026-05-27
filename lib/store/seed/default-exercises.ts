import { generateId } from "@/lib/utils/id";
import type { Exercise, ExerciseCategory } from "@/lib/store/type";

const GYM_EXERCISES = [
  "Bench Press",
  "Squat",
  "Deadlift",
  "Overhead Press",
  "Barbell Row",
  "Romanian Deadlift",
  "Leg Press",
  "Lat Pulldown",
] as const;

const CALISTHENICS_EXERCISES = [
  "Pull-up",
  "Chin-up",
  "Dip",
  "Push-up",
  "Muscle-up",
  "Handstand Push-up",
  "L-sit",
  "Plank",
] as const;

const CARDIO_EXERCISES = [
  "Chạy bộ",
  "Đạp xe",
  "Đi bộ dốc",
  "Nhảy dây",
  "Máy chèo thuyền",
] as const;

function createExercise(
  name: string,
  category: ExerciseCategory,
): Exercise {
  return {
    id: generateId(),
    name,
    category,
    isCustom: false,
  };
}

export function createDefaultExercises(): Exercise[] {
  return [
    ...GYM_EXERCISES.map((name) => createExercise(name, "gym")),
    ...CALISTHENICS_EXERCISES.map((name) =>
      createExercise(name, "calisthenics"),
    ),
    ...CARDIO_EXERCISES.map((name) => createExercise(name, "cardio")),
  ];
}
