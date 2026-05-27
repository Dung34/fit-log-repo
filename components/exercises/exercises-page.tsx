"use client";

import {
  Block,
  BlockTitle,
  Button,
  List,
  ListItem,
  Navbar,
  NavbarBackLink,
  Page,
  Preloader,
} from "konsta/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ExerciseFormSheet } from "@/components/exercises/exercise-form-sheet";
import { useStoreHydrated } from "@/lib/hooks/use-store-hydrated";
import { useFitLogStore } from "@/lib/store/use-fit-log-store";
import type { Exercise, ExerciseCategory } from "@/lib/store/type";

const CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  gym: "Gym",
  calisthenics: "Calisthenics",
};

function groupByCategory(exercises: Exercise[]) {
  return (["gym", "calisthenics"] as const).map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    items: exercises.filter((exercise) => exercise.category === category),
  }));
}

export function ExercisesPage() {
  const router = useRouter();
  const hydrated = useStoreHydrated();
  const getActiveExercises = useFitLogStore((state) => state.getActiveExercises);
  const deleteExercise = useFitLogStore((state) => state.deleteExercise);
  const exercises = useFitLogStore((state) => state.exercises);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Exercise | undefined>();

  const groups = useMemo(
    () => groupByCategory(getActiveExercises()),
    [exercises, getActiveExercises],
  );

  const openCreate = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  const openEdit = (exercise: Exercise) => {
    setEditing(exercise);
    setFormOpen(true);
  };

  const handleDelete = (exercise: Exercise) => {
    const confirmed = window.confirm(`Ẩn bài tập "${exercise.name}" khỏi danh sách?`);
    if (!confirmed) {
      return;
    }
    try {
      deleteExercise(exercise.id);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Không thể xóa");
    }
  };

  return (
    <Page>
      <Navbar
        title="Bài tập"
        left={<NavbarBackLink onClick={() => router.push("/")} />}
      />

      <Block strong inset>
        <Button large onClick={openCreate}>
          + Thêm bài tập custom
        </Button>
      </Block>

      {!hydrated ? (
        <Block strong inset className="flex justify-center py-12">
          <Preloader />
        </Block>
      ) : (
        groups.map(({ category, label, items }) => (
          <div key={category}>
            <BlockTitle>{label}</BlockTitle>
            {items.length === 0 ? (
              <Block strong inset>
                <p className="text-sm text-black/60 dark:text-white/60">
                  Chưa có bài tập trong nhóm này.
                </p>
              </Block>
            ) : (
              <List strongIos outlineIos>
                {items.map((exercise) => (
                  <ListItem
                    key={exercise.id}
                    title={exercise.name}
                    subtitle={exercise.isCustom ? "Custom" : "Mặc định"}
                    after={
                      <div className="flex items-center gap-1">
                        <Button
                          clear
                          small
                          className="!min-h-11 !min-w-11"
                          aria-label={`Sửa ${exercise.name}`}
                          onClick={() => openEdit(exercise)}
                        >
                          ✎
                        </Button>
                        <Button
                          clear
                          small
                          className="!min-h-11 !min-w-11 text-red-500"
                          aria-label={`Xóa ${exercise.name}`}
                          onClick={() => handleDelete(exercise)}
                        >
                          ✕
                        </Button>
                      </div>
                    }
                  />
                ))}
              </List>
            )}
          </div>
        ))
      )}

      <ExerciseFormSheet
        opened={formOpen}
        exercise={editing}
        onClose={() => setFormOpen(false)}
        onSaved={() => setFormOpen(false)}
      />
    </Page>
  );
}
