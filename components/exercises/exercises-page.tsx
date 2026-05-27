"use client";

import { Dialog, DialogButton, List, ListItem, Preloader } from "konsta/react";
import { useMemo, useState } from "react";
import { ExerciseFormSheet } from "@/components/exercises/exercise-form-sheet";
import { CategoryTag } from "@/components/ui/category-tag";
import { FitButton } from "@/components/ui/fit-button";
import { FitCard } from "@/components/ui/fit-card";
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
  const hydrated = useStoreHydrated();
  const getActiveExercises = useFitLogStore((state) => state.getActiveExercises);
  const deleteExercise = useFitLogStore((state) => state.deleteExercise);
  const exercises = useFitLogStore((state) => state.exercises);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Exercise | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Exercise | null>(null);

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

  const confirmDelete = () => {
    if (!deleteTarget) {
      return;
    }
    try {
      deleteExercise(deleteTarget.id);
      setDeleteTarget(null);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Không thể xóa");
    }
  };

  return (
    <div className="min-h-full bg-fit-bg-muted px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
      <header className="mb-6">
        <h1 className="fit-h1">Bài tập</h1>
        <p className="fit-caption mt-1">Danh mục Gym & Calisthenics</p>
      </header>

      <FitButton fullWidth className="mb-6" onClick={openCreate}>
        + Thêm bài tập custom
      </FitButton>

      {!hydrated ? (
        <div className="flex justify-center py-12">
          <Preloader />
        </div>
      ) : (
        groups.map(({ category, label, items }) => (
          <section key={category} className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <h2 className="fit-h2">{label}</h2>
              <CategoryTag category={category} />
            </div>
            {items.length === 0 ? (
              <FitCard>
                <p className="fit-caption">Chưa có bài tập trong nhóm này.</p>
              </FitCard>
            ) : (
              <List strongIos outlineIos className="!m-0 rounded-[var(--fit-radius-card)] overflow-hidden shadow-[var(--fit-shadow-card)]">
                {items.map((exercise) => (
                  <ListItem
                    key={exercise.id}
                    title={exercise.name}
                    subtitle={exercise.isCustom ? "Custom" : "Mặc định"}
                    after={
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="flex min-h-11 min-w-11 items-center justify-center rounded-full active:bg-black/5"
                          aria-label={`Sửa ${exercise.name}`}
                          onClick={() => openEdit(exercise)}
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-red-500 active:bg-red-50"
                          aria-label={`Xóa ${exercise.name}`}
                          onClick={() => setDeleteTarget(exercise)}
                        >
                          ✕
                        </button>
                      </div>
                    }
                  />
                ))}
              </List>
            )}
          </section>
        ))
      )}

      <ExerciseFormSheet
        opened={formOpen}
        exercise={editing}
        onClose={() => setFormOpen(false)}
        onSaved={() => setFormOpen(false)}
      />

      <Dialog
        opened={Boolean(deleteTarget)}
        onBackdropClick={() => setDeleteTarget(null)}
        title="Ẩn bài tập?"
        content={
          deleteTarget
            ? `Ẩn "${deleteTarget.name}" khỏi danh sách?`
            : ""
        }
        buttons={
          <>
            <DialogButton onClick={() => setDeleteTarget(null)}>
              Hủy
            </DialogButton>
            <DialogButton strong onClick={confirmDelete}>
              Ẩn
            </DialogButton>
          </>
        }
      />
    </div>
  );
}
